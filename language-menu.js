document.querySelectorAll('.language-menu').forEach((menu) => {
  const select = menu.querySelector('.language-select');
  const globe = menu.querySelector('svg');
  if (!select || menu.querySelector('.language-trigger')) return;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'language-trigger';
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', select.getAttribute('aria-label') || 'בחירת שפה');
  if (globe) trigger.append(globe);

  const panel = document.createElement('div');
  panel.className = 'language-options';
  panel.setAttribute('role', 'menu');
  panel.innerHTML = [...select.options].map((option) =>
    `<button type="button" role="menuitemradio" data-language="${option.value}">${option.textContent}<span aria-hidden="true">✓</span></button>`
  ).join('');

  const sync = () => {
    panel.querySelectorAll('button').forEach((button) => {
      const active = button.dataset.language === select.value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-checked', String(active));
    });
  };
  const close = () => {
    menu.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = menu.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('.is-active, button')?.focus();
  });
  panel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    select.value = button.dataset.language;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    sync();
    close();
    trigger.focus();
  });
  select.addEventListener('change', sync);
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) close();
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { close(); trigger.focus(); }
  });

  select.hidden = true;
  menu.append(trigger, panel);
  sync();
});

document.querySelectorAll('.topbar').forEach((header) => {
  const actions = header.querySelector('.top-actions');
  const nav = header.querySelector(':scope > nav');
  if (!actions || !nav || actions.querySelector('.mobile-menu-toggle')) return;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-menu-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'פתיחת תפריט');
  toggle.innerHTML = '<span></span><span></span>';
  actions.append(toggle);
  const close = () => {
    document.body.classList.remove('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('mobile-menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
});
