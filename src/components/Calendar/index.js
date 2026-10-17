import Slider from 'react-slick';
import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardAnime from 'components/CardAnime';

export default function Calendarr({ animesByDate })  {





  /*
  // Função para buscar os animes do Dia
  const fetchAnimesDay = () => {
    fetch('https://animes.vision/api/v2/temporada-atual')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifica se os dados estão sendo recebidos corretamente

        if (data.success && data.data && data.data.posts) {
          // Pegue o dia da semana atual, por exemplo, "quarta-feira"
          const getCurrentDay = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
          }).toLowerCase();

          // Função para obter o número do dia com base em seu nome
          const getDayNumber = (dayName) => {
            const daysOfWeek = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];
            return daysOfWeek.indexOf(dayName) + 1 ; // Adiciona 1 para ajustar a indexação
          };


          // Filtra os animes com a propriedade launch_day igual ao dia atual
          const currentAnimes = data.data.posts
            .filter(anime => anime.category === 'Animes' && typeof anime.launch_day === 'number' && anime.launch_day === getDayNumber(getCurrentDay))
            .map(anime => ({
              id: anime.id,
              title: anime.title,
              imageUrl: anime.thumbnail,
              // outras propriedades do anime que você deseja exibir
            }));


          console.log(currentAnimes); // Verifica os animes populares

          setAnimesDay(currentAnimes);
          
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
    fetchAnimesDay();
  }, []);
   const currentAnimes = animesDay.slice(0, 15);
  */

 

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
          <span className="border-b-4 border-emerald-600 pb-1">Animes de Hoje</span>
        </h2>
          <Slider {...settings}>
            {animes.map((anime) => (
              <div className="px-1">
                <CardAnime anime={anime} />
              </div>
            ))}
          </Slider>
          </div>
        ))
      }
    </div>
    </div >

  )
}
  

  /*
  {isLoading ? (
    // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados
    <div className="flex justify-center">

    </div>
  ) : (
    <CardAnime anime={{
      title: anime.title,
      coverImage: anime.imageUrl,
    }} />
*/    
