import RentalForm from './RentalForm';
export const metadata = {title:'Register a Renter | Linderhof Country Club'};
export default function Page(){
  return <main><section className="pagehero"><p className="eyebrow light">Condo owners</p><h1>Register a Renter</h1></section>
    <article className="content"><h2>Submit a stay for club review</h2>
    <p>You can send the club your rental details without a LINDEX account. Staff will review the request and follow up by email. Pass purchases are handled separately.</p>
    <RentalForm/></article></main>;
}
