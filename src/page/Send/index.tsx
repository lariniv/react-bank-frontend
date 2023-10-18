import { useState, useMemo, useEffect } from "react";
import BackBtn from "../../container/BackBtn";
import Input from "../../container/Input";
import { ErrorObject } from "../../types/ErrorObject";
import { REG_EXP } from "../../shared/RegExp";
import "./index.css";
import Button from "../../container/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../types/AuthContext";

const Send = () => {
  const [email, setEmail] = useState<string>("");
  const [sum, setSum] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");

  const navigation = useNavigate();

  const { state } = useAuth();

  const [emailErr, setEmailErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

  const [sumErr, setSumErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });
  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(email);
  }, [email]);

  const checkSumValidity = useMemo(() => {
    if (sum.length !== 0) {
      if (sum[0] === "$") {
        let formattedSum = sum.slice(1);
        if (isNaN(Number(formattedSum))) {
          return false;
        } else {
          return true;
        }
      }
      if (sum[sum.length - 1] === "$") {
        let formattedSum = sum.slice(0, -1);
        if (isNaN(Number(formattedSum))) {
          return false;
        } else {
          return true;
        }
      }
      if (isNaN(Number(sum))) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }, [sum]);

  useEffect(() => {
    if (checkSumValidity || checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkSumValidity, checkEmailValidity]);

  const handleSubmit = async () => {
    setEmailErr({
      result: checkEmailValidity,
      message: checkEmailValidity ? "" : "Enter proper email",
    });

    setSumErr({
      result: checkSumValidity,
      message: checkSumValidity ? "" : "Enter proper sum",
    });

    try {
      if (emailErr.result && sumErr.result) {
        const res = await fetch("http://localhost:4000/send", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            sum: Number(sum),
            token: state.token,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setSumErr({
            result: true,
            message: "",
          });

          setEmailErr({
            result: true,
            message: "",
          });

          setAlert("");
          navigation("/balance");
          setIsDisabled(false);
        } else {
          setAlert(data.message);
          setIsDisabled(true);
        }
      }
    } catch (err: any) {
      if (err.message) {
        setAlert(err.message);
        setIsDisabled(true);
      }
    }
  };

  return (
    <div className="settings">
      <header className="gridded__header">
        <BackBtn />
        <div className="settings-header__item">Send</div>
      </header>

      <Input
        type="email"
        name="Email"
        value={email}
        setValue={setEmail}
        error={emailErr}
      />

      <Input
        type="number"
        name="Sum"
        value={sum}
        setValue={setSum}
        error={sumErr}
      />

      <Button
        text="Send"
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
    </div>
  );
};

export default Send;
