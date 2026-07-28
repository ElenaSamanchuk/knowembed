(function () {
  const script = document.currentScript;
  if (!script) return;

  const botId = script.getAttribute('data-bot-id');
  if (!botId) {
    console.error('[KnowEmbed] Missing data-bot-id on script tag.');
    return;
  }

  const scriptUrl = new URL(script.src, window.location.href);
  const baseUrl = scriptUrl.origin + scriptUrl.pathname.replace(/\/widget\.js$/, '');

  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'is', 'it', 'with', 'as', 'at',
    'be', 'by', 'from', 'that', 'this', 'what', 'how', 'when', 'where', 'why', 'can', 'you', 'your',
  ]);

  function tokenize(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(function (token) {
        return token.length > 2 && !STOP_WORDS.has(token);
      });
  }

  function retrieveRelevantChunks(query, chunks, limit) {
    if (!chunks.length) return [];
    var queryTokens = tokenize(query);
    if (!queryTokens.length) return chunks.slice(0, limit || 3);

    var scored = chunks
      .map(function (chunk) {
        var chunkTokens = new Set(tokenize(chunk.content));
        var score = queryTokens.reduce(function (sum, token) {
          return sum + (chunkTokens.has(token) ? 1 : 0);
        }, 0);
        return { chunk: chunk, score: score };
      })
      .sort(function (left, right) {
        return right.score - left.score;
      });

    var best = scored.filter(function (item) {
      return item.score > 0;
    }).slice(0, limit || 3);
    if (best.length) return best.map(function (item) {
      return item.chunk;
    });
    return chunks.slice(0, limit || 3);
  }

  function composeAnswer(query, chunks, botName) {
    var relevant = retrieveRelevantChunks(query, chunks);
    if (!relevant.length) {
      return "I couldn't find this in " + botName + "'s knowledge base yet. Try rephrasing your question.";
    }
    var excerpt = relevant
      .map(function (chunk) {
        return chunk.content;
      })
      .join('\n\n');
    return 'Based on ' + botName + "'s uploaded docs:\n\n" + excerpt;
  }

  var state = {
    open: false,
    config: null,
    messages: [],
    thinking: false,
  };

  var host = document.createElement('div');
  host.id = 'knowembed-root';
  document.body.appendChild(host);

  var shadow = host.attachShadow({ mode: 'open' });

  var style = document.createElement('style');
  style.textContent =
    ':host { all: initial; }' +
    '* { box-sizing: border-box; font-family: "DM Sans", system-ui, sans-serif; }' +
    '.launcher { position: fixed; right: 20px; bottom: 20px; width: 56px; height: 56px; border: 0; border-radius: 999px; color: #fff; cursor: pointer; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.24); font-size: 1.35rem; z-index: 2147483000; }' +
    '.panel { position: fixed; right: 20px; bottom: 88px; width: min(380px, calc(100vw - 32px)); height: 540px; max-height: calc(100vh - 120px); border-radius: 20px; overflow: hidden; display: none; flex-direction: column; background: #fff; border: 1px solid #dbe2ea; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18); z-index: 2147483000; }' +
    '.panel.open { display: flex; }' +
    '.head { padding: 16px 18px; color: #fff; display: flex; justify-content: space-between; align-items: center; gap: 12px; }' +
    '.head strong { font-size: 1rem; }' +
    '.head button { border: 0; background: rgba(255,255,255,0.18); color: #fff; width: 32px; height: 32px; border-radius: 999px; cursor: pointer; }' +
    '.messages { flex: 1; overflow: auto; padding: 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 10px; }' +
    '.msg { max-width: 88%; padding: 10px 12px; border-radius: 14px; line-height: 1.45; font-size: 0.92rem; white-space: pre-wrap; }' +
    '.msg.bot { align-self: flex-start; background: #fff; border: 1px solid #e2e8f0; color: #1e293b; }' +
    '.msg.user { align-self: flex-end; color: #fff; }' +
    '.composer { padding: 12px 14px 14px; border-top: 1px solid #e2e8f0; background: #fff; display: flex; gap: 8px; }' +
    '.composer input { flex: 1; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px 12px; font-size: 0.92rem; }' +
    '.composer button { border: 0; border-radius: 12px; padding: 10px 14px; color: #fff; font-weight: 600; cursor: pointer; }' +
    '.badge { font-size: 0.72rem; text-align: center; padding: 6px; color: #64748b; border-top: 1px solid #e2e8f0; background: #fff; }';

  shadow.appendChild(style);

  var launcher = document.createElement('button');
  launcher.className = 'launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open chat');
  launcher.textContent = '💬';

  var panel = document.createElement('section');
  panel.className = 'panel';
  panel.setAttribute('aria-label', 'Chatbot');

  var head = document.createElement('header');
  head.className = 'head';
  head.innerHTML = '<div><strong>Chat</strong><div style="font-size:12px;opacity:.85">Ask our docs</div></div>';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close chat');
  head.appendChild(closeBtn);

  var messages = document.createElement('div');
  messages.className = 'messages';

  var composer = document.createElement('form');
  composer.className = 'composer';
  composer.innerHTML =
    '<input type="text" placeholder="Ask a question…" autocomplete="off" />' +
    '<button type="submit">Send</button>';

  var badge = document.createElement('div');
  badge.className = 'badge';
  badge.hidden = true;
  badge.textContent = 'Powered by KnowEmbed';

  panel.append(head, messages, composer, badge);
  shadow.append(launcher, panel);

  var input = composer.querySelector('input');
  var sendBtn = composer.querySelector('button');

  function renderMessages() {
    messages.innerHTML = '';
    state.messages.forEach(function (item) {
      var node = document.createElement('div');
      node.className = 'msg ' + item.role;
      node.textContent = item.text;
      if (item.role === 'user' && state.config) {
        node.style.background = state.config.themeColor;
      }
      messages.appendChild(node);
    });
    if (state.thinking) {
      var thinking = document.createElement('div');
      thinking.className = 'msg bot';
      thinking.textContent = 'Searching docs…';
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

    window.setTimeout(function () {
      var answer = composeAnswer(question, state.config.chunks || [], state.config.name);
      state.messages.push({ role: 'bot', text: answer });
      state.thinking = false;
      renderMessages();
    }, 400);
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

  fetch(baseUrl + '/bots/' + botId + '.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Bot config not found (' + response.status + ')');
      return response.json();
    })
    .then(function (config) {
      state.config = config;
      launcher.style.background = config.themeColor;
      head.style.background = config.themeColor;
      sendBtn.style.background = config.themeColor;
      head.querySelector('strong').textContent = config.name;
      launcher.setAttribute('aria-label', 'Open ' + config.name);
      badge.hidden = !config.branding;
    })
    .catch(function (error) {
      console.error('[KnowEmbed]', error);
      launcher.disabled = true;
      launcher.title = 'Chatbot failed to load';
    });
})();
