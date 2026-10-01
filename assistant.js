(() => {
  'use strict';

  const dialog = document.getElementById('assistantDialog');
  const launch = document.getElementById('assistantLaunch');
  const close = document.getElementById('assistantClose');
  const gate = document.getElementById('assistantGate');
  const gateText = document.getElementById('assistantGateText');
  const signIn = document.getElementById('assistantSignIn');
  const chat = document.getElementById('assistantChat');
  const logout = document.getElementById('assistantLogout');
  const messages = document.getElementById('assistantMessages');
  const form = document.getElementById('assistantForm');
  const prompt = document.getElementById('assistantPrompt');
  const mode = document.getElementById('assistantMode');
  const useContext = document.getElementById('assistantUseContext');
  const send = document.getElementById('assistantSend');
  const insert = document.getElementById('assistantInsert');
  const copy = document.getElementById('assistantCopy');
  const status = document.getElementById('assistantStatus');

  let csrfToken = '';
  let chatHistory = [];
  let lastAnswer = '';
  let selectedField = null;

  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('error', error);
  }

  function appendMessage(role, content) {
    const empty = messages.querySelector('.assistant-empty');
    if (empty) empty.remove();
    const item = document.createElement('div');
    item.className = `assistant-message ${role}`;
    item.textContent = content;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function projectContext() {
    const section = document.querySelector('.section.active');
    const fields = useContext.checked && section
      ? [...section.querySelectorAll('input[id],textarea[id],select[id]')]
        .filter((element) => !['checkbox', 'radio', 'hidden', 'file'].includes(element.type))
        .slice(0, 12)
        .map((element) => ({
          id: element.id.slice(0, 80),
          label: (element.closest('.field')?.querySelector('label')?.textContent || element.id).trim().slice(0, 120),
          value: element.value.slice(0, 1200),
        }))
      : [];
    return {
      section: section?.id || 'dashboard',
      projectName: useContext.checked ? (document.getElementById('projectName')?.value || '').slice(0, 160) : '',
      fields,
    };
  }

  async function loadSession() {
    gate.hidden = false;
    chat.hidden = true;
    logout.hidden = true;
    gateText.textContent = 'در حال بررسی دسترسی…';
    signIn.hidden = true;
    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error('status');
      const session = await response.json();
      if (session.authenticated && typeof session.csrfToken === 'string') {
        csrfToken = session.csrfToken;
        gate.hidden = true;
        chat.hidden = false;
        logout.hidden = false;
        prompt.focus();
      } else if (session.available) {
        csrfToken = '';
        gateText.textContent = 'برای استفاده از دستیار خصوصی، با حساب ChatGPT خود وارد شوید.';
        signIn.hidden = false;
      } else {
        gateText.textContent = 'ورود با ChatGPT برای HAFS در انتظار فعال‌سازی دسترسی OpenAI است.';
      }
    } catch {
      gateText.textContent = 'بررسی دسترسی ممکن نشد. کمی بعد دوباره تلاش کنید.';
    }
  }

  async function openAssistant() {
    if (!dialog.open) dialog.showModal();
    setStatus('');
    await loadSession();
  }

  launch.addEventListener('click', openAssistant);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener('focusin', (event) => {
    const element = event.target;
    if (element.closest?.('.section') && (element.tagName === 'TEXTAREA' ||
        (element.tagName === 'INPUT' && element.type === 'text'))) {
      selectedField = element;
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = prompt.value.trim();
    if (!message || message.length > 2500 || !csrfToken || send.disabled) return;
    const previousHistory = chatHistory.slice(-8);
    const userMessage = appendMessage('user', message);
    prompt.value = '';
    send.disabled = true;
    insert.hidden = true;
    copy.hidden = true;
    setStatus('در حال آماده‌کردن پاسخ…');
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-HAFS-CSRF': csrfToken },
        body: JSON.stringify({ mode: mode.value, message, context: projectContext(), history: previousHistory }),
      });
      if (response.status === 403) {
        await loadSession();
        throw new Error('نشست شما پایان یافته است. دوباره وارد شوید.');
      }
      if (!response.ok) throw new Error('پاسخ دریافت نشد. دوباره تلاش کنید.');
      const result = await response.json();
      if (typeof result.answer !== 'string' || !result.answer.trim()) throw new Error('پاسخ خالی بود.');
      lastAnswer = result.answer.trim();
      appendMessage('assistant', lastAnswer);
      chatHistory = [...previousHistory, { role: 'user', content: message }, { role: 'assistant', content: lastAnswer }].slice(-8);
      insert.hidden = !(selectedField && selectedField.closest('.section.active'));
      copy.hidden = false;
      setStatus('پاسخ آماده است. پیش از استفاده، متن را بررسی کنید.');
    } catch (error) {
      userMessage.remove();
      if (!messages.children.length) {
        const empty = document.createElement('p');
        empty.className = 'assistant-empty';
        empty.textContent = 'از فرم فعلی کمک بگیرید، برنامهٔ پروژه بخواهید یا سؤال خود را بپرسید.';
        messages.append(empty);
      }
      prompt.value = message;
      setStatus(error.message, true);
    } finally {
      send.disabled = false;
    }
  });

  insert.addEventListener('click', () => {
    if (!lastAnswer || !selectedField || !selectedField.closest('.section.active')) return;
    selectedField.value = `${selectedField.value.trimEnd()}${selectedField.value ? '\n\n' : ''}${lastAnswer}`;
    selectedField.dispatchEvent(new Event('input', { bubbles: true }));
    dialog.close();
    selectedField.focus();
  });

  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(lastAnswer);
      setStatus('پاسخ کپی شد.');
    } catch {
      setStatus('کپی ممکن نشد؛ متن پاسخ را انتخاب و کپی کنید.', true);
    }
  });

  logout.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST', credentials: 'same-origin', headers: { 'X-HAFS-CSRF': csrfToken },
      });
      if (!response.ok) throw new Error('خروج انجام نشد.');
      csrfToken = '';
      chatHistory = [];
      lastAnswer = '';
      messages.replaceChildren();
      const empty = document.createElement('p');
      empty.className = 'assistant-empty';
      empty.textContent = 'از فرم فعلی کمک بگیرید، برنامهٔ پروژه بخواهید یا سؤال خود را بپرسید.';
      messages.append(empty);
      await loadSession();
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  const params = new URLSearchParams(location.search);
  if (params.has('assistant')) {
    const outcome = params.get('assistant');
    params.delete('assistant');
    const clean = `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`;
    window.history.replaceState(window.history.state, '', clean);
    openAssistant().then(() => {
      if (outcome === 'signin-error') setStatus('ورود کامل نشد. دوباره تلاش کنید.', true);
    });
  }
})();
