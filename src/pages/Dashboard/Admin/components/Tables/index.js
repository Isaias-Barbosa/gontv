import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tables = () => {
    const [users, setUsers] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState({
        nome: '',
        nome_perfil: '',
        email: '',
        senha: '',
        sexo: '',
        nivel_id: 1
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3006/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                // Atualize o estado de usuários para indicar que ocorreu um erro
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

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

    const openEditModal = (user) => {
        setSelectedUser(user);
        if (user) {
          setEditingUser(user);
        } else {
          setEditingUser({
            nome: '',
            nome_perfil: '',
            email: '',
            senha: '',
            sexo: '',
            nivel_id: user.nivel_id,
          });
        }
        setEditModalOpen(true);
      };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();

        try {
            // Realize a lógica de salvamento do usuário no backend aqui
            // Use o estado "editingUser" para obter as informações atualizadas do usuário

            await axios.put(`http://localhost:3006/api/users/${selectedUser.id}`, {
                ...editingUser,
                nivel_id: Number(editingUser.nivel_id), // Converter para número
            });


            // Atualize o estado de usuários ou execute outras ações necessárias após o salvamento bem-sucedido

            setUsers((prevUsers) => {
                const updatedUsers = prevUsers.map((user) => {
                    if (user.id === selectedUser.id) {
                        return {
                            ...user,
                            nome: editingUser.nome,
                            nome_perfil: editingUser.nome_perfil,
                            email: editingUser.email,
                            senha: editingUser.senha,
                            nivel_id: editingUser.nivel_id,
                        };
                    }
                    return user;
                });
                return updatedUsers;
            });

            closeEditModal();
            alert('Usuário atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            // Lide com o erro de salvamento, se necessário
        }
    };


    return (
        <div className="my-8 h-screen">
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b">Nome</th>
                        <th className="py-2 px-4 border-b">Apelido</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Função</th>
                        <th className="py-2 px-4 border-b">Sexo</th>
                        <th className="py-2 px-4 border-b">Editar</th>
                        <th className="py-2 px-4 border-b">Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b">{user.nome}</td>
                            <td className="py-2 px-4 border-b">{user.nome_perfil}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{getFunctionName(user.nivel_id)}</td>
                            <th className="py-2 px-4 border-b">{user.sexo}</th>
                            <td className="py-2 px-4 border-b">
                                <button className="text-blue-500 hover:text-blue-700" onClick={() => openEditModal(user)}>
                                    Editar
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button className="text-red-500 hover:text-red-700">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de Edição */}
            {editModalOpen && selectedUser && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-900 bg-opacity-50"
                    onClick={closeEditModal}
                >
                    <div className="bg-white p-8 h-2/1 w-2/3 rounded-lg shadow-lg" onClick={handleModalClick}>
                        <h2 className="text-xl mb-4">Editar Usuário</h2>
                        <form onSubmit={handleSaveUser}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="nome">
                                    Nome:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    type="text"
                                    id="nome"
                                    value={editingUser.nome}
                                    onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="nomePerfil">
                                    Nome do Perfil:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    type="text"
                                    id="nomePerfil"
                                    value={editingUser.nome_perfil}
                                    onChange={(e) => setEditingUser({ ...editingUser, nome_perfil: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    Email:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    type="email"
                                    id="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="senha">
                                    Senha:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    type="password"
                                    id="senha"
                                    value={editingUser.senha}
                                    onChange={(e) => setEditingUser({ ...editingUser, senha: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="funcao">
                                    Função:
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    id="funcao"
                                    value={editingUser.nivel_id}
                                    onChange={(e) => setEditingUser({ ...editingUser, nivel_id: e.target.value })}
                                >
                                    <option value={1}>Administrador</option>
                                    <option value={2}>Usuário</option>
                                    <option value={3}>Staff</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Tables;
