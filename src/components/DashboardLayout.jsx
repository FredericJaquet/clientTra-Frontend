
import api from "../api/axios";
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from "react";
import '../assets/css/App.css'
import SearchBar from './SearchBar';
import Sidebar from './SideBar';
import DemoBanner from './DemoBanner';
import RegisterFromDemo from './RegisterFromDemo';

function DashboardLayout() {
    const [isDemo, setIsDemo] = useState(true);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const theme = user?.preferredTheme || "blue";
    const darkMode = user?.preferredMode || "light";

    document.documentElement.setAttribute("data-theme", theme);
      if (darkMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

    useEffect(() => {
        api.get("/context")
        .then((response) => {
            setIsDemo(response.data.isDemo);
        });
    }, []);

    const onCreateRealAccount = () => {
        setShowRegisterForm(true);
        console.log("Registro real");
    }
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <SearchBar />
        {isDemo &&
          <DemoBanner
          onCreateRealAccount={onCreateRealAccount} />
        }
        <div className="flex-1 overflow-auto">
          {showRegisterForm &&
            <RegisterFromDemo onClose={() => {
              setShowRegisterForm(false)
              window.location.reload();}
            } />
          }
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
