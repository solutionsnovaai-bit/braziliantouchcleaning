import { forwardRef } from 'react';

// The real logo (gold-edged enamel pin) is revealed from the centre, the three sparkles pop in
// and a soft light sweeps across before the page opens.
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
        <img data-intro-logo="" className="bt-intro__logo" src="/assets/brand/logo-pin-cut.webp" alt="" width="900" height="1283" />
        <span data-intro-shine="" className="bt-intro__shine" />
        {SPARKS.map((p, i) => (
          <svg key={i} data-intro-star={i} className="cs-intro__star bt-intro__spark" viewBox="0 0 100 100" style={{ left: p.x + '%', top: p.y + '%', width: p.s + '%' }}>
            <path d={STAR} fill="#fff3f7" />
          </svg>
        ))}
      </div>
      <div className="cs-intro__bottom"><span>Greater Boston <i>✦</i> Home care</span><span className="cs-intro__rule"><i /></span><button type="button" data-intro-skip="">Skip intro <span>↗</span></button></div>
    </div>
  );
});

export default BrandIntro;
