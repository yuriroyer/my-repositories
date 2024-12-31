
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Container, Owner, Loading, BackButton, IssuesList, PageActions } from "./style";
import api from "../../services/api";

export default function Repositorio() {
    const { repositorio } = useParams();

    const [repositorios, setRepositorios] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);





    useEffect(() => {
        async function load() {
            const nomeRepo = repositorio;

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'all',
                        per_page: 5
                    }
                })
            ]);

            setRepositorios(repositorioData.data);
            setIssues(issuesData.data);

            setLoading(false);

            console.log('Repositorio ==>', repositorioData.data);
            console.log('Issues ==>', issuesData.data);

        }

        load();
    }, [repositorio]);


    useEffect(() => {
        async function loadIssues() {
            const nomeRepo = repositorio;

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: 'all',
                    per_page: 5,
                    page
                }
            });

            setIssues(response.data);
        }

        loadIssues();
    }, [repositorio, page]);



    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1);
    }



    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        );
    } else {
        return (
            <Container>

                <BackButton to="/">
                    <FaArrowLeft color="#000" size={35} />
                </BackButton>

                <Owner>
                    <img
                        src={repositorios.owner.avatar_url}
                        alt={repositorios.owner.login}
                    />
                    <h1>{repositorios.name}</h1>
                    <p>{repositorios.description}</p>
                </Owner>


                <IssuesList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img src={issue.user.avatar_url} alt={issue.user.login} />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>

                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>{label.name}</span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssuesList>

                <PageActions>
                    <button
                        type="button"
                        onClick={() => handlePage('back')}
                        disabled={page < 2}
                    >
                        Anterior
                    </button>


                    <button
                        type="button"
                        onClick={() => handlePage('next')}
                    >
                        Próxima
                    </button>
                </PageActions>

            </Container>
        );
    }


}
