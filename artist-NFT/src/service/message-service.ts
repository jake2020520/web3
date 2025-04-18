import { Store } from "react-notifications-component";
import type { NOTIFICATION_TYPE } from "react-notifications-component";

export const messageBox = async (
  type: NOTIFICATION_TYPE | undefined,
  title: string,
  message: string
) => {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true,
    },
  });
};
