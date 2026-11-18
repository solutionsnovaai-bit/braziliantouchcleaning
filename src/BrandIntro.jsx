import { forwardRef } from 'react';

// Opens like a macro shot on the logo's big sparkle, then the real logo (gold-edged enamel pin)
// spreads out from it: the symbol first, the lettering written in after.
const STAR = 'M50 0C55 36 63 45 100 50C64 55 55 64 50 100C45 64 36 55 0 50C36 45 45 36 50 0Z';
const SPARKS = [
  { x: 75.6, y: 14.2, s: 10.5 },
  { x: 84.6, y: 12.4, s: 5.2 },
  { x: 82.9, y: 18.6, s: 5.2 }
];

const BrandIntro = forwardRef(function BrandIntro(_, ref) {
  return (
    <div ref={ref} className="cs-intro" role="dialog" aria-modal="true" aria-label="Welcome to Brazilian Touch Cleaning" tabIndex={-1}>
      <div className="cs-intro__halo" aria-hidden="true" />
      <div className="cs-intro__paper" aria-hidden="true" />
      <div className="cs-intro__top" aria-hidden="true"><span>Brazilian care.</span><span>Spotless homes.</span></div>
      <div className="cs-intro__stage bt-stage" aria-hidden="true">
        <div className="bt-intro__part bt-intro__sym"><img data-intro-sym="" src="/assets/brand/logo-pin-cut.webp" alt="" width="900" height="1283" /></div>
        <div className="bt-intro__part bt-intro__word"><img data-intro-word="" src="/assets/brand/logo-pin-cut.webp" alt="" width="900" height="1283" /></div>
        <span data-intro-shine="" className="bt-intro__shine" />
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <radialGradient id="bt-star-rose" cx="38%" cy="32%" r="80%"><stop offset="0" stopColor="#ff9cc0" /><stop offset=".35" stopColor="#f0508a" /><stop offset=".72" stopColor="#D93A72" /><stop offset="1" stopColor="#a8224f" /></radialGradient>
          </defs>
        </svg>
        {SPARKS.map((p, i) => (
          <svg key={i} data-intro-star={i} className="bt-intro__spark" viewBox="-4 -4 108 108" style={{ left: p.x + '%', top: p.y + '%', width: p.s + '%' }}>
            <path d={STAR} fill="url(#bt-star-rose)" stroke="#E7C77E" strokeWidth="3.2" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <div className="cs-intro__bottom"><span>Greater Boston <i>✦</i> Home care</span><span className="cs-intro__rule"><i /></span><button type="button" data-intro-skip="">Skip intro <span>↗</span></button></div>
    </div>
  );
});

export default BrandIntro;
