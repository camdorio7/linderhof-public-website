import {NextResponse} from 'next/server';
export const runtime='nodejs';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request:Request){
 try{
  const length=Number(request.headers.get('content-length')||0);
  if(length>12000)return NextResponse.json({error:'Submission is too large.'},{status:413});
  const data=await request.json();
  if(data.website)return NextResponse.json({ok:true});
  const first=String(data.first||'').trim(),last=String(data.last||'').trim(),email=String(data.email||'').trim(),message=String(data.message||'').trim(),kind=data.kind==='contact'?'contact':'membership';
  if(!first||first.length>80||!last||last.length>80||email.length>254||!emailPattern.test(email)||message.length>2000||(kind==='contact'&&!message))return NextResponse.json({error:'Please check the required fields.'},{status:400});
  const apiKey=process.env.RESEND_API_KEY,from=process.env.INQUIRY_FROM_EMAIL,to=process.env.INQUIRY_TO_EMAIL;
  if(!apiKey||!from||!to){console.error('Inquiry email configuration missing');return NextResponse.json({error:'The inquiry form is temporarily unavailable. Please contact the club directly.'},{status:503});}
  const text=`Type: ${kind}\nFirst name: ${first}\nLast name: ${last}\nEmail: ${email}\nMessage: ${message||'Please send me information about membership.'}`;
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:to.split(',').map((s:string)=>s.trim()),reply_to:email,subject:`Linderhof ${kind==='membership'?'Membership Inquiry':'Contact Form'} — ${first} ${last}`,text}),cache:'no-store'});
  if(!response.ok){console.error('Inquiry delivery failed',response.status,await response.text());return NextResponse.json({error:'We could not deliver your inquiry right now. Please try again later.'},{status:502});}
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Unable to process your inquiry.'},{status:400});}
}
