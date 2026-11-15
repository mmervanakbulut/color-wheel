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
- **`DiceStage.jsx`** (~75 satır): 3D Küp Zar sahnesi (`diceCount` 1 veya 2, küp yüzey dönüşü ve duygu etiketi).
- **`WheelStage.jsx`** (~145 satır): 6 dilimli görsel Duygu Çarkı (Canvas) ve sağdaki büyük taklit kartı.
- **`QuizStage.jsx`** (~75 satır): Üstte hedef duygu ve altta karşı karakterli 3 seçenek kartı ile eşleştirme sahnesi.
- **`EmotionDiceActivity.jsx`** (~240 satır): Üst araç çubuğu (`🎲 3D Zar | 🎡 Çark | 🧩 Eşleştir`, `👧 Kız | 👦 Erkek`, `🎲 Tek Zar | 🎲🎲 Çift Zar`), mod yönetimi ve alt aksiyon çubuğu.
- **`emotionDice.css`** (~85 satır): 3D Küp perspektif ve yüz (`face-0..5`) dönüş stilleri.
- **Görseller:** `public/assets/emotions/{e,k}-{mutlu,uzgun,sinirli,sasirma,endiseli,basardim}.jpg`

---

## 5. Etkinlik 3: Rota ve Algoritma (`src/activities/route-game/`)

- **`config.js`**: `ROUTE_THEMES` (`cat`, `bee`, `robot`, `space`), `DIRECTION_VECTORS`, `LEVELS_5X5`, `LEVELS_8X8`, `parseGrid`, `findShortestPathLength`, `createVerifiedRandomLevel(size)`.
- **`RouteTopBar.jsx`**: Mod (`Tek Adım` | `Algoritma`), harita boyutu (`5×5` | `8×8`), karakter teması, görev gezinme (`◀ ▶ 🎲 Sürpriz`), ses ve tam ekran.
- **`RouteBoard.jsx`**: `5×5` veya `8×8` harita ızgarası, karakter/hedef/engel hücreleri ve tek adım modunda komşu hücreye dokunarak ilerleme.
- **`RouteControls.jsx`**: Algoritma kod sırası (`📋 KOD SIRASI`), 3D renkli yön butonları, `▶️ BAŞLAT`, `⌫ Sil`, `🔄 Baştan`.
- **`RouteGameActivity.jsx`**: Oyun state yönetimi, BFS onaylı sürpriz haritalar, çarpışma uyarı banner'ı ve yıldızlı kutlama modalı.
- **`routeGame.css`**: Harita ızgarası, 3D D-Pad butonları ve sallanma/nabız animasyonları.

---

## 6. Etkinlik 4: Tren Vagonu Örüntü (`src/activities/train-pattern/`)

- **`config.js`**: `CARGO_THEMES` (`shapes`, `fruits`, `animals`, `space`), `EASY_PATTERNS` (1 boş vagon), `ADVANCED_PATTERNS` (2 boş vagon) ve `createRandomPattern(difficulty)`.
- **`TrainTrack.jsx`**: Lokomotif, vagonlar, aktif `❓` vagon vurgusu ve tren rayı sahnesi.
- **`PatternChoices.jsx`**: Alt seçenek butonları ve `🔄 Baştan` butonu.
- **`TrainPatternActivity.jsx`**: Kolay/Usta modları, vagon teması seçici, görev/sürpriz geçişi, yanlış seçim uyarısı ve kutlama modalı.
- **`trainPattern.css`**: Lokomotif, vagon, tekerlek, ray ve titreşim stilleri.
