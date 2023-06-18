import Calendar from 'components/Calendar';
import animes from 'json/animes.json';
import { Helmet } from 'react-helmet';


export default function CalendarPage() {

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
      <div className="calendar-page">
        <Calendar animesByDate={animesByDate} />
      </div>
    </>

  )
}
