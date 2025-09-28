import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';
import { pdf } from "@react-pdf/renderer";
import CashflowReportPDF from "./CashflowReportPDF";

function IncomesReport(){

    const { t } = useTranslation();

    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    useEffect(() => {
        if(!startDate || !endDate) return;
        
        axios.get("/reports/cash-flow/income", {
            params: {
                initDate: startDate,
                endDate: endDate
            }
        })
        .then((response) => {
            setReport(response.data);
            console.log(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error(error.response?.data?.message || "Error");
            setLoading(false);
        });
    }, [startDate, endDate, loading]);

    const handleDateSelection = (e) => {
        if(e.target.name === "startDate"){
            setStartDate(e.target.value);
        }
        if(e.target.name === "endDate"){
            setEndDate(e.target.value);
        }
        if(startDate && endDate){
            setLoading(true);
        }
    };

    const handlePrint = async () => {
        const blob = await pdf(
            <CashflowReportPDF
            t={t}
            title={t('reports.report_incomes')}
            startDate={startDate}
            endDate={endDate}
            report={report}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url);
        newWindow.onload = () => {
            newWindow.print();
        };
    }

    const handleDateRange = (e) => {
        const today = new Date();
        let start, end;

        if (e.target.name === "month") {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }

        if (e.target.name === "quarter") {
            const quarter = Math.floor(today.getMonth() / 3); // 0,1,2,3
            start = new Date(today.getFullYear(), quarter * 3, 1);
            end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        }

        if (e.target.name === "year") {
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
        }

        const formatDate = (d) => d.toISOString().slice(0, 10);

        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
        setLoading(true);
    };

    return(
       <div className="flex w-full flex-col items-center gap-5 py-10">
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold mb-2 w-1/2">{t('reports.report_incomes')}</h4>
                    <button
                        className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={() => handlePrint()}
                    >
                        {t('button.print')}
                    </button>
                </div>
                <div className="flex justify-center items-center mb-4 gap-6">
                    <div>
                        <label className="mr-2">{t('reports.date_from')}:</label>
                        <input 
                            type="date"
                            name="startDate"
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            value={startDate}
                            placeholder={t('reports.date_from')}
                            onChange={handleDateSelection}
                            required    
                            />
                    </div>
                    <div>
                        <label className="mr-2">{t('reports.date_to')}:</label>
                        <input 
                            type="date"
                            name="endDate"
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            value={endDate}
                            placeholder={t('reports.date_to')}
                            onChange={handleDateSelection}
                            required    
                            />
                    </div>
                </div>
                <div className="flex justify-center items-center mb-4 gap-2">
                    <button
                        name="month"
                        className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={handleDateRange}
                    >
                        {t('reports.month')}
                    </button>
                    <button
                        name="quarter"
                        className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={handleDateRange}
                    >
                        {t('reports.quarter')}
                    </button>
                    <button
                        name="year"
                        className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={handleDateRange}
                    >
                        {t('reports.year')}
                    </button>
                </div>
                {startDate && endDate && (
                    <>
                        <label className="modal-scroll flex justify-center w-full border border-[color:var(--primary)] rounded-full mb-2 p-2 font-semibold overflow-auto">
                            {t('reports.report_incomes')}: {t('reports.date_from')}{" "}
                            {new Date(startDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            })}{" "}
                            {t('reports.date_to')}{" "}
                            {new Date(endDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            })}
                        </label>

                        {loading ? (
                            <div className="text-center">{t('reports.loading')}</div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <label className="flex justify-end w-full font-semibold">
                                    {t('reports.total')}: {report.grandTotalNet?.toFixed(2)}€
                                </label>
                                <div className="flex">
                                    <label className="w-2/5 font-semibold">{t('reports.customer')}</label>
                                    <label className="w-1/5 font-semibold">{t('reports.total_net')}</label>
                                    <label className="w-1/5 font-semibold">{t('reports.total_vat')}</label>
                                    <label className="w-1/5 font-semibold">{t('reports.total_withholding')}</label>
                                </div>{/* -> Header hasta aquí*/}
                                <div className="flex flex-col gap-2">
                                    {report.parties?.map((customer) => (
                                        <div key={customer.idCompany} className="w-full">
                                        <div className="flex w-full border border-[color:var(--primary)] bg-[color:var(--background)] rounded-full p-2 font-semibold">
                                            <span className="w-2/5">{customer.legalName}</span>
                                            <span className="w-1/5 text-right">{customer.totalNet?.toFixed(2)}€</span>
                                            <span className="w-1/5 text-right">{customer.totalVat?.toFixed(2)}€</span>
                                            <span className="w-1/5 text-right">{customer.totalWithholding?.toFixed(2)}€</span>
                                        </div>
                                        <div className="ml-4 flex flex-col gap-1 mt-2">
                                            {customer.invoices?.map((invoice, index) => (
                                            <div
                                                key={invoice.invoiceNumber}
                                                className={`flex w-full p-2 text-sm rounded-full shadow ${
                                                    index % 2 === 0 ? "bg-[color:var(--alt-even)]" : "bg-[color:var(--alt-uneven)]"
                                                    }`}
                                            >
                                                <span className="w-1/5">{invoice.invoiceNumber}</span>
                                                <span className="w-1/5">{new Date(invoice.docDate).toLocaleDateString("es-ES")}</span>
                                                <span className="w-1/5 text-right">{invoice.totalNet?.toFixed(2)}€</span>
                                                <span className="w-1/5 text-right">{invoice.totalVat?.toFixed(2)}€</span>
                                                <span className="w-1/5 text-right">{invoice.totalWithholding?.toFixed(2)}€</span>
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default IncomesReport;