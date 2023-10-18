import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackBtn from "../../container/BackBtn";
import Button from "../../container/Button";
import Input from "../../container/Input";
import { REG_EXP } from "../../shared/RegExp";
import { useAuth } from "../../types/AuthContext";
import { ErrorObject } from "../../types/ErrorObject";
import "./index.css";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [passwordErr, setPasswordErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const navigation = useNavigate();

  const { dispatch } = useAuth();

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  const checkPasswordValidity = useMemo(() => {
    return REG_EXP.PASSWORD.test(password);
  }, [password]);

  useEffect(() => {
    if (checkPasswordValidity || checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkPasswordValidity, checkEmailValidity]);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setPasswordErr({ result: false, message: "Password is too short" });
    } else {
      setPasswordErr({
        result: checkPasswordValidity,
        message: checkPasswordValidity ? "" : "Password is too weak",
      });
    }

    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Enter proper email",
    });

    console.log("About to fetch");

    try {
      if (emailErr.result && passwordErr.result) {
        console.log("About to fetch");
        const res = await fetch("http://localhost:4000/signup", {
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

          setPasswordErr({
            result: true,
            message: "",
          });

          setEmailErr({
            result: true,
            message: "",
          });

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
          value={password}
          setValue={setPassword}
          error={passwordErr}
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
