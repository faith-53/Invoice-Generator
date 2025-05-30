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

function App() {
  return (
    <div>
      <Navbar />
      <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoice/:invoiceId" element={<InvoicePreview />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
        </Routes>
        <Footer />
    </div>
  );
}

export default App;
