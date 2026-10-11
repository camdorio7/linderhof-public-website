// Set these environment variables to Stripe Price IDs for real, approved merchandise.
export const catalog=[
 {id:'cap',name:'Linderhof Cap',description:'Club headwear',env:'STRIPE_PRICE_CAP'},
 {id:'polo',name:'Linderhof Polo',description:'Club apparel',env:'STRIPE_PRICE_POLO'},
 {id:'gift',name:'Linderhof Gift Item',description:'Club merchandise',env:'STRIPE_PRICE_GIFT'}
] as const;
