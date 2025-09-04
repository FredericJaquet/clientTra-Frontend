import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import logoBlue from "../assets/img/logo_blue_transparent500x150.png";
import logoRed from "../assets/img/logo_red_transparent500x150.png";
import { Link } from "react-router-dom";

function Sidebar() {


    const [theme, setTheme] = useState("red");

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme) {
        setTheme(currentTheme);
        }
    }, []);

    const logo = theme === "red" ? logoRed : logoBlue;

    const handleLogout = () => {
        // Borrar token y usuario del localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.documentElement.setAttribute("data-theme", "blue");
        document.documentElement.classList.remove("dark");
    };

    return (
        <div
            id="sidebar"
            className="w-56 h-screen bg-[color:var(--primary)] p-3 rounded-r-3xl shadow-[8px_0_25px_rgba(0,0,0,0.35)] overflow-y-auto "
        >
            <img
                className="flex-none mb-4 rounded-md w-auto"
                width={220}
                height={150}
                src={logo}
                alt="Logo"
            />

            {/* Menú */}
            <div className="sticky top-0 flex flex-col gap-2">
                <h6 className="text-lg font-semibold text-[color:var(--text-light)] mt-3">Menú</h6>
                <ul className="flex flex-col gap-1">
                    <li><Link to="/" onClick={handleLogout} className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block">Logout</Link></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">DashBoard</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">Mi cuenta</a></li>
                </ul>

                <h6 className="text-lg font-semibold text-[color:var(--text-light)] mt-4">Empresas</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">Usuarios</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">Mi Empresa</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">Clientes</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] pl-3 py-1 block" href="#">Proveedores</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">Crear</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Pedidos</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Factura Cliente</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Factura Proveedor</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Presupuesto</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Orden de pedido</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">Documentos</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Pedidos</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Factura Cliente</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Factura Proveedor</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Presupuesto</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Orden de Pedido</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">Informes</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Ingresos</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Gastos</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Cobros</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Pagos</a></li>
                </ul>

                <h6 className="text-lg mt-4 font-semibold text-[color:var(--text-light)]">Gráficos</h6>
                <ul className="flex flex-col gap-1">
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Ingresos</a></li>
                    <li><a className="text-[color:var(--text-light)] hover:text-[color:var(--text-light-hover)] hover:underline pl-3 py-1 block " href="#">Gastos</a></li>
                </ul>


                {/* Repetir el mismo patrón para Crear, Documentos, Informes, Gráficos */}
            </div>
        </div>
    );
}

export default Sidebar;
