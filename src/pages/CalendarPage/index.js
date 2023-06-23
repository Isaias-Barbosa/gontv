import { LinearProgress } from '@mui/material';
import Calendar from 'components/Calendar';
import animes from 'json/animes.json';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';


export default function CalendarPage() {

  const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Simulação de uma requisição assíncrona
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Tempo de simulação de carregamento (2 segundos)
    }, []);

  const pageTitle = "Gon.TV - Calendário de Animes"


  const organizeAnimesByDate = () => {
    const animesByDate = {};

    // Organize os animes por data
    animes.forEach((anime) => {
      const { date } = anime;

      if (!animesByDate[date]) {
        animesByDate[date] = [];
      }

      animesByDate[date].push(anime);
    });

    return animesByDate;
  };

  const animesByDate = organizeAnimesByDate();

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {isLoading ? (
                // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados   
                <div className="min-h-screen bg-black-dark flex justify-start flex-col">
                    <LinearProgress />
                </div>
            ) : (
      <div className="calendar-page">
        <Calendar animesByDate={animesByDate} />
      </div>
            )}
    </>

  )
}
