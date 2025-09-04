import React from "react";
import { Link } from "react-router-dom";
import '../assets/css/App.css';

function Navbar() {
  return (
    <nav >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-start space-x-8">
        <Link to="/" className="text-[color:var(--primary)] font-bold hover:text-[color:var(--primary-hover)] hover:underline">Login</Link>
        <a href="#" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">Proyecto</a>
        <a href="#" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">Cómo funciona</a>
        <Link to="/Register" className="text-[color:var(--text)] hover:text-[color:var(--primary-hover)] hover:underline">Registro</Link>
      </div>
    </nav>
  );
}

export default Navbar;