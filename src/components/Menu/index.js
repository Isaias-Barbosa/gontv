import React, { useState, useEffect } from "react";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { IoLogInOutline } from "react-icons/io5";
import { LuDices } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import Search from "components/Search";
import logo from "assets/logo.png";
import { FcCalendar } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [searchSize, setSearchSize] = useState("64");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const siteTitle = "Gon.tv";


  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 640);
      setIsLogin(windowWidth > 640);

      if (windowWidth < 768) {
        setSearchSize(28); // Tamanho no mobile
      } else if (windowWidth < 1024) {
        setSearchSize(44); // Tamanho no tablet
      } else {
        setSearchSize(64); // Tamanho nos demais tamanhos
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  const handleSearchChange = (event) => {
    setSearchSize(event.target.value.length > 0 ? "full" : "64");
  };

  const handleSearchIconClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const handleSearchInputKeyDown = (event) => {
    if (event.key === "Enter") {
      // Redirecionar para a página de resultados
      navigate(`/search?query=${encodeURIComponent(event.target.value)}`);

      // Limpar o campo de pesquisa
      event.target.value = "";

      // Fechar o modal de pesquisa
      setIsSearchModalOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black-dark  opacity-80 z-50 "></div>
      )}

      <nav class="flex
            bg-black-dark">

        <div className="flex flex-grow justify-center items-center bg-black-dark">
          {!isOpen && !isMobile && (
            <Link to="/">
              <div className="relative top-auto md:py-3 md:left-10 left-36 z-50 flex items-center ">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-10 h-auto md:w-6 md:h-auto"
                />
                <span className="text-emerald-400 text-xl font-bold ml-2">{siteTitle}</span>
              </div>
            </Link>
          )}
        </div>
        <button
          className="fixed py-5 left-4 top-1 text-white p-1 z-50  md:fixed md:top-4 md:left-2 md:bg-transparent md:text-white md:p-0 md:w-12 md:h-12 md:flex md:justify-center md:items-center"
          onClick={toggleMenu}
        >
          <FiMenu size={35} />
        </button>

        <div className="flex items-center bg-black-dark p-5">
          <div className="flex flex-grow justify-end">

            {isMobile ? (
              <>
                <Link to="/">
                  <div className="fixed top-1 my-2 right-32 md:py-3 md:left-10 ms-2 z-50 flex items-center">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-10 h-auto md:w-6 md:h-auto mx-auto"
                    />
                    <span className="text-emerald-400 text-xl font-bold ml-2">{siteTitle}</span>
                  </div>
                </Link>

                <button
                  className="text-white  p-2 md:p-0 md:w-10 md:h-10 flex  items-center"
                  onClick={handleSearchIconClick}
                >
                  <FiSearch size={24} />
                </button>

              </>
            ) : (
              <button
                className="text-white  p-2 md:p-0 md:w-10 md:h-10 flex  items-center"
                onClick={handleSearchIconClick}
              >
                <FiSearch size={24} />
              </button>
            )}

          </div>

          {!isMobile && (
            <>
              <div className="flex items-center ml-1 ">
                <Link to="/calendar">
                  <FcCalendar className="text-green-500 ml-3" size={34} />
                </Link>
              </div>
              <button
                className="text-white hover:text-emerald-400 px-4 py-2 mx-auto rounded-lg flex items-center"
                onClick={() => navigate(`/animes/random`)}
              >
                <LuDices className="mr-2" size={20} />
              </button>
              <Link to="/login">
                <button className="hover:text-emerald-500 text-white px-1 py-2 mx-2 rounded-lg flex items-center">
                  <IoLogInOutline className="mr-2" size={20} />
                  <span className="text-center">Login</span>
                </button>
              </Link>
            </>
          )}
        </div>

        {isOpen && (
          <div
            className="fixed top-0 bottom-0 left-0 right-0 z-50 "
            onClick={toggleMenu}
          >
            <div className="fixed top-0 left-0 bg-black-light w-55 h-full z-50">
              <nav className="flex flex-col justify-between items-center bg-black-light  p-10 transition-transform duration-500 ease-in-out transform translate-x-0">
                <button
                  className="text-white focus:outline-none flex items-center justify-center"
                  onClick={toggleMenu}
                >
                  <h1 className="outline outline-offset-2 outline-emerald-500 rounded-full p-1 ">
                    <span className="hover:text-emerald-400">Fechar Menu</span>
                  </h1>
                </button>
                <div className="flex justify-between w-full py-4">
                  <div className="text-white font-bold text-xl mb-8">
                    <Link to="/">
                      <div className="flex items-center px-3">
                        <img
                          src={logo}
                          alt="Logo"
                          className="w-10 h-auto md:w-12 md:h-12 "
                        />
                        <span className="text-emerald-400 font-bold text-xl ml-2">
                          {siteTitle}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/animes"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/animes" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Animes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/animesDublados"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/animesDublados" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Animes Dublados
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tvAnimes"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/tvAnimes" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      TV Animes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/filmes"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/filmes" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Filmes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/calendar"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/calendar" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Calendário
                    </Link>
                  </li>
                  {!isLogin && (
                    <>
                      <li>
                        <button
                          className="text-white hover:text-emerald-400 py-2 mx-2 rounded-lg flex items-center"
                          onClick={() => navigate(`/animes/random`)}
                        >
                          <LuDices className="mr-2" size={20} />
                          <span className="text-center">Random</span>
                        </button>
                      </li>

                      <div className="py-2">
                        <Link to="/login">
                          <button className="bg-emerald-700 hover:bg-emerald-500 text-white px-7 py-3 rounded-lg">
                            Login
                          </button>
                        </Link>
                      </div>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {isSearchModalOpen && (
          <div className="fixed inset-0 bg-black-dark opacity-90 z-50">
            <div className="absolute top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black-dark rounded-lg p-4" >
              <Search
                handleSearchChange={handleSearchChange} onKeyDown={handleSearchInputKeyDown} />
              <button
                className="absolute top-3 -right-4 text-white p-1 md:p-0 md:w-8 md:h-8 flex justify-center items-center"
                onClick={handleSearchModalClose}
              >
                <FiX size={30} />
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
