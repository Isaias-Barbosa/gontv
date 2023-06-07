import Home from "pages/Home";
import Menu from "./components/Menu";
import Rodape from "components/Rodape";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import SingleAnimePage from "pages/SingleAnimePage";
import Animes from "pages/Animes";
import SinglePlayPage from "pages/SinglePlayPage";
import AnimesDub from "pages/AnimesDub";
import SearchAnime from "pages/SearchAnime";
import AnimesLancamentos from "pages/AnimesLancamentos";
import Filmes from "pages/Filmes";
import CalendarPage from "pages/CalendarPage";
import AzListPage from "pages/AzListPage";
import FiltroPage from "pages/FiltroPage";



function AppRoutes() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Menu />
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/animes/" element={<Animes />} />
        <Route path="/lancamentos/*" element={<AnimesLancamentos />} />
        <Route path="/animesDublados" element={<AnimesDub />} />
        <Route path="/filmes/" element={<Filmes />} />
        <Route path="/animes/:slug/*" element={<SingleAnimePage />} />
        <Route path="/animes/:slug/:titleSlug/:languageEpisode/*" element={<SinglePlayPage />} />
        <Route path="/search/" element={<SearchAnime />} /> {/* Defina a rota para SearchAnime */}
        <Route path="/search/:letter"element={<SearchAnime />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/az-list/:letter" element={<AzListPage />} />
        <Route path="/filtro" element={<FiltroPage />} />
      </Routes>
    <Rodape />
  </BrowserRouter>
  

  )
}

export default AppRoutes;
