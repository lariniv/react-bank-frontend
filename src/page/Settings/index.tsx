import BackBtn from "../../container/BackBtn";
import Input from "../../container/Input";
import { useState, useMemo, useEffect } from "react";
import { ErrorObject } from "../../types/ErrorObject";
import Button from "../../container/Button";
import "./index.css";
import { useAuth } from "../../types/AuthContext";
import { useNavigate } from "react-router-dom";
import { REG_EXP } from "../../shared/RegExp";

const Settings = () => {
  const [email, setEmail] = useState<string>("");
  const [emailPassword, setEmailPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isDisabledEmail, setIsDisabledEmail] = useState<boolean>(false);
  const [isDisabledPasswordd, setIsDisabledPassword] = useState<boolean>(false);

  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [emailPasswordErr, setEmailPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [oldPasswordErr, setOldPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [newPasswordErr, setNewPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  const checkEmailPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(emailPassword);
  }, [emailPassword]);

  const checkNewPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(newPassword);
  }, [newPassword]);

  const checkOldPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(oldPassword);
  }, [oldPassword]);

  useEffect(() => {
    if (checkEmailPasswordValidity || checkEmailValidity) {
      setIsDisabledEmail(false);
    }
    if (checkNewPasswordValidity || checkOldPasswordValidity) {
      setIsDisabledPassword(false);
    }
  }, [
    checkEmailPasswordValidity,
    checkEmailValidity,
    checkNewPasswordValidity,
    checkOldPasswordValidity,
  ]);

  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSubmitEmail = async () => {
    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Enter proper email",
    });

    if (emailPassword.length < 8) {
      setEmailPasswordErr({ result: false, message: "Password is too short" });
    } else {
      setEmailPasswordErr({
        result: checkEmailPasswordValidity,
        message: checkEmailPasswordValidity ? "" : "Password is too weak",
      });
    }
    try {
      if (emailPasswordErr.result && emailErr.result) {
        if (emailPassword === state.user.password) {
          console.log("Fetching");
          const res = await fetch("http://localhost:4000/settings-email", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              token: state.token,
              email: email,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            dispatch({ type: "LOGIN", email: data.email });
            setEmailErr({
              result: true,
              message: "",
            });

            setEmailPasswordErr({
              result: true,
              message: "",
            });

            setEmail("");

            setEmailPassword("");

            setIsDisabledEmail(false);
          } else {
            setIsDisabledEmail(true);
          }
        } else {
          setEmailPasswordErr({
            result: false,
            message: "Enter correct password",
          });
          setIsDisabledEmail(true);
        }
      } else {
        setIsDisabledEmail(true);
      }
    } catch (err) {
      setIsDisabledEmail(true);
    }
  };

  const handleSubmitPassword = async () => {
    if (newPassword.length < 8) {
      setNewPasswordErr({ result: false, message: "Password is too short" });
    } else {
      setNewPasswordErr({
        result: checkNewPasswordValidity,
        message: checkNewPasswordValidity ? "" : "Password is too weak",
      });
    }
    try {
      if (newPasswordErr.result && oldPasswordErr.result) {
        if (oldPassword === state.user.password) {
          const res = await fetch("http://localhost:4000/settings-password", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              token: state.token,
              password: newPassword,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            dispatch({ type: "LOGIN", password: data.password });
            setOldPasswordErr({
              result: true,
              message: "",
            });

            setNewPasswordErr({
              result: true,
              message: "",
            });

            setNewPassword("");

            setOldPassword("");

            setIsDisabledPassword(false);
          } else {
            setNewPasswordErr({
              result: false,
              message: data.message,
            });
            setIsDisabledPassword(true);
          }
        } else {
          setOldPasswordErr({
            result: false,
            message: "Enter correct password",
          });
          setIsDisabledEmail(true);
        }
      } else {
        setIsDisabledPassword(true);
      }
    } catch (err) {
      setIsDisabledPassword(true);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    if (!state.user.email) {
      navigate("/");
    }
  };
  return (
    <div className="settings">
      <header className="gridded__header">
        <BackBtn />
        <div className="settings-header__item">Settings</div>
      </header>

      <main className="main">
        <div className="container">
          <h2 className="settings-heading__title">Change email</h2>

          <Input
            type="email"
            name="Email"
            value={email}
            setValue={setEmail}
            error={emailErr}
          />

          <Input
            type="password"
            name="Password"
            isPassword
            value={emailPassword}
            setValue={setEmailPassword}
            error={emailPasswordErr}
          />

          <Button
            mod="outline"
            text="Save email"
            type="submit"
            disabled={isDisabledEmail}
            action={() => handleSubmitEmail()}
          />

          <div className="splitter" />
        </div>

        <div className="container">
          <h2 className="settings-heading__title">Change password</h2>

          <Input
            type="password"
            name="Password"
            isPassword
            value={oldPassword}
            setValue={setOldPassword}
            error={oldPasswordErr}
          />

          <Input
            type="password"
            name="New password"
            isPassword
            value={newPassword}
            setValue={setNewPassword}
            error={newPasswordErr}
          />

          <Button
            text="Save submit"
            type="submit"
            mod="outline"
            disabled={isDisabledPasswordd}
            action={() => handleSubmitPassword()}
          />

          <div className="splitter" />
        </div>

        <Button
          mod="outline-red"
          text="Log out"
          type="submit"
          action={() => handleLogout()}
        />
      </main>
    </div>
  );
};

export default Settings;
