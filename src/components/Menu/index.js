import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { IoLogInOutline } from "react-icons/io5";
import { AiOutlineHome } from 'react-icons/ai';
import { BsPlayBtn, BsDisplay, BsShuffle } from 'react-icons/bs';
import { RiCalendarEventLine } from 'react-icons/ri';
import { LuDices } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import Search from "components/Search";
import logo from "assets/logo.png";
import { useNavigate } from "react-router-dom";
import Hamburger from 'hamburger-react'

export default function Menu() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [searchSize, setSearchSize] = useState("64");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);



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
    setIsMenuOpen(!isMenuOpen);
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

      <nav class="flex bg-black-light flex-grow items-center h-20">
        <div className="flex justify-end flex-grow ">
          {!isOpen && !isMobile && (
            <Link to="/">
              <div className="relative top-auto md:py-3 md:left-10 left-36 z-50 flex items-center">
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
          className="fixed left-4  text-white p-1 z-50  md:fixed md:top-4 md:left-2 md:bg-transparent md:text-white md:p-0 md:w-12 md:h-12 md:flex md:justify-center md:items-center"
          onClick={toggleMenu}
        >
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </button>


        <div className="flex flex-auto ml-10 items-center">
          {isMobile ? (
            <>
              <Link to="/">
                <div className="relative  my-3 mx-1 ms-20   z-50 flex items-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-auto md:w-6 md:h-auto mx-auto"
                  />
                  <span className="text-emerald-400 text-xl font-bold ml-2 items-center">{siteTitle}</span>
                </div>
              </Link>

              <button
                className="text-white ms-20 md:p-0 md:w-10 md:h-10 flex mx-auto items-center"
                onClick={handleSearchIconClick}
              >
                <FiSearch size={24} />
              </button>

            </>
          ) : (
            ""
          )}

        </div>

        {!isMobile && (
          <>
            <div className="flex items-center ml-9">
              <button
                className="text-white  p-1 md:p-0 md:w-10 md:h-10 flex  items-center"
                onClick={handleSearchIconClick}
              >
                <FiSearch className="hover:text-emerald-400" size={26} />
              </button>
              <Link to="/calendar">
                <RiCalendarEventLine className="text-white hover:text-emerald-400 ml-2" size={26} />
              </Link>
            </div>
            <button
              className="text-white hover:text-emerald-400 px-4 py-2 mx-auto rounded-lg flex items-center"
              onClick={() => navigate(`/animes/random`)}
            >
              <LuDices className="" size={26} />
            </button>
            <Link to="/login">
              <button className="hover:text-emerald-500 text-white px-1 py-2 mx-2 rounded-lg flex items-center">
                <IoLogInOutline className="mr-3" size={26} />
                <span className="text-center mr-5">Login</span>
              </button>
            </Link>
          </>
        )}


        {isOpen && (
          <div
            className="fixed top-0 bottom-0 left-0 right-0 z-50 "
            onClick={toggleMenu}
          >
            <div className="absolute top-16 left-2 2xl:left-7 h-full z-50">
              <nav className={`flex flex-col justify-between items-center shadow-md border-x shadow-emerald-400 border-gray-700 rounded-xl bg-zinc-900 w-60 h-auto ${isMenuOpen ? 'open' : ''} `} >
                <div className="flex justify-between w-full ">
                </div>
                <ul className="space-y-5 p-9 ">
                  <li>
                    <AiOutlineHome className="inline-block mr-2  text-white " size={25} />
                    <Link
                      to="/"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/" ? "border-b-2 border-b-emerald-500" : ""
                        }`}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <BsPlayBtn className="inline-block mr-2  text-white" size={25} />
                    <Link
                      to="/animes"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/animes" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Animes
                    </Link>
                  </li>

                  <li>
                    <BsPlayBtn className="inline-block mr-2 text-white" size={25} />
                    <Link
                      to="/animesDublados"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/animesDublados" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Animes Dublados
                    </Link>
                  </li>
                  <li>
                    <BsPlayBtn className="inline-block mr-2 text-white" size={25} />
                    <Link
                      to="/filmes"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/filmes" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Filmes
                    </Link>
                  </li>
                  <li>
                    <BsDisplay className="inline-block mr-2 text-white" size={25} />
                    <Link
                      to="/tvAnimes"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/tvAnimes" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      TV Animes
                    </Link>
                  </li>
                  <li>

                    <RiCalendarEventLine className="inline-block mr-2 text-white" size={25} />
                    <Link
                      to="/calendar"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/calendar" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Calendário
                    </Link>
                  </li>
                  <li>

                    <BsShuffle className="inline-block mr-2 text-white" size={25} />
                    <Link
                      to="/generos"
                      className={`text-white hover:text-emerald-500 ${location.pathname === "/generos" ? "border-b-2 border-b-emerald-500" : ""
                        }`}
                    >
                      Gêneros
                    </Link>
                  </li>
                  {!isLogin && (
                    <>
                      <li>
                        <button
                          className="text-white hover:text-emerald-400 py-2  rounded-lg flex items-center"
                          onClick={() => navigate(`/animes/random`)}
                        >
                          <LuDices className=" mr-2" size={20} />
                          <span className="text-center ms-1">Random</span>
                        </button>
                      </li>

                      <div className="py-2">
                        <Link to="/login">
                          <button className="border hover:bg-emerald-500 text-white px-7 py-3 rounded-lg">
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
            <div className="absolute inset-0 bg-black" onClick={handleSearchModalClose}></div>
            <div className="absolute top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black-dark rounded-lg p-4"

            >
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
