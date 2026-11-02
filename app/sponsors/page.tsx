import content from '../../content/site.json';

export const metadata = { title: 'Our Sponsors | Linderhof Country Club' };

export default function SponsorsPage() {
  return <main className="sponsorsPage">
    <header className="pagehero sponsorsHero">
      <p className="eyebrow light">LINDERHOF COUNTRY CLUB</p>
      <h1>Our Sponsors</h1>
    <p>Thank you to the businesses that support Linderhof Country Club.</p>
    </header>
    <ul className="sponsorGrid" aria-label="Club sponsors">
      {content.sponsors.map(({name, image, link}, index) => {
        const card = <><img src={image} alt="" loading="lazy" /><strong>{name}</strong></>;
        return <li key={index}>{link ? <a href={link}>{card}</a> : <div>{card}</div>}</li>;
      })}
    </ul>
  </main>;
}
