# Paralect assignment checklist

Reference: [Embeddable Chatbot Builder](https://www.paralect.com/academy/product-manager/projects/chatbot-builder)

| Requirement | Status | Where |
|-------------|--------|--------|
| Upload company docs → chatbot | ✅ | `DocUpload`, `ingest-document` |
| ChatGPT-like in-app chat | ✅ | `ChatPanel`, `chat` function |
| Embeddable widget | ✅ | `public/widget.js`, `embed-demo.html` |
| Pricing + billing flow | ✅ Mock | `PricingPage`, `CheckoutPage`, plan limits in Edge Functions |
| Landing + pricing showcase | ✅ | `/`, `/pricing` |
| Supabase auth + DB | ✅ | Auth, migrations, RLS |
| AI API | ✅ | Groq (free), Gemini/OpenAI optional |
| Written demo (no video) | ✅ | [DEMO.md](./DEMO.md) |
| Automated tests | ✅ | `npm run test`, `npm run test:e2e` |
| Live deploy | ✅ | GitHub Pages via CI |
| Focused scope | ✅ | Single niche: support FAQ bots |
| Attention to detail | ✅ | Copy, widget UX, docs |

## Honest MVP limits

- Mock Stripe (allowed by brief)
- Keyword retrieval + LLM (pgvector schema ready for v2)
- `.txt` / `.md` / `.csv` only
