package studyitem

import (
	"context"
	"errors"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"merantalk/backend/internal/app/exercise"
)

type stubKanaLoader struct {
	mu      sync.Mutex
	rows    []KanaInfo
	err     error
	delay   time.Duration
	calls   atomic.Int32
	onFetch func(callNum int32) ([]KanaInfo, error)
}

func (l *stubKanaLoader) LoadKanaCatalog(ctx context.Context) ([]KanaInfo, error) {
	n := l.calls.Add(1)
	if l.delay > 0 {
		time.Sleep(l.delay)
	}
	if l.onFetch != nil {
		return l.onFetch(n)
	}
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.err != nil {
		return nil, l.err
	}
	out := make([]KanaInfo, len(l.rows))
	copy(out, l.rows)
	return out, nil
}

func TestKanaCatalogCache_HitTTLAndSingleflight(t *testing.T) {
	var nowMu sync.Mutex
	currentTime := time.Date(2026, 11, 27, 10, 0, 0, 0, time.UTC)
	nowFn := func() time.Time {
		nowMu.Lock()
		defer nowMu.Unlock()
		return currentTime
	}

	loader := &stubKanaLoader{
		delay: 15 * time.Millisecond,
		rows: []KanaInfo{
			{Character: "が", Script: "hiragana", Romaji: "ga", Mnemonic: `Huruf か (ka) ditambah 2 titik tenten kanan atas berubah menjadi bunyi tebal "GA".`},
		},
	}

	svc := newServiceWithCache(loader, 30*time.Minute, nowFn)

	// 1. Concurrent cold-cache callers must deduplicate into a single DB call via singleflight.
	const workers = 12
	var wg sync.WaitGroup
	wg.Add(workers)
	for i := 0; i < workers; i++ {
		go func() {
			defer wg.Done()
			raw := []exercise.Exercise{
				{
					ID:            "ex-ga",
					ExerciseType:  exercise.ExerciseTypeFillBlank,
					Prompt:        "Pilih huruf hiragana dakuten yang benar:",
					Content:       map[string]any{"options": []any{"が", "か", "ぎ", "ぐ"}},
					CorrectAnswer: "が",
				},
			}
			sanitized := exercise.SanitizeExercises(raw)
			items := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u2-dakuten", raw, sanitized, nil)
			if len(items) != 1 || items[0].Reading != "ga" {
				t.Errorf("expected study item for が with reading 'ga', got %+v", items)
			}
		}()
	}
	wg.Wait()

	if got := loader.calls.Load(); got != 1 {
		t.Fatalf("expected 1 singleflight DB load for concurrent cold callers, got %d", got)
	}

	// 2. Subsequent call within TTL must hit in-memory cache (still 1 DB call).
	nowMu.Lock()
	currentTime = currentTime.Add(29 * time.Minute)
	nowMu.Unlock()

	raw := []exercise.Exercise{
		{
			ID:            "ex-ga-2",
			ExerciseType:  exercise.ExerciseTypeFillBlank,
			Prompt:        "Pilih huruf hiragana dakuten:",
			Content:       map[string]any{"options": []any{"が", "か"}},
			CorrectAnswer: "が",
		},
	}
	sanitized := exercise.SanitizeExercises(raw)
	_ = svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u2-dakuten", raw, sanitized, nil)
	if got := loader.calls.Load(); got != 1 {
		t.Fatalf("expected cache hit within TTL (1 DB call), got %d", got)
	}

	// 3. After TTL expires, cache reloads from DB and picks up updated mnemonic.
	loader.mu.Lock()
	loader.delay = 0
	loader.rows = []KanaInfo{
		{Character: "が", Script: "hiragana", Romaji: "ga", Mnemonic: `Mnemonic baru dari DB untuk huruf dakuten.`},
	}
	loader.mu.Unlock()

	nowMu.Lock()
	currentTime = currentTime.Add(2 * time.Minute) // total +31m > 30m TTL
	nowMu.Unlock()

	sanitizedAfterTTL := exercise.SanitizeExercises(raw)
	itemsAfterTTL := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u2-dakuten", raw, sanitizedAfterTTL, nil)
	if got := loader.calls.Load(); got != 2 {
		t.Fatalf("expected cache reload after TTL expiry (2 DB calls), got %d", got)
	}
	if len(itemsAfterTTL) != 1 || itemsAfterTTL[0].Mnemonic != "Mnemonic baru dari DB untuk huruf dakuten." {
		t.Fatalf("expected updated DB mnemonic after TTL refresh, got %+v", itemsAfterTTL)
	}
}

func TestKanaCatalogCache_FallbackAndStaleOnError(t *testing.T) {
	t.Run("nil loader uses embedded fallback map", func(t *testing.T) {
		svc := NewService(nil)
		raw := []exercise.Exercise{
			{
				ID:            "ex-a",
				ExerciseType:  exercise.ExerciseTypeFillBlank,
				Prompt:        "Pilih huruf hiragana a:",
				Content:       map[string]any{"options": []any{"あ", "い"}},
				CorrectAnswer: "あ",
			},
		}
		sanitized := exercise.SanitizeExercises(raw)
		items := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u1-hiragana", raw, sanitized, nil)
		if len(items) != 1 || items[0].Reading != "a" || items[0].Mnemonic == "" {
			t.Fatalf("expected fallback kana item for あ, got %+v", items)
		}
	})

	t.Run("cold DB error falls back to embedded map", func(t *testing.T) {
		loader := &stubKanaLoader{err: errors.New("connection refused")}
		svc := NewService(loader)
		raw := []exercise.Exercise{
			{
				ID:            "ex-ku",
				ExerciseType:  exercise.ExerciseTypeFillBlank,
				Prompt:        "Pilih huruf hiragana ku:",
				Content:       map[string]any{"options": []any{"く", "け"}},
				CorrectAnswer: "く",
			},
		}
		sanitized := exercise.SanitizeExercises(raw)
		items := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u1-hiragana", raw, sanitized, nil)
		if len(items) != 1 || items[0].Reading != "ku" {
			t.Fatalf("expected fallback item for く on DB error, got %+v", items)
		}
	})

	t.Run("DB error after TTL serves stale DB catalog", func(t *testing.T) {
		currentTime := time.Date(2026, 11, 27, 10, 0, 0, 0, time.UTC)
		loader := &stubKanaLoader{
			onFetch: func(callNum int32) ([]KanaInfo, error) {
				if callNum == 1 {
					return []KanaInfo{
						{Character: "キョ", Script: "katakana", Romaji: "kyo", Mnemonic: `Gabungan キ (ki) + huruf kecil ョ (yo) menjadi "KYO".`},
					}, nil
				}
				return nil, errors.New("temporary DB outage")
			},
		}
		svc := newServiceWithCache(loader, 10*time.Minute, func() time.Time { return currentTime })
		raw := []exercise.Exercise{
			{
				ID:            "ex-kyo",
				ExerciseType:  exercise.ExerciseTypeFillBlank,
				Prompt:        "Pilih huruf katakana yoon:",
				Content:       map[string]any{"options": []any{"キョ", "キャ", "キュ"}},
				CorrectAnswer: "キョ",
			},
		}

		s1 := exercise.SanitizeExercises(raw)
		items1 := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u3-yoon", raw, s1, nil)
		if len(items1) != 1 || items1[0].Reading != "kyo" {
			t.Fatalf("expected initial DB load for キョ, got %+v", items1)
		}

		// Expire TTL and simulate transient DB outage
		currentTime = currentTime.Add(15 * time.Minute)
		s2 := exercise.SanitizeExercises(raw)
		items2 := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u3-yoon", raw, s2, nil)
		if len(items2) != 1 || items2[0].Reading != "kyo" {
			t.Fatalf("expected stale DB catalog to be served during transient error, got %+v", items2)
		}
		if loader.calls.Load() != 2 {
			t.Fatalf("expected 2 loader attempts, got %d", loader.calls.Load())
		}
	})
}

func TestBuildLessonStudyItemsAndHints_DBDakutenYoonAndAntiSpoiler(t *testing.T) {
	// Real seed rows mirroring PostgreSQL kana_characters (Dakuten, Handakuten, Yoon, Basic with quoted romaji)
	loader := &stubKanaLoader{
		rows: []KanaInfo{
			{Character: "つ", Script: "hiragana", Romaji: "tsu", Mnemonic: `Ombak besar melengkung menghantam pantai — "TSU-nami".`},
			{Character: "ぞ", Script: "hiragana", Romaji: "zo", Mnemonic: `Huruf そ (so) ditambah 2 titik tenten menjadi "ZO".`},
			{Character: "ぱ", Script: "hiragana", Romaji: "pa", Mnemonic: `Huruf は (ha) dengan lingkaran kecil (handakuten / maru) dibaca tegas "PA".`},
			{Character: "きゃ", Script: "hiragana", Romaji: "kya", Mnemonic: `Gabungan き (ki) + huruf kecil ゃ (ya) dilebur cepat menjadi satu suku kata "KYA".`},
			{Character: "キョ", Script: "katakana", Romaji: "kyo", Mnemonic: `Gabungan キ (ki) + huruf kecil ョ (yo) menjadi "KYO".`},
			{Character: "モ", Script: "katakana", Romaji: "mo", Mnemonic: `Bentuk lurus tegas dari hiragana も ("MO-nitor").`},
			{Character: "あ", Script: "hiragana", Romaji: "a", Mnemonic: `Seperti huruf "a" dengan garis lengkung melingkar — bunyikan "a" pada "apa".`},
		},
	}

	svc := NewService(loader)
	raw := []exercise.Exercise{
		{
			ID:            "ex-tsu",
			ExerciseType:  exercise.ExerciseTypeFillBlank,
			Prompt:        "Pilih huruf hiragana yang sesuai:",
			Content:       map[string]any{"options": []any{"つ", "す", "く", "う"}},
			CorrectAnswer: "つ",
		},
		{
			ID:            "ex-zo",
			ExerciseType:  exercise.ExerciseTypeFillBlank,
			Prompt:        "Pilih huruf hiragana dakuten yang sesuai:",
			Content:       map[string]any{"options": []any{"ぞ", "そ", "ざ", "ず"}},
			CorrectAnswer: "ぞ",
		},
		{
			ID:            "ex-kya",
			ExerciseType:  exercise.ExerciseTypeListeningChoice,
			Prompt:        "Dengarkan bunyi huruf berikut dan pilih aksara yang benar:",
			Content:       map[string]any{"audio_text": "きゃ", "options": []any{"きゃ", "きゅ", "きょ", "しゃ"}},
			CorrectAnswer: "きゃ",
		},
		{
			ID:            "ex-kyo-kata",
			ExerciseType:  exercise.ExerciseTypeFillBlank,
			Prompt:        "Pilih huruf katakana yoon yang sesuai:",
			Content:       map[string]any{"options": []any{"キョ", "キャ", "キュ", "ショ"}},
			CorrectAnswer: "キョ",
		},
		{
			ID:            "ex-mo",
			ExerciseType:  exercise.ExerciseTypeListeningChoice,
			Prompt:        "Dengarkan bunyi katakana berikut dan pilih aksara yang benar:",
			Content:       map[string]any{"audio_text": "モ", "options": []any{"モ", "マ", "ミ", "ム"}},
			CorrectAnswer: "モ",
		},
	}

	sanitized := exercise.SanitizeExercises(raw)
	items := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u2-dakuten-yoon", raw, sanitized, nil)

	if len(items) != 5 {
		t.Fatalf("expected 5 study items, got %d: %+v", len(items), items)
	}

	// Study cards keep the rich DB metadata (including Dakuten & Yoon reading + full mnemonic)
	if items[1].Symbol != "ぞ" || items[1].Reading != "zo" || !strings.Contains(items[1].Mnemonic, "tenten") {
		t.Errorf("expected Dakuten study card for ぞ from DB, got %+v", items[1])
	}
	if items[2].Symbol != "きゃ" || items[2].Reading != "kya" || !strings.Contains(items[2].Mnemonic, "Gabungan き") {
		t.Errorf("expected Yoon study card for きゃ from DB, got %+v", items[2])
	}
	if items[3].Symbol != "キョ" || items[3].Reading != "kyo" {
		t.Errorf("expected Katakana Yoon study card for キョ from DB, got %+v", items[3])
	}

	// Quiz hints must NOT leak glyph OR quoted romaji spoilers from DB mnemonics!
	checks := []struct {
		idx       int
		glyph     string
		forbidden []string
	}{
		{idx: 0, glyph: "つ", forbidden: []string{"つ", "TSU-nami", `"TSU`}},
		{idx: 1, glyph: "ぞ", forbidden: []string{"ぞ", `"ZO"`}},
		{idx: 2, glyph: "きゃ", forbidden: []string{"きゃ", `"KYA"`}},
		{idx: 3, glyph: "キョ", forbidden: []string{"キョ", `"KYO"`}},
		{idx: 4, glyph: "モ", forbidden: []string{"モ", "MO-nitor", `"MO`}},
	}
	for _, tc := range checks {
		if sanitized[tc.idx].Hint == nil || strings.TrimSpace(*sanitized[tc.idx].Hint) == "" {
			t.Fatalf("expected non-empty hint for exercise[%d] (%s)", tc.idx, tc.glyph)
		}
		hint := *sanitized[tc.idx].Hint
		for _, bad := range tc.forbidden {
			if strings.Contains(hint, bad) {
				t.Errorf("exercise[%d] (%s) hint leaked spoiler %q: %q", tc.idx, tc.glyph, bad, hint)
			}
		}
	}
}

func TestStripSpoilerFromHint_DBMnemonicPatterns(t *testing.T) {
	cases := []struct {
		name      string
		mnemonic  string
		answer    string
		romaji    string
		wantNo    []string
		wantHas   []string
	}{
		{
			name:     "hiragana tsu dash quoted",
			mnemonic: `Ombak besar melengkung menghantam pantai — "TSU-nami".`,
			answer:   "つ",
			romaji:   "tsu",
			wantNo:   []string{"つ", "TSU-nami", "TSU"},
			wantHas:  []string{"Ombak besar melengkung menghantam pantai."},
		},
		{
			name:     "hiragana a quoted letter",
			mnemonic: `Seperti huruf "a" dengan garis lengkung melingkar — bunyikan "a" pada "apa".`,
			answer:   "あ",
			romaji:   "a",
			wantNo:   []string{"あ", `"a"`},
			wantHas:  []string{"garis lengkung melingkar", `"apa"`},
		},
		{
			name:     "katakana mo parenthesized quoted",
			mnemonic: `Bentuk lurus tegas dari hiragana も ("MO-nitor").`,
			answer:   "モ",
			romaji:   "mo",
			wantNo:   []string{"モ", "MO-nitor"},
			wantHas:  []string{"Bentuk lurus tegas dari hiragana も."},
		},
		{
			name:     "dakuten zo quoted romaji",
			mnemonic: `Huruf そ (so) ditambah 2 titik tenten menjadi "ZO".`,
			answer:   "ぞ",
			romaji:   "zo",
			wantNo:   []string{"ぞ", `"ZO"`},
			wantHas:  []string{"2 titik tenten", "bunyi ini"},
		},
		{
			name:     "glyph embedded directly in mnemonic",
			mnemonic: `Huruf あ berbentuk lengkung.`,
			answer:   "あ",
			romaji:   "a",
			wantNo:   []string{"あ"},
			wantHas:  []string{"huruf ini"},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := stripSpoilerFromHint(tc.mnemonic, tc.answer, tc.romaji)
			for _, bad := range tc.wantNo {
				if strings.Contains(got, bad) {
					t.Errorf("stripSpoilerFromHint leaked %q in %q", bad, got)
				}
			}
			for _, good := range tc.wantHas {
				if !strings.Contains(got, good) {
					t.Errorf("stripSpoilerFromHint missing expected %q in %q", good, got)
				}
			}
		})
	}
}

func TestBuildLessonStudyItemsAndHints_GrammarExampleFallbackAndCheckpoints(t *testing.T) {
	svc := NewService(nil)

	// Grammar fallback when exercises have no extractable items
	gps := []GrammarContext{
		{
			Title:   "Partikel は",
			Formula: "Topik + は + Predikat",
			Examples: []GrammarExample{
				{JP: "わたしは学生です。", Reading: "Watashi wa gakusei desu.", ID: "Saya adalah pelajar."},
			},
		},
	}
	items := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u4-partikel-wa", nil, nil, gps)
	if len(items) != 1 || items[0].Symbol != "わたしは学生です。" || items[0].Meaning != "Saya adalah pelajar." {
		t.Fatalf("expected grammar example fallback card, got %+v", items)
	}

	// Checkpoint slugs return empty items and do not populate hints
	raw := []exercise.Exercise{
		{
			ID:            "ex-cp",
			ExerciseType:  exercise.ExerciseTypeFillBlank,
			Prompt:        "Pilih huruf:",
			Content:       map[string]any{"options": []any{"あ", "い"}},
			CorrectAnswer: "あ",
		},
	}
	sanitized := exercise.SanitizeExercises(raw)
	cpItems := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u1-tes-akhir", raw, sanitized, gps)
	if len(cpItems) != 0 {
		t.Fatalf("expected 0 items for checkpoint slug, got %d", len(cpItems))
	}
	if sanitized[0].Hint != nil {
		t.Fatalf("expected nil hint for checkpoint slug, got %q", *sanitized[0].Hint)
	}
}

func TestBuildLessonStudyItemsAndHints_WritingTraceAndFreeTyping(t *testing.T) {
	svc := NewService(nil)

	raw := []exercise.Exercise{
		{
			ID:                "ex-wt-a",
			ExerciseType:      exercise.ExerciseTypeWritingTrace,
			Prompt:            "Ikuti garis panduan untuk menulis huruf Hiragana あ.",
			CorrectAnswer:     "あ",
			AcceptableAnswers: []string{"あ"},
			Content: map[string]any{
				"target_character": "あ",
				"script":           "hiragana",
				"romaji":           "a",
				"meaning":          "Huruf a (contoh: あさ = pagi)",
				"mnemonic":         "Bentuk lengkung melingkar seperti huruf 'a'.",
				"audio_text":       "あ",
			},
		},
		{
			ID:            "ex-ft-tabemasu",
			ExerciseType:  exercise.ExerciseTypeFreeTyping,
			Prompt:        "Ketik dalam bahasa Jepang: Saya makan nasi setiap pagi.",
			CorrectAnswer: "毎朝ご飯を食べます。",
			AcceptableAnswers: []string{
				"まいあさごはんをたべます",
				"maiasa gohan o tabemasu",
			},
			Content: map[string]any{
				"target_translation": "Saya makan nasi setiap pagi.",
				"audio_text":         "毎朝ご飯を食べます。",
			},
		},
	}

	sanitized := exercise.SanitizeExercises(raw)
	items := svc.BuildLessonStudyItemsAndHints(context.Background(), "n5-u1-writing-practice", raw, sanitized, nil)

	if len(items) != 2 {
		t.Fatalf("expected 2 study items for writing_trace + free_typing, got %d: %+v", len(items), items)
	}

	// Verify writing_trace study item extraction
	wt := items[0]
	if wt.Symbol != "あ" || wt.Reading != "a" || wt.Meaning != "Huruf a (contoh: あさ = pagi)" || wt.Mnemonic != "Bentuk lengkung melingkar seperti huruf 'a'." || wt.SpeakText != "あ" {
		t.Errorf("unexpected writing_trace study item: %+v", wt)
	}
	if sanitized[0].Hint == nil || !strings.Contains(*sanitized[0].Hint, "goresan") {
		t.Errorf("expected writing_trace spoiler-free stroke hint, got %v", sanitized[0].Hint)
	}

	// Verify free_typing study item extraction & spoiler-free hint
	ft := items[1]
	if ft.Symbol != "毎朝ご飯を食べます。" || ft.Meaning != "Saya makan nasi setiap pagi." || ft.SpeakText != "毎朝ご飯を食べます。" {
		t.Errorf("unexpected free_typing study item: %+v", ft)
	}
	if ft.Reading == "" || ft.Reading == "Latihan mengetik" {
		t.Errorf("expected resolved reading for free_typing item, got %q", ft.Reading)
	}
	if sanitized[1].Hint == nil {
		t.Fatalf("expected non-nil hint for free_typing exercise")
	}
	ftHint := *sanitized[1].Hint
	for _, spoiler := range []string{"毎朝", "食べます", "たべます", "tabemasu"} {
		if strings.Contains(strings.ToLower(ftHint), strings.ToLower(spoiler)) {
			t.Errorf("free_typing hint leaked answer %q: %q", spoiler, ftHint)
		}
	}
	if !strings.Contains(ftHint, "Saya makan nasi setiap pagi.") {
		t.Errorf("expected free_typing hint to reference target_translation, got %q", ftHint)
	}
}
