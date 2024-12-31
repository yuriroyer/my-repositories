import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio";

export default function AppRoutes() { // Renomeie para evitar conflitos com "Routes" do React Router
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/repositorio/:repositorio" element={<Repositorio />} />
            </Routes>
        </BrowserRouter>
    );
}
