import React from "react";
import { useState } from "react";
import { useNavigate  } from "react-router-dom";
import api from "../api/axios";

function RegisterStep1({ formData, setFormData, nextStep }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleActualRegister = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.emailAdmin || !formData.password || !formData.repeatedPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (formData.password !== formData.repeatedPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    nextStep();
  };

  const submitDemoRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.emailAdmin || !formData.password || !formData.repeatedPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (formData.password !== formData.repeatedPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    e.preventDefault();
    try {
      await api.post("/registration/demo-data", {
        username: formData.username,
        password: formData.password,
        email: formData.emailAdmin
      });
            
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="relative w-2/3 aspect-square bg-[color:var(--primary)] rounded-full flex items-center justify-center">
        <div className="bg-[color:var(--secondary)] rounded-2xl border text-[color:var(--text)] border-[color:var(--border)] drop-shadow-xl hover:drop-shadow-2xl p-8 w-2/3">
          <h3 className="fw-bold text-center mb-4">Registro</h3>
          <p className="text-center mb-6 text-[color:var(--info)]">
            Registro Demo: puedes probar la aplicación sin crear empresa.<br/>
            Si más adelante eliges "Registrar mi Empresa", se perderán los datos de la demo.<br/><br/>
          </p>
          <form className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Usuario"
                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                required
              />
              <input
                type="text"
                name="emailAdmin"
                value={formData.emailAdmin}
                onChange={handleChange}
                placeholder="Email"
                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                required
              />
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                required
              />
              <input
                type="password"
                name="repeatedPassword"
                value={formData.repeatedPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                required
              />
            </div>

            {error && (
              <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={submitDemoRegister}
                className="bg-[color:var(--primary)] text-white drop-shadow-2xl rounded-lg px-6 py-2 hover:bg-[color:var(--primary-hover)] transition"
              >
                Registro con Demo
              </button>
              <button
                onClick={handleActualRegister}
                className="bg-[color:var(--primary)] text-white drop-shadow-2xl rounded-lg px-6 py-2 hover:bg-[color:var(--primary-hover)] transition"
              >
                Registrar mi Empresa
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterStep1;
