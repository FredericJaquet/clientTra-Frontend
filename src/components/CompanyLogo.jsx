import api from "../api/axios";
import { useEffect, useState } from "react";

function CompanyLogo({ logoPath }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (logoPath) {
      setPreview(`${api.defaults.baseURL.replace("/api", "")}/${logoPath}`);
    }
  }, [logoPath]);

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <img
          src={preview}
          alt="Company Logo"
          className="w-32 h-32 object-contain rounded-lg border"
        />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center border rounded-lg text-gray-400">
          No Logo
        </div>
      )}

      <label className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl cursor-pointer hover:bg-[color:var(--primary-hover)] transition">
        Cambiar logo
        <input
          type="file"
          name="logo"
          accept="image/*"
          className="hidden"
          onChange={(e) => console.log("Nuevo logo:", e.target.files[0])}
        />
      </label>
    </div>
  );
}

export default CompanyLogo;
