# Stripe — пошагово для KnowEmbed (проект buwxmfapwampgpwvnulb)

Ошибка **`Webhook secret missing`** = в Supabase **нет** секрета `STRIPE_WEBHOOK_SECRET`.  
Checkout может открыться, но webhook после оплаты вернёт 503.

> **Безопасность:** secret key (`sk_test_…`) и `whsec_…` **никогда** не коммить в Git и не вставлять в чаты. Если ключ уже светился — в Stripe → Roll key.

---

## Шаг 1 — Stripe: secret key (у тебя уже есть)

Открой: https://dashboard.stripe.com/test/apikeys  

Нужен **Secret key** (`sk_test_…`) — только для Supabase, не для фронтенда.

Publishable key (`pk_test_…`) KnowEmbed **не использует** (Checkout на сервере).

---

## Шаг 2 — Stripe: webhook + signing secret (`whsec_`)

### 2a. Список webhooks
https://dashboard.stripe.com/test/webhooks  

### 2b. Если endpoint уже создан — открой его
Кликни на endpoint с URL:
```
https://buwxmfapwampgpwvnulb.supabase.co/functions/v1/stripe-webhook
```

### 2c. Signing secret
На странице endpoint → блок **Signing secret** → **Reveal** → скопируй значение `whsec_…`

### 2d. Если endpoint ещё нет — Add endpoint
https://dashboard.stripe.com/test/webhooks/create  

| Поле | Значение |
|------|----------|
| Endpoint URL | `https://buwxmfapwampgpwvnulb.supabase.co/functions/v1/stripe-webhook` |
| Events | `checkout.session.completed` |

После создания — снова **Reveal** signing secret.

### 2e. Проверка доставки
На странице webhook → **Send test event** → `checkout.session.completed`  
Должен быть **200**, не 503.

---

## Шаг 3 — Supabase: добавить secrets (главное!)

### Прямая ссылка на secrets Edge Functions:
https://supabase.com/dashboard/project/buwxmfapwampgpwvnulb/settings/functions  

(или: Project → **Edge Functions** → **Secrets**)

Добавь **два** секрета (Add new secret):

| Name | Value |
|------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_…` из шага 1 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` из шага 2 |

Сохрани. Секреты подхватываются без передеплоя, но подожди ~1 мин или передеплой functions (шаг 4).

---

## Шаг 4 — Убедиться, что functions задеплоены

### GitHub Actions (если push в main):
https://github.com/ElenaSamanchuk/knowembed/actions/workflows/deploy-supabase.yml  
→ **Run workflow**

Нужны functions: `create-checkout-session`, `stripe-webhook` (последняя с `--no-verify-jwt`).

### Локально (если есть access token):
https://supabase.com/dashboard/account/tokens → Create token

```bash
export SUPABASE_ACCESS_TOKEN=sbp_ваш_токен

npx supabase secrets set \
  STRIPE_SECRET_KEY="sk_test_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  --project-ref buwxmfapwampgpwvnulb

npx supabase functions deploy stripe-webhook --project-ref buwxmfapwampgpwvnulb --no-verify-jwt
npx supabase functions deploy create-checkout-session --project-ref buwxmfapwampgpwvnulb
```

---

## Шаг 5 — Проверка в приложении

1. https://elenasamanchuk.github.io/knowembed/pricing (или localhost)
2. Войти → **Upgrade to Pro**
3. Карта: `4242 4242 4242 4242`, любая дата, любой CVC
4. После оплаты: https://elenasamanchuk.github.io/knowembed/checkout?success=1

### Проверка в БД:
https://supabase.com/dashboard/project/buwxmfapwampgpwvnulb/editor/28724?schema=public  
Таблица **profiles** → у твоего user колонка `plan` = `pro`

---

## Почему ассистент не может «зайти за тебя»

- Логин в Stripe/Supabase в **твоём браузере** — это твоя сессия; у агента нет доступа к cookies и Dashboard.
- Секреты живут только в **Supabase Edge Functions Secrets**, не в `.env.local` и не в коде.
- Локально нет `SUPABASE_ACCESS_TOKEN` — без него CLI не может записать secrets.

Если дашь **Supabase access token** (Account → Access Tokens) в терминале одной командой — можно настроить через CLI, но **не вставляй** `sk_test` / `whsec` в GitHub Issues или публичный чат.

---

## Частые ошибки

| Симптом | Причина |
|---------|---------|
| `Webhook secret missing` | Нет `STRIPE_WEBHOOK_SECRET` в Supabase |
| `STRIPE_SECRET_KEY is not configured` | Нет secret key в Supabase |
| Webhook 400 Invalid signature | Неверный `whsec` (скопирован не тот endpoint) |
| Webhook 503 | Secret не добавлен или function не задеплоена |
| plan не меняется | Webhook не дошёл — смотри Stripe → Webhooks → Recent deliveries |
