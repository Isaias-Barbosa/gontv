import React, { useEffect, useState } from "react";
import {useParams, useNavigate } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import animes from 'json/animes.json';
import { Helmet } from "react-helmet";



export default function SingleAnimePage() {

  const { slug } = useParams();
  const [randomAnime, setRandomAnime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug === "random") {
      const randomIndex = Math.floor(Math.random() * animes.length);
      const anime = animes[randomIndex];
      setRandomAnime(anime);
      navigate(`/animes/${anime.slug}`);
    }
  }, [slug, navigate]);

  if (slug === "random" && !randomAnime) {
    return <div>Carregando anime aleatório...</div>;
  }

  
  
  let anime;
  if (slug === "random") {
    anime = randomAnime;
  } else {
    anime = animes.find((anime) => anime.slug === slug);
  }

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