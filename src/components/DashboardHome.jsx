import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

function DashboardHome() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [cashingReport, setCashingReport] = useState(null);
  const [paymentReport, setPaymentReport] = useState(null);
  const [cashflowInReport, setCashflowInReport] = useState(null);
  const [cashflowOutReport, setCashflowOutReport] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingQuotes, setPendingQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "ROLE_USER";
  const year = new Date().getFullYear();
  const initDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const promises = [];

        if (role === "ROLE_ADMIN") {
          promises.push(
            axios.get("/users").then(res => setUsers(res.data))
          );
          
        }

        if (role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") {
          promises.push(
            axios.get(`/reports/cash-flow/income?initDate=${initDate}&endDate=${endDate}`)
              .then(res => setCashflowInReport(res.data))
          );
          promises.push(
            axios.get(`/reports/cash-flow/outcome?initDate=${initDate}&endDate=${endDate}`)
              .then(res => setCashflowOutReport(res.data))
          );
          promises.push(
            axios.get("/reports/pending/income").then(res => setCashingReport(res.data))
          );
          promises.push(
            axios.get("/reports/pending/outcome").then(res => setPaymentReport(res.data))
          );
        }

        promises.push(axios.get("/orders/pending").then(res => setPendingOrders(res.data)));
        promises.push(
          axios.get("/quotes/by-status", { params: { status: "PENDING" } })
            .then(res => setPendingQuotes(res.data))
        );

        await Promise.all(promises);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role, initDate, endDate]);

  const benefit = ((cashflowInReport?.grandTotalNet ?? 0) - (cashflowOutReport?.grandTotalNet ?? 0)).toFixed(2) + "€";

  return (
    <div id="dashboard" className="flex w-full overflow-auto flex-col flex-grow items-center gap-5 p-3">
      {/* Finanzas */}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
        <Card
          title={t('dashboard.finances')}
          headers={[t('dashboard.incomes'), t('dashboard.outcomes'), t('dashboard.benefit')]}
          rows={[[
            loading || !cashflowInReport ? t('dashboard.loading') : (cashflowInReport?.grandTotalNet ?? 0).toFixed(2) + "€",
            loading || !cashflowOutReport ? t('dashboard.loading') : (cashflowOutReport?.grandTotalNet ?? 0).toFixed(2) + "€",
            loading || !cashflowInReport || !cashflowOutReport ? t('dashboard.loading') : benefit
          ]]}
        />
      )}

      {/* Usuarios */}
      {role === "ROLE_ADMIN" && (
        <Card
          title={t('dashboard.users')}
          headers={[t('dashboard.name'), t('dashboard.email')]}
          rows={loading || !users.length ? [[t('dashboard.loading'), ""]] : users.map(u => [u.userName, u.email])}
        />
      )}

      {/* Cobros pendientes */}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
        <Card
          title={t('dashboard.cashing')}
          granTotal={loading || !cashingReport ? t('dashboard.loading') : cashingReport.grandTotal.toFixed(2)}
          headers={[t('dashboard.month'), t('dashboard.total')]}
          rows={loading || !cashingReport?.monthlyReports ? [[t('dashboard.loading'), ""]] :
            cashingReport.monthlyReports.map(r => [r.deadline.toString(), `${r.monthlyTotal.toFixed(2)}€`])
          }
        />
      )}

      {/* Pagos pendientes */}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
        <Card
          title={t('dashboard.payment')}
          granTotal={loading || !paymentReport ? t('dashboard.loading') : paymentReport.grandTotal.toFixed(2)}
          headers={[t('dashboard.month'), t('dashboard.total')]}
          rows={loading || !paymentReport?.monthlyReports ? [[t('dashboard.loading'), ""]] :
            paymentReport.monthlyReports.map(r => [r.deadline.toString(), `${r.monthlyTotal.toFixed(2)}€`])
          }
        />
      )}

      {/* Pedidos pendientes */}
      <Card
        title={t('dashboard.pending_orders')}
        headers={[t('dashboard.number'), t('dashboard.date')]}
        rows={loading || !pendingOrders.length ? [[t('dashboard.loading'), ""]] :
          pendingOrders.map(r => [r.descrip, r.dateOrder])
        }
      />

      {/* Presupuestos pendientes */}
      <Card
        title={t('dashboard.pending_quotes')}
        headers={[t('dashboard.number'), t('dashboard.date')]}
        rows={loading || !pendingQuotes.length ? [[t('dashboard.loading'), ""]] :
          pendingQuotes.map(r => [r.docNumber, r.docDate])
        }
      />
    </div>
  );
}

export default DashboardHome;
