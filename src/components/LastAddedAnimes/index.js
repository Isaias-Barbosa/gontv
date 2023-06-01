import { Link } from 'react-router-dom'
import lastAddedAnimeData from 'json/animes.json'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function LastAddedAnimes() {

  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

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
    <>
      <div className="py-6">
      <div className="flex justify-center items-center mb-9">
        <h2 className="text-2xl text-white text-center items-center font-bold">
          <span className="border-b-4 border-emerald-600 pb-1">Novos Animes Legendados</span>
        </h2>
      </div>
      <div className="container mx-auto px-7 max-w-8xl mb-6 xl:px-1 2xl:px-1">
        <Slider {...settings}>
          {limitedAnimes && limitedAnimes.length > 0 ? (
            limitedAnimes.map((anime) => (
              <Link to={`/animes/${anime.slug}`}>
                <div key={anime.id} className="flex flex-col items-center object-cover mx-1">
                  <div className="aspect-ratio-box">
                  <div className="anime-cover">
                    <img src={anime.coverImage} alt={anime.title} className="w-full h-full object-cover mb-4" />
                  </div>
                    <h3 className="text-lg text-white text-center font-semibold">{truncateTitle(anime.title)}</h3>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>Nenhum anime encontrado.</div>
          )}
        </Slider>
      </div>
    </div>
    </>
  )
}
