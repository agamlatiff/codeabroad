package flashcard

import (
	"context"
	"errors"
	"fmt"

	"codeabroad/backend/infrastructure/postgres"
	"github.com/jackc/pgx/v5"
)

type postgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a PostgreSQL-backed flashcard repository.
func NewRepository(db *postgres.PostgresDB) Repository {
	return &postgresRepository{db: db}
}

const deckSelectFromClause = `
		SELECT
			d.id::text,
			d.language_code,
			d.title,
			d.description,
			d.category,
			d.icon_name,
			d.accent_color,
			d.jlpt_level,
			d.sort_order,
			COUNT(c.id)::int AS total_cards,
			GREATEST(COUNT(c.id) - COUNT(p.id), 0)::int AS new_cards,
			COUNT(p.id)::int AS learned_cards,
			COUNT(CASE WHEN p.id IS NOT NULL AND p.next_review_at <= NOW() THEN 1 END)::int AS due_cards,
			COUNT(CASE WHEN p.id IS NOT NULL AND p.next_review_at > NOW() THEN 1 END)::int AS scheduled_cards,
			d.created_at
		FROM flashcard_decks d
		LEFT JOIN flashcard_cards c ON c.deck_id = d.id
		LEFT JOIN user_flashcard_progress p ON p.card_id = c.id AND p.user_id = $1::uuid
`

type rowScanner interface {
	Scan(dest ...any) error
}

func scanDeckRow(scanner rowScanner) (Deck, error) {
	var d Deck
	err := scanner.Scan(
		&d.ID,
		&d.LanguageCode,
		&d.Title,
		&d.Description,
		&d.Category,
		&d.IconName,
		&d.AccentColor,
		&d.JLPTLevel,
		&d.SortOrder,
		&d.TotalCards,
		&d.NewCards,
		&d.LearnedCards,
		&d.DueCards,
		&d.ScheduledCards,
		&d.CreatedAt,
	)
	return d, err
}

func (r *postgresRepository) ListDecks(ctx context.Context, userID string, languageCode string, jlptLevel string) ([]Deck, error) {
	query := deckSelectFromClause + `
		WHERE d.language_code = $2
		  AND ($3 = '' OR UPPER(d.jlpt_level) = UPPER($3))
		GROUP BY d.id
		ORDER BY d.sort_order ASC, d.created_at ASC
	`

	rows, err := r.db.Pool.Query(ctx, query, userID, languageCode, jlptLevel)
	if err != nil {
		return nil, fmt.Errorf("list flashcard decks: %w", err)
	}
	defer rows.Close()

	decks := make([]Deck, 0, 30)
	for rows.Next() {
		d, err := scanDeckRow(rows)
		if err != nil {
			return nil, fmt.Errorf("scan flashcard deck: %w", err)
		}
		decks = append(decks, d)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate flashcard decks: %w", err)
	}
	return decks, nil
}

func (r *postgresRepository) GetDeckWithCards(ctx context.Context, userID string, deckID string) (*DeckDetailResponse, error) {
	deckQuery := deckSelectFromClause + `
		WHERE d.id = $2::uuid
		GROUP BY d.id
	`

	deck, err := scanDeckRow(r.db.Pool.QueryRow(ctx, deckQuery, userID, deckID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrDeckNotFound
		}
		return nil, fmt.Errorf("get flashcard deck: %w", err)
	}

	cardsQuery := `
		SELECT
			c.id::text,
			c.deck_id::text,
			c.front_text,
			c.reading,
			c.back_meaning,
			c.part_of_speech,
			c.sort_order,
			COALESCE(p.ease_factor, 2.5),
			COALESCE(p.interval_days, 0),
			COALESCE(p.repetitions, 0),
			p.next_review_at,
			p.last_reviewed_at
		FROM flashcard_cards c
		LEFT JOIN user_flashcard_progress p ON p.card_id = c.id AND p.user_id = $1::uuid
		WHERE c.deck_id = $2::uuid
		ORDER BY c.sort_order ASC, c.created_at ASC
	`

	rows, err := r.db.Pool.Query(ctx, cardsQuery, userID, deckID)
	if err != nil {
		return nil, fmt.Errorf("list deck cards: %w", err)
	}
	defer rows.Close()

	cards := make([]Card, 0)
	for rows.Next() {
		var c Card
		if err := rows.Scan(
			&c.ID,
			&c.DeckID,
			&c.FrontText,
			&c.Reading,
			&c.BackMeaning,
			&c.PartOfSpeech,
			&c.SortOrder,
			&c.EaseFactor,
			&c.IntervalDays,
			&c.Repetitions,
			&c.NextReviewAt,
			&c.LastReviewedAt,
		); err != nil {
			return nil, fmt.Errorf("scan deck card: %w", err)
		}
		cards = append(cards, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate deck cards: %w", err)
	}

	return &DeckDetailResponse{
		Deck:  deck,
		Cards: cards,
	}, nil
}

func (r *postgresRepository) ListDueCards(ctx context.Context, userID string, languageCode string, limit int) (*DueQueueResponse, error) {
	statsQuery := `
		SELECT
			COUNT(p.id)::int AS total_learned,
			COUNT(CASE WHEN p.next_review_at <= NOW() THEN 1 END)::int AS total_due
		FROM user_flashcard_progress p
		INNER JOIN flashcard_cards c ON c.id = p.card_id
		INNER JOIN flashcard_decks d ON d.id = c.deck_id
		WHERE p.user_id = $1::uuid AND d.language_code = $2
	`
	var totalLearned, totalDue int
	if err := r.db.Pool.QueryRow(ctx, statsQuery, userID, languageCode).Scan(&totalLearned, &totalDue); err != nil {
		return nil, fmt.Errorf("count due flashcards: %w", err)
	}

	cardsQuery := `
		SELECT
			c.id::text,
			c.deck_id::text,
			c.front_text,
			c.reading,
			c.back_meaning,
			c.part_of_speech,
			c.sort_order,
			p.ease_factor,
			p.interval_days,
			p.repetitions,
			p.next_review_at,
			p.last_reviewed_at
		FROM user_flashcard_progress p
		INNER JOIN flashcard_cards c ON c.id = p.card_id
		INNER JOIN flashcard_decks d ON d.id = c.deck_id
		WHERE p.user_id = $1::uuid
		  AND d.language_code = $2
		  AND p.next_review_at <= NOW()
		ORDER BY p.next_review_at ASC
		LIMIT $3
	`

	rows, err := r.db.Pool.Query(ctx, cardsQuery, userID, languageCode, limit)
	if err != nil {
		return nil, fmt.Errorf("list due flashcards: %w", err)
	}
	defer rows.Close()

	cards := make([]Card, 0)
	for rows.Next() {
		var c Card
		if err := rows.Scan(
			&c.ID,
			&c.DeckID,
			&c.FrontText,
			&c.Reading,
			&c.BackMeaning,
			&c.PartOfSpeech,
			&c.SortOrder,
			&c.EaseFactor,
			&c.IntervalDays,
			&c.Repetitions,
			&c.NextReviewAt,
			&c.LastReviewedAt,
		); err != nil {
			return nil, fmt.Errorf("scan due flashcard: %w", err)
		}
		cards = append(cards, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate due flashcards: %w", err)
	}

	return &DueQueueResponse{
		TotalDue:     totalDue,
		TotalLearned: totalLearned,
		Cards:        cards,
	}, nil
}

func (r *postgresRepository) CardExists(ctx context.Context, cardID string) (bool, error) {
	var exists bool
	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT EXISTS(SELECT 1 FROM flashcard_cards WHERE id = $1::uuid)`,
		cardID,
	).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("check flashcard exists: %w", err)
	}
	return exists, nil
}

func (r *postgresRepository) GetCardProgress(ctx context.Context, userID string, cardID string) (*CardProgress, error) {
	query := `
		SELECT
			user_id::text,
			card_id::text,
			ease_factor,
			interval_days,
			repetitions,
			next_review_at,
			COALESCE(last_reviewed_at, NOW())
		FROM user_flashcard_progress
		WHERE user_id = $1::uuid AND card_id = $2::uuid
	`
	var p CardProgress
	err := r.db.Pool.QueryRow(ctx, query, userID, cardID).Scan(
		&p.UserID,
		&p.CardID,
		&p.EaseFactor,
		&p.IntervalDays,
		&p.Repetitions,
		&p.NextReviewAt,
		&p.LastReviewedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("get flashcard progress: %w", err)
	}
	return &p, nil
}

func (r *postgresRepository) UpsertCardProgress(ctx context.Context, progress *CardProgress) error {
	query := `
		INSERT INTO user_flashcard_progress (
			user_id,
			card_id,
			ease_factor,
			interval_days,
			repetitions,
			next_review_at,
			last_reviewed_at,
			updated_at
		) VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (user_id, card_id)
		DO UPDATE SET
			ease_factor = EXCLUDED.ease_factor,
			interval_days = EXCLUDED.interval_days,
			repetitions = EXCLUDED.repetitions,
			next_review_at = EXCLUDED.next_review_at,
			last_reviewed_at = EXCLUDED.last_reviewed_at,
			updated_at = NOW()
	`
	_, err := r.db.Pool.Exec(
		ctx,
		query,
		progress.UserID,
		progress.CardID,
		progress.EaseFactor,
		progress.IntervalDays,
		progress.Repetitions,
		progress.NextReviewAt,
		progress.LastReviewedAt,
	)
	if err != nil {
		return fmt.Errorf("upsert flashcard progress: %w", err)
	}
	return nil
}
