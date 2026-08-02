import { publicPath } from '../lib/paths';

export function HeroLiveWidget() {
  const demoUrl = publicPath('embed-demo.html');

  return (
    <div className="hero-live-demo">
      <div className="hero-live-demo__glow" aria-hidden="true" />
      <div className="hero-live-demo__frame">
        <div className="hero-live-demo__chrome">
          <div className="hero-showcase__dots" aria-hidden="true">
            <span className="hero-showcase__dot hero-showcase__dot--red" />
            <span className="hero-showcase__dot hero-showcase__dot--yellow" />
            <span className="hero-showcase__dot hero-showcase__dot--green" />
          </div>
          <p className="hero-showcase__url">still-store.demo · KnowEmbed widget</p>
          <span className="hero-live-demo__live">Live</span>
        </div>
        <div className="hero-live-demo__viewport">
          <iframe
            title="Live KnowEmbed widget on sample store"
            src={demoUrl}
            loading="lazy"
            tabIndex={0}
          />
        </div>
      </div>
      <p className="hero-live-demo__hint muted">
        Open the chat bubble — real AI answers from the demo FAQ
      </p>
    </div>
  );
}
