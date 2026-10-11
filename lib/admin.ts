import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
const COOKIE='lcc_admin';
function sign(value:string){return createHmac('sha256',process.env.ADMIN_SESSION_SECRET||'').update(value).digest('hex')}
export function configured(){return !!(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)}
export async function isAdmin(){if(!configured())return false;const token=(await cookies()).get(COOKIE)?.value||'';const [exp,sig]=token.split('.');if(!exp||!sig||!/^\d+$/.test(exp)||Number(exp)<Date.now())return false;const expected=sign(exp);return sig.length===expected.length && timingSafeEqual(Buffer.from(sig),Buffer.from(expected))}
export async function setAdminCookie(){const exp=String(Date.now()+8*60*60*1000);(await cookies()).set(COOKIE,`${exp}.${sign(exp)}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:8*60*60})}
export async function clearAdminCookie(){(await cookies()).delete(COOKIE)}
export function checkPassword(candidate:string){const pass=process.env.ADMIN_PASSWORD||'';const a=Buffer.from(candidate),b=Buffer.from(pass);return !!pass&&a.length===b.length&&timingSafeEqual(a,b)}
