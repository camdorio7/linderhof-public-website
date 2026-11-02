import content from '../../content/site.json';
import { InteriorLayout } from '../InteriorLayout';

export const metadata = { title: 'Our Sponsors | Linderhof Country Club' };

export default function SponsorsPage() {
  return <InteriorLayout title="Our Sponsors">
    <p>Thank you to the businesses that support Linderhof Country Club.</p>
    <ul className="sponsorGrid">
      {content.sponsors.map(({name, image, link}, index) => {
        const card = <><img src={image} alt="" loading="lazy" /><strong>{name}</strong></>;
        return <li key={index}>{link ? <a href={link}>{card}</a> : <div>{card}</div>}</li>;
      })}
    </ul>
  </InteriorLayout>;
}
