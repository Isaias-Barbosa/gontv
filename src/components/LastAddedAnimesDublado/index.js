import { Link } from 'react-router-dom'

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import CardAnime from 'components/CardAnime';

export default function LastAddedAnimesDublado({animes}) {

  const [isLoading, setIsLoading] = useState(true);





  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);

  const dubladoAnimes = animes.filter((anime) => anime.language === "Dublado");




  const limitedAnimes = dubladoAnimes.slice(0, 10);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    centerMode: false,
    centerPadding: '15px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,

        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,

        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,

        },
      },
    ],

  };

  return (
    <>
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h2 className="text-2xl text-white font-bold text-start p-1">
          <span className="border-b-4 border-emerald-600 pb-1">Novos Animes Dublados</span>
        </h2>
        <div className="text-end mb-2">
          <Link to="/animesDublados" className="text-emerald-600 hover:text-emerald-500 text-end font-bold">
            Ver Todos
          </Link>
        </div>
        {isLoading ? (
          // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados
          <div className="flex justify-center">
            <BeatLoader color="#00b894" loading={isLoading} size={20} />
          </div>
        ) : (
          <Slider {...settings}>
            {limitedAnimes && limitedAnimes.length > 0 ? (
              limitedAnimes.map((anime) => (
                <div className="px-1">
                <CardAnime anime={anime} />
                </div>
              ))
            ) : (
              <div>Nenhum anime encontrado.</div>
            )}
          </Slider>
        )}
      </div>

    </>
  )
}

  /*

  // Função para buscar os animes do servidor
  const fetchAnimes = () => {
      fetch('https://animes.vision/api/v2/search?ordenar=adicionado_recentemente')
        .then(response => response.json())
        .then(data => {
          console.log(data); // Verifica se os dados estão sendo recebidos corretamente
  
          if (Array.isArray(data)) { // Verifica se data é um array
              // Filtra os animes com a propriedade category igual a "Animes"
              const currentAnimes = data.filter(anime => anime.category === 'Animes' && anime.dubbed === true).map(anime => ({
                  id: anime.id,
                  title: anime.title,
                  imageUrl: anime.thumbnail,
                  // outras propriedades do anime que você deseja exibir
              }));
  
          console.log(currentAnimes); // Verifica os animes convertidos
  
          setAnimesData(currentAnimes);
          setIsLoading(false);
      } else {
          console.log('Dados inválidos ou ausentes.');
      }
        })
        .catch(error => {
          console.log('Ocorreu um erro:', error);
        });
    };
  
    useEffect(() => {
      fetchAnimes();
    }, []);


    const currentAnimes = animesData.slice(0, 15);


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    centerMode: false,
    centerPadding: '15px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,

        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,

        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,

        },
      },
    ],

  };

  return (
    <>
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h2 className="text-2xl text-white font-bold text-start p-1">
          <span className="border-b-4 border-emerald-600 pb-1">Novos Animes Dublados</span>
        </h2>
        <div className="text-end mb-2">
          <Link to="/animesDublados" className="text-emerald-600 hover:text-emerald-500 text-end font-bold">
            Ver Todos
          </Link>
        </div>
        {isLoading ? (
          // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados
          <div className="flex justify-center">
            <BeatLoader color="#00b894" loading={isLoading} size={20} />
          </div>
        ) : (
          <Slider {...settings}>
            {currentAnimes && currentAnimes.length > 0 ? (
              currentAnimes.map((anime) => (
                <div className="px-1">
                <CardAnime anime={{
                                    title: anime.title,
                                    coverImage: anime.imageUrl,
                                 }} />
                </div>
              ))
            ) : (
              <div>Nenhum anime encontrado.</div>
            )}
          </Slider>
        )}
      </div>

    </>
  )
}
*/