import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';
import { usePublicAnimes } from 'context/AnimeCatalogContext';
import { sortAnimes } from 'lib/animeList';
export default function Banner() {
  const animes = usePublicAnimes();
  const highlights = useMemo(() => sortAnimes(animes.filter(anime => anime.top === true && anime.visibility !== 'draft')), [animes]);
  if (!highlights.length) return null;
  return <Carousel showThumbs={false} infiniteLoop={highlights.length > 1} autoPlay={highlights.length > 1} interval={5000} stopOnHover showStatus={false} showArrows={highlights.length > 1}>
    {highlights.map(anime => {
      const synopsis = String(anime.synopsis || '');
      const image = anime.background || anime.coverImage;
      return <div key={anime.id} className="relative"><div className="bg-cover bg-center w-full" style={{ backgroundImage: image ? `url(${image})` : 'linear-gradient(120deg, #102f25, #050505)', minHeight: '420px' }}>
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative flex flex-col justify-center items-center text-white px-6 py-20" style={{ minHeight: '420px' }}>
          <h2 className="text-3xl font-bold mb-4">{anime.title}</h2>
          {synopsis && <p className="text-base mb-6 max-w-4xl">{synopsis.length > 350 ? `${synopsis.slice(0, 350)}…` : synopsis}</p>}
          <Link to={`/animes/${anime.slug}`} className="bg-emerald-400 text-black px-4 py-2 rounded-lg hover:bg-emerald-500 font-semibold">Assista agora</Link>
        </div>
      </div></div>;
    })}
  </Carousel>;
}
