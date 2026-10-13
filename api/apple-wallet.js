import { PKPass } from 'passkit-generator';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const b64 = value => Buffer.from(value || '', 'base64');

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const auth=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
    if(!auth) return res.status(401).json({error:'Please sign in again.'});
    const supabaseUrl=process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!supabaseUrl||!serviceKey) return res.status(503).json({error:'LINDEX Pass server setup is incomplete.'});
    const apple={
      passTypeIdentifier:process.env.APPLE_WALLET_PASS_TYPE_ID,
      teamIdentifier:process.env.APPLE_WALLET_TEAM_ID,
      signerCert:process.env.APPLE_WALLET_SIGNER_CERT_BASE64,
      signerKey:process.env.APPLE_WALLET_SIGNER_KEY_BASE64,
      wwdr:process.env.APPLE_WALLET_WWDR_CERT_BASE64,
      signerKeyPassphrase:process.env.APPLE_WALLET_SIGNER_KEY_PASSPHRASE || undefined,
    };
    if(!apple.passTypeIdentifier||!apple.teamIdentifier||!apple.signerCert||!apple.signerKey||!apple.wwdr){
      return res.status(503).json({error:'Apple Wallet is ready in LINDEX, but the club still needs to add its Apple Wallet certificates in Vercel.'});
    }
    const admin=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false}});
    const {data:userData,error:userError}=await admin.auth.getUser(auth);
    if(userError||!userData?.user) return res.status(401).json({error:'Your sign-in expired. Please sign in again.'});
    const {data:profile,error:profileError}=await admin.from('profiles').select('*').eq('id',userData.user.id).maybeSingle();
    if(profileError||!profile||profile.membership_status!=='active') return res.status(403).json({error:'An active Linderhof membership is required for LINDEX Pass.'});

    const iconPath=path.join(process.cwd(),'public','assets','lindex-icon-180.png');
    const icon=fs.readFileSync(iconPath);
    const pass=new PKPass(
      {'icon.png':icon,'icon@2x.png':icon,'logo.png':icon,'logo@2x.png':icon},
      {wwdr:b64(apple.wwdr),signerCert:b64(apple.signerCert),signerKey:b64(apple.signerKey),signerKeyPassphrase:apple.signerKeyPassphrase},
      {
        formatVersion:1,
        passTypeIdentifier:apple.passTypeIdentifier,
        teamIdentifier:apple.teamIdentifier,
        serialNumber:`lindex-${profile.id}`,
        organizationName:'Linderhof Country Club',
        description:'LINDEX Digital Membership Card',
        logoText:'LINDEX',
        foregroundColor:'rgb(255,255,255)',
        backgroundColor:'rgb(7,60,44)',
        labelColor:'rgb(239,213,124)',
        generic:{
          primaryFields:[{key:'member',label:'MEMBER',value:profile.full_name||userData.user.email}],
          secondaryFields:[{key:'division',label:'DIVISION',value:profile.division||'Member'},{key:'index',label:'CLUB INDEX',value:profile.handicap_index==null?'—':String(profile.handicap_index)}],
          auxiliaryFields:[{key:'status',label:'STATUS',value:'ACTIVE'},{key:'memberId',label:'MEMBER ID',value:String(profile.id).slice(0,8).toUpperCase()}],
          backFields:[{key:'club',label:'Linderhof Country Club',value:'LINDEX — Your Digital Clubhouse'},{key:'site',label:'Member Portal',value:'https://linderhofmembers.com'}]
        }
      }
    );
    const verificationUrl=profile.verification_token?`https://linderhofmembers.com/verify?token=${encodeURIComponent(profile.verification_token)}`:`https://linderhofmembers.com`;
    pass.setBarcodes({message:verificationUrl,format:'PKBarcodeFormatQR',messageEncoding:'iso-8859-1',altText:'LINDEX Member Verification'});
    const buffer=pass.getAsBuffer();
    res.setHeader('Content-Type','application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition','attachment; filename="LINDEX-Membership.pkpass"');
    res.setHeader('Cache-Control','private, no-store');
    return res.status(200).send(buffer);
  }catch(error){
    console.error(error);
    return res.status(500).json({error:error?.message||'Could not create Apple Wallet pass.'});
  }
}
