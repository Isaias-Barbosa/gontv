import {useParams } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import animeDetails from 'json/animes.json';

export default function SingleAnimePage() {

  const { id } = useParams();

  const anime = animeDetails.find((anime) => anime.id === parseInt(id));
  

  if (!anime) {
    return <div>Anime não encontrado.</div>;
  }

  return (
    <div>
      <SingleAnime anime={anime} />
    </div>
  );
}
