import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { BsDiscord, BsAndroid2 } from 'react-icons/bs';
import { IoLogInOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Search from 'components/Search';

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

  const siteTitle = 'Gon.TV'

  return (
    <>
      <div className="relative">
        {isOpen && (
          <div className="fixed inset-0 bg-black-light  opacity-80 z-50"></div>
        )}

        <button
          className="fixed top-1 left-4 text-white p-1 z-50  md:fixed md:top-1 md:left-8 md:bg-transparent md:text-white md:p-0 md:w-12 md:h-12 md:flex md:justify-center md:items-center"
          onClick={toggleMenu}
        >
          <FiMenu size={34} />
        </button>

        <div className="flex items-center bg-black-light p-2">
          <div className="flex justify-center flex-grow">
            <Search handleSearchChange={handleSearchChange} />
            {!isMobile && (
              <div className="flex items-center ml-3 ">
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
          <div className="fixed top-0 left-0 bg-black-light w-55 h-full z-50">
            <nav className="flex flex-col justify-between items-center bg-black-light  p-10">
              <div className="flex justify-between w-full">
                <div className="text-white font-bold text-xl mb-8">{siteTitle}</div>
                <button
                  className="text-white focus:outline-none"
                  onClick={toggleMenu}
                >
                  <FiX className="w-7 h-10 mb-6" />
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
                  <a href="#" className="text-white hover:text-emerald-500">
                    Filmes Animes
                  </a>
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
        )}
      </div>

    </>
  );
};
