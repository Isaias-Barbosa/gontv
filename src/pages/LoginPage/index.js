import React, { useState, useEffect } from 'react';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica de autenticação aqui
  };

  
    return (
        <div class="login-page">
            <div className="flex justify-center items-center h-screen">
                <form onSubmit={handleSubmit} className="w-auto sm:w-96 md:w-80 lg:w-1/3 xl:w-96 2xl:w-96 p-10 bg-white rounded-lg shadow-lg ">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold" htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold" htmlFor="password">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border border-gray-300 rounded"
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

                </form>
            </div>
        </div>
    );
};