import { useState } from "react";
import api from "../api/axios";
import { useTranslation } from 'react-i18next';
import { emailValidator, urlValidator } from "../utils/validator";

function RegisterFromDemo({ onClose }) {
    const { t } = useTranslation();

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        legalName: '',
        comName: '',
        vatNumber: '',
        email:'',
        web:'',
        address: {
            street:'',
            stNumber:'',
            apt:'',
            cp:'',
            city:'',
            state:'',
            country:''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If field for Address
        if (['street','stNumber','apt','cp','city','state','country'].includes(name)) {
            setFormData(prev => ({...prev, address: { ...prev.address, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();

        if( !formData.vatNumber || 
            !formData.comName ||
            !formData.legalName ||
            !formData.address.street ||
            !formData.address.stNumber ||
            !formData.address.cp ||
            !formData.address.city ||
            !formData.address.country ){
            setError(t('error.all_fields_required'));
            return;
        }

        if(!emailValidator(formData.email)){
            setError(t('error.email_invalid'));
            return;
        }

        if(!urlValidator(formData.web)){
            setError(t('error.url_invalid'));
            return;
        }

        setError('');

        console.log(formData);
        
        try {
            await api.post("/demo-data-deleting/register-company", formData);
            await api.delete("/demo-data-deleting/demo-data");
            onClose();
        } catch (err) {
            console.log(err);
            setError(err.response.data.message);
        }

        
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[color:var(--secondary)] rounded-xl shadow-lg p-6 w-1/2 max-h-[90vh] flex flex-col">
                <h3 className="fw-bold text-center mb-4">{t('register.company_data')}</h3>
                <form >
                    <div className="flex flex-col gap-4 ">
                        <div className="flex gap-2 ">
                            <input
                                name="legalName"
                                type="text"
                                value={formData.legalName}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                required
                                placeholder={t('register.legal_name')}
                            />
                            <input
                                name="comName"
                                type="text"
                                value={formData.comName}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.com_name')}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="vatNumber"
                                type="text"
                                value={formData.vatNumber}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.cif')}
                                required
                            />
                            <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                            placeholder={t('register.email')} />
                        </div>
                        <div className="flex gap-2 ">
                            <input
                                name="web"
                                value={formData.web}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                type="url"
                                placeholder={t('register.web')} />
                        </div>
                        <hr/>
                        <div className="flex gap-2">
                            <input
                                name="street"
                                type="text"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.street')}
                                required />
                            <input
                                name="stNumber"
                                value={formData.address.stNumber}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                type="text"
                                placeholder={t('register.st_number')}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="apt"
                                type="text"
                                value={formData.address.apt}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.apt')}
                            />
                            <input
                                name="cp"
                                type="text"
                                value={formData.address.cp}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.cp')}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="city"
                                type="text"
                                value={formData.address.city}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.city')}
                                required
                            />
                            <input
                                name="state"
                                type="text"
                                value={formData.address.state}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.state')}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                name="country"
                                type="text"
                                value={formData.address.country}
                                onChange={handleChange}
                                className="p-2 w-1/2 rounded-lg border bg-[color:var(--background)]"
                                placeholder={t('register.country')}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-white text-center rounded-lg px-6 py-2 bg-[color:var(--error)]">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 my-5">
                            <button
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                type="button"
                                onClick={() => onClose()}
                            >
                                {t('button.cancel')}
                            </button>
                            <button
                                className="mb-4 px-4 py-2 rounded-xl bg-[color:var(--primary)] text-[color:var(--text-light)] w-max flex items-center gap-2 hover:bg-[color:var(--primary-hover)] transition-colors duration-300"
                                type="button"
                                onClick={handleSave}
                            >
                                {t('button.save')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );



}

export default RegisterFromDemo;