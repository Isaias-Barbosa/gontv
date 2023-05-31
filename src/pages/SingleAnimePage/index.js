import {useParams } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import animes from 'json/animes.json';




export default function SingleAnimePage() {

  const { slug } = useParams();
  
  const anime = animes.find((anime) => anime.slug === slug);
  

  if (!anime) {
    return <div>Anime não encontrado.</div>;
  }

  return (
    <div>
      <SingleAnime anime={anime} />
    </div>
  );
}