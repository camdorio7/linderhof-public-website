import {NextResponse} from 'next/server';
import {isAdmin} from '../../../../lib/admin';
export const runtime='nodejs';
const headers=()=>({Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'});
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{
  const form=await req.formData();const file=form.get('file');const kind=form.get('kind');
  if(!(file instanceof File)||!['image','guide'].includes(String(kind)))return NextResponse.json({error:'Invalid upload'},{status:400});
  const isImage=kind==='image';const allowed=isImage?['image/jpeg','image/png','image/webp']:['application/pdf'];
  const limit=isImage?4*1024*1024:8*1024*1024;
  if(!allowed.includes(file.type)||file.size===0||file.size>limit)return NextResponse.json({error:`Use ${isImage?'JPG, PNG, or WebP (max 4 MB)':'PDF (max 8 MB)'}`},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer());
  const valid=file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216:file.type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):file.type==='image/webp'?bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP':bytes.toString('ascii',0,5)==='%PDF-';
  if(!valid)return NextResponse.json({error:'File contents do not match selected type'},{status:400});
  const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'pdf';
  const slug=file.name.replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'club-photo';
  const path=isImage?`public/images/uploads/${slug}-${crypto.randomUUID().slice(0,8)}.${ext}`:'public/2027-membership-guide.pdf';
  const endpoint=`https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`;
  let sha: string|undefined;
  if(!isImage){const existing=await fetch(endpoint,{headers:headers(),cache:'no-store'});if(existing.ok)sha=(await existing.json()).sha;else if(existing.status!==404)return NextResponse.json({error:'Could not check existing membership guide'},{status:502})}
  const res=await fetch(endpoint,{method:'PUT',headers:headers(),body:JSON.stringify({message:isImage?'Upload Linderhof website photo':'Update 2027 membership guide',content:bytes.toString('base64'),branch:process.env.GITHUB_BRANCH||'main',...(sha?{sha}:{})})});
  if(!res.ok){const result=await res.json().catch(()=>({}));return NextResponse.json({error:result.message||`GitHub ${res.status}`},{status:res.status})}
  return NextResponse.json({ok:true,url:isImage?'/'+path.replace(/^public\//,''):'/2027-membership-guide.pdf',label:file.name});
 }catch{return NextResponse.json({error:'Upload failed. Check GitHub configuration.'},{status:500})}
}
