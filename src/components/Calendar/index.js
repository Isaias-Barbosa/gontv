import { MdPlayCircleFilled } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Calendar({ animesByDate }) {
  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  


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
    <div className="bg-black-dark py-2">
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1 telona">
        {Object.entries(animesByDate).map(([date, animes]) => (
          <div key={date}>
            <h2 className="text-2xl font-bold text-white ms-1 flex justify-start mb-3">
              <span className="border-b-4 border-emerald-600">{date}</span>
              </h2>
              <Slider {...settings}>
              {animes.map((anime, index) => (
                <div className="aspect-ratio-box" >
                  <div key={index} className="relative">
                  <Link to={`/animes/${anime.slug}`}>
                    <div className="anime-cover">
                      <img
                        className="px-1 object-cover custom-height mb-1"
                        src={anime.coverImage} alt={anime.title} />
                      <div className="overlay"></div>
                      <button className="play-button">
                        <MdPlayCircleFilled className="text-white text-4xl" />
                      </button>
                    </div>
                    </Link>
                  </div>
                  <h3 className="text-center text-white font-bold mt-2">{truncateTitle(anime.title)}</h3>
                </div>
              ))}
          </Slider>
            </div>
        ))
        }
      </div >
    </div >
  )
}
