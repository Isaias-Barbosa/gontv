import Home from "pages/Home";
import Menu from "./components/Menu";
import Rodape from "components/Rodape";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import SingleAnimePage from "pages/SingleAnimePage";
import Animes from "pages/Animes";
import SinglePlayPage from "pages/SinglePlayPage";
import AnimesDub from "pages/AnimesDub";



function AppRoutes() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Menu />
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/animes/" element={<Animes />} />
        <Route path="/animesDublados" element={<AnimesDub />} />
        <Route path="/animes/:slug/*" element={<SingleAnimePage />} />
        <Route path="/animes/:slug/:titleSlug/:languageEpisode/*" element={<SinglePlayPage />} />
      </Routes>
    <Rodape />
  </BrowserRouter>
  

  )
}

export default AppRoutes;
