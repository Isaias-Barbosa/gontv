import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'Auth/auth';
import { Navigate } from 'react-router-dom';

export default function MinhaConta() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [editingUser, setEditingUser] = useState({});
    const [successMessage, setSuccessMessage] = useState('');


    const getFunctionName = (nivelId) => {
        if (nivelId === 1) {
            return "Administrador";
        } else if (nivelId === 2) {
            return "Usuario";
        } else if (nivelId === 3) {
            return "Staff";
        } else {
            return "Função Desconhecida";
        }
    };

    const getFunctionColor = (nivelId) => {
        if (nivelId === 1) {
            return "red"; // Administrador - cor vermelha
        } else if (nivelId === 2) {
            return "blue"; // Usuario - cor azul
        } else if (nivelId === 3) {
            return "lime"; // Staff - cor verde (lime)
        } else {
            return "black"; // Outros níveis de usuário - cor preta (padrão)
        }
    };


    const handleEditProfile = () => {
        // Lógica para abrir o modal de edição do perfil
        setEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            // Lógica para salvar as alterações no perfil do usuário
            // Aqui você pode fazer uma requisição ao backend usando axios para atualizar as informações no banco de dados

            // Exemplo de requisição POST usando axios
            const response = await axios.post('/api/updateUser', editingUser);

            // Exibir mensagem de sucesso
            setSuccessMessage(`Usuário: ${user.nome} editado com sucesso!`);

            // Limpar o formulário de edição
            setEditingUser({});

            // Fechar o modal após 3 segundos
            setTimeout(() => {
                setEditing(false);
            }, 3000);

            // Atualizar a página
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="bg-black-light ">
            <div className="container mx-auto py-2 h-screen">
                <h1 className="text-white text-3xl font-bold mb-4 text-center my-5">Minha Conta</h1>
                <div className="my-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none"
                        onClick={handleEditProfile}
                    >
                        Editar Perfil
                    </button>
                </div>
                <div className="bg-slate-300 p-4 rounded-lg shadow-md flex justify-center flex-col">

                    {user && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">Olá, <span className="text-blue-500">{user.nome}</span></h2>
                            <div className="mb-4">
                                <h3 className="font-medium">Aqui estão as suas informações:</h3>
                                <div className="mt-2">
                                    <p>
                                        <span className="font-semibold">Nome:</span> {user.nome}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Apelido:</span> {user.nome_perfil}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email:</span> {user.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Sexo:</span> {user.sexo}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Nível de usuário: </span>
                                        <span style={{ color: getFunctionColor(user.nivel_id) }}>{getFunctionName(user.nivel_id)}</span>
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Modal de Edição do Perfil */}
                {editing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3>Formulário de Edição do Perfil</h3>
                            {/* Renderize o formulário de edição aqui */}
                            <form>
                                <label htmlFor="nome">Nome:</label>
                                <input type="text" id="nome" name="nome" value={editingUser.nome || ''} onChange={handleInputChange} />

                                <label htmlFor="nome_perfil">Apelido:</label>
                                <input
                                    type="text"
                                    id="nome_perfil"
                                    name="nome_perfil"
                                    value={editingUser.nome_perfil || ''}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={editingUser.email || ''} onChange={handleInputChange} />

                                <label htmlFor="senha">Senha:</label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={editingUser.senha || ''}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="sexo">Sexo:</label>
                                <select id="sexo" name="sexo" value={editingUser.sexo || ''} onChange={handleInputChange}>
                                    <option value="">Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>

                                <button type="button" onClick={handleSaveChanges}>
                                    Salvar Alterações
                                </button>
                            </form>

                            {/* Exibir mensagem de sucesso */}
                            {successMessage && (
                                <div className="text-green-500 mt-2">
                                    {successMessage}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
