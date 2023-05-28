import SinglePlay from 'components/SinglePlay';
import animeData from 'json/animes.json';

export default function SinglePlayPage({ animeId, episodeId }) {

    const animeIdInt = parseInt(animeId);
    const episodeIdInt = parseInt(episodeId);
  
    const anime = animeData.find(anime => anime.id === animeIdInt);
    const selectedEpisode = anime?.episodes.find(episode => episode.id === episodeIdInt);
  
    return selectedEpisode ? <SinglePlay episode={selectedEpisode} /> : <div>Episódio não encontrado</div>;
  
}