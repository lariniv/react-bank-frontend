import BackBtn from "../../container/BackBtn";
import Input from "../../container/Input";
import { useState, useMemo, useEffect } from "react";
import Button from "../../container/Button";
import "./index.css";
import { useAuth } from "../../types/AuthContext";
import { useNavigate } from "react-router-dom";
import { REG_EXP } from "../../shared/RegExp";
import DOMAIN from "../../shared/Domain";

const Settings = () => {
  const [changeEmailForm, setChangeEmailForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [changePasswordForm, setChangePasswordForm] = useState<{
    oldPassword: string;
    newPassword: string;
  }>({
    oldPassword: "",
    newPassword: "",
  });

  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const [isDisabledEmail, setIsDisabledEmail] = useState<boolean>(false);
  const [isDisabledPasswordd, setIsDisabledPassword] = useState<boolean>(false);

  const [changeEmailFormError, setChangeEmailFormError] = useState<{
    emailError: string | null;
    passwordError: string | null;
  }>({
    emailError: null,
    passwordError: null,
  });

  const [changePasswordFormError, setChangePasswordFormError] = useState<{
    oldPasswordError: string | null;
    newPasswordError: string | null;
  }>({
    oldPasswordError: null,
    newPasswordError: null,
  });

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(changeEmailForm.email);
  }, [changeEmailForm.email]);

  const checkEmailPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(changeEmailForm.password);
  }, [changeEmailForm.password]);

  const checkNewPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(changePasswordForm.newPassword);
  }, [changePasswordForm.newPassword]);

  const checkOldPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(changePasswordForm.oldPassword);
  }, [changePasswordForm.oldPassword]);

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

  const handleSubmitEmail = async () => {
    const { email, password } = changeEmailForm;

    setChangeEmailFormError((prev) => ({
      ...prev,
      emailError: checkEmailValidity ? null : "Enter proper email",
    }));

    if (password.length < 8) {
      setChangeEmailFormError((prev) => ({
        ...prev,
        passwordError: "Password is too short",
      }));
    } else {
      setChangeEmailFormError((prev) => ({
        ...prev,
        passwordError: checkEmailPasswordValidity
          ? null
          : "Password is too weak",
      }));
    }
    try {
      if (email && password) {
        if (password === state.user.password) {
          const res = await fetch(`${DOMAIN}/settings-email`, {
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
            setChangeEmailFormError({ emailError: null, passwordError: null });

            setChangeEmailForm({ email: "", password: "" });

            setIsDisabledEmail(false);
          } else {
            setIsDisabledEmail(true);
          }
        } else {
          setChangeEmailFormError((prev) => ({
            ...prev,
            passwordError: "Enter correct password",
          }));
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
    const { newPassword, oldPassword } = changePasswordForm;
    if (newPassword.length < 8) {
      setChangePasswordFormError((prev) => ({
        ...prev,
        newPasswordError: "Password is too weak",
      }));
    } else {
      setChangePasswordFormError((prev) => ({
        ...prev,
        newPasswordError: checkNewPasswordValidity
          ? null
          : "Password is too weak",
      }));
    }
    try {
      if (
        !changePasswordFormError.newPasswordError &&
        !changePasswordFormError.oldPasswordError
      ) {
        if (oldPassword === state.user.password) {
          const res = await fetch(`${DOMAIN}/settings-password`, {
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
            setChangePasswordFormError({
              oldPasswordError: null,
              newPasswordError: null,
            });

            setChangePasswordForm({
              newPassword: "",
              oldPassword: "",
            });

            setIsDisabledPassword(false);
          } else {
            setChangePasswordFormError((prev) => ({
              ...prev,
              newPasswordError: data.message,
            }));
            setIsDisabledPassword(true);
          }
        } else {
          setChangePasswordFormError((prev) => ({
            ...prev,
            oldPasswordError: "Enter correct password",
          }));

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
          <form className="container">
            <Input
              type="email"
              name="Email"
              value={changeEmailForm.email}
              setValue={(newValue) =>
                setChangeEmailForm((prev) => ({ ...prev, email: newValue }))
              }
              error={changeEmailFormError.emailError}
            />

            <Input
              type="password"
              name="Password"
              isPassword
              value={changeEmailForm.password}
              setValue={(newValue) =>
                setChangeEmailForm((prev) => ({ ...prev, password: newValue }))
              }
              error={changeEmailFormError.passwordError}
            />

            <Button
              mod="outline"
              text="Save email"
              type="submit"
              disabled={isDisabledEmail}
              action={() => handleSubmitEmail()}
            />
          </form>

          <div className="splitter" />
        </div>

        <div className="container">
          <h2 className="settings-heading__title">Change password</h2>

          <form className="container">
            <Input
              type="password"
              name="Password"
              isPassword
              value={changePasswordForm.oldPassword}
              setValue={(newValue) =>
                setChangePasswordForm((prev) => ({
                  ...prev,
                  oldPassword: newValue,
                }))
              }
              error={changePasswordFormError.oldPasswordError}
            />

            <Input
              type="password"
              name="New password"
              isPassword
              value={changePasswordForm.newPassword}
              setValue={(newValue) =>
                setChangePasswordForm((prev) => ({
                  ...prev,
                  newPassword: newValue,
                }))
              }
              error={changePasswordFormError.newPasswordError}
            />

            <Button
              text="Save submit"
              type="submit"
              mod="outline"
              disabled={isDisabledPasswordd}
              action={() => handleSubmitPassword()}
            />
          </form>

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
