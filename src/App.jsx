import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import SelectLanguage from './contexts/LanguageContext';
import { setupResponseInterceptor } from "./api/axios";

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Project = lazy(() => import('./components/Project'));
const LegalTerms = lazy (() => import ('./components/LegalTerms'));
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const DashboardHome = lazy(() => import('./components/DashboardHome'));
const MyAccount = lazy(() => import('./components/MyAccount'));
const Users = lazy(() => import('./components/Users'));
const MyCompany = lazy(() => import('./components/MyCompany'));
const Customers = lazy(() => import('./components/Customers'));
const CustomerDetails = lazy(() => import('./components/CustomerDetails'));
const Providers = lazy(() => import('./components/Providers'));
const ProviderDetails = lazy(() => import('./components/ProviderDetails'));
const OrdersListForCustomers = lazy(() => import('./components/OrdersListForCustomers'));
const OrdersListForProviders = lazy(() => import('./components/OrdersListForProviders'));
const CustomerInvoicesList = lazy(() => import('./components/CustomerInvoicesList'));
const ProviderInvoicesList = lazy(() => import('./components/ProviderInvoicesList'));
const QuotesList = lazy(() => import('./components/QuotesList'));
const PosList = lazy(() => import('./components/PosList'));
const IncomesReport = lazy(() => import('./components/IncomesReport'));
const OutcomesReport = lazy(() => import('./components/OutcomesReport'));
const CashingReport = lazy(() => import('./components/CashingReport'));
const PaymentReport = lazy(() => import('./components/PaymentReport'));
const IncomesGraph = lazy(() => import('./components/IncomesGraph'));
const OutcomesGraph = lazy(() => import('./components/OutcomesGraph'));

// Check for token for private routes
const isAuthenticated = () => localStorage.getItem("token") !== null;

// Private Route Wrapper
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

// Component that configures the interceptor within the router
function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    setupResponseInterceptor(navigate); // Redirect to login if 401
  }, [navigate]);

  SelectLanguage();

  return (
    <ThemeProvider>
      <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/project" element={<Project />} />
          <Route path="/legal" element={<LegalTerms />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="users" element={<Users />} />
            <Route path="my-company" element={<MyCompany />} />
            <Route path="customers" element={<Customers />} />
            <Route path="providers" element={<Providers />} />
            <Route path="orders/customers/list" element={<OrdersListForCustomers />} />
            <Route path="orders/providers/list" element={<OrdersListForProviders />} />
            <Route path="customer-invoice/list" element={<CustomerInvoicesList />} />
            <Route path="provider-invoice/list" element={<ProviderInvoicesList />} />
            <Route path="quote/list" element={<QuotesList />} />
            <Route path="po/list" element={<PosList />} />
            <Route path="report/incomes" element={<IncomesReport />} />
            <Route path="report/outcomes" element={<OutcomesReport />} />
            <Route path="report/cashing" element={<CashingReport />} />
            <Route path="report/payment" element={<PaymentReport />} />
            <Route path="graph/incomes" element={<IncomesGraph />} />
            <Route path="graph/outcomes" element={<OutcomesGraph />} />
            <Route path="customers/:id" element={<CustomerDetails />} />
            <Route path="providers/:id" element={<ProviderDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

// Final Export with Router
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
