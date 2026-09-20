import { NextResponse } from 'next/server';
import { requireEmployer } from '../../../../lib/employer-auth';
export async function GET(request){const auth=await requireEmployer(request);if(auth.error)return auth.error;const [{data:packages},{data:subs}]=await Promise.all([auth.db.from('employer_packages').select('*').eq('active',true).order('price'),auth.db.from('employer_subscriptions').select('*, employer_packages(*)').eq('company_id',auth.company.id).order('created_at',{ascending:false}).limit(1)]);return NextResponse.json({packages:packages||[],subscription:subs?.[0]||null});}
