import React from "react";
import Card from "./Card";

function DashboardHome() {
  return (
    <div
      id="dashboard"
      className="flex w-full overflow-auto flex-col flex-grow items-center gap-5 p-3"
    >
      <Card
        title="Finanzas"
        headers={["Ingresos", "Gastos", "Beneficios"]}
        rows={[["0.00€", "0.00€", "0.00€"]]}
      />
      <Card
        title="Usuarios"
        headers={["Nombre", "Email"]}
        rows={[
          ["Admin1", "admin1@prueba.es"],
          ["User1", "user1@prueba.es"],
        ]}
      />
      <Card
        title="Cobros pendientes"
        headers={["Mes", "Total"]}
        rows={[
          ["Enero", "100€"],
          ["Febrero", "200€"],
        ]}
      />
      <Card
        title="Pagos pendientes"
        headers={["Mes", "Total"]}
        rows={[
          ["Enero", "50€"],
          ["Febrero", "75€"],
        ]}
      />
      <Card
        title="Pedidos pendientes"
        headers={["Número", "Fecha"]}
        rows={[
          ["001", "01/01/2025"],
          ["002", "02/01/2025"],
        ]}
      />
      <Card
        title="Presupuestos pendientes"
        headers={["Número", "Fecha"]}
        rows={[
          ["P-001", "01/01/2025"],
          ["P-002", "02/01/2025"],
        ]}
      />
    </div>
  );
}

export default DashboardHome;
