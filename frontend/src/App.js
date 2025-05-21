import { Routes, Route } from "react-router-dom";
import InvoiceItem from "./Pages/invoices/InvoiceItem";
//import Navbar from "./components/ui/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import InvoiceList from "./Pages/invoices/InvoiceList";
import InvoiceForm from "./Pages/invoices/InvoiceForm";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register"
import Header from "./components/layout/Header";
import Home from "./Pages/Home/Home";


function App() {
  return (
    <div>
      <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoice/:invoiceId" element={<InvoiceItem />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
          
        </Routes>
    </div>
  );
}

export default App;
