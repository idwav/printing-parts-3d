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
  const language = actions.querySelector('.language-menu');
  const instagram = actions.querySelector('.instagram-link');
  if (instagram && !nav.querySelector('.mobile-instagram')) {
    const link = instagram.cloneNode(true);
    link.className = 'mobile-instagram';
    link.append(document.createTextNode('Instagram'));
    nav.append(link);
  }
  const mobileQuery = window.matchMedia('(max-width:1024px)');
  const placeLanguage = () => {
    if (!language) return;
    language.classList.remove('is-open');
    language.querySelector('.language-trigger')?.setAttribute('aria-expanded', 'false');
    if (mobileQuery.matches) nav.append(language);
    else actions.prepend(language);
  };
  placeLanguage();
  mobileQuery.addEventListener('change', placeLanguage);
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
// Shared contact information, also shown beside the contact form.
document.addEventListener('DOMContentLoaded', () => {
  const makeLocation = (footer = false) => {
    const block = document.createElement(footer ? 'footer' : 'section');
    block.className = footer ? 'business-location business-location-footer' : 'business-location';
    block.innerHTML = '<h2 data-location-title></h2><address><span data-location-address></span><a href="mailto:info@printingparts3d.com" dir="ltr">info@printingparts3d.com</a></address><a class="business-directions" href="https://www.google.com/maps/search/?api=1&query=7+Hankin+Street+Holon+Israel" target="_blank" rel="noopener noreferrer"><span data-location-directions></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5 5 19M5 7v12h12"/></svg></a>';
    return block;
  };
  const main = document.querySelector('main');
  const finalCta = document.querySelector('.site-cta');
  if (finalCta) {
    const ending = document.createElement('div');
    ending.className = 'site-ending';
    finalCta.before(ending);
    ending.append(makeLocation(true), finalCta);
  }
  else if (main) main.after(makeLocation(true));
  const translate = () => {
    const en = document.documentElement.lang.startsWith('en') || document.body.classList.contains('lang-en');
    document.querySelectorAll('[data-location-title]').forEach(n => n.textContent = en ? 'Find us' : 'איפה אנחנו');
    document.querySelectorAll('[data-location-address]').forEach(n => n.textContent = en ? '7 Hankin Street, Holon, Israel' : 'רחוב חנקין 7, חולון');
    document.querySelectorAll('[data-location-directions]').forEach(n => n.textContent = en ? 'Get directions' : 'ניווט אלינו');
  };
  translate();
  new MutationObserver(translate).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  new MutationObserver(translate).observe(document.body, {attributes:true, attributeFilter:['class']});
});

// Desktop wheel inertia; preserve touch, keyboard and nested scrolling.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0, target = 0, previous = 0;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const tick = time => {
    const dt = previous ? Math.min(time - previous, 50) : 16;
    previous = time;
    target = Math.max(0, Math.min(target, maxScroll()));
    const distance = target - scrollY;
    if (Math.abs(distance) < .75) {
      window.scrollTo({top:target, behavior:'instant'});
      stop(); return;
    }
    window.scrollTo({top:scrollY + distance * (1 - Math.exp(-dt / 110)), behavior:'instant'});
    frame = requestAnimationFrame(tick);
  };
  document.addEventListener('wheel', event => {
    if (reduced.matches || !mouse.matches || event.ctrlKey || event.metaKey || event.shiftKey || !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (!delta) return;
    for (let node = event.target instanceof Element ? event.target : null; node && node !== document.body; node = node.parentElement) {
      if (node.matches('input,textarea,select,[contenteditable="true"],dialog') || node.closest('.topbar nav')) { stop(); return; }
      const style = getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight && ((delta > 0 && node.scrollTop + node.clientHeight < node.scrollHeight) || (delta < 0 && node.scrollTop > 0))) { stop(); return; }
    }
    event.preventDefault();
    if (!frame) target = scrollY;
    target = Math.max(0, Math.min(target + delta, maxScroll()));
    if (!frame) frame = requestAnimationFrame(tick);
  }, {passive:false});
  ['pointerdown','touchstart','keydown','pagehide'].forEach(type => addEventListener(type, stop, {passive:true}));
  document.addEventListener('click', stop, {passive:true});
  reduced.addEventListener('change', stop);
})();

// Branded shutter transition for ordinary internal page navigation.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'pp3d-page-reveal';
  let navigating = false;
  addEventListener('pageshow', () => {
    navigating = false;
    document.querySelectorAll('.page-reveal.is-closing').forEach(el => el.remove());
  });
  let destination;
  try { destination = sessionStorage.getItem(key); sessionStorage.removeItem(key); } catch (_) {}
  if (!reducedMotion.matches && destination === location.pathname) {
    const curtain = document.createElement('div');
    curtain.className = 'page-reveal';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.append(curtain);
    setTimeout(() => curtain.remove(), 850);
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname || !url.pathname.endsWith('.html')) return;
    if (navigating) { event.preventDefault(); return; }
    try { sessionStorage.setItem(key, url.pathname); } catch (_) {}
    event.preventDefault();
    navigating = true;
    const curtain = document.createElement('div');
    curtain.className = 'page-reveal is-closing';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.append(curtain);
    setTimeout(() => location.assign(url.href), 620);
  });
})();
