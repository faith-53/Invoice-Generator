import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center py-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="display-4 fw-bold">Welcome to InvoicePro</h1>
          <p className="lead mt-4">
            Create, manage, and send professional invoices in seconds. Simple. Fast. Free.
          </p>
          <Link to={"/login"} className="btn btn-primary btn-lg mt-3">
            Create Invoice
          </Link>
        </div>
        <div className="col-md-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3101/3101461.png"
            alt="Invoice Illustration"
            className="img-fluid"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
