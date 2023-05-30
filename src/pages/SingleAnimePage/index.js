import {useParams } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import animeDetails from 'json/animes.json';
import animeDetailsDub from 'json/animesDub.json';

export default function SingleAnimePage() {

  const { id } = useParams();
  const language = useParams().language; // Parâmetro adicional para a linguagem
  let anime = null;

  if (language === 'Dublado') {

    anime = animeDetailsDub.find((anime) => anime.id === parseInt(id));
   
  } else {
    anime = animeDetails.find((anime) => anime.id === parseInt(id));
  }

  

  if (!anime) {
    return <div>Anime não encontrado.</div>;
  }

  return (
    <div>
      <SingleAnime anime={anime} />
    </div>
  );
}
