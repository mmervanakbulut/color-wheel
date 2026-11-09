import React, { useEffect } from 'react';
import { playClick } from '../../utils/sound';
import LegoSettingsModal from './LegoSettingsModal';

// Lego Renkleri etkinliğine özel stiller
import './styles/layout.css';
import './styles/components.css';

// Lego Renkleri motor modülleri (window.LegoApp namespace)
import './engine/config.js';
import './engine/state.js';
import './engine/audio.js';
import './engine/hand.js';
import './engine/tower.js';
import './engine/quiz.js';
import './engine/wheel.js';
import './engine/app.js';

export default function LegoColorsActivity({ onBackToHome }) {
  useEffect(() => {
    if (window.LegoApp && typeof window.LegoApp.initApp === 'function') {
      window.LegoApp.initApp();
    }
    return () => {
      if (window.LegoApp) {
        window.LegoApp.cancelAnimation?.();
        window.LegoApp.clearAutoNextTimer?.();
      }
    };
  }, []);

  const handleGoHome = () => {
    playClick();
    if (window.LegoApp) {
      window.LegoApp.cancelAnimation?.();
      window.LegoApp.clearAutoNextTimer?.();
    }
    onBackToHome?.();
  };

  return (
    <div className="app-shell">
      {/* ÜST ÖĞRETMEN ARAÇ ÇUBUĞU */}
      <header className="top-toolbar">
        {/* SOL GRUP: Ana Ekran & Mod Sekmeleri */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={handleGoHome}
            className="icon-pill-btn"
            title="Ana Ekrana Dön"
          >
            🏠 <span>Etkinlikler</span>
          </button>

          <div className="segmented-control" role="group" aria-label="Etkinlik Türü">
            <button type="button" className="seg-btn active" data-activity="hand" title="Parmaklara Lego Takma">
              🖐️ Parmak
            </button>
            <button type="button" className="seg-btn" data-activity="tower" title="Üst Üste Lego Kule Yapma">
              🧱 Kule
            </button>
            <button type="button" className="seg-btn" data-activity="quiz" title="3 Seçenekten Doğru Lego Rengini Bulma">
              🧩 Eşleştir
            </button>
          </div>
        </div>

        {/* ORTA GRUP: Seçili Etkinliğe Özel Hızlı Seçenekler */}
        <div className="toolbar-group">
          {/* Parmak Modu Hızlı El Seçimi */}
          <div id="quick-hand-controls" className="segmented-control" role="group" aria-label="El Seçimi">
            <button type="button" className="seg-btn active" data-hand-type="left" title="Sol El">🤚 Sol</button>
            <button type="button" className="seg-btn" data-hand-type="right" title="Sağ El">✋ Sağ</button>
            <button type="button" className="seg-btn" data-hand-type="both" title="İki El">👐 İki El</button>
          </div>

          {/* Kule Modu Hızlı Lego Sayısı Seçici */}
          <div id="quick-tower-controls" className="segmented-control hidden" role="group" aria-label="Kule Yüksekliği">
            <button type="button" id="btn-tower-dec" className="seg-btn" title="Lego Sayısını Azalt">➖</button>
            <span id="quick-tower-count-label" className="px-3 py-1 font-extrabold text-sm text-slate-800 flex items-center" title="Kuledeki Lego Sayısı">5 Kat 🧱</span>
            <button type="button" id="btn-tower-inc" className="seg-btn" title="Lego Sayısını Artır">➕</button>
          </div>

          {/* Çarklı / Çarksız Görünüm Seçici */}
          <div id="quick-wheel-mode-controls" className="segmented-control" role="group" aria-label="Çark Görünümü">
            <button type="button" className="seg-btn active" data-game-mode="both" title="Renk Çarkı Gösterilsin">
              🎡 Çarklı
            </button>
            <button type="button" className="seg-btn" data-game-mode="finger-only" title="Çark Olmadan Doğrudan Parmak/Kule Üzerinde Renk Değişsin">
              ✨ Çarksız
            </button>
          </div>

          {/* Eşleştirme (Quiz) Modu Hızlı Kontroller */}
          <div id="quick-quiz-controls" className="segmented-control hidden" role="group" aria-label="Soru Lego Sayısı">
            <button type="button" id="btn-quiz-dec" className="seg-btn" title="Lego Sayısını Azalt">➖</button>
            <span id="quick-quiz-length-label" className="px-3 py-1 font-extrabold text-sm text-slate-800 flex items-center" title="Sorudaki Lego Sayısı">1&apos;li 🧱</span>
            <button type="button" id="btn-quiz-inc" className="seg-btn" title="Lego Sayısını Artır">➕</button>
            <button type="button" className="seg-btn active" data-quiz-layout="vertical" title="Üst Üste Kule Dizilimi">↕️ Dikey</button>
            <button type="button" className="seg-btn" data-quiz-layout="horizontal" title="Yan Yana Dizilim">↔️ Yatay</button>
            <button type="button" id="btn-quiz-autonext" className="seg-btn" title="Doğru Bilince Otomatik Geçiş">✋ <span>Tuşla Geç</span></button>
          </div>

          {/* Eşleştirme Modu Doğru Sayacı */}
          <div id="sequence-steps-bar" className="sequence-steps-bar hidden" aria-label="Skor"></div>
        </div>

        {/* SAĞ GRUP */}
        <div className="toolbar-group">
          <div id="active-colors-strip" className="active-colors-strip" title="Aktif Renkler"></div>

          <button type="button" id="btn-toggle-sound" className="icon-pill-btn" title="Ses Efektleri Aç/Kapa">
            🔊
          </button>
          <button type="button" id="btn-reset" className="icon-pill-btn" title="Baştan Başla">
            🔄
          </button>
          <button type="button" id="btn-open-settings" className="icon-pill-btn accent" title="Tüm Ayarlar">
            ⚙️ <span>Ayarlar</span>
          </button>
          <button type="button" id="btn-fullscreen" className="icon-pill-btn" title="Tam Ekran">
            ⛶
          </button>
        </div>
      </header>

      {/* SÜRE İLERLEME ÇUBUĞU */}
      <div className="timer-bar-track">
        <div id="timer-progress-fill" className="timer-progress-fill"></div>
      </div>

      {/* ANA SAHNE */}
      <main id="main-stage" className="main-stage" data-game-mode="both">
        <section className="wheel-panel" aria-label="Renk Çarkı">
          <div className="wheel-wrapper">
            <div className="wheel-pointer" aria-hidden="true"></div>
            <canvas id="wheel-canvas" width="320" height="320"></canvas>
          </div>
        </section>

        <section className="hand-panel" aria-label="Etkinlik Görseli">
          <div id="hands-container" className="hands-stage"></div>
        </section>
      </main>

      {/* ALT AKSİYON ÇUBUĞU */}
      <footer className="bottom-action-bar">
        <button type="button" id="btn-main-action" className="action-btn primary">
          🎲 BAŞLAT
        </button>
        <button type="button" id="btn-respin" className="action-btn subtle hidden" title="Bu Adımı Tekrar Çevir">
          🔁 Tekrar Seç
        </button>
        <button type="button" id="btn-finish-activity" className="action-btn celebrate" title="Etkinliği Bitir ve Kutla">
          🏆 Bitir
        </button>
      </footer>

      {/* KONFETİ KATMANI */}
      <div id="confetti-layer" aria-hidden="true"></div>

      {/* ÖĞRETMEN AYAR MODALI */}
      <LegoSettingsModal />
    </div>
  );
}
