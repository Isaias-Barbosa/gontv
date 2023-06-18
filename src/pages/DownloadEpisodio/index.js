import React from 'react';
import { useParams } from 'react-router-dom';

import Download from 'components/Download';
import animes from 'json/animes.json';
import { Helmet } from 'react-helmet';

export default function DownloadEpisodio() {


  const { slug, titleSlug} = useParams();

  
  // Obtenha os detalhes do anime com base no slug
  const anime = animes.find((anime) => anime.slug === slug);
  const animeTitle = anime ? anime.title : '';

  // Obtenha o título do episódio com base no titleSlug
  const episodeData = anime && anime.episodes.find((ep) => ep.titleSlug === titleSlug);
  const episodeTitle = episodeData ? `${episodeData.titleEpisodio}` : '';
  const thumb = episodeData ? `${episodeData.thumbnail}` : '';

  // Define a página atual com base no índice do episódio
  const episodeIndex = anime && anime.episodes.findIndex((ep) => ep.titleSlug === titleSlug);
  const currentPage = episodeIndex !== -1 ? episodeIndex + 1 : 0;

  // Define o array de episódios
  const episodes = anime ? anime.episodes : [];

   // Obtém a linguagem do episódio
   const languageEpisode = episodeData ? episodeData.languageEpisode : '';

   const pageTitle = ` Gon.TV - Baixar ${anime.title} - ${anime.language} - ${episodeTitle} - Online em FHD `;


  return (
    <div className="download-page">
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet><Download 
      coverImage={thumb} 
      animeTitle={animeTitle} 
      episodeTitle={episodeTitle}
      currentPage={currentPage}
      episodes={episodes}
      slug={slug}
        languageEpisode={languageEpisode}
        anime={anime}
       />
    </div>
  );
}
