-- system_prompt for locale-aware bots + seed smlogik-assistant

alter table public.bots
  add column if not exists system_prompt text;

alter table public.published_bots
  add column if not exists system_prompt text;

-- Seed smlogik-assistant (same owner as demo-store-assistant)
do $$
declare
  v_owner uuid := '636da3f9-a5fa-4226-bc13-6ba810452f12';
  v_bot_id uuid := gen_random_uuid();
  v_doc_id uuid := gen_random_uuid();
  v_prompt text := 'Отвечай только на русском языке. Ты консультант SmartLogic — премиальной алюминиевой садовой мебели smlogik.ru. Отвечай по базе знаний: доставка, сборка, материалы, видеообзор, скидки, зимний уход, гарантия, как заказать. Не выдумывай цены и точные сроки — направляй к менеджеру и форме заявки на сайте. Будь дружелюбным, кратким (2–4 предложения), premium-тон.';
begin
  if exists (select 1 from public.bots where public_id = 'smlogik-assistant') then
    return;
  end if;

  insert into public.bots (id, owner_id, public_id, name, welcome, theme_color, system_prompt)
  values (
    v_bot_id,
    v_owner,
    'smlogik-assistant',
    'SmartLogic Консультант',
    'Здравствуйте! Я консультант SmartLogic. Помогу с подбором комплекта, расскажу про бесплатный видеообзор и доставку по России. О чём спросить?',
    '#2D4A3E',
    v_prompt
  );

  insert into public.documents (id, bot_id, name, size_bytes)
  values (v_doc_id, v_bot_id, 'smlogik-faq-ru.md', 4500);

  insert into public.chunks (bot_id, document_id, document_name, content) values
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'SmartLogic (smlogik.ru) — российский производитель премиальной уличной мебели из алюминия для террас, дач, веранд и HoReCa. Заводское производство, порошковое покрытие, водоотталкивающие чехлы.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Материалы: каркас из алюминия с порошковым покрытием — не ржавеет, выдерживает дождь и мороз. Нагрузка до 120 кг на одно посадочное место. Комплект полностью разборный, сборка около 30 минут — справится один человек.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Подушки SmartLogic с водоотталкивающими чехлами — не нужно убирать в дом каждый сезон. Рассчитаны на уличную эксплуатацию на террасе и веранде.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Доставка по всей России и СНГ. По Москве и Московской области — часто в день заказа после согласования комплекта. Точный срок и стоимость менеджер сообщит после подбора. Доставка до двери.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'На готовые комплекты действует скидка до 30%. Акция на наборы мебели для террасы и лаунж-зоны. Точную сумму уточняйте у менеджера — цены зависят от модели.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Видеообзор — бесплатный лид-магнит: после заявки менеджер пришлёт видео с комплектом и варианты расстановки под вашу террасу без обязательства покупки. Оставьте имя и телефон в форме на сайте.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Зимний уход: алюминий не боится дождя, снега и мороза — мебель можно оставлять на террасе круглый год. При длительном простое рекомендуем накрыть комплект защитным чехлом.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Гарантия SmartLogic: собственное заводское производство, контроль качества на каждом этапе. Условия гарантии на каркас и фурнитуру уточняйте у менеджера при заказе.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Как заказать: 1) форма на сайте «Получить видеообзор и консультацию» (имя + телефон); 2) WhatsApp +7 986 330-57-98; 3) Telegram +7 905 521-90-66. Менеджер подберёт комплект и рассчитает доставку.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Контакты SmartLogic: телефон +7 (986) 330-57-98, email sadmebel@smlogik.ru, сайт smlogik.ru. Работаем с частными клиентами и HoReCa (рестораны, отели).'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Популярные коллекции: Чикаго, Монца и другие линейки — лаунж-зоны, обеденные группы, шезлонги. Для подбора под площадь террасы закажите бесплатный видеообзор.'),
  (v_bot_id, v_doc_id, 'smlogik-faq-ru.md', 'Сборка: разборный комплект собирается за ~30 минут, инструмент в комплекте. Каркас лёгкий и прочный. Подходит для террасы, беседки, веранды, летней площадки ресторана.');

  insert into public.published_bots (public_id, bot_id, name, welcome, theme_color, branding, system_prompt)
  values (
    'smlogik-assistant',
    v_bot_id,
    'SmartLogic Консультант',
    'Здравствуйте! Я консультант SmartLogic. Помогу с подбором комплекта, расскажу про бесплатный видеообзор и доставку по России. О чём спросить?',
    '#2D4A3E',
    true,
    v_prompt
  );
end $$;
