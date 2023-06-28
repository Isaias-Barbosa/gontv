import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdPlayCircleFilled } from 'react-icons/md';

import animeDetails from 'json/animes.json';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardAnime from 'components/CardAnime';

export default function PopularAnime() {

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);

    const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    const [popularAnimeList, setPopularAnimeList] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Filtrar a lista de animes populares com a propriedade "top" igual a true
        const filteredList = animeDetails.filter((anime) => anime.top === true).slice(0, 10);
        setPopularAnimeList(filteredList);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
          };

          handleResize();
        window.addEventListener('resize', handleResize);

        // Limpar o event listener quando o componente é desmontado
        return () => window.removeEventListener('resize', handleResize);


    }, []);


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
        <section>
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h2 className="text-2xl text-start text-white font-bold mb-4 p-1">
          <span className="border-b-4 border-emerald-600 pb-1">Animes Populares</span>
        </h2>
        {isLoading ? (
          // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados
          <div className="flex justify-center">
            
          </div>
        ) : (
                  <Slider {...settings}>
          {popularAnimeList.map((anime) => (
            <div className="px-1">
            <CardAnime anime={anime} />
            </div>
          ))}
        </Slider>
        
                )}
                
      </div>
    </section>
    )
}

