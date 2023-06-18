import { Helmet } from "react-helmet";

export default function MinhaConta() {

  const pageTitle = 'Gon.TV - MinhaConta'

  return (
    <>
    <Helmet>
        <title>{pageTitle}</title>
    </Helmet>

    <div className="bg-black-light ">
      <div className="container mx-auto py-2 h-screen">
        <h1 className="text-white text-3xl font-bold mb-4 text-center my-5">Minha Conta</h1>
        <div className="bg-slate-300 p-4 rounded-lg shadow-md flex justify-center flex-col">
          <h2 className="text-lg font-semibold mb-4">Olá, <span className="text-blue-500">Gon</span></h2>
          <div className="mb-4">
            <h3 className="font-medium">Aqui estão as suas informações:</h3>
            <div className="mt-2">
              <p>
                <span className="font-semibold">Nome:</span> Isaias Barbosa
              </p>
              <p>
                <span className="font-semibold">Apelido:</span> Gon
              </p>
              <p>
                <span className="font-semibold">Email:</span> isaiasbarbosa111@gmail.com
              </p>
              <p>
                <span className="font-semibold">Sexo:</span> Masculino
              </p>
              <p>
                <span className="font-semibold">Nível de usuário: </span>
                <span className="text-lg font-bold text-rose-500">Admnistrador</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}