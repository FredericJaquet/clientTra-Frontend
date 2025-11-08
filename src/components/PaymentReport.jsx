import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';

function PaymentReport(){

    const { t } = useTranslation();

    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get("reports/pending/outcome")
        .then(response => {
            setReport(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error(error.response?.data?.message || "Error");
            setLoading(false);
        });
    }, [reload]);

    const handlePaidChange = async (idDocument) => {
        try{
            await axios.get(`provider-invoices/toggle-paid-status/${idDocument}`);
        }catch(error){
            console.error(error.response?.data?.message || "Error");
        }
        setReload(!reload); 
    }

    return(
       <div className="flex w-full flex-col items-center gap-5 py-10">
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex items-center mb-2">
                    <h4 className="text-lg font-semibold mb-2 w-1/2">{t('reports.report_pending_payment')}</h4>
                </div>
                <hr className="border-[color:var(--primary)] mb-2" />
                {loading ? (
                    <div className="text-center">{t('reports.loading')}</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <label className="flex justify-end w-full font-semibold">
                            {t('reports.total')}: {report.grandTotal?.toFixed(2) || 0}€
                        </label>
                    <div className="flex flex-col gap-2">
                        {report.monthlyReports?.map((monthlyReport, index) => (
                        <div key={index} className="w-full">
                            <div className="flex w-full border border-[color:var(--primary)] bg-[color:var(--background)] rounded-full p-2 font-semibold">
                                <span className="w-1/3">{monthlyReport.deadline}</span>
                                <span className="w-1/3 text-right">{t('reports.total')}: {monthlyReport.monthlyTotal?.toFixed(2)}€</span>
                            </div>
                            <div className="ml-4 flex flex-col gap-1 mt-2">
                                {monthlyReport.invoices?.map((invoice, index) => (
                                <div
                                    key={invoice.idDocument}
                                    className={`flex w-full p-2 text-sm rounded-full shadow ${
                                    index % 2 === 0 ? "bg-[color:var(--alt-even)]" : "bg-[color:var(--alt-uneven)]"
                                    }`}
                                >
                                    <span className="w-2/5">{invoice.comName}</span>
                                    <span className="w-2/5">{invoice.docNumber}</span>
                                    <span className="w-1/5 text-right">{invoice.totalToPay?.toFixed(2)}€</span>
                                    <div className="w-1/5 flex justify-end gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 border border-[color:var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                            checked={invoice.status === "PAID"}
                                            onChange={() => handlePaidChange(invoice.idDocument)}
                                        />
                                        <label className="w-1/2">{t('reports.paid')}</label>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    </div>    
                </div>
                )}
            </div>
        </div>
    )
}

export default PaymentReport;