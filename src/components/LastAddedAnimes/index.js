import { Link } from 'react-router-dom'
import lastAddedAnimeData from 'json/animes.json'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BeatLoader } from 'react-spinners';
import React, { useState, useEffect } from 'react';
import CardAnime from 'components/CardAnime';

export default function LastAddedAnimes() {

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);


  const limitedAnimes = lastAddedAnimeData.slice(0, 10);

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
      <div className="py-6">
        <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
          <h2 className="text-2xl text-white text-start items-center font-bold p-1">
            <span className="border-b-4 border-emerald-600 pb-1">Novos Animes Legendados</span>
          </h2>
          <div className="text-end mb-2">
            <Link to="/animes" className="text-emerald-600 hover:text-emerald-500 text-end font-bold">
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
      </div>
    </>
  )
}
