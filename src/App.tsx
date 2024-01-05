import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./types/AuthContext";
import AuthRoute from "./component/AuthRoute";
import PrivateRoute from "./component/PrivateRoute";

import {
  Balance,
  Notification,
  Receive,
  Recovery,
  RecoveryConfirm,
  Send,
  Settings,
  SignIn,
  SignUp,
  SignUpConfirm,
  Transaction,
  WelcomePage,
} from "./page";

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
