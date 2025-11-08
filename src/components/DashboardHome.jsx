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
            axios.get(`/reports/cash-flow/income?initDate=${initDate}&endDate=${endDate}&withOrders=false`)
              .then(res => setCashflowInReport(res.data))
          );
          promises.push(
            axios.get(`/reports/cash-flow/outcome?initDate=${initDate}&endDate=${endDate}&withOrders=false`)
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
      {/* Balance */}
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

      {/* Users */}
      {role === "ROLE_ADMIN" && (
        <Card
          title={t('dashboard.users')}
          headers={[t('dashboard.name'), t('dashboard.email')]}
          rows={
            loading
            ? [[t('dashboard.loading'), ""]]
            : users.length === 0
              ? [[t('dashboard.no_results'), ""]]
              : users.map(u => [u.userName, u.email])
        }
        />
      )}

      {/* Cashing */}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
        <Card
          title={t('dashboard.cashing')}
          granTotal={
            loading
              ? t('dashboard.loading')
              : !cashingReport
                ? t(0.00.toFixed(2))
                : cashingReport.grandTotal.toFixed(2)
          }
          headers={[t('dashboard.month'), t('dashboard.total')]}
          rows={
            loading
              ? [[t('dashboard.loading'), ""]]
              : !cashingReport || !cashingReport.monthlyReports?.length
                ? [[t('dashboard.no_results'), ""]]
                : cashingReport.monthlyReports.map(r => [
                    r.deadline.toString(),
                    `${r.monthlyTotal.toFixed(2)}€`
                  ])
          }
        />
      )}

      {/* Payments */}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
        <Card
          title={t('dashboard.payment')}
          granTotal={
            loading
              ? t('dashboard.loading')
              : !paymentReport
                ? t(0.00.toFixed(2))
                : paymentReport.grandTotal.toFixed(2)
          }
          headers={[t('dashboard.month'), t('dashboard.total')]}
          rows={
            loading
              ? [[t('dashboard.loading'), ""]]
              : !paymentReport || !paymentReport.monthlyReports?.length
                ? [[t('dashboard.no_results'), ""]]
                : paymentReport.monthlyReports.map(r => [
                    r.deadline.toString(),
                    `${r.monthlyTotal.toFixed(2)}€`
                  ])
          }
        />
      )}

      {/* Pending Orders */}
      <Card
        title={t('dashboard.pending_orders')}
        headers={[t('dashboard.number'), t('dashboard.date')]}
        rows={
          loading
            ? [[t('dashboard.loading'), ""]]
            : !pendingOrders || !pendingOrders.length
              ? [[t('dashboard.no_results'), ""]]
              : pendingOrders.map(r => [r.descrip, new Date(r.dateOrder).toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" })])
        }
      />


      {/* Pending Quotes */}
      <Card
        title={t('dashboard.pending_quotes')}
        headers={[t('dashboard.number'), t('dashboard.date')]}
        rows={
          loading
            ? [[t('dashboard.loading'), ""]]
            : !pendingQuotes || !pendingQuotes.length
              ? [[t('dashboard.no_results'), ""]]
              : pendingQuotes.map(r => [r.docNumber, new Date(r.docDate).toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" })])
        }
      />
    </div>
  );
}

export default DashboardHome;
