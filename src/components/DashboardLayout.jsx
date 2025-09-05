import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import '../assets/css/App.css'
import SearchBar from './SearchBar';
import Sidebar from './SideBar';

function DashboardLayout() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (storedUser) {
      document.documentElement.setAttribute("data-theme", storedUser.preferredTheme);
      if (storedUser.preferredMode=="dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [storedUser]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <SearchBar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
