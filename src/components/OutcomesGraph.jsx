import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from "recharts";

function OutcomesGraph(){

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [report, setReport] = useState({});

    useEffect(() => {
        if(!startDate || !endDate) return;
        
        axios.get("/reports/cash-flow/outcome/graph", {
            params: {
                initDate: startDate,
                endDate: endDate
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

    return(
       <div className="flex w-full flex-col items-center gap-5 py-10">
            <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
                <div className="w-full flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold mb-2 w-1/2">{t('reports.report_outcomes_graph')}</h4>
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
                {startDate && endDate && (
                    <>
                        <label className="modal-scroll flex justify-center w-full border border-[color:var(--primary)] rounded-full mb-2 p-2 font-semibold overflow-auto">
                            {t('reports.report_incomes_graph')}: {t('reports.date_from')}{" "}
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
                            <>
                            {!loading && report.months && report.months.length > 0 && (
                                <div className="w-full h-[400px] p-4 bg-[color:var(--secondary)] rounded-xl shadow-lg">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={report.months.map(m => ({
                                            month: m.docDate.toString(), // Ej: 2025-07
                                            totalNet: m.totalNet
                                            }))}
                                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                        >
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: 'var(--text)', fontSize: 12 }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: 'var(--text)', fontSize: 12 }}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                formatter={(value) => value.toFixed(2) + "€"}
                                                contentStyle={{ backgroundColor: 'var(--secondary)', border:"transparent" }}
                                            />
                                            <Legend wrapperStyle={{ color: 'var(--text)' }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="totalNet"
                                                    stroke="var(--success)"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            <ReferenceLine
                                                y={report.averageNet}
                                                stroke='var(--divide)'
                                                strokeDasharray="4 4"
                                                label={{
                                                    position: 'top',
                                                    value: `${t("reports.average")} ${report.averageNet.toFixed(2)}€`,
                                                    fill: 'var(--text)',
                                                    fontSize: 12
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default OutcomesGraph;