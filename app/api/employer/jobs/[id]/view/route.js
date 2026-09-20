import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from '../../../../../../lib/supabase-url';
export async function POST(request,{params}){const body=await request.json();const sessionId=String(body.sessionId||'');if(sessionId.length<8)return NextResponse.json({error:'sessionId invalid'},{status:400});const client=createClient(normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);const {error}=await client.from('job_views').insert({job_id:params.id,session_id:sessionId});if(error&&error.code!=='23505')return NextResponse.json({error:error.message},{status:400});return NextResponse.json({success:true});}
