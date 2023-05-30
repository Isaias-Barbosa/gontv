import {useParams } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import animeDetails from 'json/animes.json';
import animeDetailsDub from 'json/animesDub.json';



export default function SingleAnimePage() {

  const { id } = useParams();

  // Combina os dois conjuntos de dados em uma única matriz
  const allAnimeDetails = [...animeDetails, ...animeDetailsDub];

  const anime = allAnimeDetails.find((anime) => anime.id === parseInt(id));
  

  if (!anime) {
    return <div>Anime não encontrado.</div>;
  }

  return (
    <div>
      <SingleAnime anime={anime} />
    </div>
  );
}