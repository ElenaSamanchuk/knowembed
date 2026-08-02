import { useState } from 'react';
import { HeroLiveWidget } from './HeroLiveWidget';
import { HeroProductShowcase } from './HeroProductShowcase';

type DemoTab = 'live' | 'tour';

export function HeroDemoPanel() {
  const [tab, setTab] = useState<DemoTab>('live');

  return (
    <div className="hero-demo-panel">
      <div className="hero-demo-panel__switch" role="tablist" aria-label="Hero demo mode">
        <button
          type="button"
          role="tab"
          className={`hero-demo-panel__tab${tab === 'live' ? ' is-active' : ''}`}
          aria-selected={tab === 'live'}
          onClick={() => setTab('live')}
        >
          Live widget
        </button>
        <button
          type="button"
          role="tab"
          className={`hero-demo-panel__tab${tab === 'tour' ? ' is-active' : ''}`}
          aria-selected={tab === 'tour'}
          onClick={() => setTab('tour')}
        >
          Product tour
        </button>
      </div>
      {tab === 'live' ? <HeroLiveWidget /> : <HeroProductShowcase />}
    </div>
  );
}
