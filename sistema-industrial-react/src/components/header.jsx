import "./header.css";

const menuItems = [
    { label: "Visão geral", icon: "▦" },
    { label: "Conferência", icon: "⌖" },
    { label: "Silos", icon: "▤" },
    { label: "Histórico", icon: "◷" },
];

function Header({ activePage = "Visão geral", onNavigate }) {
    return (
        <header className="header">
            <a
                className="header-logo"
                href="/"
                aria-label="SiloCheck - início"
                onClick={(event) => {
                    event.preventDefault();
                    onNavigate("Visão geral");
                }}
            >
                <span className="logo-icon">⌂</span>
                <span className="logo-text">
                    Silo<span>Check</span>
                </span>
            </a>

            <nav className="header-nav" aria-label="Navegação principal">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        className={`nav-link ${
                            activePage === item.label ? "active" : ""
                        }`}
                        aria-current={
                            activePage === item.label ? "page" : undefined
                        }
                        onClick={(event) => {
                            event.preventDefault();
                            onNavigate(item.label);
                        }}
                    >
                        <span className="nav-icon" aria-hidden="true">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="header-actions">
                <div className="system-status">
                    <span className="status-dot" />
                    <span>Sistema operacional</span>
                </div>

                {/* <button
                    className="notification-button"
                    type="button"
                    aria-label="Notificações"
                    title="Notificações"
                >
                    ♧<span className="notification-count">3</span>
                </button> */}

                {/* <button
                    className="user-profile"
                    type="button"
                    aria-label="Perfil do usuário"
                    title="Perfil do usuário"
                >
                    VH
                </button> */}
            </div>
        </header>
    );
}

export default Header;
