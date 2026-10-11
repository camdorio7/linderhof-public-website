import {NextRequest,NextResponse} from 'next/server';
import Stripe from 'stripe';
import {catalog} from '../../shop/catalog';
export async function POST(req:NextRequest){
 const origin=new URL(req.url).origin;
 const stripeKey=process.env.STRIPE_SECRET_KEY;
 if(!stripeKey)return NextResponse.json({error:'Shop checkout is not configured.'},{status:503});
 const form=await req.formData();const productId=form.get('productId');
 if(typeof productId!=='string')return NextResponse.json({error:'Invalid product.'},{status:400});
 const product=catalog.find(p=>p.id===productId);
 if(!product)return NextResponse.json({error:'Unknown product.'},{status:400});
 const priceId=process.env[product.env];if(!priceId)return NextResponse.json({error:'Product not available.'},{status:409});
 try{const stripe=new Stripe(stripeKey);const price=await stripe.prices.retrieve(priceId);
 if(!price.active||price.type!=='one_time'||price.unit_amount==null)return NextResponse.json({error:'Product not available.'},{status:409});
 const session=await stripe.checkout.sessions.create({mode:'payment',line_items:[{price:priceId,quantity:1}],success_url:origin+'/shop/success?session_id={CHECKOUT_SESSION_ID}',cancel_url:origin+'/shop',billing_address_collection:'auto',shipping_address_collection:{allowed_countries:['US']},automatic_tax:{enabled:process.env.STRIPE_AUTOMATIC_TAX==='true'},metadata:{productId}});
 if(!session.url)throw new Error('No checkout URL');return NextResponse.redirect(session.url,303);
 }catch(e){console.error('Stripe checkout error',e);return NextResponse.json({error:'Unable to start checkout. Please try again later.'},{status:502})}
}
