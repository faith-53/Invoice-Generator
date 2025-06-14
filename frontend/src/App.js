import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import InvoiceList from "./Pages/invoices/InvoiceList";
import InvoiceForm from "./Pages/invoices/InvoiceForm";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register"
import Home from "./Pages/Home/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import InvoicePreview from "./Pages/invoices/InvoicePreview";
import { ThemeProvider } from "./context/themeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar />
        <ToastContainer />
        <main className="main-content container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/invoices/new" element={<InvoiceForm />} />
            <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
            <Route path="/invoices/:id" element={<InvoicePreview />} />
            <Route path="/invoices" element={<InvoiceList />} />
          </Routes>
        </main>
        <Footer className="footer" />
      </div>
    </ThemeProvider>
  );
}

export default App;
