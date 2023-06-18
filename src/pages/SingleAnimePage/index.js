import {useParams } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import animes from 'json/animes.json';
import { Helmet } from "react-helmet";



export default function SingleAnimePage() {

  const { slug } = useParams();
  
  const anime = animes.find((anime) => anime.slug === slug);

  const pageTitle = ` Gon.TV - Assistir ${anime.title} - ${anime.language} - Online em FHD `;


  if (!anime) {
    return <div>Anime não encontrado.</div>;
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
    <div>
      <SingleAnime anime={anime} />
    </div>
    </>
  );
}