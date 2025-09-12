import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";

function Phones ({phones, idCompany, onPhonesChange}){

    //TODO Ver como pasar los tel nuevos a la lista del Company, porque desaparece al volver a la pestaña

    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [phonesList, setPhonesList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "phoneNumber", direction: "asc" });
    const [selectedPhone, setSelectedPhone] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({phoneNumber:"", kind:""});
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [phoneToDelete, setPhoneToDelete] = useState(null);


    const handleSort = (key) => {
        setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        if (phones && phones.length > 0) {
            setPhonesList(phones);
        }
    }, [phones]);

    const sortedPhones = [...phonesList].sort((a, b) => {
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

    const addPhone = () => {
        setShowAddForm(true);
    };

    const editPhone = (phone) => {
        setSelectedPhone(phone);
        setFormData({ phoneNumber: phone.phoneNumber, kind: phone.kind });
        setShowEditForm(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phoneNumber || !formData.kind) {
            setError(t('error.all_fields_required'));
            return;
        }

        try {
            const response = await api.post(`/companies/${idCompany}/phones`, formData);

            setPhonesList(prevPhones => {
                const updatedPhones = [...prevPhones, response.data];
                onPhonesChange(updatedPhones);
                return updatedPhones;
            });

            setShowAddForm(false);
            setError("");
            setFormData({ phoneNumber: "", kind: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phoneNumber || !formData.kind) {
            setError(t('error.all_fields_required'));
            return;
        }

        try {
            const response = await api.patch(`/companies/${idCompany}/phones/${selectedPhone.idPhone}`, formData);

            setPhonesList(prevPhones => {
                const updatedPhones = prevPhones.map(phone =>
                    phone.idPhone === selectedPhone.idPhone ? response.data : phone
                );
                onPhonesChange(updatedPhones);
                return updatedPhones;
            });

            setShowEditForm(false);
            setError("");
            setFormData({ phoneNumber: "", kind: "" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error");
        }
    };

    const handleDeletePhone = async () => {
        if (!phoneToDelete) return;

        try {
            await api.delete(`/companies/${idCompany}/phones/${phoneToDelete.idPhone}`);

            setPhonesList(prevPhones => {
                const updatedPhones = prevPhones.filter(p => p.idPhone !== phoneToDelete.idPhone);
                onPhonesChange(updatedPhones);
                return updatedPhones;
            });

            setShowDeleteConfirm(false);
            setPhoneToDelete(null);
        } catch (err) {
            console.error(err);
            setError(t('error.deleting_phone'));
        }
    };


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

     //Cancel Add
    const handleCancelAdd = () => {
        setShowAddForm(false);
        setError("");
    }

     //Cancel Edit
    const handleCancelEdit = () => {
        setShowEditForm(false);
        setError("");
    }

    const confirmDeletePhone = (phone) => {
        setPhoneToDelete(phone);
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setPhoneToDelete(null);
        setShowDeleteConfirm(false);
    };

    return (
        <div>
            {/* Card Add Phone */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                    <h3 className="text-xl font-semibold mb-4">{t('phones.add_phone')}</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                        <input 
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            placeholder={t('phones.phone_number')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="kind"
                            value={formData.kind}
                            placeholder={t('phones.kind')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
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
            )}
            {/* Card Edit Phone */}
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                    <h3 className="text-xl font-semibold mb-4">{t('phones.edit_phone')}</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                        <input 
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            placeholder={t('phones.phone_number')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="kind"
                            value={formData.kind}
                            placeholder={t('phones.kind')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
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
                                onClick={handleDeletePhone}
                            >
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sortedPhones.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('phones.no_phones')}
                </div>
                ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full mb-2 divide-y divide-[color:var(--divide)]">
                    <thead>
                        <tr>
                            <th 
                                className="w-1/2 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("phoneNumber")}>
                                {t('phones.phone_number')} {sortConfig.key === "phoneNumber" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("kind")}>
                                {t('phones.kind')} {sortConfig.key === "kind" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y [color:var(--divide)]">
                        {sortedPhones.map((phone) => (
                        <tr
                            key={phone.idPhone}
                            className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                        >
                            <td className="w-1/2 py-2" onClick={() => editPhone(phone)}>{phone.phoneNumber}</td>
                            <td className="w-1/3 py-2" onClick={() => editPhone(phone)}>{phone.kind}</td>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                            <td className="flex justify-center py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => confirmDeletePhone(phone)}
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
                    onClick={addPhone}
                >
                <span className="text-lg font-bold">+</span> {t('button.add')}
                </button>
            </div>)}
        </div>    
    );
}

export default Phones;