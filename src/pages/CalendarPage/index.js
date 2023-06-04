import Calendar from 'components/Calendar';
import animes from 'json/animes.json';


export default function CalendarPage() {

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
    <div className="calendar-page">
    <Calendar animesByDate={animesByDate} />
  </div>
    
  )
}
