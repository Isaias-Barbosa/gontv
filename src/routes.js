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



function AppRoutes() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Menu />
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/animes/" element={<Animes />} />
        <Route path="/AnimesLancamentos/*" element={<AnimesLancamentos />} />
        <Route path="/animesDublados" element={<AnimesDub />} />
        <Route path="/animes/:slug/*" element={<SingleAnimePage />} />
        <Route path="/animes/:slug/:titleSlug/:languageEpisode/*" element={<SinglePlayPage />} />
        <Route path="/search/" element={<SearchAnime />} /> {/* Defina a rota para SearchAnime */}
      </Routes>
    <Rodape />
  </BrowserRouter>
  

  )
}

export default AppRoutes;
