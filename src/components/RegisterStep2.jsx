import React from "react";

function RegisterStep2({ formData, setFormData, submit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo pertenece a Address
    if (['street','StNumber','apt','cp','city','state','country'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        Address: { ...prev.Address, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
        <div className="relative w-2/3 aspect-square bg-[color:var(--primary)] rounded-full flex items-center justify-center ">
            <div  className="bg-[color:var(--secondary)] rounded-2xl border text-[color:var(--text)] border-[color:var(--border)] drop-shadow-xl hover:drop-shadow-2xl p-8 w-2/3">
                <h3 className="fw-bold text-center mb-4">Datos de tu empresa</h3>
                <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <div className="flex flex-col gap-4 ">
                        <div className="flex gap-2 ">
                            <input
                                name="legalName"
                                type="text"
                                value={formData.legalName}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                required
                                placeholder="Nombre Fiscal"
                            />
                            <input
                                name="comName"
                                type="text"
                                value={formData.comName}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="Nombre comercial"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="vatNumber"
                                type="text"
                                value={formData.vatNumber}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="CIF"
                                required
                            />
                            <input
                            name="emailCompany"
                            type="email"
                            value={formData.emailCompany}
                            onChange={handleChange}
                            className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                            placeholder="Email" />
                        </div>
                        <div className="flex gap-2 ">
                            <input
                                name="web"
                                value={formData.web}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                type="url"
                                placeholder="Web" />
                        </div>
                        <hr className="border-primary"/>
                        <div className="flex gap-2">
                            <input
                                name="street"
                                type="text"
                                value={formData.Address.street}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="Calle"
                                required />
                            <input
                                name="StNumber"
                                value={formData.Address.StNumber}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                type="text"
                                placeholder="Portal"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="apt"
                                type="text"
                                value={formData.Address.apt}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="Piso"
                            />
                            <input
                                name="cp"
                                type="text"
                                value={formData.Address.cp}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="CP"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="city"
                                type="text"
                                value={formData.Address.city}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="Ciudad"
                                required
                            />
                            <input
                                name="state"
                                type="text"
                                value={formData.Address.state}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="Provincia"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="country"
                                type="text"
                                value={formData.Address.country}
                                onChange={handleChange}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                placeholder="País"
                                required
                            />
                        </div>
                        <div className="text-end col-12">
                            <button
                                className="bg-[color:var(--primary)] text-white drop-shadow-2xl rounded-lg px-6 py-2 hover:bg-[color:var(--primary-hover)] transition"
                                type="submit"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default RegisterStep2;

