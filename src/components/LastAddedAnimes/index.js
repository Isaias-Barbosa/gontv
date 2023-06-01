import { Link } from 'react-router-dom'
import lastAddedAnimeData from 'json/animes.json'
import { MdPlayCircleFilled } from 'react-icons/md';
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
        <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
          <h2 className="text-2xl text-white text-start items-center font-bold mb-4 p-1">
            <span className="border-b-4 border-emerald-600 pb-1">Novos Animes Legendados</span>
          </h2>
          <Slider {...settings}>
            {limitedAnimes && limitedAnimes.length > 0 ? (
              limitedAnimes.map((anime) => (
                <div className="aspect-ratio-box" >
                  <div key={anime.id} className="relative">
                    <Link to={`/animes/${anime.slug}`}>
                      <div className="anime-cover">
                        <img src={anime.coverImage} alt={anime.title}
                          className="w-full h-auto px-1 object-cover custom-height-last mb-1"
                        />
                        <div className="overlay"></div>
                        <button className="play-button">
                          <MdPlayCircleFilled className="text-white text-4xl" />
                        </button>
                      </div>
                    </Link>
                    <h3 className="text-md text-white text-center font-semibold">{truncateTitle(anime.title)}</h3>
                  </div>
                </div>
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
