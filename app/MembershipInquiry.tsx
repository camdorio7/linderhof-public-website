'use client';
import {useState, type FormEvent} from 'react';
import Link from 'next/link';
export default function MembershipInquiry({kind='membership'}:{kind?:'membership'|'contact'}){
 const [status,setStatus]=useState('');
 function handleSubmit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const first=String(data.get('first')||'').trim(),last=String(data.get('last')||'').trim(),email=String(data.get('email')||'').trim(),phone=String(data.get('phone')||'').trim(),interest=String(data.get('interest')||'').trim();
  const subject=`Linderhof ${kind==='membership'?'Membership Inquiry':'Contact Request'} — ${first} ${last}`;
  const body=`Name: ${first} ${last}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\n\nPlease contact me about Linderhof Country Club.`;
  // No email backend is configured: let the visitor explicitly send via their own mail application.
  window.location.href=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setStatus('Your email app should open with the inquiry prepared. Choose a recipient and send it there; the website has not submitted it automatically.');
 }
 return <section className="inquiry" id="membership-inquiry"><div className="inquiryTitle">{kind==='membership'?<>MEMBERSHIP<br/>INQUIRY</>:<>CONTACT<br/>THE CLUB</>}</div><form className="inquiryForm" onSubmit={handleSubmit}><label>First Name*<input name="first" required autoComplete="given-name" placeholder="FIRST NAME"/></label><label>Last Name*<input name="last" required autoComplete="family-name" placeholder="LAST NAME"/></label><label>Email Address*<input type="email" name="email" required autoComplete="email" placeholder="EMAIL ADDRESS"/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="PHONE"/></label><label className="inquiryInterest">I'm interested in<select name="interest" defaultValue="Membership"><option>Membership</option><option>Golf</option><option>Pool & Amenities</option><option>Club Events</option><option>General Information</option></select></label><button type="submit">PREPARE EMAIL ↗</button><p className="inquiryNotice">This opens your email application. No information is sent automatically until the club's email service is configured. <Link href="/contact">Contact & Directions ↗</Link></p>{status&&<p className="inquiryStatus" role="status">{status}</p>}</form></section>
}
