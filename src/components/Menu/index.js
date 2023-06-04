import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { BsDiscord, BsAndroid2 } from 'react-icons/bs';
import { IoLogInOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Search from 'components/Search';
import logo from 'assets/logo.png';
import { FcCalendar } from "react-icons/fc";

export default function Menu() {

  const [isMobile, setIsMobile] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [searchSize, setSearchSize] = useState('64');
  const [isOpen, setIsOpen] = useState(false);

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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchSize(event.target.value.length > 0 ? 'full' : '64');
  };

  const siteTitle = 'Gon.tv'

  return (
    <>

      {isOpen && (
        <div className="fixed inset-0 bg-black-dark  opacity-80 z-50"></div>
      )}

      <button
        className="fixed py-6 left-4 text-white p-1 z-50  md:fixed md:top-4 md:left-2 md:bg-transparent md:text-white md:p-0 md:w-12 md:h-12 md:flex md:justify-center md:items-center"
        onClick={toggleMenu}
      >
        <FiMenu size={34} />
      </button>



      <div className="flex items-center bg-black-dark p-5">
        <div className="flex justify-center flex-grow">
          <Search handleSearchChange={handleSearchChange} />
          {!isMobile && (
            <div className="flex items-center ml-3 ">
              <Link to="/calendar">
              <FcCalendar className="text-green-500 ml-3" size={34} />
              </Link>
              <BsDiscord className="text-white mx-3" size={34} />
              <BsAndroid2 className="text-white" size={34} />           
            </div>
          )}
        </div>
        {!isMobile && (
          <button className="bg-emerald-700 hover:bg-emerald-500 text-white px-4 py-2 mx-2 rounded-lg flex items-center">
            <IoLogInOutline className="mr-2" size={20} />
            <span className="text-center">Login</span>
          </button>
        )}
      </div>




      {isOpen && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-50" onClick={toggleMenu}>
        <div className="fixed top-0 left-0 bg-black-light w-55 h-full z-50">
          <nav className="flex flex-col justify-between items-center bg-black-light  p-10">
            <div className="flex justify-between w-full">
              <div className="text-white font-bold text-xl mb-8">
                <Link to="/">
                  <div className="flex items-center px-3">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-10 h-auto md:w-12 md:h-12 "
                    />
                    <span className="text-emerald-400 text-xl ml-2">{siteTitle}</span>
                  </div>
                </Link>
              </div>
              <button
          className="text-white focus:outline-none flex items-center justify-center"
          onClick={toggleMenu}
        >
          <FiX className="w-7 h-7 md:w-8 md:h-8" />
        </button>
            </div>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-white hover:text-emerald-500 border-b-2 border-b-emerald-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/animes" className="text-white hover:text-emerald-500">
                  Animes
                </Link>
              </li>
              <li>
                <Link to="/animesDublados" className="text-white hover:text-emerald-500">
                  Animes Dublados
                </Link>
              </li>
              <li>
                <Link to="/filmes" className="text-white hover:text-emerald-500">
                  Filmes
                </Link>
              </li>
              <li>
                <a href="#" className="text-white hover:text-emerald-500">
                  Listona
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-emerald-500">
                  Calendário
                </a>
              </li>
            </ul>
            {!isLogin && (
              <button className="bg-emerald-700 hover:bg-emerald-500 text-white  px-7 py-3 rounded-lg">
                Login
              </button>
            )}
          </nav>
        </div>
        </div>
      )}

      {!isOpen && !isMobile && (
        <Link to="/">
          <div className="fixed top-3 md:py-3 md:left-10 ms-4 left-14 z-50 flex items-center">
            <img src={logo} alt="Logo" className="w-10 h-auto md:w-6 md:h-auto" />
            <span className="text-emerald-400 text-xl ml-2">{siteTitle}</span>
          </div>
        </Link>
      )}

    </>
  );
};
