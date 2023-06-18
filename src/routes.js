import Home from "pages/Home";
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
import SearchGenero from "pages/SearchGenero";
import TVAnimes from "pages/TVAnimes";
import LoginPage from "pages/LoginPage";
import NotFoundPage from "pages/NotFoundPage";
import Layout from "Layout";
import Register from "pages/Register";
import MeuPerfil from "pages/Profile/MeuPerfil";
import MinhaConta from "pages/Profile/MinhaConta";
import DownloadEpisodio from "pages/DownloadEpisodio";


function AppRoutes() {

  return (
    <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/animes/" element={<Layout><Animes /></Layout>} />
          <Route path="/lancamentos/*" element={<Layout><AnimesLancamentos /></Layout>} />
          <Route path="/tvAnimes/*" element={<Layout><TVAnimes /></Layout>} />
          <Route path="/animesDublados" element={<Layout><AnimesDub /></Layout>} />
          <Route path="/filmes/" element={<Layout><Filmes /></Layout>} />
          <Route path="/animes/:slug/*" element={<Layout><SingleAnimePage /></Layout>} />
          <Route path="/animes/:slug/:titleSlug/:languageEpisode/*" element={<Layout><SinglePlayPage /></Layout>} />
          <Route path="/animes/:slug/:titleSlug/:languageEpisode/:download/*" element={<Layout><DownloadEpisodio /></Layout>} />
          <Route path="/search/" element={<Layout><SearchAnime /></Layout>} />
          <Route path="/search/:letter" element={<Layout><SearchAnime /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/az-list/:letter" element={<Layout><AzListPage /></Layout>} />
          <Route path="/search-genero/:genero" element={<Layout><SearchGenero /></Layout>} />
          <Route path="/filtro" element={<Layout><FiltroPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/profile/meuperfil/*" element={<Layout><MeuPerfil /></Layout>} />
          <Route path="/profile/minhaconta/*" element={<Layout><MinhaConta /></Layout>} />

          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;
