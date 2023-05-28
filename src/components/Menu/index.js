import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { BsDiscord, BsAndroid2 } from 'react-icons/bs';
import { IoIosNotifications } from 'react-icons/io';
import { Link } from 'react-router-dom';



export default function Menu() {

  const [isMobile, setIsMobile] = useState(false);
  const [islogin, setIsLogin] = useState(false)
  const [searchSize, setSearchSize] = useState(64);

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

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const siteTitle = 'Gon.TV'

  return (
    <>
      <div className="relative">
        {isOpen && (
          <div className="fixed inset-0 bg-gray-900 opacity-80 z-50"></div>
        )}

        <button
          className="fixed top-3 left-1 bg-gray-900 text-white p-1 rounded-full z-50 md:fixed md:top-3 md:left-8 md:bg-transparent md:text-white md:p-0 md:w-12 md:h-12 md:flex md:justify-center md:items-center"
          onClick={toggleMenu}
        >
          <FiMenu size={34} />
        </button>

        <div className="flex items-center  bg-gray-900 p-4">
          <div className="flex justify-center flex-grow">
            <div className="flex items-center ms-7 bg-gray-800 rounded-lg justify-center ">
              <input
                type="search"
                placeholder="Pesquisar"
                className={`bg-transparent text-white px-1 py-1 rounded-lg focus:outline-none w-${searchSize}`}
              /><a className='text-white border bg-gray-900 rounded-md w-12 text-center mx-3' href='#'>Filtro</a>
            </div>
            {!isMobile && (
              <div className="flex items-center ml-3 ">
                <BsDiscord className="text-white mx-3" size={34} />
                <BsAndroid2 className="text-white" size={34} />
              </div>
            )}
          </div>
          {!isMobile && (
            <IoIosNotifications className='text-white bg-gray-900 border rounded-full' size={34} />
          )}
          {!isMobile && (
            <button className="bg-emerald-700 hover:bg-emerald-500 text-white px-6 py-2 ml-2 rounded-lg">
              Login
            </button>
          )}
        </div>


        {isOpen && (
          <div className="fixed top-0 left-0 bg-gray-900 w-60 h-full z-50">
            <nav className="flex flex-col justify-between items-center bg-gray-900 p-10">
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
                  <a href="#" className="text-white hover:text-emerald-500">
                    Animes Dublados
                  </a>
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
              {!islogin && (
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
