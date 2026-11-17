import React, { useState, useEffect, Suspense } from 'react';
import { ACTIVITIES } from './data/activities';
import HomeGrid from './components/HomeGrid';

export default function App() {
  const [activeId, setActiveId] = useState(() => {
    const hash = window.location.hash.replace('#', '').trim();
    return ACTIVITIES.some((a) => a.id === hash) ? hash : null;
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      setActiveId(ACTIVITIES.some((a) => a.id === hash) ? hash : null);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSelectActivity = (id) => {
    window.location.hash = id;
    setActiveId(id);
  };

  const handleBackToHome = () => {
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    setActiveId(null);
  };

  const selectedActivity = ACTIVITIES.find((a) => a.id === activeId);

  if (selectedActivity) {
    const ActivityComponent = selectedActivity.component;
    return (
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center text-2xl font-black text-slate-600">
            ⏳ Etkinlik Yükleniyor...
          </div>
        }
      >
        <ActivityComponent onBackToHome={handleBackToHome} />
      </Suspense>
    );
  }

  return <HomeGrid onSelectActivity={handleSelectActivity} />;
}

