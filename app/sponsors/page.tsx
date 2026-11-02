type Sponsor = {name:string; image:string; link:string};
export const dynamic = 'force-dynamic';

async function getSponsors(): Promise<Sponsor[] | null> {
  try {
    const response = await fetch('https://linderhofmembers.com/api/public-website-sponsors', {
      cache:'no-store', signal:AbortSignal.timeout(6000)
    });
    if (!response.ok) return null;
    const rows:unknown = await response.json();
    if (!Array.isArray(rows) || !rows.every(row => row && typeof row.name==='string' &&
      typeof row.image==='string' && typeof row.link==='string')) return null;
    return rows;
  } catch {return null;}
}

export const metadata = { title: 'Our Sponsors | Linderhof Country Club' };

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  return <main className="sponsorsPage">
    <header className="pagehero sponsorsHero">
      <p className="eyebrow light">LINDERHOF COUNTRY CLUB</p>
      <h1>Our Sponsors</h1>
    <p>Thank you to the businesses that support Linderhof Country Club.</p>
    </header>
    {sponsors === null ? <p style={{textAlign:'center'}}>The sponsor directory is temporarily unavailable.</p> :
    <ul className="sponsorGrid" aria-label="Club sponsors">
      {sponsors.map(({name, image, link}, index) => {
        const card = <><img src={image} alt="" loading="lazy" /><strong>{name}</strong></>;
        return <li key={index}>{link ? <a href={link}>{card}</a> : <div>{card}</div>}</li>;
      })}
    </ul>}
  </main>;
}
