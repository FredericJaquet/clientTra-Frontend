import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";

function ContactPersons ({contacts, idCompany, onContactsChange}){

    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";

    const [contactsList, setContactsList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "firstname", direction: "asc" });
    const [selectedContact,setSelectedContact] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
                                                firstname:"",
                                                middlename:"",
                                                lastname:"",
                                                role:"",
                                                email:""
                                            });
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        if (contacts && contacts.length > 0) {
            setContactsList(contacts);
        }
    }, [contacts]);

    const sortedContacts = [...contactsList].sort((a, b) => {
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

    const addContact = () => {
        setShowAddForm(true);
    };

    const editContact = (contact) => {
        setSelectedContact(contact);
        setFormData({   firstname: contact.firstname,
                        middlename: contact.middlename,
                        lastname: contact.lastname,
                        role: contact.role,
                        email: contact.email });
        setShowEditForm(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstname || !formData.middlename) {
            setError(t('error.all_fields_required'));
            return;
        }

        try {
            const response = await api.post(`/companies/${idCompany}/contacts`, formData);

            console.log(response);

            setContactsList(prevContacts => {
                const updatedContacts = [...prevContacts, response.data];
                onContactsChange(updatedContacts);
                console.log(updatedContacts);
                return updatedContacts;
            });

            setShowAddForm(false);
            setError("");
            setFormData({
                        firstname:"",
                        middlename:"",
                        lastname:"",
                        role:"",
                        email:""
                        });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.deleting_contact'));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstname || !formData.middlename) {
            setError(t('error.all_fields_required'));
            return;
        }

        try {
            const response = await api.patch(`/companies/${idCompany}/contacts/${selectedContact.idContactPerson}`, formData);

            setContactsList(prevContacts => {
                const updatedContacts = prevContacts.map(contact =>
                    contact.idContactPerson === selectedContact.idContactPerson ? response.data : contact
                );
                onContactsChange(updatedContacts);
                return updatedContacts;
            });

            setShowEditForm(false);
            setError("");
            setFormData({
                        firstname:"",
                        middlename:"",
                        lastname:"",
                        role:"",
                        email:""
                        });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.deleting_contact'));
        }
    };

    const handleDeleteContact = async () => {
        if (!contactToDelete) return;

        try {
            await api.delete(`/companies/${idCompany}/contacts/${contactToDelete.idContactPerson}`);

            setContactsList(prevContacts => {
                const updatedContacts = prevContacts.filter(c => c.idContactPerson !== contactToDelete.idContactPerson);
                onContactsChange(updatedContacts);
                return updatedContacts;
            });

            setShowDeleteConfirm(false);
            setContactToDelete(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('error.deleting_contact'));
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

    const confirmDeleteContact= (contact) => {
        setContactToDelete(contact);
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setContactToDelete(null);
        setShowDeleteConfirm(false);
    };

 return (
        <div>
            {/* Card Add Contact */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                    <h3 className="text-xl font-semibold mb-4">{t('contacts.add_contact')}</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                        <input 
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            placeholder={t('contacts.firstname')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="middlename"
                            value={formData.middlename}
                            placeholder={t('contacts.middlename')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input 
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            placeholder={t('contacts.lastname')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            placeholder={t('contacts.role')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input 
                            type="text"
                            name="email"
                            value={formData.email}
                            placeholder={t('contacts.email')}
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
            {/* Card Edit Contact */}
            {showEditForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/3">
                    <h3 className="text-xl font-semibold mb-4">{t('contacts.edit_contact')}</h3>
                    <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                        <input 
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            placeholder={t('contacts.firstname')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="middlename"
                            value={formData.middlename}
                            placeholder={t('contacts.middlename')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input 
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            placeholder={t('contacts.lastname')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            placeholder={t('contacts.role')}
                            onChange={handleChange}
                            className="p-2 rounded-lg border bg-[color:var(--background)]"
                            />
                        <input 
                            type="text"
                            name="email"
                            value={formData.email}
                            placeholder={t('contacts.email')}
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
                        <h3 className="text-xl font-semibold mb-4">{t('contacts.confirm_delete')}</h3>
                        
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
                                onClick={handleDeleteContact}
                            >
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {sortedContacts.length === 0 ? (
                <div className="py-6 text-center text-[color:var(--text)]">
                    {t('contacts.no_contacts')}
                </div>
                ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full mb-2 divide-y divide-[color:var(--divide)]">
                    <thead>
                        <tr>
                            <th 
                                className="w-1/5 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("firstname")}>
                                {t('contacts.firstname')} {sortConfig.key === "firstname" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/5 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("middlename")}>
                                {t('contacts.middlename')} {sortConfig.key === "middlename" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/5 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("lastname")}>
                                {t('contacts.lastname')} {sortConfig.key === "lastname" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/5 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("role")}>
                                {t('contacts.role')} {sortConfig.key === "role" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                            <th 
                                className="w-1/5 py-3 text-left text-[color:var(--text)] font-medium"
                                onClick={() => handleSort("email")}>
                                {t('contacts.email')} {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y [color:var(--divide)]">
                        {sortedContacts.map((contact) => (
                        <tr
                            key={contact.idContactPerson}
                            className="cursor-pointer text-[color:var(--text)] hover:bg-[color:var(--primary)] hover:text-[color:var(--text-light-hover)] transition-colors"
                        >
                            <td className="w-1/5 py-2" onClick={() => editContact(contact)}>{contact.firstname}</td>
                            <td className="w-1/5 py-2" onClick={() => editContact(contact)}>{contact.middlename}</td>
                            <td className="w-1/5 py-2" onClick={() => editContact(contact)}>{contact.lastname}</td>
                            <td className="w-1/5 py-2" onClick={() => editContact(contact)}>{contact.role}</td>
                            <td className="w-1/5 py-2" onClick={() => editContact(contact)}>{contact.email}</td>
                            {(role === "ROLE_ADMIN" || role === "ROLE_ACCOUNTING") && (
                            <td className="flex justify-center py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => confirmDeleteContact(contact)}
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
                    onClick={addContact}
                >
                <span className="text-lg font-bold">+</span> {t('button.add')}
                </button>
            </div>)}
        </div>    
    );

}

export default ContactPersons;