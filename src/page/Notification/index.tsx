import { useEffect, useState } from "react";
import BackBtn from "../../container/BackBtn";
import getDate from "../../shared/GetDate";
import { useAuth } from "../../types/AuthContext";
import { NotificationObject } from "../../types/NotificationObject";
import "./index.css";

const Notification = () => {
  const [notification, setNotification] = useState<Array<NotificationObject>>(
    []
  );

  const { state } = useAuth();
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/notification", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ token: state.token }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.notificationList);
        setNotification(data.notificationList);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
    console.log(notification);
  }, []);
  return (
    <div className="settings">
      <header className="gridded__header">
        <BackBtn />
        <div className="settings-header__item">Notifications</div>
      </header>
      <div className="container">
        {notification.reverse().map((item) => (
          <div className="card" key={item?.id}>
            <div
              className={`card__icon card__icon--small ${
                item?.type === "warning"
                  ? "card__icon--warning"
                  : "card__icon--announcement"
              }`}
            />

            <div className="card__content">
              <div className="card__title">{item?.text}</div>

              <div className="card__description">
                <div className="card__date">{getDate(item?.date as Date)}</div>
                <div className="card__type">
                  {item?.type === "warning" ? "Warning" : "Announcement"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
