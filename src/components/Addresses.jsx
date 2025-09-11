import { useState, useEffect } from "react";
import api from "../api/axios";
import { useTranslation } from 'react-i18next';


function Addresses ({addresses, idCompany}){
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "ROLE_USER";
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
                                        idAddress:"",
                                        street: "",
                                        stNumber: "",
                                        apt: "",
                                        cp: "",
                                        city: "",
                                        state: "",
                                        country: "" });

    const [address, setAddress] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (addresses && addresses.length > 0) {
            setAddress(addresses[0]);
            setFormData({ 
                        idAddress:addresses[0].idAddress,
                        street: addresses[0].street,
                        stNumber: addresses[0].stNumber,
                        apt: addresses[0].apt,
                        cp: addresses[0].cp,
                        city: addresses[0].city,
                        state: addresses[0].state,
                        country: addresses[0].country });

        }
    }, [addresses]);

    const handleEdit = () => {
        if (address) {
            setIsEditing(!isEditing);
            setError("");
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if( !formData.street ||
            !formData.stNumber ||
            !formData.cp ||
            !formData.city ||
            !formData.country ){
            setError(t('error.all_fields_required'));
            return;
        }
        
        try {
            const response = await api.patch(`/companies/${idCompany}/addresses/${address.idAddress}`, formData);
            setAddress(response.data);
            setIsEditing(false);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    }

    return (
    <div>
        <div className="grid grid-cols-[1fr_2fr_1fr_2fr] sd:grid-cols-2 gap-4">
            <label className="mr-2 font-semibold">{t('register.street')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.street}</label>
                :
                <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
            }
            <label className="mr-2 font-semibold">{t('register.st_number')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.stNumber}</label>
                :
                <input
                    type="text"
                    name="stNumber"
                    value={formData.stNumber}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
            }
            <label className="mr-2 font-semibold">{t('register.apt')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.apt}</label>
                :
                <input
                    type="text"
                    name="apt"
                    value={formData.apt}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
                }
            <label className="mr-2 font-semibold">{t('register.cp')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.cp}</label>
                :
                <input
                    type="text"
                    name="cp"
                    value={formData.cp}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
            }
            <label className="mr-2 font-semibold">{t('register.city')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.city}</label>
                :
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
            }
            <label className="mr-2 font-semibold">{t('register.state')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.state}</label>
                :
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
            }
            <label className="mr-2 font-semibold">{t('register.country')}:</label>
            {!isEditing ? 
                <label className="mr-2">{address.country}</label>
                :
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-[color:var(--background)] p-2 mr-2 h-8 rounded-lg border"
                />
            }
            <div></div>
            <div className="flex justify-end">
                {!isEditing ?
                    role === "ROLE_ADMIN" && (
                    <button
                        onClick={handleEdit}
                        className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                    >
                        {t('button.edit')}
                    </button> )
                    :
                    <div className="flex gap-2">
                        <button
                        onClick={handleSave}
                        className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                        >
                        {t('button.save')}
                        </button>
                        <button
                        onClick={handleEdit}
                        className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--text-light)] rounded-xl hover:bg-[color:var(--primary-hover)]"
                        >
                            {t('button.cancel')}
                        </button>
                    </div>
                }
            </div>
        </div>
        {error && (
            <div className=" my-2 text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                {error}
            </div>
        )}
    </div>
    );
}

export default Addresses;