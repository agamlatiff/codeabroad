package studyitem

import (
	"context"
	"strings"
	"sync"
	"time"

	"golang.org/x/sync/singleflight"
)

const defaultKanaCacheTTL = 30 * time.Minute

// KanaInfo represents canonical character metadata loaded from PostgreSQL kana_characters.
type KanaInfo struct {
	Character string
	Script    string
	Romaji    string
	Mnemonic  string
}

// KanaLoader loads the full kana/kanji catalog from persistent storage (PostgreSQL SSOT).
type KanaLoader interface {
	LoadKanaCatalog(ctx context.Context) ([]KanaInfo, error)
}

// kanaCatalogCache caches the PostgreSQL kana_characters table in RAM with a TTL and singleflight deduplication.
// When no loader is configured or the backing store is temporarily unavailable/empty, it gracefully falls back
// to the lightweight embedded Gojuon map so isolated unit tests and degraded startups continue operating.
type kanaCatalogCache struct {
	loader KanaLoader
	ttl    time.Duration
	now    func() time.Time

	mu        sync.RWMutex
	entries   map[string]KanaInfo
	loadedAt  time.Time
	hasLoaded bool
	sfGroup   singleflight.Group
}

func newKanaCatalogCache(loader KanaLoader, ttl time.Duration, nowFn func() time.Time) *kanaCatalogCache {
	if ttl <= 0 {
		ttl = defaultKanaCacheTTL
	}
	if nowFn == nil {
		nowFn = time.Now
	}
	return &kanaCatalogCache{
		loader: loader,
		ttl:    ttl,
		now:    nowFn,
	}
}

func (c *kanaCatalogCache) getCatalog(ctx context.Context) map[string]KanaInfo {
	if c == nil || c.loader == nil {
		return fallbackKanaMap
	}

	c.mu.RLock()
	if c.hasLoaded && len(c.entries) > 0 && c.now().Sub(c.loadedAt) < c.ttl {
		entries := c.entries
		c.mu.RUnlock()
		return entries
	}
	stale := c.entries
	hasStale := c.hasLoaded && len(c.entries) > 0
	c.mu.RUnlock()

	if ctx == nil {
		ctx = context.Background()
	}

	val, _, _ := c.sfGroup.Do("kana_catalog", func() (any, error) {
		// Double-check after entering singleflight in case another caller just populated the cache.
		c.mu.RLock()
		if c.hasLoaded && len(c.entries) > 0 && c.now().Sub(c.loadedAt) < c.ttl {
			entries := c.entries
			c.mu.RUnlock()
			return entries, nil
		}
		c.mu.RUnlock()

		rows, err := c.loader.LoadKanaCatalog(ctx)
		if err != nil || len(rows) == 0 {
			if hasStale {
				return stale, nil
			}
			return fallbackKanaMap, nil
		}

		catalog := make(map[string]KanaInfo, len(rows))
		for _, row := range rows {
			ch := strings.TrimSpace(row.Character)
			if ch == "" {
				continue
			}
			catalog[ch] = KanaInfo{
				Character: ch,
				Script:    strings.TrimSpace(row.Script),
				Romaji:    strings.TrimSpace(row.Romaji),
				Mnemonic:  strings.TrimSpace(row.Mnemonic),
			}
		}
		if len(catalog) == 0 {
			if hasStale {
				return stale, nil
			}
			return fallbackKanaMap, nil
		}

		c.mu.Lock()
		c.entries = catalog
		c.loadedAt = c.now()
		c.hasLoaded = true
		c.mu.Unlock()

		return catalog, nil
	})

	if catalog, ok := val.(map[string]KanaInfo); ok && len(catalog) > 0 {
		return catalog
	}
	if hasStale {
		return stale
	}
	return fallbackKanaMap
}

// fallbackKanaMap is a lightweight read-only fallback used ONLY when KanaLoader is nil
// or PostgreSQL kana_characters returns an error or empty result set.
var fallbackKanaMap = map[string]KanaInfo{
	// Hiragana
	"あ": {Character: "あ", Script: "hiragana", Romaji: "a", Mnemonic: `Bentuk lengkungnya memutar bertangkai silang dari atas ke kanan bawah.`},
	"い": {Character: "い", Script: "hiragana", Romaji: "i", Mnemonic: `Dua garis tegak sedikit melengkung berdiri berdampingan mirip angka 11.`},
	"う": {Character: "う", Script: "hiragana", Romaji: "u", Mnemonic: `Satu lengkungan membulat menyamping dengan topi miring kecil di bagian atas.`},
	"え": {Character: "え", Script: "hiragana", Romaji: "e", Mnemonic: `Garis zig-zag menyerupai angka 2 dengan satu garis miring kecil di atas.`},
	"お": {Character: "お", Script: "hiragana", Romaji: "o", Mnemonic: `Garis silang memutar ke kanan bawah disertai satu titik terpisah di kanan atas.`},
	"か": {Character: "か", Script: "hiragana", Romaji: "ka", Mnemonic: `Garis melengkung mirip bilah pedang pendek ditambah satu titik percikan di kanan.`},
	"き": {Character: "き", Script: "hiragana", Romaji: "ki", Mnemonic: `Dua garis palang datar disilang batang miring menyerupai gigi anak kunci.`},
	"く": {Character: "く", Script: "hiragana", Romaji: "ku", Mnemonic: `Satu sudut tunggal menyiku ke kiri seperti paruh burung yang terbuka.`},
	"け": {Character: "け", Script: "hiragana", Romaji: "ke", Mnemonic: `Satu tiang tegak di kiri diikuti garis silang pendek dan kaki kanan melengkung.`},
	"こ": {Character: "こ", Script: "hiragana", Romaji: "ko", Mnemonic: `Dua garis datar pendek sejajar atas-bawah membentuk rongga terbuka ke kiri.`},
	"さ": {Character: "さ", Script: "hiragana", Romaji: "sa", Mnemonic: `Satu garis datar disilang batang miring lalu melengkung ke bawah seperti senyum.`},
	"し": {Character: "し", Script: "hiragana", Romaji: "shi", Mnemonic: `Satu goresan tegak lurus lalu melengkung halus ke kanan seperti mata pancing.`},
	"す": {Character: "す", Script: "hiragana", Romaji: "su", Mnemonic: `Palang datar dengan simpul kecil menggantung di tengah mirip gulungan tali.`},
	"せ": {Character: "せ", Script: "hiragana", Romaji: "se", Mnemonic: `Tiga garis bersilang membentuk lekukan seperti sandaran kursi santai.`},
	"そ": {Character: "そ", Script: "hiragana", Romaji: "so", Mnemonic: `Satu goresan zig-zag mengalir ke bawah lalu berbelok melengkung di bagian kaki.`},
	"た": {Character: "た", Script: "hiragana", Romaji: "ta", Mnemonic: `Dua garis silang pendek di sisi kiri diikuti dua garis datar bertumpuk di sisi kanan.`},
	"ち": {Character: "ち", Script: "hiragana", Romaji: "chi", Mnemonic: `Garis datar pendek ditembus tiang miring yang membulat ke bawah mirip angka 5.`},
	"つ": {Character: "つ", Script: "hiragana", Romaji: "tsu", Mnemonic: `Satu lengkungan lebar menyapu ke bawah seperti ombak laut yang menggulung.`},
	"て": {Character: "て", Script: "hiragana", Romaji: "te", Mnemonic: `Garis atas datar yang berbelok halus ke kanan membentuk lengkungan terbuka.`},
	"と": {Character: "と", Script: "hiragana", Romaji: "to", Mnemonic: `Garis miring pendek di atas yang menancap pada lengkungan bulat seperti duri.`},
	"な": {Character: "な", Script: "hiragana", Romaji: "na", Mnemonic: `Palang silang di kiri dengan satu titik atas dan simpul kecil di kanan bawah.`},
	"に": {Character: "に", Script: "hiragana", Romaji: "ni", Mnemonic: `Tiang vertikal di kiri dengan dua garis datar pendek bertumpuk di sebelah kanan.`},
	"ぬ": {Character: "ぬ", Script: "hiragana", Romaji: "nu", Mnemonic: `Dua garis melingkar saling bertaut berakhir pada satu simpul kecil di kanan bawah.`},
	"ね": {Character: "ね", Script: "hiragana", Romaji: "ne", Mnemonic: `Tiang lurus di kiri berliku naik di sisi kanan dan ditutup satu simpul bawah.`},
	"の": {Character: "の", Script: "hiragana", Romaji: "no", Mnemonic: `Satu tarikan melingkar penuh dari dalam keluar seperti gulungan obat nyamuk.`},
	"は": {Character: "は", Script: "hiragana", Romaji: "ha", Mnemonic: `Tiang kiri tegak dengan satu palang datar kanan yang berakhir bersimpul di bawah.`},
	"ひ": {Character: "ひ", Script: "hiragana", Romaji: "hi", Mnemonic: `Satu lengkungan dalam menyerupai mangkuk senyum terbuka dengan ekor naik ke atas.`},
	"ふ": {Character: "ふ", Script: "hiragana", Romaji: "fu", Mnemonic: `Goresan tengah berombak diapit dua titik kecil di kanan kiri seperti puncak gunung.`},
	"へ": {Character: "へ", Script: "hiragana", Romaji: "he", Mnemonic: `Satu tarikan menanjak pendek lalu turun panjang menyerupai puncak atap miring.`},
	"ほ": {Character: "ほ", Script: "hiragana", Romaji: "ho", Mnemonic: `Tiang kiri tegak dengan dua palang datar sejajar di kanan dan simpul di kaki.`},
	"ま": {Character: "ま", Script: "hiragana", Romaji: "ma", Mnemonic: `Dua garis palang datar sejajar ditembus satu tiang tengah yang bersimpul di bawah.`},
	"み": {Character: "み", Script: "hiragana", Romaji: "mi", Mnemonic: `Goresan berputar membentuk simpul kiri lalu disilang lengkungan naik mirip angka 21.`},
	"む": {Character: "む", Script: "hiragana", Romaji: "mu", Mnemonic: `Palang datar disilang lingkaran simpul melenting disertai satu titik terpisah di kanan atas.`},
	"め": {Character: "め", Script: "hiragana", Romaji: "me", Mnemonic: `Dua garis menyilang membentuk lingkaran membulat polos tanpa simpul penutup.`},
	"も": {Character: "も", Script: "hiragana", Romaji: "mo", Mnemonic: `Satu kail lengkung tegak ditembus dua garis datar sejajar di bagian badan.`},
	"や": {Character: "や", Script: "hiragana", Romaji: "ya", Mnemonic: `Lengkungan lebar di kanan ditembus satu titik terpisah dan tiang miring ke kiri bawah.`},
	"ゆ": {Character: "ゆ", Script: "hiragana", Romaji: "yu", Mnemonic: `Tiang kiri pendek menyambung lingkaran besar memutar yang disilang batang tegak.`},
	"よ": {Character: "よ", Script: "hiragana", Romaji: "yo", Mnemonic: `Tiang tegak berpalang pendek ke kanan lalu membentuk satu simpul membulat di bawah.`},
	"ら": {Character: "ら", Script: "hiragana", Romaji: "ra", Mnemonic: `Titik miring di atas yang terpisah dari lengkungan besar membulat ke kanan bawah.`},
	"り": {Character: "り", Script: "hiragana", Romaji: "ri", Mnemonic: `Dua batang vertikal sejajar, dengan batang kanan lebih panjang melengkung halus.`},
	"る": {Character: "る", Script: "hiragana", Romaji: "ru", Mnemonic: `Satu tarikan mirip angka 3 dengan satu lingkaran simpul kecil di ujung ekornya.`},
	"れ": {Character: "れ", Script: "hiragana", Romaji: "re", Mnemonic: `Tiang lurus kiri disilang lengkungan tajam yang melenting ke luar arah kanan.`},
	"ろ": {Character: "ろ", Script: "hiragana", Romaji: "ro", Mnemonic: `Satu tarikan mirip angka 3 polos yang terbuka bersih tanpa simpul di bagian ekor.`},
	"わ": {Character: "わ", Script: "hiragana", Romaji: "wa", Mnemonic: `Tiang lurus kiri disilang garis naik lalu melengkung lebar ke arah kanan bawah.`},
	"を": {Character: "を", Script: "hiragana", Romaji: "o / wo", Mnemonic: `Palang atas miring bertemu tiang tengah lalu melangkahi lengkungan bawah.`},
	"ん": {Character: "ん", Script: "hiragana", Romaji: "n", Mnemonic: `Satu tarikan tunggal berkaki satu yang melengkung naik lalu turun di kanan.`},
	// Katakana
	"ア": {Character: "ア", Script: "katakana", Romaji: "a", Mnemonic: `Sudut tajam terbuka di atas yang bertumpu pada satu goresan miring ke kiri bawah.`},
	"イ": {Character: "イ", Script: "katakana", Romaji: "i", Mnemonic: `Satu sapuan miring pendek di atas dengan batang tegak lurus menurun di bawahnya.`},
	"ウ": {Character: "ウ", Script: "katakana", Romaji: "u", Mnemonic: `Satu titik tegak di atap garis datar yang membelok turun ke kiri bawah.`},
	"エ": {Character: "エ", Script: "katakana", Romaji: "e", Mnemonic: `Dua garis datar sejajar atas-bawah yang dihubungkan satu tiang tegak di tengah.`},
	"オ": {Character: "オ", Script: "katakana", Romaji: "o", Mnemonic: `Palang datar disilang batang tegak berkait kiri dengan satu garis miring di sudut kiri bawah.`},
	"カ": {Character: "カ", Script: "katakana", Romaji: "ka", Mnemonic: `Satu palang berbelok siku tajam ke bawah disilang satu garis miring ke kiri.`},
	"キ": {Character: "キ", Script: "katakana", Romaji: "ki", Mnemonic: `Dua palang datar bersudut tajam yang disilang satu batang miring di tengah.`},
	"ク": {Character: "ク", Script: "katakana", Romaji: "ku", Mnemonic: `Satu sapuan pendek kiri atas menyambung atap pendek lalu melengkung miring ke kiri.`},
	"ケ": {Character: "ケ", Script: "katakana", Romaji: "ke", Mnemonic: `Satu garis miring pendek kiri diikuti atap datar dengan tiang melengkung ke kiri bawah.`},
	"コ": {Character: "コ", Script: "katakana", Romaji: "ko", Mnemonic: `Dua sudut siku tajam terbuka menghadap ke kiri seperti kurung kotak terbuka.`},
	"サ": {Character: "サ", Script: "katakana", Romaji: "sa", Mnemonic: `Palang datar disilang dua batang tegak, dengan batang kanan turun melengkung ke kiri.`},
	"シ": {Character: "シ", Script: "katakana", Romaji: "shi", Mnemonic: `Dua titik vertikal berbaris di kiri + sapuan panjang naik dari bawah ke kanan atas.`},
	"ス": {Character: "ス", Script: "katakana", Romaji: "su", Mnemonic: `Atap berbelok miring ke kiri bawah disertai satu kaki penyangga pendek ke kanan bawah.`},
	"セ": {Character: "セ", Script: "katakana", Romaji: "se", Mnemonic: `Garis atas menyiku tajam yang ditopang satu garis lengkung dari bawah.`},
	"ソ": {Character: "ソ", Script: "katakana", Romaji: "so", Mnemonic: `Satu titik miring di kiri atas + satu sapuan panjang turun dari kanan atas ke kiri.`},
	"タ": {Character: "タ", Script: "katakana", Romaji: "ta", Mnemonic: `Sudut miring ke kiri atas dengan palang pendek menyilang di bagian tengah badan.`},
	"チ": {Character: "チ", Script: "katakana", Romaji: "chi", Mnemonic: `Atap miring pendek di atas palang datar yang ditembus batang melengkung ke kiri.`},
	"ツ": {Character: "ツ", Script: "katakana", Romaji: "tsu", Mnemonic: `Dua titik sejajar horizontal di atas + sapuan panjang turun dari kanan atas ke kiri.`},
	"テ": {Character: "テ", Script: "katakana", Romaji: "te", Mnemonic: `Dua garis datar bertumpuk di atas dengan satu tiang tengah melengkung ke kiri bawah.`},
	"ト": {Character: "ト", Script: "katakana", Romaji: "to", Mnemonic: `Satu batang tegak lurus dengan satu cabang pendek menonjol miring ke kanan.`},
	"ナ": {Character: "ナ", Script: "katakana", Romaji: "na", Mnemonic: `Palang horizontal lurus yang disilang satu sapuan melengkung ke kiri bawah.`},
	"ニ": {Character: "ニ", Script: "katakana", Romaji: "ni", Mnemonic: `Dua garis datar bersih sejajar atas-bawah tanpa batang penghubung.`},
	"ヌ": {Character: "ヌ", Script: "katakana", Romaji: "nu", Mnemonic: `Garis menyudut turun ke kiri yang disilang satu titik goresan pendek di kanan bawah.`},
	"ネ": {Character: "ネ", Script: "katakana", Romaji: "ne", Mnemonic: `Titik kecil di puncak atap miring bertiang tegak dengan cabang pendek di kanan bawah.`},
	"ノ": {Character: "ノ", Script: "katakana", Romaji: "no", Mnemonic: `Satu goresan miring diagonal tajam dari kanan atas ke kiri bawah.`},
	"ハ": {Character: "ハ", Script: "katakana", Romaji: "ha", Mnemonic: `Dua goresan pendek terbuka ke kiri dan kanan seperti atap miring terpisah.`},
	"ヒ": {Character: "ヒ", Script: "katakana", Romaji: "hi", Mnemonic: `Batang tegak berbelok sudut ke kanan bawah dengan satu garis pendek melintang ke atas.`},
	"フ": {Character: "フ", Script: "katakana", Romaji: "fu", Mnemonic: `Satu goresan datar berbelok turun ke kiri bawah tanpa sudut tambahan.`},
	"ヘ": {Character: "ヘ", Script: "katakana", Romaji: "he", Mnemonic: `Bentuk atap bersudut tajam menanjak pendek lalu menurun memanjang ke kanan.`},
	"ホ": {Character: "ホ", Script: "katakana", Romaji: "ho", Mnemonic: `Bentuk salib bertiang diapit dua titik cabang pendek di sisi kiri dan kanan.`},
	"マ": {Character: "マ", Script: "katakana", Romaji: "ma", Mnemonic: `Garis datar membelok menyiku ke kiri diikuti satu goresan pendek di bagian ujung.`},
	"ミ": {Character: "ミ", Script: "katakana", Romaji: "mi", Mnemonic: `Tiga goresan pendek miring sejajar bertumpuk rapi seperti tiga cakaran diagonal.`},
	"ム": {Character: "ム", Script: "katakana", Romaji: "mu", Mnemonic: `Garis sudut tajam turun ke kiri bawah yang ditutup satu goresan pendek di sudut kanan.`},
	"メ": {Character: "メ", Script: "katakana", Romaji: "me", Mnemonic: `Satu sapuan miring kiri disilang sapuan pendek membentuk tanda silang tajam.`},
	"モ": {Character: "モ", Script: "katakana", Romaji: "mo", Mnemonic: `Dua garis datar bertiang siku rata mendatar tanpa kait berlebih.`},
	"ヤ": {Character: "ヤ", Script: "katakana", Romaji: "ya", Mnemonic: `Goresan menyiku ke kanan ditembus satu tiang panjang miring tanpa titik terpisah.`},
	"ユ": {Character: "ユ", Script: "katakana", Romaji: "yu", Mnemonic: `Garis siku atas berbelok turun bertumpu di atas satu garis alas horizontal panjang.`},
	"ヨ": {Character: "ヨ", Script: "katakana", Romaji: "yo", Mnemonic: `Tiga garis mendatar terbuka ke kiri yang disatukan batang tegak di sebelah kanan.`},
	"ラ": {Character: "ラ", Script: "katakana", Romaji: "ra", Mnemonic: `Satu garis datar pendek di atas diikuti lengkungan siku menurun ke kiri bawah.`},
	"リ": {Character: "リ", Script: "katakana", Romaji: "ri", Mnemonic: `Dua batang tegak bersisian, garis kanan turun memanjang melengkung ke kiri.`},
	"ル": {Character: "ル", Script: "katakana", Romaji: "ru", Mnemonic: `Satu garis miring turun ke kiri diikuti batang tegak berbelok tajam ke kanan atas.`},
	"レ": {Character: "レ", Script: "katakana", Romaji: "re", Mnemonic: `Satu tarikan vertikal yang melenting tajam ke kanan atas.`},
	"ロ": {Character: "ロ", Script: "katakana", Romaji: "ro", Mnemonic: `Bentuk kotak segi empat siku utuh tertutup rapat.`},
	"ワ": {Character: "ワ", Script: "katakana", Romaji: "wa", Mnemonic: `Tiang pendek kiri atas terhubung garis atas lalu melengkung turun membelok ke kiri.`},
	"ヲ": {Character: "ヲ", Script: "katakana", Romaji: "o / wo", Mnemonic: `Dua garis datar atas dihubungkan kurva turun tajam di sisi kanan.`},
	"ン": {Character: "ン", Script: "katakana", Romaji: "n", Mnemonic: `Satu titik di kiri atas + sapuan panjang naik dari kiri bawah ke kanan atas.`},
}
