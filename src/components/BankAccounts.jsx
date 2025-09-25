import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";

function BankAccounts ({bankAccounts, idCompany, onAccountsChange}){

    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [accountsList, setAccountsList] = useState ([]);
    const [sortConfig, setSortConfig] = useState({ key: "swift", direction: "asc" });
    const [selectedAccount, setSelectedAccount] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({swift:"", iban:"", branch:"", holder:""});
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        if (bankAccounts && bankAccounts.length > 0) {
            setAccountsList(bankAccounts);
        }
    }, [bankAccounts]);

    const sortedAccounts = [...accountsList].sort((a, b) => {
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

    const addAccount = () => {
        setShowAddForm(true);
    };

    const editAccount = (account) => {
        setSelectedAccount(account);
        setFormData({swift:account.swift, iban:account.iban, branch:account.branch, holder: account.holder});
        setShowEditForm(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if(!formData.iban){
            setError(t('error.iban_required'));
            return;
        }

        try {
            const response = await api.post(`/companies/${idCompany}/accounts`, formData);

            setAccountsList(prevAccounts => {
                const updatedAccounts = [...prevAccounts, response.data];
                onAccountsChange(updatedAccounts);
                return updatedAccounts;
            });

            setShowAddForm(false);
            setError("");
            setFormData({swift:"", iban:"", branch:"", holder:""});
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if(!formData.iban){
            setError(t('error.iban_required'));
            return;
        }

        try {
            const response = await api.patch(`/companies/${idCompany}/accounts/${selectedAccount.idBankAccount}`, formData);

            console.log(response.data);

            setAccountsList(prevAccounts => {
                const updatedAccounts = prevAccounts.map(account =>
                    account.idBankAccount === selectedAccount.idBankAccount ? response.data : account
                );
                onAccountsChange(updatedAccounts);
                return updatedAccounts;
            });

            setShowEditForm(false);
            setError("");
            setFormData({swift:"", iban:"", branch:"", holder:""});
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    }

    const handleDeleteAccount = async () => {
        if (!accountToDelete) return;

        try {
            await api.delete(`/companies/${idCompany}/accounts/${accountToDelete.idBankAccount}`);

            setAccountsList(prevAccounts => {
                const updatedAccounts = prevAccounts.filter(a => a.idBankAccount !== accountToDelete.idBankAccount);
                onAccountsChange(updatedAccounts);
                return updatedAccounts;
            });

            setShowDeleteConfirm(false);
            setAccountToDelete(null);
        } catch (err) {
            console.error(err);
            setError(t('error.deleting_account'));
        }
    };
    
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setError("");
    }

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setError("");
    }

    const confirmDeleteAccount = (account) => {
        setAccountToDelete(account);
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setAccountToDelete(null);
        setShowDeleteConfirm(false);
    };

    return (
        <div>
            {/* Card Add Account */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                    <h3 className="text-xl font-semibold mb-4">{t('bank_accounts.add_account')}</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                        <input 
                            type="text"
                            name="swift"
                            value={formData.swift}
                            placeholder={t('bank_accounts.swift')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="iban"
                            value={formData.iban}
                            placeholder={t('bank_accounts.iban')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="branch"
                            value={formData.branch}
                            placeholder={t('bank_accounts.branch')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="holder"
                            value={formData.holder}
                            placeholder={t('bank_accounts.holder')}
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
            {/* Card Edit Account */}
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                    <h3 className="text-xl font-semibold mb-4">{t('bank_accounts.edit_account')}</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                        <input 
                            type="text"
                            name="swift"
                            value={formData.swift}
                            placeholder={t('bank_accounts.swift')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="iban"
                            value={formData.iban}
                            placeholder={t('bank_accounts.iban')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="branch"
                            value={formData.branch}
                            placeholder={t('bank_accounts.branch')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="holder"
                            value={formData.holder}
                            placeholder={t('bank_accounts.holder')}
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
                        <h3 className="text-xl font-semibold mb-4">{t('bank_accounts.confirm_delete')}</h3>
                        
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
                                onClick={handleDeleteAccount}
                            >
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sortedAccounts.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('bank_accounts.no_accounts')}
                </div>
                ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full mb-2 divide-y divide-[color:var(--divide)]">
                    <thead>
                        <tr>
                            <th 
                                className="w-1/6 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("swift")}>
                                {t('bank_accounts.swift')} {sortConfig.key === "swift" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("iban")}>
                                {t('bank_accounts.iban')} {sortConfig.key === "iban" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/3 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("branch")}>
                                {t('bank_accounts.branch')} {sortConfig.key === "branch" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y [color:var(--divide)]">
                        {sortedAccounts.map((account) => (
                        <tr
                            key={account.idBankAccount}
                            className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                        >
                            <td className="w-1/6 py-2" onClick={() => editAccount(account)}>{account.swift}</td>
                            <td className="w-1/3 py-2" onClick={() => editAccount(account)}>{account.iban}</td>
                            <td className="w-1/3 py-2" onClick={() => editAccount(account)}>{account.branch}</td>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                            <td className="flex justify-center py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => confirmDeleteAccount(account)}
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
                    onClick={addAccount}
                >
                <span className="text-lg font-bold">+</span> {t('button.add')}
                </button>
            </div>)}
        </div>    
    );

}

export default BankAccounts;