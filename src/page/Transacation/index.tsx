import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackBtn from "../../container/BackBtn";
import { TransactionsObject } from "../../types/TransactionObject";
import "./index.css";

const Transaction = () => {
  const [transaction, setTransaction] = useState<TransactionsObject>();

  const { id, token } = useParams();

  console.log(id, token);

  const getDate = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("en-US", { month: "long" });
    const hour = newDate.getHours();
    const minutes = newDate.getMinutes();
    let minutesString;
    if (minutes < 10) {
      minutesString = "0" + String(minutes);
    } else {
      minutesString = String(minutes);
    }
    return `${day} ${month}, ${hour}:${minutesString}`;
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/transaction?token=${token}&id=${id}`,
        { method: "GET" }
      );

      const data = await res.json();

      if (res.ok) {
        setTransaction(data.transaction);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(transaction);
    fetchData();
  }, []);
  return (
    <div className="settings">
      <header className="gridded__header">
        <BackBtn />
        <div className="settings-header__item">Transaction</div>
      </header>

      <main className="main">
        <div
          className={`sum__title ${
            transaction?.type === "send" ? "send" : "receive"
          }`}
        >
          {transaction?.type === "send" ? "-$" : "+$"}
          {String(transaction?.sum).split(".")[0]}
          <span className="sum__subtitle">
            .
            {String(transaction?.sum).split(".")[1]
              ? String(transaction?.sum).split(".")[1]
              : "0"}
          </span>
        </div>

        <div className="transaction__card">
          <div className="transaction__container">
            <div className="transaction__name">Date</div>
            <div className="transaction__details">
              {transaction?.date && getDate(transaction.date)}
            </div>
          </div>

          <div className="splitter" />

          <div className="transaction__container">
            <div className="transaction__name">Address</div>
            <div className="transaction__details">
              {transaction?.type === "receive"
                ? transaction?.address &&
                  transaction?.address[0].toUpperCase() +
                    transaction?.address.slice(1)
                : transaction?.address}
            </div>
          </div>

          <div className="splitter" />

          <div className="transaction__container">
            <div className="transaction__name">Type</div>
            <div className="transaction__details">
              {transaction?.type && transaction?.type[0].toUpperCase()}
              {transaction?.type && transaction?.type.slice(1)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transaction;
