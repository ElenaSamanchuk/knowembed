import { publicPath } from '../lib/paths';

export function HeroLiveWidget() {
  const demoUrl = publicPath('embed-demo.html');

  return (
    <div className="hero-live-demo">
      <div className="hero-live-demo__frame panel-card">
        <div className="hero-live-demo__chrome">
          <p className="hero-live-demo__label">Live embed preview</p>
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
      <p className="hero-live-demo__hint muted">Click the chat bubble — real AI answers from the demo FAQ</p>
    </div>
  );
}
