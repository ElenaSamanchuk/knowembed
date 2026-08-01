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

## Шаг 1 — AI ключ (бесплатно через Gemini)

**Рекомендуем Gemini — бесплатный tier, хватает для демо.**

1. Зайди на https://aistudio.google.com/apikey
2. **Create API key** → скопируй ключ
3. В Supabase: **Edge Functions → Secrets**
4. Нажми **Add or replace secrets**
5. Вставь **одной строкой**:

```
GEMINI_API_KEY=AIza...твой-ключ
```

6. Нажми **Save**

Загрузка документов теперь **бесплатная** (без embeddings). Ответы в чате идут через Gemini.

### Альтернатива: OpenAI (платно)

Если хочешь OpenAI — нужен баланс на https://platform.openai.com/settings/organization/billing

```
OPENAI_API_KEY=sk-...
```

Gemini имеет приоритет, если заданы оба ключа.

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

Тебе нужен только **один custom secret**: `GEMINI_API_KEY` (бесплатно) или `OPENAI_API_KEY` (платно).

---

## Если что-то не работает

| Симптом | Решение |
|---------|---------|
| «Requested function was not found» | Шаг 2–3: деплой функций |
| «OPENAI_API_KEY is not configured» / «Add GEMINI_API_KEY» | Шаг 1: секрет Gemini или OpenAI |
| Регистрация не пускает | Шаг 4: выключить confirm email |
| «Unauthorized» в chat | Перелогиниться |

Напиши, когда сделаешь шаги 1–2 — проверю, что функции задеployились.
