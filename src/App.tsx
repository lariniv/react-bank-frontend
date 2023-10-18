import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "./component/AuthRoute";
import { AuthProvider } from "./types/AuthContext";
import WelcomePage from "./page/WelcomePage";
import SignUp from "./page/SignUp";
import PrivateRoute from "./component/PrivateRoute";
import SignUpConfirm from "./page/SignUpConfirm";
import SignIn from "./page/SignIn";
import Recovery from "./page/Recovery";
import RecoveryConfirm from "./page/RecoveryConfirm";
import Balance from "./page/Balance";
import Settings from "./page/Settings";
import Send from "./page/Send";
import Receive from "./page/Receive";
import Notification from "./page/Notification";
import Transaction from "./page/Transacation";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <AuthRoute>
                <WelcomePage />
              </AuthRoute>
            }
          />
          <Route
            path="signup"
            element={
              <AuthRoute>
                <SignUp />
              </AuthRoute>
            }
          />
          <Route
            path="signup-confirm"
            element={
              <PrivateRoute>
                <SignUpConfirm />
              </PrivateRoute>
            }
          />
          <Route
            path="signin"
            element={
              <AuthRoute>
                <SignIn />
              </AuthRoute>
            }
          />
          <Route
            path="recovery"
            element={
              <AuthRoute>
                <Recovery />
              </AuthRoute>
            }
          />
          <Route
            path="recovery-confirm"
            element={
              <AuthRoute>
                <RecoveryConfirm />
              </AuthRoute>
            }
          />
          <Route
            path="balance"
            element={
              <PrivateRoute>
                <Balance />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="send"
            element={
              <PrivateRoute>
                <Send />
              </PrivateRoute>
            }
          />
          <Route
            path="receive"
            element={
              <PrivateRoute>
                <Receive />
              </PrivateRoute>
            }
          />
          <Route
            path="notification"
            element={
              <PrivateRoute>
                <Notification />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction/:token/:id"
            element={
              <PrivateRoute>
                <Transaction />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
