import { useEffect, useState } from 'react';
import { publicPath } from '../lib/paths';

const SLIDES = [
  {
    id: 'landing',
    label: 'Landing',
    caption: 'Product marketing site',
    src: 'docs/screenshots/01-landing.png',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    caption: 'Manage all your bots',
    src: 'docs/screenshots/02-signup.png',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    caption: 'Upload FAQs and docs',
    src: 'docs/screenshots/03-knowledge.png',
  },
  {
    id: 'chat',
    label: 'Test chat',
    caption: 'ChatGPT-style workspace',
    src: 'docs/screenshots/04-chat.png',
  },
  {
    id: 'embed',
    label: 'Embed',
    caption: 'Live widget on any site',
    src: 'docs/screenshots/06-embed.png',
  },
] as const;

const ROTATE_MS = 4200;

export function HeroProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[active];

  return (
    <div
      className="hero-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-showcase__glow" aria-hidden="true" />
      <div className="hero-showcase__frame">
        <div className="hero-showcase__chrome">
          <div className="hero-showcase__dots" aria-hidden="true">
            <span className="hero-showcase__dot hero-showcase__dot--red" />
            <span className="hero-showcase__dot hero-showcase__dot--yellow" />
            <span className="hero-showcase__dot hero-showcase__dot--green" />
          </div>
          <p className="hero-showcase__url">knowembed.app/{slide.id === 'landing' ? '' : 'app'}</p>
        </div>
        <div className="hero-showcase__viewport" aria-live="polite">
          {SLIDES.map((item, index) => (
            <figure
              key={item.id}
              className={`hero-showcase__slide${index === active ? ' is-active' : ''}`}
              aria-hidden={index !== active}
            >
              <img src={publicPath(item.src)} alt={item.caption} loading={index === 0 ? 'eager' : 'lazy'} />
              <figcaption className="hero-showcase__caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="hero-showcase__tabs" role="tablist" aria-label="Product tour">
        {SLIDES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={`hero-showcase__tab${index === active ? ' is-active' : ''}`}
            aria-selected={index === active}
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
