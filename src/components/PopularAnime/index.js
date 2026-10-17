import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardAnime from 'components/CardAnime';

export default function PopularAnime() {

  const [isLoading, setIsLoading] = useState(true);
  const [popularAnimes, setPopularAnimes] = useState([]);

  // Função para buscar os animes populares da temporada atual com base nas visualizações
  const fetchPopularAnimes = () => {
    fetch('https://animes.vision/api/v2/temporada-atual')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifica se os dados estão sendo recebidos corretamente

        if (data.success && data.data && data.data.posts) {
          // Filtra os animes com a propriedade category igual a "Animes", dublados igual a false e do ano atual
          const currentAnimes = data.data.posts
            .filter(anime => anime.category === 'Animes')
            .sort((a, b) => b.views - a.views) // Classifica por visualizações decrescentes
            .map(anime => ({
              id: anime.id,
              title: anime.title,
              imageUrl: anime.thumbnail,
              // outras propriedades do anime que você deseja exibir
            }));

          console.log(currentAnimes); // Verifica os animes populares

          setPopularAnimes(currentAnimes);
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
    fetchPopularAnimes();
  }, []);

  const currentAnimes = popularAnimes.slice(0, 10);

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
            {currentAnimes.map((anime) => (
              <div className="px-1">
                <CardAnime anime={{
                  title: anime.title,
                  coverImage: anime.imageUrl,
                }} />
              </div>
            ))}
          </Slider>

        )}

      </div>
    </section>
  )
}

