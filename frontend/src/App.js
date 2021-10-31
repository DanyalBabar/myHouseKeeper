import React from "react";
import { AuthProvider } from "./contexts/AuthContext.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import Signup from "./pages/AuthPages/Signup";

import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute.js";
import MainPage from "./pages/MainPage.js";

function App() {
  return (
    <>
      <div className="min-h-screen">
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={MainPage} />

              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
