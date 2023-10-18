import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../container/BackBtn";
import Button from "../../container/Button";
import Input from "../../container/Input";
import { useAuth } from "../../types/AuthContext";
import { ErrorObject } from "../../types/ErrorObject";
import "./index.css";

const SignUpConfirm = () => {
  const [code, setCode] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [codeErr, setCodeErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const [res, setRes] = useState<number>(0);

  const { state, dispatch } = useAuth();

  const fetchData = async (email: string) => {
    try {
      const response = await fetch("http://localhost:4000/signup-confirm", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setRes(data.code);
        console.log(data.code);
      } else {
        setAlert(data.message);
      }
    } catch (err: any) {
      if (err.message) {
        setAlert(err.message);
      }
    }
  };

  const navigation = useNavigate();

  useEffect(() => {
    const email = state.user.email;
    if (email) {
      fetchData(email);
    }
  }, [state.user.email]);

  const checkCodeValidity = useMemo(() => {
    if (code.length < 6) {
      return false;
    }
    return true;
  }, [code]);

  useEffect(() => {
    if (checkCodeValidity) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [checkCodeValidity]);

  const handleSubmit = async () => {
    try {
      if (checkCodeValidity && Number(code) === res) {
        setCodeErr({
          result: true,
          message: "",
        });
        const response = await fetch(
          "http://localhost:4000/signup-confirm-code",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              isConfirm: true,
              email: state.user.email,
              token: state.token,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          dispatch({ type: "LOGIN", isConfirm: data.isConfirm });
          navigation("/balance");
        } else {
          setAlert(data.message);
        }
      } else {
        setCodeErr({ result: false, message: "Enter valid code" });
      }
    } catch (err: any) {
      if (err.message) {
        setAlert(err.message);
      }
    }

    console.log(Number(code), checkCodeValidity, res);
  };

  return (
    <div className="signup">
      <header className="header">
        <BackBtn />
      </header>

      <main className="main">
        <div className="heading">
          <h2 className="heading__title">Confirm account</h2>
          <p className="heading__text">Write the code you received</p>
        </div>

        <Input
          name="Code"
          value={code}
          setValue={setCode}
          error={codeErr}
          type="code"
        />

        <Button
          text="Confirm"
          href="/signup-confirm"
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

export default SignUpConfirm;
