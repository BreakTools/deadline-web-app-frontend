import { createContext } from "react";

//This is here just so my IDE picks up the variables correctly.
const NotificationContext = createContext({
  getNotificationPermission: function () {},
  sendNotification: function () {},
});

export function NotificationContextProvider(props) {
  //This code handles everything related to the browser notifcations.
  function getNotificationPermission() {
    //This function checks if desktop notifcations are a thing,
    //if they are we ask for permission.
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      return "denied";
    }

    let permission = Notification.permission;

    if (permission === "default") {
      permission = Notification.requestPermission();
    }

    return permission;
  }

  function sendNotification(title, options) {
    //This function sends a notification for the user.
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else {
      console.error("Permission not granted for notifications");
    }
  }

  const context = {
    getNotificationPermission: getNotificationPermission,
    sendNotification: sendNotification,
  };

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
