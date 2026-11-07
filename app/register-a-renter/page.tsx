import RentalForm from './RentalForm';
export const metadata = {title:'Register Your Stay | Linderhof Country Club'};
export default function Page(){
  return <main><section className="pagehero"><p className="eyebrow light">Condo Renter Access</p><h1>Register Your Stay</h1></section>
    <article className="content" style={{maxWidth:960,margin:'0 auto'}}>
      <h2>Staying in a Linderhof condo?</h2>
      <p>Complete the form below with your condo unit, contact information, and check-in and check-out dates. Your condo owner will receive a request to confirm your stay. You do not need a LINDEX account.</p>
      <p>After your stay is confirmed, we will email you a private link to select and purchase eligible pool or golf passes. <strong>Do not purchase a pass yet.</strong></p>
      <RentalForm/>
      <p style={{marginTop:24,fontSize:'.9rem'}}>Condo owners do not need to register renters. Owners only confirm the stay request they receive by email or through LINDEX.</p>
    </article></main>;
}
