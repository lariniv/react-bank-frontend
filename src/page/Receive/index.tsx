import { useState, useMemo } from "react";
import BackBtn from "../../container/BackBtn";
import Input from "../../container/Input";
import { ErrorObject } from "../../types/ErrorObject";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../types/AuthContext";

const Receive = () => {
  const [sum, setSum] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  const navigation = useNavigate();

  const { state } = useAuth();

  const [sumErr, setSumErr] = useState<ErrorObject>({
    result: true,
    message: "",
  });

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

  const handleStripe = async () => {
    setSumErr({
      result: checkSumValidity,
      message: checkSumValidity ? "" : "Enter proper sum",
    });

    try {
      const res = await fetch("http://localhost:4000/receive", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token: state.token,
          sum: sum,
          address: "stripe",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSumErr({ result: false, message: "" });
        setAlert("");
        navigation("/balance");
      } else {
        setAlert(data.message);
        console.log(data.message);
      }
    } catch (err: any) {
      setAlert(err.message);
    }
  };

  const handleCoinbase = async () => {
    setSumErr({
      result: checkSumValidity,
      message: checkSumValidity ? "" : "Enter proper sum",
    });

    try {
      const res = await fetch("http://localhost:4000/receive", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token: state.token,
          sum: sum,
          address: "coinbase",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSumErr({ result: false, message: "" });
        setAlert("");
        navigation("/balance");
      } else {
        setAlert(data.message);
      }
    } catch (err: any) {
      setAlert(err.message);
    }
  };

  return (
    <div className="settings">
      <header className="gridded__header">
        <BackBtn />
        <div className="settings-header__item">Receive</div>
      </header>

      <Input
        type="number"
        name="Receive number"
        value={sum}
        setValue={setSum}
        error={sumErr}
      />

      <div className="splitter" />

      <div className="container">
        <h2 className="title">Payment system</h2>

        <div className="card" onClick={() => handleStripe()}>
          <div className="receive__content">
            <div className="receive__icon receive__icon--stripe" />
            <div className="receive__text">Stripe</div>
          </div>

          <div className="receive__payments">
            <div className="receive__payment receive__payment--mastercard" />
            <div className="receive__payment receive__payment--throne1" />
            <div className="receive__payment receive__payment--bitcoin" />
            <div className="receive__payment receive__payment--throne2" />
            <div className="receive__payment receive__payment--etherium" />
            <div className="receive__payment receive__payment--binance" />
          </div>
        </div>

        <div className="card pointer" onClick={() => handleCoinbase()}>
          <div className="receive__content">
            <div className="receive__icon receive__icon--coinbase" />
            <div className="receive__text">Coinbase</div>
          </div>

          <div className="receive__payments">
            <div className="receive__payment receive__payment--throne1" />
            <div className="receive__payment receive__payment--mastercard" />
            <div className="receive__payment receive__payment--throne2" />
            <div className="receive__payment receive__payment--bitcoin" />
            <div className="receive__payment receive__payment--binance" />
            <div className="receive__payment receive__payment--etherium" />
          </div>
        </div>
      </div>

      {!!alert && (
        <div className="alert">
          <div className="alert__icon" />
          {alert}
        </div>
      )}
    </div>
  );
};

export default Receive;
