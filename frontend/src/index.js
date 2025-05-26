import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { InvoiceProvider } from './context/invoiceContext';
import App from './App';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </AuthProvider>,
  </BrowserRouter>
);


