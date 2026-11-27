package curriculum

import (
	"context"

	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/studyitem"
)

// defaultStudyItemService is used by the package-level compatibility helper and unit tests
// when no repository-backed kana loader is wired.
var defaultStudyItemService = studyitem.NewService(nil)

// repoKanaLoader adapts curriculum's kanaRepository to studyitem.KanaLoader so PostgreSQL
// kana_characters remains the primary Single Source of Truth for kana/kanji lookup.
type repoKanaLoader struct {
	repo kanaRepository
}

func (l *repoKanaLoader) LoadKanaCatalog(ctx context.Context) ([]studyitem.KanaInfo, error) {
	if l == nil || l.repo == nil {
		return nil, nil
	}
	rows, err := l.repo.ListKanaWithProgress(ctx, "", "")
	if err != nil {
		return nil, err
	}
	out := make([]studyitem.KanaInfo, 0, len(rows))
	for _, r := range rows {
		out = append(out, studyitem.KanaInfo{
			Character: r.Character,
			Script:    r.Script,
			Romaji:    r.Romaji,
			Mnemonic:  r.Mnemonic,
		})
	}
	return out, nil
}

func newStudyItemService(repo Repository) studyitem.Service {
	if kRepo, ok := repo.(kanaRepository); ok && kRepo != nil {
		return studyitem.NewService(&repoKanaLoader{repo: kRepo})
	}
	return studyitem.NewService(nil)
}

func isCheckpointLessonSlug(slug string) bool {
	return studyitem.IsCheckpointLessonSlug(slug)
}

func toStudyItemGrammarContexts(grammarPoints []GrammarPoint) []studyitem.GrammarContext {
	if len(grammarPoints) == 0 {
		return nil
	}
	out := make([]studyitem.GrammarContext, len(grammarPoints))
	for i, gp := range grammarPoints {
		var examples []studyitem.GrammarExample
		if len(gp.Examples) > 0 {
			examples = make([]studyitem.GrammarExample, len(gp.Examples))
			for j, ex := range gp.Examples {
				examples[j] = studyitem.GrammarExample{
					JP:      ex.JP,
					Reading: ex.Reading,
					ID:      ex.ID,
				}
			}
		}
		out[i] = studyitem.GrammarContext{
			Title:    gp.Title,
			Formula:  gp.Formula,
			Examples: examples,
		}
	}
	return out
}

func fromStudyItems(items []studyitem.Item) []LessonStudyItem {
	out := make([]LessonStudyItem, len(items))
	for i, item := range items {
		out[i] = LessonStudyItem{
			Symbol:             item.Symbol,
			Reading:            item.Reading,
			Meaning:            item.Meaning,
			Mnemonic:           item.Mnemonic,
			SpeakText:          item.SpeakText,
			FirstExerciseIndex: item.FirstExerciseIndex,
		}
	}
	return out
}

func buildLessonStudyItemsWithService(
	ctx context.Context,
	svc studyitem.Service,
	slug string,
	rawExercises []exercise.Exercise,
	sanitizedExercises []exercise.Exercise,
	grammarPoints []GrammarPoint,
) []LessonStudyItem {
	if svc == nil {
		svc = defaultStudyItemService
	}
	items := svc.BuildLessonStudyItemsAndHints(
		ctx,
		slug,
		rawExercises,
		sanitizedExercises,
		toStudyItemGrammarContexts(grammarPoints),
	)
	return fromStudyItems(items)
}

// buildLessonStudyItemsAndHints builds distractor-free LessonStudyItem cards from unsanitized
// lesson exercises and populates spoiler-free contextual hints + furigana on sanitized exercises for non-checkpoint lessons.
func buildLessonStudyItemsAndHints(
	slug string,
	rawExercises []exercise.Exercise,
	sanitizedExercises []exercise.Exercise,
	grammarPoints []GrammarPoint,
) []LessonStudyItem {
	return buildLessonStudyItemsWithService(
		context.Background(),
		defaultStudyItemService,
		slug,
		rawExercises,
		sanitizedExercises,
		grammarPoints,
	)
}
