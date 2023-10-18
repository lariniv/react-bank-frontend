import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../container/BackBtn";
import Button from "../../container/Button";
import Input from "../../container/Input";
import { ErrorObject } from "../../types/ErrorObject";
import { REG_EXP } from "../../shared/RegExp";
import "./index.css";
import { useAuth } from "../../types/AuthContext";

const Recovery = () => {
  const [email, setEmail] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const { dispatch } = useAuth();

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  useEffect(() => {
    if (checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkEmailValidity]);

  const navigation = useNavigate();

  const handleSubmit = async () => {
    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Enter proper email",
    });

    try {
      if (emailErr.result) {
        const res = await fetch("http://localhost:4000/recovery", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "LOGIN", email: email });

          setEmailErr({
            result: true,
            message: "",
          });

          navigation("/recovery-confirm");
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

        <Input
          type="email"
          name="Email"
          value={email}
          setValue={setEmail}
          error={emailErr}
        />

        <Button
          text="Send code"
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

export default Recovery;
