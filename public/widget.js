(function () {
  const script = document.currentScript;
  if (!script) return;

  const botId = script.getAttribute('data-bot-id');
  const apiBase = script.getAttribute('data-api');
  const anonKey = script.getAttribute('data-anon-key');

  if (!botId || !apiBase) {
    console.error('[KnowEmbed] Missing data-bot-id or data-api on script tag.');
    return;
  }

  const functionsBase = apiBase.replace(/\/$/, '') + '/functions/v1';
  const CHAT_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M7 8h10M7 12h6M21 11.5c0 4.15-3.85 7.5-8.6 7.5-.96 0-1.88-.15-2.72-.43L4 20l1.2-3.36C4.43 15.4 4 13.5 4 11.5 4 7.35 7.85 4 12.6 4 17.35 4 21 7.35 21 11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const state = {
    open: false,
    config: null,
    messages: [],
    thinking: false,
  };

  const host = document.createElement('div');
  host.id = 'knowembed-root';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent =
    ':host { all: initial; }' +
    '* { box-sizing: border-box; font-family: "Manrope", system-ui, sans-serif; }' +
    '.launcher { position: fixed; right: max(16px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom)); width: 56px; height: 56px; border: 1px solid #222; border-radius: 50%; color: #fff; background: #01b6ca; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 2147483000; display: grid; place-items: center; transition: transform .2s cubic-bezier(0.16,1,0.3,1), box-shadow .2s; }' +
    '.launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(1,182,202,0.35); }' +
    '.launcher:disabled { opacity: .55; cursor: not-allowed; transform: none; }' +
    '.panel { position: fixed; right: max(16px, env(safe-area-inset-right)); bottom: calc(max(16px, env(safe-area-inset-bottom)) + 56px + 12px); width: min(380px, calc(100vw - 32px)); height: min(520px, calc(100dvh - 120px)); border-radius: 20px; overflow: hidden; display: none; flex-direction: column; background: #0e0e0e; border: 1px solid #222; box-shadow: 0 10px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04); z-index: 2147483000; }' +
    '.panel.open { display: flex; animation: knowembed-in .28s cubic-bezier(0.16,1,0.3,1); }' +
    '@keyframes knowembed-in { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }' +
    '@media (max-width: 480px) { .panel { right: 12px; left: 12px; width: auto; bottom: calc(16px + 56px + 12px); height: min(70dvh, 520px); } .launcher { right: 16px; bottom: 16px; } }' +
    '.head { padding: 16px 18px; color: #fff; display: flex; justify-content: space-between; align-items: center; gap: 12px; background: #0b2631; border-bottom: 1px solid #222; }' +
    '.head strong { font-size: 0.95rem; font-weight: 700; }' +
    '.head button { border: 0; background: rgba(255,255,255,0.12); color: #fff; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; font-size: 1.2rem; line-height: 1; }' +
    '.messages { flex: 1; overflow: auto; padding: 16px; background: #000; display: flex; flex-direction: column; gap: 10px; }' +
    '.msg { max-width: 88%; padding: 10px 12px; border-radius: 14px; line-height: 1.45; font-size: 0.88rem; white-space: pre-wrap; }' +
    '.msg.bot { align-self: flex-start; background: #0e0e0e; border: 1px solid #222; color: #fff; }' +
    '.msg.user { align-self: flex-end; color: #fff; background: #01b6ca; }' +
    '.composer { padding: 12px 14px 14px; border-top: 1px solid #222; background: #0e0e0e; display: flex; gap: 8px; }' +
    '.composer input { flex: 1; border: 1px solid #222; border-radius: 12px; padding: 10px 12px; font-size: 0.88rem; background: #000; color: #fff; }' +
    '.composer input::placeholder { color: #969aa1; }' +
    '.composer input:focus { outline: 2px solid rgba(1,182,202,0.35); border-color: #01b6ca; }' +
    '.composer button { border: 0; border-radius: 12px; padding: 10px 14px; color: #fff; font-weight: 600; cursor: pointer; background: #01b6ca; }' +
    '.badge { font-size: 0.72rem; text-align: center; padding: 8px; color: #969aa1; border-top: 1px solid #222; background: #0e0e0e; font-family: "JetBrains Mono", monospace; }';

  shadow.appendChild(style);

  const launcher = document.createElement('button');
  launcher.className = 'launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open chat');
  launcher.innerHTML = CHAT_ICON;

  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.setAttribute('aria-label', 'Chatbot');

  const head = document.createElement('header');
  head.className = 'head';
  head.innerHTML = '<div><strong>Chat</strong><div style="font-size:12px;opacity:.85">AI assistant</div></div>';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close chat');
  head.appendChild(closeBtn);

  const messages = document.createElement('div');
  messages.className = 'messages';

  const composer = document.createElement('form');
  composer.className = 'composer';
  composer.innerHTML =
    '<input type="text" placeholder="Ask a question…" autocomplete="off" />' +
    '<button type="submit">Send</button>';

  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.hidden = true;
  badge.textContent = 'Powered by KnowEmbed';

  panel.append(head, messages, composer, badge);
  shadow.append(launcher, panel);

  const input = composer.querySelector('input');
  const sendBtn = composer.querySelector('button');

  function renderMessages() {
    messages.innerHTML = '';
    state.messages.forEach(function (item) {
      var node = document.createElement('div');
      node.className = 'msg ' + item.role;
      node.textContent = item.text;
      if (item.role === 'user' && state.config) {
        node.style.background = state.config.theme_color;
      }
      messages.appendChild(node);
    });
    if (state.thinking) {
      var thinking = document.createElement('div');
      thinking.className = 'msg bot';
      thinking.textContent = 'Searching docs with AI…';
      messages.appendChild(thinking);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    if (!state.config || state.thinking) return;
    var question = input.value.trim();
    if (!question) return;
    input.value = '';
    state.messages.push({ role: 'user', text: question });
    state.thinking = true;
    renderMessages();

    fetch(functionsBase + '/public-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey || '',
      },
      body: JSON.stringify({ publicId: botId, message: question }),
    })
      .then(function (response) {
        return response.json().then(function (payload) {
          if (!response.ok) throw new Error(payload.error || 'Chat failed');
          var answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
          if (!answer) throw new Error('Empty answer from AI');
          return answer;
        });
      })
      .then(function (answer) {
        state.messages.push({ role: 'bot', text: answer });
        state.thinking = false;
        renderMessages();
      })
      .catch(function (error) {
        state.messages.push({
          role: 'bot',
          text: error.message || 'Sorry, something went wrong.',
        });
        state.thinking = false;
        renderMessages();
      });
  }

  composer.addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage();
  });

  function openPanel() {
    state.open = true;
    panel.classList.add('open');
    if (state.messages.length === 0 && state.config) {
      state.messages.push({ role: 'bot', text: state.config.welcome });
      renderMessages();
    }
    input.focus();
  }

  function closePanel() {
    state.open = false;
    panel.classList.remove('open');
  }

  launcher.addEventListener('click', function () {
    if (state.open) closePanel();
    else openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && state.open) closePanel();
  });

  fetch(functionsBase + '/public-bot?public_id=' + encodeURIComponent(botId), {
    headers: { apikey: anonKey || '' },
  })
    .then(function (response) {
      return response.json().then(function (payload) {
        if (!response.ok) throw new Error(payload.error || 'Bot not found');
        return payload;
      });
    })
    .then(function (config) {
      state.config = config;
      launcher.style.background = config.theme_color;
      head.style.background = config.theme_color;
      sendBtn.style.background = config.theme_color;
      head.querySelector('strong').textContent = config.name;
      launcher.setAttribute('aria-label', 'Open ' + config.name);
      badge.hidden = !config.branding;
    })
    .catch(function (error) {
      console.error('[KnowEmbed]', error);
      launcher.disabled = true;
      launcher.title = 'Chatbot failed to load. Publish the bot first.';
    });
})();
