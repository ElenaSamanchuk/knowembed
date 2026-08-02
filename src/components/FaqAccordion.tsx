import { useState } from 'react';

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <article key={item.q} className={`faq-accordion-item panel-card ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              id={buttonId}
              className="faq-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.q}</span>
              <span className="faq-accordion-icon" aria-hidden="true" />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="faq-accordion-panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="faq-accordion-panel-inner">
                <p className="muted">{item.a}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
