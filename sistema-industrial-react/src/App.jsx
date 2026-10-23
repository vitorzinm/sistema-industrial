import { useState } from "react";
import Header from "./components/header";
import Conferencia from "./pages/Conferencia";
import VisaoGeral from "./pages/visaoGeral";
import Silos from "./pages/Silos";
import Historico from "./pages/historico";
import "./App.css";

function App() {
    const [pagina, setPagina] = useState("Visão geral");

    return (
        <>
            <Header activePage={pagina} onNavigate={setPagina} />

            {pagina === "Visão geral" && <VisaoGeral onNavigate={setPagina} />}

            {pagina === "Conferência" && <Conferencia onNavigate={setPagina} />}

            {pagina === "Silos" && <Silos />}

            {pagina === "Histórico" && <Historico />}
        </>
    );
}

export default App;
