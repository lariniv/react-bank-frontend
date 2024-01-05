import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../container/BackBtn";
import Button from "../../container/Button";
import Input from "../../container/Input";
import { REG_EXP } from "../../shared/RegExp";
import "./index.css";
import { useAuth } from "../../types/AuthContext";
import DOMAIN from "../../shared/Domain";
const RecoveryConfirm = () => {
  const [formData, setFormData] = useState({
    code: "",
    password: "",
  });

  const [formError, setFormError] = useState<{
    codeError: string | null;
    passwordError: string | null;
  }>({
    codeError: "",
    passwordError: "",
  });

  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { state, dispatch } = useAuth();

  const checkPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(formData.password);
  }, [formData.password]);

  const checkCodeValidity = useMemo(() => {
    if (formData.code.length < 6) {
      return false;
    }
    return true;
  }, [formData.code]);

  useEffect(() => {
    if (checkPasswordValidity || checkCodeValidity) {
      setIsDisabled(false);
    }
  }, [checkPasswordValidity, checkCodeValidity]);

  const navigation = useNavigate();

  const handleSubmit = async () => {
    if (formData.password.length < 8) {
      setFormError((prev) => ({
        ...prev,
        passwordError: "Password is too short",
      }));
    } else {
      setFormError((prev) => ({
        ...prev,
        passwordError: checkPasswordValidity ? null : "Password is too weak",
      }));
    }

    setFormError((prev) => ({
      ...prev,
      codeError: checkCodeValidity ? null : "Enter valid code",
    }));

    try {
      if (checkCodeValidity && checkPasswordValidity) {
        const res = await fetch(`${DOMAIN}/recovery-confirm`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            code: formData.code,
            newPassword: formData.password,
            email: state.user.email,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setFormError({
            codeError: null,
            passwordError: null,
          });

          setAlert("");

          dispatch({ type: "LOGIN", ...data.user });

          console.log(state);

          navigation("/balance");
        } else {
          setAlert(data.message);
        }
      } else {
        setAlert("Fill in all the fields");
        setIsDisabled(true);
      }
    } catch (err: any) {
      if (err.message) {
        setAlert(err.message);
        setIsDisabled(true);
      }
    }
  };

  return (
    <div className="recovery">
      <header className="header">
        <BackBtn />
      </header>

      <main className="main">
        <div className="heading">
          <h2 className="heading__title">Recover password</h2>
          <p className="heading__text">Choose a recovery method</p>
        </div>

        <form className="container">
          <Input
            type="code"
            name="Code"
            value={formData.code}
            setValue={(newValue: string) =>
              setFormData((prev) => ({ ...prev, code: newValue }))
            }
            error={formError.codeError}
          />

          <Input
            type="password"
            name="Password"
            isPassword
            value={formData.password}
            setValue={(newValue: string) =>
              setFormData((prev) => ({ ...prev, password: newValue }))
            }
            error={formError.passwordError}
          />

          <Button
            text="Send code"
            type="submit"
            disabled={isDisabled}
            action={() => handleSubmit()}
          />
        </form>

        {!!alert && (
          <div className="alert">
            <div className="alert__icon" />
            {alert}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecoveryConfirm;
