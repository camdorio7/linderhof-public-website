import RentalForm from './RentalForm';
export const metadata = {title:'Register a Renter | Linderhof Country Club'};
export default function Page(){
  return <main><section className="pagehero"><p className="eyebrow light">Condo owners</p><h1>Register a Renter</h1></section>
    <article className="content"><h2>Submit a Stay for Club Review</h2>
    <p>You can send the club your rental details without a LINDEX account. Staff will review the request and follow up by email. Pass purchases are handled separately.</p>
    <div style={{maxWidth:960,margin:"16px auto",padding:"16px 20px",border:"1px solid rgba(125,125,125,.25)",borderRadius:12,background:"#f7f7f4"}}><strong>Renter eligibility</strong><p style={{margin:"8px 0 0"}}>Registration is available only for renters staying in Linderhof Country Club condominiums. All requests require staff verification and approval before access is granted.</p></div><RentalForm/></article></main>;
}
