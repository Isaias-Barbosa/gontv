import Episodio from 'components/Episodio';
import animeData from 'json/animes.json';
import { useParams } from 'react-router-dom';



export default function SinglePlayPage() {

  const { slug } = useParams();
  const anime = animeData.find((anime) => anime.slug === slug);

  if (!anime || !anime.episodes || anime.episodes.length === 0) {
    return <div>Anime não encontrado ou sem episódios</div>;
  }

  const primeiroEpisodio = anime.episodes[0];
  
  

  return <Episodio anime={anime} episodio={primeiroEpisodio} />;
  }
