import React, { useEffect, useState } from "react";
import {useParams } from 'react-router-dom'
import SingleAnime from 'components/SingleAnime';
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom'
import { usePublicAnimes } from 'context/AnimeCatalogContext';
//import { LinearProgress} from '@mui/material';

export default function SingleAnimePage() {
  const animes = usePublicAnimes();
  const { slug } = useParams();
  const [randomAnime, setRandomAnime] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (slug === "random") {
      const randomIndex = Math.floor(Math.random() * animes.length);
      const anime = animes[randomIndex] 
      setRandomAnime(anime);
      navigate(`/animes/${anime.slug}`);
    }
  }, [animes, slug, navigate]);

  if (slug === "random" && !randomAnime) {
    return <div>Carregando anime aleatório...</div>;
  }

  let anime;
  if (slug === "random") {
    anime = randomAnime;
  } else {
    anime = animes.find((anime) => anime.slug === slug);
    
  }

  if (!anime) {
    return <div>Anime não encontrado.</div>;
  }

  const pageTitle = ` Gon.TV - Assistir ${anime.title} - ${anime.language} - Online em FHD `;
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


  
  /*
  const location = useLocation();
  const { animeSlug } = useParams();
  const animeId = location.state && location.state.animeId;
  
  

  const [animeDetails, setAnimeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  function generateSlug(title) {
    if (!title) {
      return '';
    }

    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  useEffect(() => {
    console.log("Entrando no useEffect");
  
    const fetchAnimeDetails = async () => {
      try {
        console.log("Iniciando busca por detalhes do anime");
  
        const response = await fetch(`https://animes.vision/api/v2/search?ordenar=adicionado_recentemente`);
        if (!response.ok) {
          throw new Error("Erro ao buscar a lista de releases");
        }
  
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
  
        const allAnimes = Object.values(data).flat();
        console.log("Todos os animes:", allAnimes);
  
        const animeDetails = allAnimes.find(
          (item) => generateSlug(item.title) === animeSlug
        );
  
        if (animeDetails) {
          console.log("Anime encontrado:", animeDetails);
          setAnimeDetails(animeDetails);
        } else {
          console.log("Anime não encontrado");
        }
      } catch (error) {
        console.error("Ocorreu um erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAnimeDetails();
  }, [animeSlug]);
  
  console.log("Anime Slug:", animeSlug);
  console.log("Anime Data:", animeDetails);


  const slug = animeSlug;
*/


  /*
  if (!animeData || !animeData.data || Object.keys(animeData.data).length === 0) {
    return <div>Dados do anime não encontrados.</div>;
  }
  */
  
  /*

  let pageTitle = "Gon.TV - Online em FHD";

  if (animeDetails) {
    pageTitle = `Gon.TV - Assistir ${animeDetails.title}  - Online em FHD`;
  }
  
  */

  /* useEffect(() => {
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

  */


/*
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {isLoading ? (
        // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados   
        <div className="min-h-screen bg-black-dark flex justify-start flex-col">
          <LinearProgress />
        </div>
      ) : (
    <div>
    <SingleAnime animeDetails={animeDetails} animeSlug={slug}/>
    </div>
      )
      }
    </>
      
  );
*/