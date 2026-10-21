'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const primary = [
  ['/about', 'ABOUT US'],
  ['/golf', 'GOLF'],
  ['/membership', 'MEMBERSHIP'],
  ['/amenities', 'POOL & AMENITIES'],
  ['/events', 'NEWS & EVENTS'],
  ['/lpoa', 'LPOA'],
  ['/shop', 'PRO SHOP'],
];
const secondary = [
  ['/contact', 'Guest Information'],
  ['/contact', 'Contact & Directions'],
  ['/membership#membership-inquiry', 'Membership Inquiries'],
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const previouslyOpen = useRef(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const priorOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
  useEffect(() => {
    if (!open && previouslyOpen.current) toggleRef.current?.focus();
    previouslyOpen.current = open;
  }, [open]);

  return (
    <>
      <header className="mobileMasthead" data-mobile-nav>
        <Link className="mobileBrand" href="/" aria-label="Linderhof Country Club home" onClick={() => setOpen(false)}>
          <img src="/images/linderhof-crest.png" alt="Linderhof Country Club" />
        </Link>
        <button ref={toggleRef} type="button" className="mobileMenuToggle"
          aria-expanded={open} aria-controls="mobileClubMenu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(value => !value)}>
          <span className={open ? 'menuSymbol menuSymbolClose' : 'menuSymbol menuSymbolOpen'} aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="mobileMenuLabel">{open ? 'CLOSE' : 'MENU'}</span>
        </button>
      </header>
      <div id="mobileClubMenu" className={`mobileMenuOverlay${open ? ' isOpen' : ''}`}
        aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile navigation" className="mobileMenuLinks">
          {primary.map(([href, label]) => (
            <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <div className="mobileMenuSecondary">
            {secondary.map(([href, label]) => (
              <Link href={href} key={label} onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <a href="https://linderhofmembers.com" rel="noopener noreferrer">Member Login</a>
          </div>
        </nav>
      </div>
    </>
  );
}
