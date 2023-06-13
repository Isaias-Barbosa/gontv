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
import LoginPage from "pages/LoginPage";
import Admin from "pages/Dashboard/Admin";
import { useAuth } from "Auth/auth";
import { RequireAuth } from "Auth/RequireAuth";
import NotFoundPage from "pages/NotFoundPage";
import Layout from "Layout";
import Register from "pages/Register";



function AppRoutes() {
  const { user } = useAuth();



  return (
    <>
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
        <Route path="/search/" element={<Layout><SearchAnime /></Layout>} />
        <Route path="/search/:letter" element={<Layout><SearchAnime /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/az-list/:letter" element={<Layout><AzListPage /></Layout>} />
        <Route path="/search-genero/:genero" element={<Layout><SearchGenero /></Layout>} />
        <Route path="/filtro" element={<Layout><FiltroPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        {user && user.isAdmin ? (
          <Route path="/dashboard/admin/*" element={<RequireAuth><Admin /></RequireAuth>} />
        ) : (
          <Route path="/dashboard/admin/*" element={<Layout><NotFoundPage /></Layout>} />
        )}
        <Route path="/404" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </>
  )
}

export default AppRoutes;
