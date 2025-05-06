import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { PrivateRoute } from './components/layout';
import {
  Login,
  Register,
  Dashboard,
  InvoiceList,
  InvoiceForm,
  InvoicePreview,
  NotFound
} from './components';

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <PrivateRoute exact path="/" component={Dashboard} />
      <PrivateRoute exact path="/invoices" component={InvoiceList} />
      <PrivateRoute exact path="/invoices/new" component={InvoiceForm} />
      <PrivateRoute exact path="/invoices/:id" component={InvoicePreview} />
      <PrivateRoute exact path="/invoices/:id/edit" component={InvoiceForm} />
      <Route path="/404" component={NotFound} />
      <Redirect to="/404" />
    </Switch>
  );
};

export default AppRouter;