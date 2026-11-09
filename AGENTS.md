# AI Agent Kredi Tasarrufu, Yazılım Mimarisi ve Proje Kuralları (`AGENTS.md`)

Bu dosya, yapay zeka asistanlarının (Antigravity vb.) projede değişiklik yaparken **gereksiz dosya okumalarını önleyerek kredi/token kullanımını en aza indirmesi**, **temiz kod (SOLID / DRY / KISS) standartlarını koruması** ve **dokümantasyonu her zaman güncel tutması** için oluşturulmuştur.

---

## ⚡ 1. KREDİ / TOKEN TASARRUFU KURALLARI (ZORUNLU)

1. **Tüm Etkinlikleri Okuma!** Bu proje birden fazla etkileşimli sınıf uygulamasını barındıran **React + Vite + Tailwind CSS** tabanlı bir portaldır. Bir etkinlikte değişiklik istendiğinde diğer etkinliklerin klasörlerini (`src/activities/...`) **ASLA OKUMA**. Önce aşağıdaki **Modül Haritası**'na veya [`PROJECT_MAP.md`](./PROJECT_MAP.md) dosyasına bak, **yalnızca ilgili etkinliğin ilgili alt dosyasını** oku ve düzenle.
2. **Hedefli Düzenleme (`edit_file`) Kullan:** Küçük bir değişiklik için tüm dosyayı baştan yazmak (`write_file`) yerine sadece ilgili fonksiyonu/bileşeni `edit_file` ile güncelle.
3. **Ses Politikası:** Projede Türkçe sesli okuma (TTS / `speechSynthesis`) **kullanılmamaktadır**. Yalnızca `src/utils/sound.js` içindeki Web Audio API ses efektleri (tıklama, çark tik-tak, doğru/yanlış ve kutlama sesleri) kullanılır.

---

## 🏛️ 2. YAZILIM MİMARİSİ VE TEMİZ KOD PRENSİPLERİ (SOLID, DRY, KISS, YAGNI)

1. **📏 Dosya Boyutu Sınırı (Maksimum ~200–250 Satır Kuralı):**
   - Yeni yazılan hiçbir `.jsx`, `.js` veya `.css` dosyası **250 satırı geçmemelidir**.
   - Bir dosya büyümeye başladığında derhal alt bileşenlere/modüllere bölünmelidir (bu kural AI'ın tek seferde küçük dosyalar okuyarak %70'e varan kredi tasarrufu yapmasını sağlar).
2. **🎯 Tek Sorumluluk (SRP - Single Responsibility) & Kaygıların Ayrılması (SoC):**
   - Her dosya yalnızca **tek bir sorumluluğa** sahip olmalıdır. Yeni bir etkinlik (`src/activities/<etkinlik-adi>/`) oluşturulurken şu modüler yapı kullanılmalıdır:
     - `config.js`: Sabit veriler, renkler, görsel yolları ve varsayılan ayarlar.
     - `*Stage.jsx` / `*Modal.jsx`: Her oyun modu veya pencere için ayrı alt bileşen (Örn: `DiceStage.jsx`, `WheelStage.jsx`, `QuizStage.jsx`, `LegoSettingsModal.jsx`).
     - `*Activity.jsx`: Sadece üst araç çubuğunu, aktif sahneyi ve alt aksiyon çubuğunu birleştiren yönetici kabuk bileşen.
3. **♻️ DRY (*Don't Repeat Yourself* — Kendini Tekrar Etme):**
   - Birden fazla etkinlikte kullanılan fonksiyonlar ve stiller etkinlik klasörlerine kopyalanmaz; ortak katmanda tutulur:
     - Ortak ses efektleri → `src/utils/sound.js`
     - Ortak Tam Ekran (`toggleFullscreen`) ve Konfeti (`launchDomConfetti`) → `src/utils/ui.js`
     - Ortak Üst Bar (`.top-toolbar`), Alt Butonlar (`.action-btn`), Çark İbresi ve Konfeti stilleri → `src/styles/activity-shell.css`
4. **🔌 Tam İzolasyon (Low Coupling) & Açık/Kapalı Prensibi (Open/Closed):**
   - Hiçbir etkinlik (`src/activities/A`), başka bir etkinliğin (`src/activities/B`) içindeki dosyaları import edemez. Bir etkinlik klasörü silindiğinde diğer etkinlikler etkilenmemelidir.
   - Yeni etkinlik eklerken `HomeGrid.jsx` veya `App.jsx` değiştirilmez; yalnızca `src/data/activities.js` listesine yeni etkinlik nesnesi eklenir.
5. **✂️ KISS & YAGNI (Basit Tut & Gereksiz Kod Ekleme):**
   - İhtiyaç duyulmayan karmaşık soyutlamalar, kullanılmayan ayarlar veya ağır harici kütüphaneler projeye eklenmez.

---

## 🗺️ 3. HIZLI MODÜL HARİTASI (Hangi Değişiklik İçin Hangi Dosyaya Bakılmalı?)

| İstenen Değişiklik Türü | Sadece Okunacak / Düzenlenecek Dosya |
| :--- | :--- |
| **Yeni bir etkinlik/uygulama ekleme** | `src/activities/<yeni-etkinlik>/` oluştur + `src/data/activities.js` listesine 1 satır ekle |
| **Ana Ekran (GridView uygulama kartları)** | `src/components/HomeGrid.jsx` ve `src/data/activities.js` |
| **Uygulama geçişi / URL Hash yönlendirmesi** | `src/App.jsx` |
| **Ortak ses efektleri (tık, çark, başarı, yanlış)** | `src/utils/sound.js` |
| **Ortak Tam Ekran ve Konfeti yardımcıları** | `src/utils/ui.js` |
| **Ortak Üst Bar, Alt Buton ve Konfeti CSS'i** | `src/styles/activity-shell.css` |
| **Duygu Zarı (`emotion-dice`) ana kabuğu ve üst/alt barı** | `src/activities/emotion-dice/EmotionDiceActivity.jsx` |
| **Duygu Zarı: 6 duygu tanımı ve görsel yolları** | `src/activities/emotion-dice/config.js` |
| **Duygu Zarı: 3D Zar sahnesi (Tek/Çift zar)** | `src/activities/emotion-dice/DiceStage.jsx` ve `emotionDice.css` |
| **Duygu Zarı: Duygu Çarkı (Canvas) ve taklit kartı** | `src/activities/emotion-dice/WheelStage.jsx` |
| **Duygu Zarı: 3 seçenekli duygu eşleştirme sahnesi** | `src/activities/emotion-dice/QuizStage.jsx` |
| **Lego Renkleri (`lego-colors`) ana kabuğu** | `src/activities/lego-colors/LegoColorsActivity.jsx` |
| **Lego: Ayarlar Modalı bileşeni (3 sekmeli)** | `src/activities/lego-colors/LegoSettingsModal.jsx` |
| **Lego: Varsayılan renkler ve ayar sabitleri** | `src/activities/lego-colors/engine/config.js` |
| **Lego: State yönetimi, `localStorage`, sıra algoritması** | `src/activities/lego-colors/engine/state.js` |
| **Lego: El SVG çizimi ve parmak ucu 3D Lego kutuları** | `src/activities/lego-colors/engine/hand.js` |
| **Lego: Üst üste Lego Kule (Tower) SVG çizimi (3-10 kat)** | `src/activities/lego-colors/engine/tower.js` |
| **Lego: 1'li–6'lı rastgele Lego sorusu ve 3 seçenekli eşleştirme** | `src/activities/lego-colors/engine/quiz.js` |
| **Lego: Renk çarkı (Canvas) çizimi ve dönüş animasyonu** | `src/activities/lego-colors/engine/wheel.js` |
| **Lego: Buton tıklamaları ve senkronizasyon** | `src/activities/lego-colors/engine/app.js` |
| **Lego: Etkinliğe özel stiller** | `src/activities/lego-colors/styles/{layout,components}.css` |

---

## 🔄 4. DEĞİŞİKLİK SONRASI ZORUNLU GÜNCELLEME KURALI

Projede **yeni bir etkinlik eklendiğinde, mevcut bir fonksiyon/bileşen değiştirildiğinde veya dosya yapısı güncellendiğinde** aynı işlem turunda şu dosyaları **MUTLAKA GÜNCELLE**:

1. **`PROJECT_MAP.md`**: Eklenen/değişen etkinlikleri, bileşenleri veya fonksiyonları güncelle.
2. **`AGENTS.md`**: Modül sorumlulukları veya yeni etkinlik klasörü eklendiyse tabloyu güncelle.
3. **`README.md`**: Kullanıcıya/öğretmene yansıyan yeni bir etkinlik veya özellik eklendiyse kullanım kılavuzuna ekle.
