import SinglePlay from 'components/SinglePlay';
import animeData from 'json/animes.json';
import animeDataDubs from 'json/animesDub.json';
import { useParams } from 'react-router-dom';



export default function SinglePlayPage() {

    const { animeId, episodeId } = useParams();
    const animeIdInt = parseInt(animeId);
    const episodeIdInt = parseInt(episodeId);

    // Combina os dois conjuntos de dados em uma única matriz
    const allAnimeDetails = [...animeData, ...animeDataDubs];
    
    const anime = allAnimeDetails.find(anime => anime.id === animeIdInt);
    const selectedEpisode = anime?.episodes.find(episode => episode.id === episodeIdInt);
  
    return selectedEpisode ? <SinglePlay episode={selectedEpisode} /> : <div>Episódio não encontrado</div>;
  }
