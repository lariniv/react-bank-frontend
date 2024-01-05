import { useState, useMemo, useEffect } from "react";
import BackBtn from "../../container/BackBtn";
import Input from "../../container/Input";
import { REG_EXP } from "../../shared/RegExp";
import "./index.css";
import Button from "../../container/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../types/AuthContext";
import DOMAIN from "../../shared/Domain";

const Send = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");

  const [formData, setFormData] = useState({
    email: "",
    sum: "",
  });

  const [formError, setFormError] = useState<{
    emailError: string | null;
    sumError: string | null;
  }>({
    emailError: "",
    sumError: "",
  });

  const navigation = useNavigate();

  const { state } = useAuth();

  const checkEmailValidity = useMemo(() => {
    return REG_EXP.EMAIL.test(formData.email);
  }, [formData.email]);

  const checkSumValidity = useMemo(() => {
    const sum = formData.sum;

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
  }, [formData.sum]);

  useEffect(() => {
    if (checkSumValidity || checkEmailValidity) {
      setIsDisabled(false);
    }
  }, [checkSumValidity, checkEmailValidity]);

  const handleSubmit = async () => {
    setFormError({
      sumError: checkSumValidity ? null : "Enter proper sum",
      emailError: checkEmailValidity ? null : "Enter proper email",
    });

    try {
      if (!formError.emailError && !formError.sumError) {
        const res = await fetch(`${DOMAIN}/send`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            sum: Number(formData.sum),
            token: state.token,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setFormError({
            sumError: null,
            emailError: null,
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

      <form className="container">
        <Input
          type="email"
          name="Email"
          value={formData.email}
          setValue={(newValue) =>
            setFormData((prev) => ({ ...prev, email: newValue }))
          }
          error={formError.emailError}
        />

        <Input
          type="number"
          name="Sum"
          value={formData.sum}
          setValue={(newValue) =>
            setFormData((prev) => ({ ...prev, sum: newValue }))
          }
          error={formError.sumError}
        />

        <Button
          text="Send"
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
    </div>
  );
};

export default Send;
