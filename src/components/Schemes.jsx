import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { useTranslation } from 'react-i18next';
import { ServerRouter } from "react-router-dom";

//TODO: Evitar editción de esquemas si USER
function Schemes({schemes, idCompany, onSchemesChange}){

    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [schemesList, setSchemesList] = useState([]);
    const [lineInput, setLineInput] = useState({ descrip: "", discount: "" });
    const [sortConfig, setSortConfig] = useState({ key: "schemeName", direction: "asc" });
    const [selectedScheme, setSelectedScheme] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({  schemeName:"",
                                                price:"",
                                                units:"",
                                                fieldName:"",
                                                sourceLanguage:"",
                                                targetLanguage:"",
                                                schemeLines:[]});
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [schemeToDelete, setSchemeToDelete] = useState(null);
    const [editingLineIndex, setEditingLineIndex] = useState(null);

    const descripRef = useRef(null);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        if (schemes && schemes.length > 0) {
            setSchemesList(schemes);
        }
    }, [schemes]);

    const sortedSchemes = [...schemesList].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const addScheme = () => {
        setShowAddForm(true);
    };

    const editScheme = (scheme) => {
        setSelectedScheme(scheme);
        setFormData({   schemeName:scheme.schemeName,
                        price:scheme.price,
                        units:scheme.units,
                        fieldName:scheme.fieldName,
                        sourceLanguage:scheme.sourceLanguage,
                        targetLanguage:scheme.targetLanguage,
                        schemeLines:scheme.schemeLines});
        setShowEditForm(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.schemeName || !formData.price) {
            setError(t('error.all_fields_required'));
            return;
        }
        if (isNaN(Number(formData.price))) {
            setError(t('error.invalid_price'));
            return;
        }

        try {
            const response = await axios.post(`/companies/${idCompany}/schemes`, formData);

            setSchemesList(prevSchemes => {
                const updatedSchemes = [...prevSchemes, response.data];
                onSchemesChange(updatedSchemes);
                return updatedSchemes;
            });

            setShowAddForm(false);
            setError("");
            setFormData({   schemeName:"",
                            price:"",
                            units:"",
                            fieldName:"",
                            sourceLanguage:"",
                            targetLanguage:"",
                            schemeLines:[]});
            setLineInput({ descrip: "", discount: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!formData.schemeName || !formData.price) {
            setError(t('error.all_fields_required'));
            return;
        }

        try {
            const response = await axios.patch(`/companies/${idCompany}/schemes/${selectedScheme.idScheme}`, formData);

            setSchemesList(prevSchemes => {
                const updatedSchemes = prevSchemes.map(scheme =>
                    scheme.idScheme === selectedScheme.idScheme ? response.data : scheme
                );
                onSchemesChange(updatedSchemes);
                return updatedSchemes;
            });

            setShowEditForm(false);
            setError("");
            setFormData({schemeName:"",
                        price:"",
                        units:"",
                        fieldName:"",
                        sourceLanguage:"",
                        targetLanguage:"",
                        schemeLines:[]});
            setLineInput({ descrip: "", discount: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.editing_scheme'));
        }
    };

    const handleDeleteScheme = async () => {
        if (!schemeToDelete) return;

        try {
            await axios.delete(`/companies/${idCompany}/schemes/${schemeToDelete.idScheme}`);

            setSchemesList(prevSchemes => {
                const updatedSchemes = prevSchemes.filter(s => s.idScheme !== schemeToDelete.idScheme);
                onSchemesChange(updatedSchemes);
                return updatedSchemes;
            });

            setShowDeleteConfirm(false);
            setSchemeToDelete(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.deleting_scheme'));
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleLineChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setLineInput(prev => ({ ...prev, [name]: value }));
    };

    const handleAddLine = (e) => {
        if (e.type === "keydown" && e.key !== "Enter") return;
        e.preventDefault();
        if (!lineInput.descrip || !lineInput.discount){ 
            setError(t('error.all_fields_required'));
            return;
        }
        if (isNaN(Number(lineInput.discount))) {
            setError(t('error.invalid_discount'));
            return;
        }

        setFormData(prev => {
            let updatedLines;
            if (editingLineIndex !== null) {
                // Editing existing line
                updatedLines = prev.schemeLines.map((line, index) =>
                    index === editingLineIndex ? lineInput : line
                );
            } else {
                // Add new line
                updatedLines = [...(prev.schemeLines || []), lineInput];
            }
            return { ...prev, schemeLines: updatedLines };
        });

        setLineInput({ descrip: "", discount: "" });
        setEditingLineIndex(null);
        descripRef.current?.focus();
        setError("");
    };

    const handleEditLine = (index) => {
        const line = formData.schemeLines[index];
        setLineInput(line);
        setEditingLineIndex(index);
    };

     //Cancel Add
    const handleCancelAdd = () => {
        setShowAddForm(false);
        setFormData({schemeName:"",
                        price:"",
                        units:"",
                        fieldName:"",
                        sourceLanguage:"",
                        targetLanguage:"",
                        schemeLines:[]});
        setLineInput({ descrip: "", discount: "" });
        setError("");
    }

     //Cancel Edit
    const handleCancelEdit = () => {
        setShowEditForm(false);
        setFormData({schemeName:"",
                        price:"",
                        units:"",
                        fieldName:"",
                        sourceLanguage:"",
                        targetLanguage:"",
                        schemeLines:[]});
        setLineInput({ descrip: "", discount: "" });
        setError("");
    }

    const confirmDeleteScheme = (scheme) => {
        setSchemeToDelete(scheme);
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setSchemeToDelete(null);
        setShowDeleteConfirm(false);
    };

    return(
        <div>
            {/* Card Add Sheme */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">{t('schemes.add_scheme')}</h3>
                        <div className="p-6 overflow-y-auto">
                            <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        name="schemeName"
                                        placeholder={t('schemes.name')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        required
                                        />
                                    <input
                                        type="text"
                                        name="price"
                                        placeholder={t('schemes.price')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        required
                                        />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="units"
                                        placeholder={t('schemes.units')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                    <input
                                        type="text"
                                        name="fieldName"
                                        placeholder={t('schemes.field')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="sourceLanguage"
                                        placeholder={t('schemes.sourceLanguage')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                    <input
                                        type="text"
                                        name="targetLanguage"
                                        placeholder={t('schemes.targetLanguage')}
                                        onChange={handleChange}
                                        className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                                        />
                                </div>
                                <hr className="border-primary"/>
                                <h4 className="text-xl font-semibold mb-4">{t('schemes.lines')}</h4>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        ref={descripRef}
                                        type="text"
                                        name="descrip"
                                        placeholder={t('schemes.descrip')}
                                        value={lineInput.descrip}
                                        onChange={handleLineChange}
                                        onKeyDown={handleAddLine}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    <input
                                        type="text"
                                        name="discount"
                                        placeholder={t('schemes.discount')}
                                        value={lineInput.discount}
                                        onChange={handleLineChange}
                                        onKeyDown={handleAddLine}
                                        className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddLine}
                                        className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-lg hover:bg-[color:var(--primary-hover)]"
                                    >
                                        +
                                    </button>
                                </div>
                                {/* Showing added Lines */}
                                <div className="mb-4">
                                    {formData.schemeLines?.map((line, index) => (
                                        <div
                                            key={index}
                                            className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                                            onDoubleClick={() => handleEditLine(index)}
                                            title="Double click to edit"
                                        >
                                            <label className="w-1/2 py-2">{line.descrip}</label>
                                            <label className="w-1/2 py-2">{line.discount>1 ? `${line.discount}%` : `${line.discount*100}%`}</label>
                                        </div>
                                    ))}
                                </div>
                                {error && (
                                    <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                        {error}
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                    type="button"
                                    className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                    onClick={handleCancelAdd}
                                    >
                                        {t('button.cancel')}
                                    </button>
                                    <button
                                    type="submit"
                                    className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                    >
                                        {t('button.save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Card Edit Scheme */}
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                    <h3 className="text-xl font-semibold mb-4">{t('schemes.edit_scheme')}</h3>
                    <div className="p-6 overflow-y-auto">
                        <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                        <div className="flex gap-2">
                            <input 
                            type="text"
                            name="schemeName"
                            value={formData.schemeName}
                            placeholder={t('schemes.name')}
                            onChange={handleChange}
                            className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                            required
                            />
                            <input
                            type="text"
                            name="price"
                            value={formData.price}
                            placeholder={t('schemes.price')}
                            onChange={handleChange}
                            className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                            required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                            type="text"
                            name="units"
                            value={formData.units}
                            placeholder={t('schemes.units')}
                            onChange={handleChange}
                            className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                            />
                            <input
                            type="text"
                            name="fieldName"
                            value={formData.fieldName}
                            placeholder={t('schemes.field')}
                            onChange={handleChange}
                            className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                            type="text"
                            name="sourceLanguage"
                            value={formData.sourceLanguage}
                            placeholder={t('schemes.sourceLanguage')}
                            onChange={handleChange}
                            className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                            />
                            <input
                            type="text"
                            name="targetLanguage"
                            value={formData.targetLanguage}
                            placeholder={t('schemes.targetLanguage')}
                            onChange={handleChange}
                            className="p-2 w-full rounded-lg border bg-[color:var(--background)]"
                            />
                        </div>
                        <hr className="border-primary"/>
                        <h4 className="text-xl font-semibold mb-4">{t('schemes.lines')}</h4>

                        {/* Existing lines */}
                        <div className="mb-4">
                            {formData.schemeLines?.map((line, index) => (
                            <div
                                key={index}
                                className="flex cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                                onDoubleClick={() => handleEditLine(index)}
                                title="Double click to edit"
                            >
                                <label className="w-1/2 py-2">{line.descrip}</label>
                                <label className="w-1/2 py-2">{line.discount>1 ? `${line.discount}%` : `${line.discount*100}%`}</label>
                            </div>
                            ))}
                        </div>

                        {/* Editing existing lines */}
                        {editingLineIndex !== null && (
                            <div className="flex gap-2 mb-2">
                            <input
                                ref={descripRef}
                                type="text"
                                name="descrip"
                                value={lineInput.descrip}
                                onChange={handleLineChange}
                                onKeyDown={handleAddLine}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                            />
                            <input
                                type="text"
                                name="discount"
                                value={lineInput.discount}
                                onChange={handleLineChange}
                                onKeyDown={handleAddLine}
                                className="border border-[color:var(--border)] rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                            />
                            </div>
                        )}

                        {error && (
                            <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                            {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                            type="button"
                            className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                            onClick={handleCancelEdit}
                            >
                            {t('button.cancel')}
                            </button>
                            <button
                            type="submit"
                            className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                            >
                            {t('button.save')}
                            </button>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
                )}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">{t('phones.confirm_delete')}</h3>
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)]"
                                onClick={cancelDelete}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
                                onClick={handleDeleteScheme}
                            >
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sortedSchemes.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('schemes.no_schemes')}
                </div>
                ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full mb-2 divide-y divide-[color:var(--divide)]">
                    <thead>
                        <tr>
                            <th 
                                className="w-1/2 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("schemeName")}>
                                {t('schemes.name')} {sortConfig.key === "schemeName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("price")}>
                                {t('schemes.price')} {sortConfig.key === "price" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("units")}>
                                {t('schemes.units')} {sortConfig.key === "units" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("field")}>
                                {t('schemes.field')} {sortConfig.key === "field" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y [color:var(--divide)]">
                        {sortedSchemes.map((scheme) => (
                        <tr
                            key={scheme.idScheme}
                            className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                        >
                            <td className="w-1/2 py-2" onClick={() => editScheme(scheme)}>{scheme.schemeName}</td>
                            <td className="w-1/6 py-2" onClick={() => editScheme(scheme)}>{scheme.price}</td>
                            <td className="w-1/6 py-2" onClick={() => editScheme(scheme)}>{scheme.units}</td>
                            <td className="w-1/6 py-2" onClick={() => editScheme(scheme)}>{scheme.fieldName}</td>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                            <td className="flex justify-center py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => confirmDeleteScheme(scheme)}
                                >
                                    🗑️
                                </button>
                            </td>)}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
             {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
            <div className="flex justify-end">
                <button
                    className="mb-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                    onClick={addScheme}
                >
                <span className="text-lg font-bold">+</span> {t('button.add')}
                </button>
            </div>)}
        </div>
    );
}

export default Schemes;