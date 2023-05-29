import { Link } from 'react-router-dom'
import lastAddedAnimeData from 'json/lista.json'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function LastAddedAnimes() {

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    centerMode: false,
    centerPadding: '60px',
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
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
    
};

  return (
  <>
    <div className='py-10'>
    <h2 className="text-2xl text-white text-center font-bold mb-10">
    <span className="border-b-4 border-emerald-600 pb-1"> Últimos Animes Adicionados</span>
      </h2>
      <div className="mx-auto max-w-7xl">
    <Slider {...settings}>
      {lastAddedAnimeData.map((anime) => (
        <Link to={`/animes/${anime.id}`}>
          <div key={anime.id} className="flex flex-col items-center">
          <img src={anime.image} alt={anime.title} className="w-full px-3 h-auto rounded-lg" />
          <h3 className="text-lg text-white font-semibold">{anime.title}</h3>
        </div>
        </Link>
      ))}
       </Slider>
    </div>
    </div>

    </>
  )
}
