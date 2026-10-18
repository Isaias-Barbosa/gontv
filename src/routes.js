import Home from "pages/Home";
import { Route, Routes } from "react-router-dom";
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

import NotFoundPage from "pages/NotFoundPage";
import Layout from "Layout";

import MeuPerfil from "pages/Profile/MeuPerfil";
import MinhaConta from "pages/Profile/MinhaConta";
import DownloadEpisodio from "pages/DownloadEpisodio";
import GenerosPage from "pages/GenerosPage";
import TorrentPlayer from "pages/TorrentPlayer";
import AdminLayout from "pages/Admin/AdminLayout";
import AdminLogin from "pages/Admin/AdminLogin";
import UserManager from "pages/Admin/UserManager";
import AdminDashboard from "pages/Admin/AdminDashboard";
import AnimeManager from "pages/Admin/AnimeManager";
import AnimeForm from "pages/Admin/AnimeForm";
import EpisodeManager from "pages/Admin/EpisodeManager";
import EpisodeForm from "pages/Admin/EpisodeForm";
import { Navigate } from "react-router-dom";

function AppRoutes() {

  return (
    <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/animes/" element={<Layout><Animes /></Layout>} />
          <Route path="/torrent" element={<Layout><TorrentPlayer /></Layout>} />
          <Route path="/animesPage/" element={<Navigate to="/admin/animes/new" replace />} />
          <Route path="/animesEdit/" element={<Navigate to="/admin/animes" replace />} />
          <Route path="/lancamentos/*" element={<Layout><AnimesLancamentos /></Layout>} />
          <Route path="/tvAnimes/*" element={<Layout><TVAnimes /></Layout>} />
          <Route path="/animesDublados/*" element={<Layout><AnimesDub /></Layout>} />
          <Route path="/filmes/*" element={<Layout><Filmes /></Layout>} />
          <Route path="/animes/:slug/*" element={<Layout><SingleAnimePage /></Layout>} />
          <Route path="/animes/:slug/:titleSlug/:languageEpisode/*" element={<Layout><SinglePlayPage /></Layout>} />
          <Route path="/animes/:slug/:titleSlug/:languageEpisode/:download/*" element={<Layout><DownloadEpisodio /></Layout>} />
          <Route path="/search/" element={<Layout><SearchAnime /></Layout>} />
          <Route path="/search/:letter/*" element={<Layout><SearchAnime /></Layout>} />
          <Route path="/calendar/*" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/generos/*" element={<Layout><GenerosPage /></Layout>} />
          <Route path="/filtro/*" element={<Layout><FiltroPage /></Layout>} />
          <Route path="/az-list/:letter/*" element={<Layout><AzListPage /></Layout>} />
          <Route path="/search-genero/:genero/*" element={<Layout><SearchGenero /></Layout>} />
          <Route path="/filtro/*" element={<Layout><FiltroPage /></Layout>} />
          <Route path="/login/*" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register/*" element={<Navigate to="/admin/login" replace />} />
          <Route path="/profile/meuperfil/*" element={<Layout><MeuPerfil /></Layout>} />
          <Route path="/profile/minhaconta/*" element={<Layout><MinhaConta /></Layout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios" element={<UserManager />} />
            <Route path="animes" element={<AnimeManager />} />
            <Route path="animes/new" element={<AnimeForm />} />
            <Route path="animes/:id/edit" element={<AnimeForm />} />
            <Route path="animes/:animeId/episodes" element={<EpisodeManager />} />
            <Route path="animes/:animeId/episodes/new" element={<EpisodeForm />} />
            <Route path="animes/:animeId/episodes/:episodeId/edit" element={<EpisodeForm />} />
          </Route>

          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
    </>
  )
}

export default AppRoutes;
