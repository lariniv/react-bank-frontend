import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getHoursAndMinute from "../../shared/GetHoursAndMinute";
import { useAuth } from "../../types/AuthContext";
import { TransactionsObject } from "../../types/TransactionObject";
import "./index.css";

const Balance = () => {
  const { state } = useAuth();
  const [balance, setBalance] = useState<number>(10.0);
  const [transactions, setTransactions] = useState<Array<TransactionsObject>>(
    []
  );

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/balance", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: state.token }),
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance);
        setTransactions(data.transactionsList);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="balance">
      <div className="header__wrapper">
        <header className="header">
          <Link to="/settings">
            <div className="settings-icon" />
          </Link>
          <div className="header__item">Main wallet</div>
          <Link to="/notification">
            <div className="notification-icon" />
          </Link>
        </header>

        <div className="value">
          $ {String(balance).split(".")[0]}
          <span className="value--minor">
            .
            {String(balance).split(".")[1]
              ? String(balance).split(".")[1]
              : "0"}
          </span>
        </div>

        <div className="balance__buttons">
          <Link to="/receive" className="button__wrapper">
            <div className="test">
              <div className="button__icon__wrapper">
                <div className="button__icon-receive" />
              </div>
            </div>
            <div className="button__text">Receive</div>
          </Link>

          <Link to="/send" className="button__wrapper">
            <div className="test">
              <div className="button__icon__wrapper">
                <div className="button__icon-send" />
              </div>
            </div>
            <div className="button__text">Send</div>
          </Link>
        </div>
      </div>

      <main className="main offset-top">
        <div className="transactions-list">
          {transactions.reverse().map((item) => {
            let icon = "";
            let time;
            let name: string = "";
            if (item.type === "receive") {
              if (item.address?.toLowerCase() === "stripe") {
                icon = "transaction__icon--stripe";
                name = "Stripe";
              } else if (item.address?.toLowerCase() === "coinbase") {
                icon = "transaction__icon--coinbase";
                name = "Coinbase";
              } else {
                if (item.address) {
                  icon = "transaction__icon--user";
                  name = item.address?.split("@")[0] as string;
                  name = name[0].toUpperCase() + name.slice(1);
                }
              }
            } else if (item.type === "send") {
              icon = "transaction__icon--user";
              name = item.address?.split("@")[0] as string;
              name = name[0].toUpperCase() + name.slice(1);
            }

            if (item.date) {
              time = getHoursAndMinute(item.date);
            }
            return (
              <Link
                to={`/transaction/${state.token}/${item.id}`}
                className="transaction"
                key={item.id}
              >
                <div className="transaction__wrapper">
                  <div className={`transaction__icon ${icon}`} />

                  <div className="transaction__content">
                    <div className="transaction__title">{name}</div>

                    <div className="transaction__description">
                      <div className="transaction__date">{time}</div>
                      <div className="transaction__type">
                        {item.type && item.type === "send"
                          ? "Sending"
                          : "Receipt"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`transaction__sum ${
                    item.type === "receive"
                      ? "transaction__sum--receive"
                      : "transaction__sum--send"
                  }`}
                >
                  {item.type === "receive" ? "+$" : "-$"}
                  {String(item.sum).split(".")[0]}
                  <span className={`transaction__subsum `}>
                    .
                    {String(item.sum).split(".")[1]
                      ? String(item.sum).split(".")[1]
                      : "0"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Balance;
