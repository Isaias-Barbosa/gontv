import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [nome_perfil, setNomePerfil] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sexo, setSexo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const handleNomeChange = (event) => {
    setNome(event.target.value);
  };

  const handleNomePerfilChange = (event) => {
    setNomePerfil(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSexChange = (event) => {
    setSexo(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();


    try {
      await axios.post('http://localhost:3006/api/register', {
        nome,
        nome_perfil,
        email,
        password,
        sexo
      });

      setSuccessMessage('Usuário registrado com sucesso! Você será redirecionado para a página de Login....');
      setTimeout(() => {
        setSuccessMessage('');
        window.location.reload();
      }, 3000);
      navigate('/login');
      // Redirecionar para a página de login ou exibir uma mensagem de sucesso
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      setError('Ocorreu um erro ao cadastrar usuário. Por favor, tente novamente.');
    }

    setNome('');
    setNomePerfil('');
    setEmail('');
    setPassword('');
    setSexo('');
  };


  return (
    <div className="login-page">
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-auto sm:w-96 md:w-80 lg:w-1/3 xl:w-96 2xl:w-96 p-10 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Usuário</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
          <div className="mb-6">
            <label htmlFor="nome" className="block mb-2 text-sm font-bold">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              className="w-full p-2 border border-gray-300 rounded"
              value={nome}
              onChange={handleNomeChange}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="nome" className="block mb-2 text-sm font-bold">
              Apelido:
            </label>
            <input
              type="text"
              id="nome_perfil"
              className="w-full p-2 border border-gray-300 rounded"
              value={nome_perfil}
              onChange={handleNomePerfilChange}
              required
            />
          </div>
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
              Senha:
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
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold">Sexo:</label>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="masculino"
                value="Masculino"
                checked={sexo === 'Masculino'}
                onChange={handleSexChange}
              />
              <label htmlFor="masculino" className="ml-2">
                Masculino
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="feminino"
                value="Feminino"
                checked={sexo === 'Feminino'}
                onChange={handleSexChange}
              />
              <label htmlFor="feminino" className="ml-2">
                Feminino
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="nao-dizer"
                value="Prefiro Não dizer"
                checked={sexo === 'Prefiro Não dizer'}
                onChange={handleSexChange}
              />
              <label htmlFor="nao-dizer" className="ml-2">
                Prefiro Não dizer
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cadastrar Usuário
          </button>
        </form>
      </div>
    </div>
  )
}
