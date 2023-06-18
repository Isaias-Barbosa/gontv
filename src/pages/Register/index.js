import { Helmet } from "react-helmet"

export default function Register() {

  const pageTitle = "Gon.TV - Cadastro de Usuário"


  return (

    <>
    <Helmet>
        <title>{pageTitle}</title>
    </Helmet>


    <div className="login-page">
      <div className="flex justify-center items-center h-screen">
        <form
          className="w-auto sm:w-96 md:w-80 lg:w-1/3 xl:w-96 2xl:w-96 p-10 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Usuário</h2>
          <div className="mb-6">
            <label htmlFor="nome" className="block mb-2 text-sm font-bold">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              className="w-full p-2 border border-gray-300 rounded"
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
    </>
  )
}
