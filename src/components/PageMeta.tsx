import { useEffect } from 'react';
import { appOrigin } from '../lib/paths';

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

const SITE_NAME = 'KnowEmbed';
const DEFAULT_OG_IMAGE = '/og-image.png';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => {
      if (key !== 'content') el!.setAttribute(key, value);
    });
    document.head.appendChild(el);
  }
  if (attrs.content) el.content = attrs.content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function PageMeta({ title, description, path = '/', noIndex = false }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
    const origin = appOrigin();
    const canonical = `${origin}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/$/, '') || origin;
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const ogImage = `${window.location.origin}${base}${DEFAULT_OG_IMAGE.replace(/^\//, '')}`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertLink('canonical', canonical);

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    });
  }, [title, description, path, noIndex]);

  return null;
}
