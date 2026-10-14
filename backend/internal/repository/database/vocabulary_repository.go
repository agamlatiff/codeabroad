package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"fmt"
	"time"
)

// Default curated IT Tokyo vocabulary pool for graceful fallback and offline testing
var defaultVocabularies = []domain.Vocabulary{
	{
		ID:              "v1000001-0000-0000-0000-000000000001",
		Term:            "挨拶",
		Reading:         "あいさつ • Aisatsu",
		Meaning:         "Sapaan Pagi & Etika Kantor",
		Category:        "Etika Kantor",
		ExampleJA:       "Minasan, ohayou gozaimasu! Kyou mo yoroshiku onegaishimasu.",
		ExampleID:       "Selamat pagi semuanya! Mohon kerja samanya hari ini juga.",
		DifficultyLevel: "N4",
		OrderIndex:      1,
	},
	{
		ID:              "v1000002-0000-0000-0000-000000000002",
		Term:            "実装",
		Reading:         "じっそう • Jissou",
		Meaning:         "Implementasi Fitur (Feature Development)",
		Category:        "Pengembangan",
		ExampleJA:       "Kono kinou no jissou wa kyoujuu ni kanryou shimasu.",
		ExampleID:       "Implementasi fitur ini akan selesai hari ini.",
		DifficultyLevel: "N3",
		OrderIndex:      2,
	},
	{
		ID:              "v1000003-0000-0000-0000-000000000003",
		Term:            "結合テスト",
		Reading:         "けつごうてすと • Ketsugou Tesuto",
		Meaning:         "Uji Integrasi (Integration Testing)",
		Category:        "Pengujian QA",
		ExampleJA:       "Ashita kara API no ketsugou tesuto wo kaishi shimasu.",
		ExampleID:       "Mulai besok kita akan memulai uji integrasi API.",
		DifficultyLevel: "N3",
		OrderIndex:      3,
	},
	{
		ID:              "v1000004-0000-0000-0000-000000000004",
		Term:            "認可",
		Reading:         "にんか • Ninka",
		Meaning:         "Otorisasi & Keamanan Middleware",
		Category:        "Security",
		ExampleJA:       "JWT token ni yoru ninka shori wo tsuika shimashita.",
		ExampleID:       "Saya telah menambahkan proses otorisasi menggunakan JWT token.",
		DifficultyLevel: "N3",
		OrderIndex:      4,
	},
	{
		ID:              "v1000005-0000-0000-0000-000000000005",
		Term:            "並行処理",
		Reading:         "へいこうしょり • Heikou Shori",
		Meaning:         "Pemrosesan Konkuren (Concurrency)",
		Category:        "Arsitektur Backend",
		ExampleJA:       "Goroutine to channel wo tsukatta heikou shori wo sekkei shimasu.",
		ExampleID:       "Saya merancang pemrosesan konkuren menggunakan Goroutine dan channel.",
		DifficultyLevel: "N2",
		OrderIndex:      5,
	},
	{
		ID:              "v1000006-0000-0000-0000-000000000006",
		Term:            "本番環境",
		Reading:         "ほんばんかんきょう • Honban Kankyou",
		Meaning:         "Lingkungan Produksi (Production Env)",
		Category:        "DevOps & Cloud",
		ExampleJA:       "Honban kankyou he no depuroi mae ni fuka tesuto wo okonaimasu.",
		ExampleID:       "Kami melakukan load testing sebelum deploy ke lingkungan produksi.",
		DifficultyLevel: "N3",
		OrderIndex:      6,
	},
	{
		ID:              "v1000007-0000-0000-0000-000000000007",
		Term:            "朝会",
		Reading:         "あさかい • Asakai",
		Meaning:         "Rapat Standup Pagi (Daily Standup)",
		Category:        "Etika Kantor",
		ExampleJA:       "Maiasa 9-ji kara no asakai de shinchoku wo kyouyuu shimasu.",
		ExampleID:       "Kami berbagi progres kerja di rapat standup setiap pagi jam 9.",
		DifficultyLevel: "N4",
		OrderIndex:      7,
	},
	{
		ID:              "v1000008-0000-0000-0000-000000000008",
		Term:            "修正",
		Reading:         "しゅうせい • Shuusei",
		Meaning:         "Perbaikan Bug & Revisi Kode",
		Category:        "Pengembangan",
		ExampleJA:       "Kenshutsu sareta bagu no shuusei komitto wo push shimashita.",
		ExampleID:       "Saya telah melakukan push commit perbaikan bug yang ditemukan.",
		DifficultyLevel: "N3",
		OrderIndex:      8,
	},
}

// VocabularyRepository implements domain.VocabularyRepository using PostgreSQL
type VocabularyRepository struct {
	db *postgres.PostgresDB
}

// NewVocabularyRepository creates a new PostgreSQL vocabulary repository
func NewVocabularyRepository(db *postgres.PostgresDB) domain.VocabularyRepository {
	return &VocabularyRepository{db: db}
}

// GetDailyVocabularies retrieves a curated set of rotating IT Tokyo vocabularies
func (r *VocabularyRepository) GetDailyVocabularies(ctx context.Context, limit int) ([]domain.Vocabulary, error) {
	if limit <= 0 {
		limit = 5
	}

	query := `
		SELECT id, career_path_id, term, reading, meaning, category, example_ja, example_id,
		       difficulty_level, order_index, created_at, updated_at
		FROM vocabularies
		ORDER BY order_index ASC
		LIMIT $1
	`
	rows, err := r.db.Pool.Query(ctx, query, limit)
	if err != nil {
		// Graceful fallback to default vocabularies if table not yet seeded
		return r.fallbackVocabs(limit), nil
	}
	defer rows.Close()

	var result []domain.Vocabulary
	for rows.Next() {
		var v domain.Vocabulary
		if err := rows.Scan(
			&v.ID,
			&v.CareerPathID,
			&v.Term,
			&v.Reading,
			&v.Meaning,
			&v.Category,
			&v.ExampleJA,
			&v.ExampleID,
			&v.DifficultyLevel,
			&v.OrderIndex,
			&v.CreatedAt,
			&v.UpdatedAt,
		); err != nil {
			return r.fallbackVocabs(limit), nil
		}
		result = append(result, v)
	}

	if len(result) == 0 {
		return r.fallbackVocabs(limit), nil
	}

	return result, nil
}

// ListVocabularies lists vocabularies with optional category filter and pagination
func (r *VocabularyRepository) ListVocabularies(ctx context.Context, category string, limit, offset int) ([]domain.Vocabulary, int, error) {
	if limit <= 0 {
		limit = 20
	}

	countQuery := `SELECT COUNT(*) FROM vocabularies WHERE ($1 = '' OR category = $1)`
	var total int
	err := r.db.Pool.QueryRow(ctx, countQuery, category).Scan(&total)
	if err != nil {
		fallback := r.fallbackVocabs(limit)
		return fallback, len(defaultVocabularies), nil
	}

	query := `
		SELECT id, career_path_id, term, reading, meaning, category, example_ja, example_id,
		       difficulty_level, order_index, created_at, updated_at
		FROM vocabularies
		WHERE ($1 = '' OR category = $1)
		ORDER BY order_index ASC
		LIMIT $2 OFFSET $3
	`
	rows, err := r.db.Pool.Query(ctx, query, category, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query vocabularies: %w", err)
	}
	defer rows.Close()

	var result []domain.Vocabulary
	for rows.Next() {
		var v domain.Vocabulary
		if err := rows.Scan(
			&v.ID,
			&v.CareerPathID,
			&v.Term,
			&v.Reading,
			&v.Meaning,
			&v.Category,
			&v.ExampleJA,
			&v.ExampleID,
			&v.DifficultyLevel,
			&v.OrderIndex,
			&v.CreatedAt,
			&v.UpdatedAt,
		); err != nil {
			return nil, 0, fmt.Errorf("failed to scan vocabulary: %w", err)
		}
		result = append(result, v)
	}

	return result, total, nil
}

func (r *VocabularyRepository) fallbackVocabs(limit int) []domain.Vocabulary {
	if limit > len(defaultVocabularies) {
		limit = len(defaultVocabularies)
	}
	res := make([]domain.Vocabulary, limit)
	copy(res, defaultVocabularies[:limit])
	now := time.Now()
	for i := range res {
		res[i].CreatedAt = now
		res[i].UpdatedAt = now
	}
	return res
}
