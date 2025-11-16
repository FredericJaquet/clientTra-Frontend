import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {

  useEffect(() => {
    // Siempre usa tema azul en páginas públicas
    document.documentElement.setAttribute("data-theme", "blue");
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
}
