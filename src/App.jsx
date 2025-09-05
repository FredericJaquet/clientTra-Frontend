import { useEffect } from 'react';
import './assets/css/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard';


const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Wrapper de ruta privada
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function App() {

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
   if (storedUser) {
      const user = JSON.parse(storedUser);
      document.documentElement.setAttribute("data-theme", user.preferredTheme || "blue");
      if (user.darkMode=="dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.setAttribute("data-theme", "blue");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App;
