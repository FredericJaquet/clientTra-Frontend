import React, { useState } from 'react';
import '../assets/css/App.css';
import Navbar from "./Navbar";
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import { useTranslation } from 'react-i18next';

function Register(){

  const { i18n } = useTranslation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    emailAdmin: '',
    password: '',
    preferredLanguage: i18n.language,
    preferredTheme: 'blue',
    darkMode: false,

    repeatedPassword:'',
    legalName: '',
    comName: '',
    vatNumber: '',
    emailCompany:'',
    web:'',
    Address: {
        street:'',
        stNumber:'',
        apt:'',
        cp:'',
        city:'',
        state:'',
        country:''
    }
  });

  const nextStep = () => setStep(2);

  return(
    <div className="min-h-screen flex flex-col">
        <div className="justify-items-start">
            <Navbar/>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-auto">
        {step === 1 && <RegisterStep1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <RegisterStep2 formData={formData} setFormData={setFormData} />}
        </div>
    </div>
  );


}

export default Register;