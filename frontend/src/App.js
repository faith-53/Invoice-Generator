import { Routes, Route } from "react-router-dom";
import InvoiceItem from "./components/invoices/InvoiceItem";
import Navbar from "./components/ui/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import InvoiceList from "./components/invoices/InvoiceList";
import InvoiceForm from "./components/invoices/InvoiceForm";


function App() {
  return (
    <div>
      <Navbar />
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/invoice/:invoiceId" element={<InvoiceItem />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
          
        </Routes>
    </div>
  );
}

export default App;
