import React, { useContext } from "react";
import { NotificationContext } from "../../contexts/NotificationContext";
import "./Notification.css";

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  const notificationClass = `notification ${notification.type}`;

  return <div className={notificationClass}>{notification.message}</div>;
};

export default Notification;
