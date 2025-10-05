import api from "../api/axios";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function CompanyLogo({ logoPath, onLogoChange }) {

  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "ROLE_USER";

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (logoPath) {
      setPreview(`${api.defaults.baseURL.replace("/api", "")}/${logoPath}`);
    }
  }, [logoPath]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview local antes de subir
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await api.post("/owner/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onLogoChange(res.data);
    } catch (err) {
      console.error("Error subiendo logo:", err);
    }
  };

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
      {role === "ROLE_ADMIN" && (
      <label className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-lg cursor-pointer hover:bg-[color:var(--primary-hover)] transition">
        {t("button.change_logo")}
        <input
          type="file"
          name="logo"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      )}
    </div>
  );
}

export default CompanyLogo;
