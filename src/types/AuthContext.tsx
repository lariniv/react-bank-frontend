import { createContext, useContext, useReducer } from "react";

interface User {
  email: string | null;
  password: string | null;
  isConfirm: boolean;
}

interface AuthState {
  token: string | null;
  user: User;
}

type Action = {
  type: "LOGIN" | "LOGOUT";
  email?: string;
  password?: string;
  token?: string;
  isConfirm?: boolean;
};

const AuthReducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      const token = window.localStorage.getItem("token");
      if (token) {
        state.token = token;
      }
      if (action.token) {
        window.localStorage.removeItem("token");
        window.localStorage.setItem("token", action.token);
        state.token = action.token;
      }
      if (action.email) {
        state.user.email = action.email;
      }
      if (action.password) {
        state.user.password = action.password;
      }

      if (action.isConfirm) {
        state.user.isConfirm = action.isConfirm;
      } else {
        state.user.isConfirm = false;
      }
      return state;
    case "LOGOUT":
      state.token = null;
      state.user = {
        email: null,
        password: null,
        isConfirm: false,
      };
      return state;

    default:
      return state;
  }
};

const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    token: null,
    user: {
      email: "faf@gmail.com",
      password: "Testing193!a",
      isConfirm: true,
    },
  });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error with AuthContext");
  }

  return context;
};
