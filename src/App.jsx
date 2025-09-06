import { lazy, Suspense } from 'react';
import './assets/css/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import SelectLanguage from './contexts/LanguageContext';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const DashboardHome = lazy(() => import('./components/DashboardHome'));
const MyAccount = lazy(() => import('./components/MyAccount'));
const Users = lazy(() => import('./components/Users'));
const MyCompany = lazy(() => import('./components/MyCompany'));
const Customers = lazy(() => import('./components/Customers'));
const Providers = lazy(() => import('./components/Providers'));
const OrderForm = lazy(() => import('./components/OrderForm'));
const CustomerInvoiceForm = lazy(() => import('./components/CustomerInvoiceForm'));
const ProviderInvoiceForm = lazy(() => import('./components/ProviderInvoiceForm'));
const QuoteForm = lazy(() => import('./components/QuoteForm'));
const PoForm = lazy(() => import('./components/PoForm'));
const OrdersList = lazy(() => import('./components/OrdersList'));
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

const isAuthenticated = () => localStorage.getItem("token") !== null;

// Wrapper de ruta privada
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}



function App() {
  
  SelectLanguage();

  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
              <Route path="orders/create" element={<OrderForm />} />
              <Route path="customer-invoice/create" element={<CustomerInvoiceForm />} />
              <Route path="provider-invoice/create" element={<ProviderInvoiceForm />} />
              <Route path="quote/create" element={<QuoteForm />} />
              <Route path="po/create" element={<PoForm />} />
              <Route path="orders/list" element={<OrdersList />} />
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
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
