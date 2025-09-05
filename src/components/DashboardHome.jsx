import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

function DashboardHome() {

  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [cashingReport, setCashingReport] = useState([]);
  const [paymentReport, setPaymentReport] = useState([]);
  const [cashflowInReport, setCashflowInReport] = useState({});
  const [cashflowOutReport, setCashflowOutReport] = useState({});


  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "ROLE_USER";
  const year = new Date().getFullYear();
  const initDate = `${year}-01-01`; // 1 de enero del año en curso
  const endDate = `${year}-12-31`;

  //Get Users
  useEffect(() => {
    if (role === "ROLE_ADMIN") {
      axios.get("/users")
        .then(res => {
          setUsers(res.data);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
        });
    }
  }, [role]);

  //Get Pending Incomes
  useEffect(() => {
    if (role === "ROLE_ADMIN" || role ==="ROLE_ACCOUNTING") {
      axios.get("/reports/pending/income")
        .then(res => {
          setCashingReport(res.data);
        })
        .catch(err => {
          console.error("Error fetching Pending Incomes:", err);
        });
    }
  }, [role]);

  //Get Pending Outcomes
  useEffect(() => {
    if (role === "ROLE_ADMIN" || role ==="ROLE_ACCOUNTING") {
      axios.get("/reports/pending/outcome")
        .then(res => {
          setPaymentReport(res.data);
        })
        .catch(err => {
          console.error("Error fetching Pending Outcomes:", err);
        });
    }
  }, [role]);

  //Get cashflow Incomes
  useEffect(() => {
    if (role === "ROLE_ADMIN" || role ==="ROLE_ACCOUNTING") {
      axios.get(`/reports/cash-flow/income?initDate=${initDate}&endDate=${endDate}`)
        .then(res => {
          setCashflowInReport(res.data);
        })
        .catch(err => {
          console.error("Error fetching Cashflow Incomes:", err);
        });
    }
  }, [role]);

  //Get cashflow Outcomes
  useEffect(() => {
    if (role === "ROLE_ADMIN" || role ==="ROLE_ACCOUNTING") {
      axios.get(`/reports/cash-flow/outcome?initDate=${initDate}&endDate=${endDate}`)
        .then(res => {
          setCashflowOutReport(res.data);
        })
        .catch(err => {
          console.error("Error fetching Cashflow Outcomes:", err);
        });
    }
  }, [role]);

  const benefit = ((cashflowInReport?.grandTotalNet ?? 0) - (cashflowOutReport?.grandTotalNet ?? 0)).toFixed(2) + "€";

  return (
    <div
      id="dashboard"
      className="flex w-full overflow-auto flex-col flex-grow items-center gap-5 p-3"
    >
      {(role === "ROLE_ADMIN" || role == "ROLEACCOUNTING") && cashflowInReport && cashflowOutReport && (
      <Card
        title="Finanzas"
        headers={[t('dashboard.incomes'), t('dashboard.outcomes'), t('dashboard.benefit')]}
        rows={[[(cashflowInReport?.grandTotalNet ?? 0).toFixed(2)+"€", (cashflowOutReport?.grandTotalNet ?? 0).toFixed(2)+"€", benefit]]}
      />
      )}
      {role === "ROLE_ADMIN" && (
        <Card
          title={t('dashboard.users')}
          headers={[t('dashboard.name'), t('dashboard.email')]}
          rows={users.map(u => [u.userName, u.email])}
        />
      )}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && cashingReport?.monthlyReports && (
        <Card
          title={t('dashboard.cashing')}
          granTotal={cashingReport.grandTotal.toFixed(2)}
          headers={[t('dashboard.month'), t('dashboard.total')]}
          rows={cashingReport.monthlyReports.map(r => [r.deadline.toString(), `${r.monthlyTotal.toFixed(2)}€`])}
        />
      )}
      {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && paymentReport?.monthlyReports && (
        <Card
          title={t('dashboard.payment')}
          granTotal={paymentReport.grandTotal.toFixed(2)}
          headers={[t('dashboard.month'), t('dashboard.total')]}
          rows={paymentReport.monthlyReports.map(r => [r.deadline.toString(), `${r.monthlyTotal.toFixed(2)}€`])}
        />
      )}
      <Card
        title={t('dashboard.pending_orders')}
        headers={[t('dashboard.number'), t('dashboard.date')]}
        rows={[
          ["001", "01/01/2025"],
          ["002", "02/01/2025"],
        ]}
      />
      <Card
        title={t('dashboard.pending_quotes')}
        headers={[t('dashboard.number'), t('dashboard.date')]}
        rows={[
          ["P-001", "01/01/2025"],
          ["P-002", "02/01/2025"],
        ]}
      />
    </div>
  );
}

export default DashboardHome;
