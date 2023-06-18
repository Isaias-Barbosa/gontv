import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegisterClick = () => {

    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="flex justify-center items-center h-screen">
        <form
          className="w-auto sm:w-96 md:w-80 lg:w-1/3 xl:w-96 2xl:w-96 p-10 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-bold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-bold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Fazer Login
          </button>
          <div className="items-center pt-3">
          <p className="text-center text-md text-rose-400">Não tem Conta?</p>
          </div>
          <button
            type="button"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4 rounded"
            onClick={handleRegisterClick}
          >
            Cadastra-se
          </button>
        </form>
      </div>
    </div>
  );
}
  

export default LoginPage;
