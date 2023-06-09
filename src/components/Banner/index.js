import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importe o estilo do carrossel
import { Carousel } from "react-responsive-carousel"; // Importe o componente do carrossel
import animes from "json/animes.json";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { BeatLoader } from 'react-spinners';

export default function Banner() {
  const [popularAnimeList, setPopularAnimeList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);

  useEffect(() => {
    // Filtrar a lista de animes populares com a propriedade "top" igual a true
    const filteredList = animes
      .filter((anime) => anime.top === true)
      .slice(0, 3);
    setPopularAnimeList(filteredList);
    return;
  }, []);

  const MAX_TITLE_LENGTH = 350; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + "...";
    }
    return title;
  };

  return (
    <div>
      {isLoading ? (
          // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados
          <div className="flex justify-center">
            <BeatLoader color="#00b894" loading={isLoading} size={20} />
          </div>
        ) : (
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          stopOnHover={false}
          showStatus={false}
          showArrows={true}
          arrowSize={74}
        >

          {popularAnimeList.map((capa, index) => (
            <div key={index} className="relative">
              <div
                className="bg-cover bg-center w-full"
                style={{
                  backgroundImage: `url(${capa.background})`,
                  height: "530px",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                  <h2 className="text-4xl font-bold mb-4">{capa.title}</h2>
                  <p className="text-xl text-justify mb-2 p-4">
                    {truncateTitle(capa.synopsis)}
                  </p>
                  <Link to={`animes/${capa.slug}`}>
                    <button className="bg-emerald-400 text-black px-4 py-2 rounded-lg hover:bg-emerald-600 ">
                      Assista Agora
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

        </Carousel>
      )}
    </div>
  );
}
