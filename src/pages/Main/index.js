import React, { useState, useCallback, useEffect } from "react";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Container, Form, SubmitButton, List, DeleteButtom } from "./styles";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Main() {
    // Estado para armazenar o nome do novo repositório
    const [newRepo, setNewRepo] = useState("");
    // Estado para armazenar a lista de repositórios, inicializado com o conteúdo do localStorage
    const [repositorios, setRepositorios] = useState(() => {
        const savedRepos = localStorage.getItem("repositorios");
        return savedRepos ? JSON.parse(savedRepos) : [];
    });
    // Estado para controlar o estado de carregamento
    const [loading, setLoading] = useState(false);
    // Estado para armazenar alertas de erro
    const [alert, setAlert] = useState(null);

    // Atualiza o localStorage sempre que a lista de repositórios mudar
    useEffect(() => {
        localStorage.setItem("repositorios", JSON.stringify(repositorios));
    }, [repositorios]);

    // Função para atualizar o valor do estado `newRepo` com o valor do input
    function handleinputChange(e) {
        setNewRepo(e.target.value); // Atualiza o estado conforme o usuário digita
        setAlert(null); // Remove qualquer alerta de erro ao digitar
    }

    // Função para deletar um repositório da lista
    const handleDelete = useCallback(
        (repo) => {
            const updatedRepos = repositorios.filter((r) => r.name !== repo); // Remove o repositório selecionado
            setRepositorios(updatedRepos); // Atualiza a lista de repositórios no estado
        },
        [repositorios]
    );

    // Função para enviar o formulário e adicionar um novo repositório
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault(); // Previne o comportamento padrão do formulário

            async function submit() {
                setAlert(null); // Remove mensagens de erro anteriores
                setLoading(true); // Ativa o estado de carregamento
                try {
                    // Verifica se o campo de input está vazio
                    if (newRepo === "") {
                        throw new Error("Você precisa indicar um repositório");
                    }

                    // Verifica se o repositório já existe
                    const hasRepo = repositorios.find((repo) => repo.name === newRepo);
                    if (hasRepo) {
                        throw new Error("Repositório duplicado");
                    }

                    // Faz uma requisição à API do GitHub para buscar informações do repositório
                    const response = await api.get(`/repos/${newRepo}`);

                    // Cria um objeto com o nome do repositório retornado pela API
                    const data = {
                        name: response.data.full_name,
                    };

                    // Adiciona o novo repositório à lista atual e limpa o campo de input
                    setRepositorios([...repositorios, data]);
                    setNewRepo(""); // Limpa o campo de texto
                } catch (error) {
                    setAlert(error.message); // Ativa o alerta de erro com a mensagem
                    console.error(error); // Mostra o erro no console, caso ocorra
                } finally {
                    setLoading(false); // Desativa o estado de carregamento
                }
            }

            submit(); // Chama a função assíncrona
        },
        [newRepo, repositorios]
    );

    return (
        <Container>
            {/* Cabeçalho com o título da aplicação */}
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            {/* Formulário para adicionar novos repositórios */}
            <Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Adicionar Repositório"
                    value={newRepo}
                    onChange={handleinputChange}
                />
                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            {/* Exibição de mensagens de erro */}
            {alert && <p style={{ color: "red" }}>{alert}</p>}

            {/* Lista de repositórios */}
            <List>
                {repositorios.map((repo) => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButtom onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButtom>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    );
}
