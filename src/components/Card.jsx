import React from "react";

function Card({ title, headers = [], rows = [] }){
    return (
        <div className="rounded-xl shadow-lg w-3/4 p-4 bg-[color:var(--secondary)]">
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <hr className="border-[color:var(--primary)] mb-2" />

        {headers.length > 0 && (
            <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-[color:var(--divide)]">
                <thead>
                <tr>
                    {headers.map((h, i) => (
                    <th
                        key={i}
                        className="w-1/2 py-3 text-left text-[color:var(--text)] font-medium"
                    >
                        {h}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y [color:var(--divide)]">
                {rows.map((row, i) => (
                    <tr key={i}>
                    {row.map((cell, j) => (
                        <td
                        key={j}
                        className="w-1/2 py-2 text-[color:var(--text)]"
                        >
                        {cell}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}

export default Card;