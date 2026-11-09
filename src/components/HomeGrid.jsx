import React from 'react';
import { ACTIVITIES } from '../data/activities';
import { playClick } from '../utils/sound';
import { toggleFullscreen } from '../utils/ui';

export default function HomeGrid({ onSelectActivity }) {
  const handleCardClick = (id) => {
    playClick();
    onSelectActivity(id);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* ÜST BAŞLIK ÇUBUĞU */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-slate-200 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎲</span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Etkileşimli Etkinlikler
          </h1>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="px-4 py-2 rounded-xl border-2 border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-base cursor-pointer transition active:scale-95"
          title="Tam Ekran Aç/Kapa"
        >
          ⛶ Tam Ekran
        </button>
      </header>

      {/* UYGULAMA KARTLARI (GRIDVIEW) */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ACTIVITIES.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => handleCardClick(act.id)}
              className={`group relative flex flex-col items-center justify-center p-7 rounded-3xl border-4 ${act.borderColor} ${act.cardBg} shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-1 active:scale-98 text-center min-h-[220px]`}
            >
              {/* Üst Renk Şeridi */}
              <div
                className={`w-16 h-2 rounded-full bg-gradient-to-r ${act.accentBg} mb-4 opacity-85 group-hover:w-24 transition-all`}
              />

              {/* Büyük İkon */}
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                {act.icon}
              </div>

              {/* Uygulama İsmi */}
              <h2 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                {act.title}
              </h2>

              {/* Kısa Alt Bilgi */}
              {act.subtitle && (
                <p className="mt-1.5 text-sm font-bold text-slate-500">
                  {act.subtitle}
                </p>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

