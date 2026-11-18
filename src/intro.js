const EASE = 'cubic-bezier(.22,1,.36,1)';

/** Finite native timeline. Cleanup restores focus, scroll and inert state even in StrictMode. */
export function runBrandIntro(root, refs, props, onReady) {
  const el = refs.loaderRef.current;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = [], timers = [], inert = [];
  let disposed = false, leaving = false, ready = false, locked = false;
  const oldOverflow = document.documentElement.style.overflow;
  const oldFocus = document.activeElement;
  // Replay the full timeline on every page load, including anchored or restored-scroll reloads.
  const skip = !el || props.showLoader === false || reduced.matches;
  const schedule = (fn, delay) => { const id = setTimeout(() => { if (!disposed) fn(); }, delay); timers.push(id); };
  const animate = (target, frames, duration, delay = 0, easing = EASE, fill = 'both') => {
    if (!target?.animate) return null;
    const animation = target.animate(frames, { duration, delay, easing, fill });
    animations.push(animation);
    return animation;
  };
  function release() {
    if (!locked) return;
    locked = false;
    document.documentElement.style.overflow = oldOverflow;
    inert.forEach(([node, value]) => { node.inert = value; });
    if (el.contains(document.activeElement)) {
      if (oldFocus && oldFocus !== document.body && oldFocus.isConnected) oldFocus.focus({ preventScroll: true });
      else root.querySelector('#main')?.focus({ preventScroll: true });
    }
  }
  function reveal() {
    if (ready || disposed) return;
    ready = true;
    root.dataset.intro = 'complete';
    release();
    onReady();
  }
  function finish(immediate = false) {
    if (leaving || disposed) return;
    leaving = true;
    reveal();
    el.style.pointerEvents = 'none';
    if (immediate || reduced.matches) { el.hidden = true; return; }
    animate(el, [
      { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', opacity: 1 },
      { clipPath: 'polygon(0 0,100% 0,100% 0,0 15%)', opacity: 1, offset: .85 },
      { clipPath: 'polygon(0 0,100% 0,100% 0,0 0)', opacity: 0 }
    ], 920);
    animate(el.querySelector('.cs-intro__stage'), [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-54px) scale(1.06)' }], 850);
    schedule(() => { el.hidden = true; animations.forEach(a => a.cancel()); }, 940);
  }
  const skipIntro = () => finish(true);
  const keydown = e => {
    if (e.key === 'Escape') { e.preventDefault(); skipIntro(); }
    // The intro has one interactive control; keep Tab inside while the page is inert.
    if (e.key === 'Tab' && !leaving) { e.preventDefault(); el.querySelector('[data-intro-skip]').focus(); }
  };
  function destroy() {
    disposed = true;
    timers.forEach(clearTimeout);
    animations.forEach(a => a.cancel());
    release();
    el?.querySelector('[data-intro-skip]')?.removeEventListener('click', skipIntro);
    document.removeEventListener('keydown', keydown);
    reduced.removeEventListener('change', skipIntro);
    window.removeEventListener('pagehide', skipIntro);
    delete root.dataset.intro;
  }
  if (skip || !el.animate) {
    if (el) el.hidden = true;
    reveal();
    return destroy;
  }
  el.hidden = false;
  el.style.pointerEvents = '';
  root.dataset.intro = 'playing';
  locked = true;
  document.documentElement.style.overflow = 'hidden';
  Array.from(root.children).filter(node => node !== el).forEach(node => { inert.push([node, node.inert]); node.inert = true; });
  el.focus({ preventScroll: true });
  el.querySelector('[data-intro-skip]').addEventListener('click', skipIntro);
  document.addEventListener('keydown', keydown);
  reduced.addEventListener('change', skipIntro);
  window.addEventListener('pagehide', skipIntro);
  // Never leave a visitor behind a loading screen, including failed image decoding.
  schedule(() => finish(true), 5400);

  animate(el.querySelector('.cs-intro__halo'), [{ opacity: .18, transform: 'scale(.8)' }, { opacity: .7, offset: .4 }, { opacity: 0, transform: 'scale(1.35)' }], 1700);
  animate(el.querySelector('.cs-intro__paper'), [{ clipPath: 'circle(0% at 65% 38%)' }, { clipPath: 'circle(150% at 65% 38%)' }], 1250, 420, 'cubic-bezier(.55,0,.2,1)');
  animate(el.querySelector('.cs-intro__top'), [{ opacity: 0 }, { opacity: .55, offset: .3 }, { opacity: 0 }], 1700);
  animate(el.querySelector('.cs-intro__bottom'), [{ color: '#efe1e6' }, { color: '#8a5a6c' }], 600, 850);
  animate(el.querySelector('.cs-intro__rule i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 3180, 0, 'linear');

  // Logo: opens from the centre like a lens, settles with a small scale-down.
  animate(el.querySelector('[data-intro-logo]'), [
    { opacity: 0, clipPath: 'circle(0% at 50% 42%)', transform: 'scale(1.08)', filter: 'blur(10px)' },
    { opacity: 1, clipPath: 'circle(38% at 50% 42%)', transform: 'scale(1.04)', filter: 'blur(3px)', offset: .45 },
    { opacity: 1, clipPath: 'circle(100% at 50% 42%)', transform: 'scale(1)', filter: 'blur(0px)' }
  ], 1500, 380, 'cubic-bezier(.45,0,.18,1)');
  el.querySelectorAll('[data-intro-star]').forEach((star, i) => {
    animate(star, [
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.2) rotate(-60deg)' },
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1.35) rotate(10deg)', offset: .55 },
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1) rotate(0deg)' }
    ], 620, 1500 + i * 130, 'cubic-bezier(.22,1,.36,1)');
    animate(star, [{ opacity: 1 }, { opacity: 0 }], 420, 2600 + i * 60, 'linear', 'forwards');
  });
  animate(el.querySelector('[data-intro-shine]'), [
    { opacity: 0, transform: 'translateX(-130%) skewX(-18deg)' },
    { opacity: .9, offset: .3 },
    { opacity: 0, transform: 'translateX(230%) skewX(-18deg)' }
  ], 900, 2050, 'cubic-bezier(.4,0,.2,1)');
  schedule(() => finish(), 3150);
  return destroy;
}
