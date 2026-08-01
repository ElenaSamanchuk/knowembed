# Настройка KnowEmbed + Supabase (пошагово)

Проект: https://supabase.com/dashboard/project/buwxmfapwampgpwvnulb  
Репо: https://github.com/ElenaSamanchuk/knowembed

---

## ✅ Уже сделано

- [x] SQL-миграция (таблицы созданы — проверено)
- [x] `.env.local` с API ключом (локально, не в git)
- [x] `embed-demo.html` с anon key

---

## ⚠️ Важно: подключение GitHub ≠ деплой функций

Когда ты «подключила репо» в Supabase, это **не загружает Edge Functions автоматически**.

Функции лежат в папке `supabase/functions/` в GitHub, но их нужно **задеплоить отдельно** (через GitHub Actions или CLI).

Пока функции не задеployены, в дашборде их не будет, а chat/upload не работают.

---

## Шаг 1 — AI ключ (бесплатно через Groq)

**Groq — бесплатный tier, реальный LLM (Llama 3.3), без карты.**

1. Зайди на https://console.groq.com/keys
2. Создай аккаунт → **Create API Key** → скопируй ключ
3. В Supabase: **Edge Functions → Secrets**
4. **Add or replace secrets** → вставь одной строкой:

```
GROQ_API_KEY=gsk_...твой-ключ
```

5. **Save**
6. GitHub Actions → **Deploy Supabase Edge Functions** → Run workflow (если код обновился)

Документы сохраняются в **Supabase Postgres**, чат вызывает **Groq API** с контекстом из ваших docs — это настоящий RAG-пipeline.

### Запасной вариант: Gemini (тоже бесплатно)

```
GEMINI_API_KEY=AIza...
```

Groq имеет приоритет, если заданы оба ключа.

### OpenAI — только платно

Нужен баланс на platform.openai.com. Используется только если нет Groq/Gemini.

---

## Шаг 2 — Supabase Access Token (для деплоя из GitHub)

1. Открой https://supabase.com/dashboard/account/tokens
2. **Generate new token** → скопируй (показывается один раз)
3. GitHub → https://github.com/ElenaSamanchuk/knowembed/settings/secrets/actions
4. **New repository secret**
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: вставь токен из шага 2
5. Save

---

## Шаг 3 — Запустить деплой функций

После добавления секрета в GitHub:

1. https://github.com/ElenaSamanchuk/knowembed/actions
2. Слева **Deploy Supabase Edge Functions**
3. **Run workflow** → Run workflow

Через 1–2 минуты в Supabase появятся 5 функций:
- `ingest-document`
- `chat`
- `publish-bot`
- `public-chat`
- `public-bot`

---

## Шаг 4 — Auth для демо

Supabase → **Authentication** → **Providers** → **Email**

- Выключи **Confirm email** (чтобы регистрация работала сразу без письма)

---

## Шаг 5 — Локальный запуск

```bash
cd paralect-chatbot-builder
npm install
npm run dev
```

1. http://localhost:5173/login — создай аккаунт (email + пароль мин. 6 символов)
2. Dashboard → **Store Assistant**
3. Спроси: *How long is shipping?*
4. **Publish bot**
5. http://localhost:5173/embed-demo.html — виджет

---

## Default secrets в Supabase

То, что ты видишь (`SUPABASE_URL`, `SUPABASE_ANON_KEY` и т.д.) — **уже есть автоматически**. Их добавлять не нужно.

Тебе нужен **GROQ_API_KEY** (бесплатно, рекомендуется) или `GEMINI_API_KEY` / `OPENAI_API_KEY`.

---

## Если что-то не работает

| Симптом | Решение |
|---------|---------|
| «Requested function was not found» | Шаг 2–3: деплой функций |
| «Add GROQ_API_KEY» / AI errors | Шаг 1: ключ Groq + redeploy functions |
| Регистрация не пускает | Шаг 4: выключить confirm email |
| «Unauthorized» в chat | Перелогиниться |

Напиши, когда сделаешь шаги 1–2 — проверю, что функции задеployились.
