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
    const [withOrders, setWithOrders] = useState(false);


    useEffect(() => {
        if(!startDate || !endDate) return;
        
        axios.get("/reports/cash-flow/income", {
            params: {
                initDate: startDate,
                endDate: endDate,
                withOrders: withOrders
            }
        })
        .then((response) => {
            setReport(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error(error.response?.data?.message || "Error");
            setLoading(false);
        });
    }, [startDate, endDate, loading, withOrders]);

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
            console.log(start);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            console.log(end);
        }

        if (e.target.name === "quarter") {
            const quarter = Math.floor(today.getMonth() / 3); // 0,1,2,3
            start = new Date(today.getFullYear(), quarter * 3, 1);
            console.log(start);
            end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
            console.log(end);
        }

        if (e.target.name === "year") {
            start = new Date(today.getFullYear(), 0, 1);
            console.log(start);
            end = new Date(today.getFullYear(), 11, 31);
            console.log(end);
        }

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0"); // Mes 0-index
            const dd = String(date.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        };

        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
        setLoading(true);
    };

    const handleToggleWithOrders = () => {
        setWithOrders(!withOrders);
        setLoading(true);
    }

    return(
       <div className="flex w-full flex-col items-center gap-5 py-10">
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold mb-2 w-1/2">{t('reports.report_incomes')}</h4>
                    <label className="mr-2">{t('reports.with_orders')}:</label>
                    <button
                        onClick={handleToggleWithOrders}
                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                            withOrders ? "bg-gray-800" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            withOrders ? "translate-x-6" : "translate-x-0"
                            }`}
                        ></span>
                    </button>       
                    <button
                        className="px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
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
                    <button
                        name="month"
                        className="px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={handleDateRange}
                    >
                        {t('reports.month')}
                    </button>
                    <button
                        name="quarter"
                        className="px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={handleDateRange}
                    >
                        {t('reports.quarter')}
                    </button>
                    <button
                        name="year"
                        className="px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                        onClick={handleDateRange}
                    >
                        {t('reports.year')}
                    </button>
                </div>
                <hr className="border-[color:var(--primary)] mb-2" />
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
                                    <label className="w-1/5 font-semibold text-right">{t('reports.total_net')}</label>
                                    <label className="w-1/5 font-semibold text-right">{t('reports.total_vat')}</label>
                                    <label className="w-1/5 font-semibold text-right">{t('reports.total_withholding')}</label>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {report.parties?.map((customer) => (
                                        <div key={customer.idCompany} className="w-full">
                                            <div className="flex w-full border border-[color:var(--primary)] bg-[color:var(--background)] rounded-full p-2 font-semibold">
                                                <span className="w-1/5">{customer.legalName}</span>
                                                <span className="w-1/5">{customer.vatNumber}</span>
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
                                                    <span className="w-1/5">{new Date(invoice.docDate).toLocaleDateString("es-ES", {
                                                                                                        day: "2-digit",
                                                                                                        month: "2-digit",
                                                                                                        year: "numeric"
                                                                                                    })}</span>
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