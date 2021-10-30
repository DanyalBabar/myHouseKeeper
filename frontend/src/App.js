import React from "react";
// import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import Signup from "./pages/AuthPages/Signup";
import UpdateEmail from "./pages/AuthPages/UpdateEmail";
import UpdatePassword from "./pages/AuthPages/UpdatePassword";
import UpdateProfile from "./pages/AuthPages/UpdateProfile";

import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute.js";
import MainPage from "./pages/MainPage.js";

function App() {
  return (
    <>
      {/* <Container
        className="align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      > */}
      <div
        className="min-h-screen"
        // className="w-100"
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   padding: "5vh",
        //   flexDirection: "column",
        // }}
      >
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={MainPage} />
              <PrivateRoute
                exact
                path="/update-profile"
                component={UpdateProfile}
              />
              {/* <PrivateRoute exact path="/settings" component={Settings} /> */}
              <PrivateRoute
                exact
                path="/update-password"
                component={UpdatePassword}
              />
              <PrivateRoute
                exact
                path="/update-email"
                component={UpdateEmail}
              />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
      {/* </Container> */}
    </>
  );
}

export default App;
