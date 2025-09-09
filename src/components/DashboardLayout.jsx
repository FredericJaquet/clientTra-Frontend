
import { Outlet } from 'react-router-dom';
import '../assets/css/App.css'
import SearchBar from './SearchBar';
import Sidebar from './SideBar';

function DashboardLayout() {
  
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
