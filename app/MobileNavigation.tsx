'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
const primary=[['/about','ABOUT US'],['/golf','GOLF'],['/membership','MEMBERSHIP'],['/amenities','POOL & LIFESTYLE'],['/events','NEWS & EVENTS'],['/lpoa','LPOA']];
const secondary=[['/contact','Guest Information'],['/contact','Contact & Directions'],['/membership#membership-inquiry','Membership Inquiries']];
export default function MobileNavigation(){
 const [open,setOpen]=useState(false);const pathname=usePathname();
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
 return <><div className="mobileMasthead"><Link href="/" aria-label="Linderhof home" onClick={()=>setOpen(false)}><img src="/images/linderhof-crest.png" alt="Linderhof Country Club"/></Link><button type="button" className="mobileMenuToggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobileClubMenu" aria-label={open?'Close navigation':'Open navigation'}><span className="menuSymbol" aria-hidden="true">{open?'×':'☰'}</span><span>{open?'CLOSE':'MENU'}</span></button></div><div id="mobileClubMenu" className={`mobileMenuOverlay${open?' isOpen':''}`} inert={!open}><nav aria-label="Mobile navigation" className="mobileMenuLinks">{primary.map(([href,label])=><Link href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}<div className="mobileMenuSecondary">{secondary.map(([href,label])=><Link href={href} key={label} onClick={()=>setOpen(false)}>{label}</Link>)}<a href="https://linderhofmembers.com">Member Login ↗</a></div></nav></div></>
}
