import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackBtn from "../../container/BackBtn";
import Button from "../../container/Button";
import Input from "../../container/Input";
import { REG_EXP } from "../../shared/RegExp";
import { useAuth } from "../../types/AuthContext";
import "./index.css";
import DOMAIN from "../../shared/Domain";
const SignUp = () => {
  const [alert, setAlert] = useState<string>("");

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<{
    emailError: string | null;
    passwordError: string | null;
  }>({
    emailError: null,
    passwordError: null,
  });

  const navigation = useNavigate();

  const { dispatch } = useAuth();

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(formData.email as string);
  }, [formData.email]);

  const checkPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(formData.password as string);
  }, [formData.password]);

  useEffect(() => {
    if (checkPasswordValidity || checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkPasswordValidity, checkEmailValidity]);

  const handleSubmit = async () => {
    const { password, email } = formData;
    if ((password as string).length < 8) {
      setFormError((prev) => ({
        ...prev,
        passwordError: "Password is too short",
      }));
    }

    setFormError({
      emailError: checkEmailValidity ? null : "Enter proper email",
      passwordError: checkPasswordValidity ? null : "Password is too weak",
    });

    try {
      if (formError.emailError && formError.emailError) {
        const res = await fetch(`${DOMAIN}/signup`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({
            type: "LOGIN",
            email: data.user.email,
            password: data.user.password,
            token: data.user.token,
          });
          setFormError({ emailError: null, passwordError: null });

          setAlert("");
          setIsDisabled(false);
          navigation("/signup-confirm");
        } else {
          setAlert(data.message);
          setIsDisabled(true);
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
    <div className="signup">
      <header className="header">
        <BackBtn />
      </header>

      <main className="main">
        <div className="heading">
          <h2 className="heading__title">Sign up</h2>
          <p className="heading__text">Choose a registration method</p>
        </div>

        <form className="container">
          <Input
            type="email"
            name="Email"
            value={formData.email as string}
            setValue={(newValue) =>
              setFormData((prev) => ({ ...prev, email: newValue }))
            }
            error={formError.emailError}
          />
          <Input
            type="password"
            name="Password"
            isPassword
            value={formData.password as string}
            setValue={(newValue) =>
              setFormData((prev) => ({ ...prev, password: newValue }))
            }
            error={formError.passwordError}
          />

          <div>
            Already have an account?{" "}
            <Link to="/signin" className="signup-link">
              Sign in
            </Link>
          </div>

          <Button
            text="Continue"
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

export default SignUp;
