import React from 'react';

export default function LegoSettingsModal() {
  return (
    <div
      id="settings-modal"
      className="modal-backdrop hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="modal-title">⚙️ Etkinlik ve Renk Ayarları</h2>
          <button type="button" id="btn-close-settings" className="icon-pill-btn" title="Kapat">
            ✕
          </button>
        </div>

        {/* MODAL SEKMELERİ */}
        <div className="modal-tabs" role="tablist">
          <button type="button" className="modal-tab-btn active" data-settings-tab="activity">
            🎮 Etkinlik Ayarları
          </button>
          <button type="button" className="modal-tab-btn" data-settings-tab="colors">
            🎨 Lego Renkleri
          </button>
          <button type="button" className="modal-tab-btn" data-settings-tab="general">
            🛠️ Genel Ayarlar
          </button>
        </div>

        <div className="modal-body">
          {/* SEKME 1: ETKİNLİK AYARLARI */}
          <div className="settings-tab-panel" data-tab-panel="activity">
            <div className="activity-cards-picker" role="group" aria-label="Etkinlik Türü Seçimi">
              <button type="button" className="activity-pick-card active" data-activity="hand">
                <span className="act-icon">🖐️</span>
                <span className="act-title">Parmak Lego</span>
              </button>
              <button type="button" className="activity-pick-card" data-activity="tower">
                <span className="act-icon">🧱</span>
                <span className="act-title">Lego Kule</span>
              </button>
              <button type="button" className="activity-pick-card" data-activity="quiz">
                <span className="act-icon">🧩</span>
                <span className="act-title">Eşleştirme</span>
              </button>
            </div>

            {/* 1A: PARMAK LEGO AYARLARI */}
            <div id="settings-group-hand" className="settings-grid-rows">
              <div className="settings-row">
                <span>Hangi El Gösterilsin?</span>
                <div className="segmented-control">
                  <button type="button" className="seg-btn active" data-hand-type="left">
                    🤚 Sol El
                  </button>
                  <button type="button" className="seg-btn" data-hand-type="right">
                    ✋ Sağ El
                  </button>
                  <button type="button" className="seg-btn" data-hand-type="both">
                    👐 İki El
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <span>El Yönü (Bakış Açısı)</span>
                <div className="segmented-control">
                  <button type="button" className="seg-btn active" data-hand-view="back">
                    💅 Elin Üstü
                  </button>
                  <button type="button" className="seg-btn" data-hand-view="palm">
                    🖐️ Avuç İçi
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <span>Parmak Sırası</span>
                <select id="quick-order-select" className="quick-select" aria-label="Parmak Sırası">
                  <option value="thumb-first">👍 Başparmaktan Serçeye</option>
                  <option value="pinky-first">🤙 Serçeden Başparmağa</option>
                  <option value="random">🔀 Karışık Sıra</option>
                </select>
              </div>
            </div>

            {/* 1B: LEGO KULE AYARLARI */}
            <div id="settings-group-tower" className="settings-grid-rows hidden">
              <div className="settings-row">
                <span>Kule Yüksekliği (Kat Sayısı)</span>
                <div className="segmented-control">
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`seg-btn ${num === 5 ? 'active' : ''}`}
                      data-tower-preset={num}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 1C: ÇARK & SÜRE ORTAK AYARLARI */}
            <div id="settings-group-wheel-common" className="settings-grid-rows">
              <div className="settings-row">
                <span>Çark Görünümü</span>
                <div className="segmented-control">
                  <button type="button" className="seg-btn active" data-game-mode="both">
                    🎡 Çarklı
                  </button>
                  <button type="button" className="seg-btn" data-game-mode="finger-only">
                    ✨ Çarksız
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <span>Renk Seçim Süresi</span>
                <div className="segmented-control">
                  {[1, 2, 3, 4, 5].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      className={`seg-btn ${sec === 3 ? 'active' : ''}`}
                      data-duration-preset={sec}
                    >
                      {sec} sn
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 1D: EŞLEŞTİRME (QUIZ) AYARLARI */}
            <div id="settings-group-quiz" className="settings-grid-rows hidden">
              <div className="settings-row">
                <span>Sorudaki Lego Sayısı</span>
                <div className="segmented-control">
                  {[
                    { n: 1, label: "1'li" },
                    { n: 2, label: "2'li" },
                    { n: 3, label: "3'lü" },
                    { n: 4, label: "4'lü" },
                    { n: 5, label: "5'li" },
                    { n: 6, label: "6'lı" },
                  ].map((item) => (
                    <button
                      key={item.n}
                      type="button"
                      className={`seg-btn ${item.n === 1 ? 'active' : ''}`}
                      data-quiz-preset={item.n}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="settings-row">
                <span>Lego Dizilimi</span>
                <div className="segmented-control">
                  <button type="button" className="seg-btn active" data-quiz-layout="vertical">
                    ↕️ Üst Üste Kule
                  </button>
                  <button type="button" className="seg-btn" data-quiz-layout="horizontal">
                    ↔️ Yan Yana
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <span>Sonraki Soruya Geçiş</span>
                <div className="segmented-control">
                  <button type="button" className="seg-btn active" data-quiz-autonext-mode="manual">
                    ✋ Tuşla Geç
                  </button>
                  <button type="button" className="seg-btn" data-quiz-autonext-mode="auto">
                    ⏭️ Otomatik (1.5sn)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEKME 2: RENKLER */}
          <div className="settings-tab-panel hidden" data-tab-panel="colors">
            <section className="settings-section">
              <h3>🎨 Aktif Lego Renkleri (En az 2 renk seçili olmalı)</h3>
              <div id="settings-colors-list" className="colors-grid"></div>
            </section>

            <section className="settings-section">
              <h3>➕ Yeni Özel Renk Ekle</h3>
              <form id="add-color-form" className="add-color-form">
                <input
                  type="text"
                  id="new-color-name"
                  placeholder="Renk adı (Örn: Kahverengi)"
                  maxLength="18"
                  required
                  className="text-input"
                />
                <input
                  type="color"
                  id="new-color-hex"
                  defaultValue="#8D6E63"
                  className="color-picker-input"
                  title="Renk Seç"
                />
                <button type="submit" className="icon-pill-btn accent">
                  ➕ Renk Ekle
                </button>
              </form>
            </section>
          </div>

          {/* SEKME 3: GENEL */}
          <div className="settings-tab-panel hidden" data-tab-panel="general">
            <div className="settings-grid-rows">
              <label className="settings-row">
                <span>Üst üste aynı renk gelmesin</span>
                <input type="checkbox" id="setting-no-repeat" />
              </label>
              <div className="settings-row">
                <span>Tüm ayarları ve renkleri sıfırla</span>
                <button type="button" id="btn-reset-defaults" className="icon-pill-btn is-muted">
                  Fabrika Ayarlarına Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

