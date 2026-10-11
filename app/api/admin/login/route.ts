import { NextResponse } from 'next/server';
import {checkPassword,configured,setAdminCookie,clearAdminCookie} from '../../../../lib/admin';
export async function POST(request:Request){if(!configured())return NextResponse.json({error:'Admin is not configured in Vercel.'},{status:503});const {password}=await request.json();if(typeof password!=='string'||!checkPassword(password))return NextResponse.json({error:'Incorrect password'},{status:401});await setAdminCookie();return NextResponse.json({ok:true})}
export async function DELETE(){await clearAdminCookie();return NextResponse.json({ok:true})}
