# Teknik Proje İndeksi (`PROJECT_MAP.md`)

> **AI Asistanı Notu:** Kredi tasarrufu için kod tabanında arama yapmadan önce bu indeksi kullanın. Kodda yaptığınız her yapısal değişiklikten sonra bu dosyayı güncelleyin.

---

## 1. Mimari Özeti (React + Vite + Tailwind CSS — SOLID & DRY Uyumlu)

- **Giriş Noktası:** `index.html` → `src/main.jsx` → `src/App.jsx`
- **Ana Ekran (GridView):** `src/components/HomeGrid.jsx` (`src/data/activities.js` içindeki `ACTIVITIES` dizisini ızgara kartları olarak listeler).
- **Ortak Yardımcılar (DRY):**
  - `src/utils/sound.js`: Web Audio API ses efektleri (`playClick`, `playTick`, `playLockIn`, `playWrong`, `playCelebration`, `isSoundEnabled`, `toggleSoundEnabled`).
  - `src/utils/ui.js`: Ortak Tam Ekran (`toggleFullscreen`) ve Konfeti (`launchDomConfetti`) fonksiyonları.
  - `src/styles/activity-shell.css`: Tüm etkinliklerin ortak kullandığı tema değişkenleri, `.app-shell`, `.top-toolbar`, `.segmented-control`, `.icon-pill-btn`, `.bottom-action-bar`, `.action-btn`, `.wheel-pointer` ve `#confetti-layer` stilleri.
- **İzole Etkinlik Klasörleri:** Her etkinlik `src/activities/<etkinlik-id>/` altında tamamen bağımsız çalışır ve Tek Sorumluluk (SRP) ilkesine göre küçük alt dosyalara ayrılır.

---

## 2. Portal ve Ortak Dosyalar

### `src/data/activities.js`
- **`ACTIVITIES`**: Ana ekranda gösterilen uygulamaların listesi (`{ id, title, subtitle, icon, accentBg, cardBg, borderColor, component }`).
  - Mevcut Etkinlikler:
    1. `lego-colors` (`LegoColorsActivity`) — Parmak Lego • Kule • Eşleştirme
    2. `emotion-dice` (`EmotionDiceActivity`) — 3D Zar • Çark • İfade Taklidi
    3. `route-game` (`RouteGameActivity`) — 8×8 & 5×5 Harita • Tek Adım • Algoritma
    4. `train-pattern` (`TrainPatternActivity`) — Kolay & Usta • Şekil, Meyve, Hayvan
    5. `directions-world` (`DirectionsWorldActivity`) — Sağ • Sol • Yukarı • Aşağı • Çark
    6. `pixel-coding` (`PixelCodingActivity`) — Desen Kopyala • Kodla Boya • 4×4 & 5×5
    7. `step-sequence` (`StepSequenceActivity`) — Önce Hangisi? • 3 ve 4 Adımlı Algoritma
    8. `symbol-cipher` (`SymbolCipherActivity`) — Anahtara Bak • Şifreyi Çöz • 3 & 4 Haneli
    9. `if-then-coding` (`IfThenCodingActivity`) — Kuralı Oku • Karar Ver • 2 ve 3 Koşullu
    10. `loop-coding` (`LoopCodingActivity`) — 5×5 & 6×6 Harita • Döngü Blokları • Grup Döngüsü
    11. `debug-coding` (`DebugCodingActivity`) — Bozuk Kodu Bul • Eksik veya Yanlış Adımı Düzelt

### `src/components/HomeGrid.jsx`
- **`HomeGrid({ onSelectActivity })`**: Uygulamaları büyük ikon ve isimleriyle GridView olarak gösterir; sağ üstte `⛶ Tam Ekran` (`toggleFullscreen`) butonu bulunur.

### `src/components/CelebrationModal.jsx`
- **`CelebrationModal({ stars, heroIcon, targetIcon, message, nextLabel, onNext, onSurprise })`**: Etkinlik tamamlandığında yıldızlı kutlama modalını gösterir.

### `src/App.jsx`
- **`App()`**: Seçili etkinliği (`activeId`) ve URL hash (`#lego-colors`, `#emotion-dice`) senkronizasyonunu yönetir. Seçili etkinlik yoksa `<HomeGrid />` gösterir.

---

## 3. Etkinlik 1: Lego Renkleri (`src/activities/lego-colors/`)

- **Ana Kabuk:** `src/activities/lego-colors/LegoColorsActivity.jsx` (~145 satır)
- **Ayarlar Modalı Bileşeni:** `src/activities/lego-colors/LegoSettingsModal.jsx` (~220 satır — 3 sekmeli ayar penceresi)
- **Stiller:** `src/activities/lego-colors/styles/{layout.css, components.css}`
- **Motor:** `src/activities/lego-colors/engine/{config.js, state.js, audio.js, hand.js, tower.js, quiz.js, wheel.js, app.js}`

---

## 4. Etkinlik 2: Duygu Zarı & Çarkı (`src/activities/emotion-dice/`)

Tek Sorumluluk (SRP) ve maksimum 250 satır kuralına uygun olarak 5 modüle ayrılmıştır:
- **`config.js`** (~80 satır): `EMOTIONS` (6 duygu tanımı: `mutlu`, `uzgun`, `sinirli`, `sasirma`, `endiseli`, `basardim`) ve `getImgForCharacter(emotion, character)` yardımcısı.
- **`DiceStage.jsx`** (~90 satır): 3D Küp Zar sahnesi (`diceCount` 1 veya 2; Çift Zar modunda 1 Kız + 1 Erkek zarı, küp yüzey dönüşü ve duygu etiketi).
- **`WheelStage.jsx`** (~145 satır): 6 dilimli görsel Duygu Çarkı (Canvas) ve sağdaki büyük taklit kartı.
- **`QuizStage.jsx`** (~75 satır): Üstte hedef duygu ve altta karşı karakterli 3 seçenek kartı ile eşleştirme sahnesi.
- **`EmotionDiceActivity.jsx`** (~240 satır): Üst araç çubuğu (`🎲 3D Zar | 🎡 Çark | 🧩 Eşleştir`, `👧 Kız | 👦 Erkek`, `🎲 Tek Zar | 🎲🎲 Çift Zar`), mod yönetimi ve alt aksiyon çubuğu.
- **`emotionDice.css`** (~85 satır): 3D Küp perspektif ve yüz (`face-0..5`) dönüş stilleri.
- **Görseller:** `public/assets/emotions/{e,k}-{mutlu,uzgun,sinirli,sasirma,endiseli,basardim}.jpg`

---

## 5. Etkinlik 3: Rota ve Algoritma (`src/activities/route-game/`)

- **`config.js`**: `ROUTE_THEMES` (`cat`, `bee`, `robot`, `space`), `DIRECTION_VECTORS`, `LEVELS_5X5` ve `LEVELS_8X8` (`💎` elmaslı haritalar), `parseGrid`, `findShortestPathLength`, `createVerifiedRandomLevel(size, withGems)`.
- **`RouteTopBar.jsx`**: Mod (`👆 Tek Adım` — ilk basışta hareket eden elmassız/listesiz mod | `💎 Elmaslı Algoritma` — sağ panelde rota listeli mod + `💎 Elmas: Açık/Kapalı`), harita boyutu (`5×5` | `8×8`), karakter teması ve görev gezinme.
- **`RouteBoard.jsx`**: `5×5` veya `8×8` harita ızgarası, karakter/hedef/elmas (`💎` ➔ `✨`)/engel hücreleri ve Tek Adım modunda komşu hücreye dokunarak anında ilerleme.
- **`RouteControls.jsx`**: Tek Adım modunda sade alt yön tuşları; Algoritma modunda sağ tarafta dikey Rota ve Kodlama Paneli (`💎` elmas sayacı, numaralı hareket listesi olan `📋 Rota Alanı`, 3D yön butonları ve `▶️ BAŞLAT`).
- **`RouteGameActivity.jsx`**: Rota kuyruğu yürütme motoru, elmas toplama kontrolü, BFS onaylı sürpriz haritalar ve yıldızlı kutlama modalı.
- **`routeGame.css`**: İki sütunlu harita ızgarası, elmas yüzme animasyonu ve 3D yön butonları.

---

## 6. Etkinlik 4: Tren Vagonu Örüntü (`src/activities/train-pattern/`)

- **`config.js`**: `CARGO_THEMES` (`shapes`, `fruits`, `animals`, `space`), `EASY_PATTERNS` (1 boş vagon), `ADVANCED_PATTERNS` (2 boş vagon) ve `createRandomPattern(difficulty)`.
- **`TrainTrack.jsx`**: Lokomotif, vagonlar, aktif `❓` vagon vurgusu ve tren rayı sahnesi.
- **`PatternChoices.jsx`**: Alt seçenek butonları ve `🔄 Baştan` butonu.
- **`TrainPatternActivity.jsx`**: Kolay/Usta modları, vagon teması seçici, görev/sürpriz geçişi, yanlış seçim uyarısı ve kutlama modalı.
- **`trainPattern.css`**: Lokomotif, vagon, tekerlek, ray ve titreşim stilleri.

---

## 7. Etkinlik 5: Yönler Dünyası (`src/activities/directions-world/`)

- **`config.js`**: `DIRECTIONS` (`up`, `right`, `down`, `left`), `SPRITE_TYPES`, `ANCHOR_PAIRS`, `WHEEL_SLICES` ve `createLookQuestion` / `createOddQuestion` / `createWhereQuestion` üreticileri.
- **`DirectionVisuals.jsx`**: 4 yöne baş aşağı düşmeden dönen özel SVG nesneler (`rocket`, `fish`, `plane`, `ladybug`, `arrow`).
- **`LookStage.jsx`**: `👀 Yöne Bak` — Ortadaki karakteri çevreleyen artı düzeninde yön butonları (`4 Yön (Sağ-Sol-Yukarı-Aşağı)`, `Sağ-Sol`, `Yukarı-Aşağı`).
- **`OddDirectionStage.jsx`**: `🔍 Ters Yön` — 2×2 kartlarda farklı yöne bakanı bulma sahnesi.
- **`WhereStage.jsx`**: `📍 Neresinde?` — Merkez nesneye göre `Üstünde / Altında / Sağında / Solunda` konum ilişkisi sahnesi.
- **`DirectionWheelStage.jsx`** + **`useDirectionWheel.js`**: 8 dilimli Yön Çarkı (Canvas) ve sınıfça hareket taklit kartı.
- **`DirectionsTopBar.jsx`** + **`DirectionsWorldActivity.jsx`**: Mod/kapsam seçimi, ok tuşu desteği, puan sayacı ve kutlama modalı.
- **`directionsWorld.css`**: 3D yön kartı, sallanma ve zıplama animasyonları.

---

## 8. Etkinlik 6: Piksel Kodlama (`src/activities/pixel-coding/`)

- **`patterns.js`**: `EASY_PATTERNS` (`4×4` — 16 tanıdık desen) ve `MASTER_PATTERNS` (`5×5` — 16 tanıdık desen; toplam 32 şablon).
- **`config.js`**: `PIXEL_COLORS`, `createEmptyGrid`, `getUsedColorCodes`, `remixPatternColors` (mevcut şeklin renk/sayı kodlarını karıştırır) ve `createSurprisePattern` (kurallı Piksel Karakter Yüzü, Geometrik Kodlama Motifi ve Renk Sürprizli Şablon üreticisi).
- **`PixelTopBar.jsx`**: Mod seçimi (`Desen Kopyala | Kodla Boya | Serbest`), boyut (`4×4 Kolay | 5×5 Usta`), desen gezinme ve puan.
- **`PixelBoardStage.jsx`**: Yan yana örnek + boyama tahtası, kodlu piksel ızgarası ve serbest çizim alanı.
- **`PixelPalette.jsx`**: Renk/kod butonları ve silgi aracı.
- **`PixelCodingActivity.jsx`** & **`pixelCoding.css`**: Tamamlanma kontrolü, hata kontrolü (`💡 Kontrol Et`), `🎨 Renk Değiştir`, `🎲 Sürpriz Desen` ve kutlama modalı.

---

## 9. Etkinlik 7: İşlem Sıralama (`src/activities/step-sequence/`)

- **`stories.js`** & **`config.js`**: `EASY_SEQUENCES` (3 adımlı 16 hikaye), `MASTER_SEQUENCES` (4 adımlı 16 hikaye; toplam 32 işlem hikayesi), `shuffleSteps` ve `createSurpriseSequence` (Azdan Çoğa, Artan Sayı Zinciri, Lego Kule İnşası, Ay Evreleri).
- **`SequenceStage.jsx`**: Üstte `1. -> 2. -> 3. -> 4.` hedef yuvaları ve altta karışık adım kartları.
- **`StepSequenceActivity.jsx`**: Kolay/Usta geçişi, hikaye gezgini, sürpriz sıralama ve kutlama modalı.

---

## 10. Etkinlik 8: Sembol Şifre Çözücü (`src/activities/symbol-cipher/`)

- **`config.js`**: `CODE_SYMBOLS` (`▲, ●, ■, ◆`), `CIPHER_THEMES` (`fruits`, `animals`, `space`, `shapes`) ve `createCipherPuzzle`.
- **`CipherStage.jsx`**: Üstte sembol anahtar tablosu, ortada şifreli kilit yuvaları ve altta seçenek butonları.
- **`SymbolCipherActivity.jsx`**: 3 Haneli (Kolay) / 4 Haneli (Usta) zorluk, tema seçici ve yeni şifre üretimi.

---

## 11. Etkinlik 9: Eğer – İse Koşul Oyunu (`src/activities/if-then-coding/`)

- **`config.js`**: `EASY_RULES` (2 dallı koşullar), `MASTER_RULES` (3 dallı koşullar ve sayı karşılaştırma), `buildQuestionDeck`.
- **`IfThenStage.jsx`**: Üstte `EĞER ... ➔ ...` kural kartları, ortada gelen durum/nesne kartı ve altta karar butonları.
- **`IfThenCodingActivity.jsx`**: 5 adımlık tur takibi, Kolay/Usta geçişi ve kutlama modalı.

---

## 12. Etkinlik 10: Döngü Atölyesi (`src/activities/loop-coding/`)

- **`config.js`**: `LOOP_THEMES` (`frog`, `robot`, `space`, `bee`), `DIR_META`, `LEVELS_5X5`, `LEVELS_6X6`, `parseLoopLevel`, `createRandomLoopLevel` ve `expandProgramToSteps`.
- **`LoopBoard.jsx`**: `5×5` ve `6×6` harita ızgarası, karakter/hedef/engel ve adım izi görünümü.
- **`LoopControls.jsx`**: `1️⃣ Yön Seç` (`⬆️ ⬇️ ⬅️ ➡️` ile taslak grup oluşturma) ➔ `2️⃣ Tekrarla` (`1×..5×` seçerek `🔁 N× [ ... ]` döngü grubuna paketleme) ➔ `▶️ BAŞLAT`.
- **`LoopCodingActivity.jsx`** & **`loopCoding.css`**: Adım adım döngü yürütme motoru, aktif tekrar sayacı (`(2/3)`), çarpışma kontrolü ve kutlama modalı.

---

## 13. Etkinlik 11: Hata Ayıklama (`src/activities/debug-coding/`)

- **`config.js`**: `DEBUG_THEMES` (`robot`, `cat`, `bee`, `space`), `DIR_META`, `LEVELS_EASY` (`5×5`), `LEVELS_MASTER` (`6×6`), `parseDebugLevel` ve `createRandomDebugLevel` (`❓` eksik adım, yanlış yön veya fazla hareket içeren görevler).
- **`DebugBoard.jsx`**: `5×5` ve `6×6` harita tahtası, karakter, hedef, engel ve çarpışma animasyonu.
- **`DebugControls.jsx`**: Tıklanıp düzenlenebilen yönerge adımları (`1. ➡️, 2. ❓, 3. ⬇️`), `➕ Adım Ekle`, `🗑️ Seçiliyi Sil`, `🔄 İlk Hali`, yön düzeltme butonları ve `▶️ YÖNERGEYİ DENE`.
- **`DebugCodingActivity.jsx`** & **`debugCoding.css`**: Adım adım yönerge test motoru; çarpışma veya hata anında hatalı adımı (`🐞`) otomatik kırmızı işaretleyip seçili hale getirme ve kutlama modalı.
