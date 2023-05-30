import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import animeDetails from 'json/animes.json';

export default function PopularAnime() {

    const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
      if (title.length > MAX_TITLE_LENGTH) {
        return title.substring(0, MAX_TITLE_LENGTH) + '...';
      }
      return title;
    };
    
    const [popularAnimeList, setPopularAnimeList] = useState([]);

  useEffect(() => {
    // Randomizar a lista de animes populares apenas uma vez ao montar o componente
    const randomizedList = animeDetails.sort(() => Math.random() - 0.5).slice(0, 10);
    setPopularAnimeList(randomizedList);
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
                breakpoint: 1366,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    
                },
            },
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
                    slidesToShow: 3,
                    slidesToScroll: 3,
                   
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
            <h2 className="text-2xl text-center text-white font-bold mb-1 p-6">
                <span className="border-b-4 border-emerald-600 pb-1">Animes Populares</span>
            </h2>
            <div className="mx-8 sm:mx-auto md:mx-8 lg:mx-8 xl:mx-8 3xl:mx-auto max-w-8xl mb-6">
                <Slider {...settings}>
                    {popularAnimeList.map((anime) => (
                        <Link to={`/animes/${anime.id}`} key={anime.id}>
                            <div className="flex flex-col items-center mx-2">
                            <div className="mb-4">
                                    <img src={anime.coverImage} alt={anime.title} className="h-80 mb-3 rounded-lg" />
                                </div>
                                <h3 className="text-lg text-center text-white font-semibold">{truncateTitle(anime.title)}</h3>
                            </div>
                        </Link>
                    ))}
                </Slider>
            </div>
        </section>
    )
}

