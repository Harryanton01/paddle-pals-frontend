import { toast, type ToastOptions } from "react-toastify";
import { match, P } from "ts-pattern";
import { AxiosError } from "axios";

export const useNotification = () => {
  function addNotification(
    message: string,
    type: ToastOptions["type"] = "info"
  ) {
    toast(message, {
      type,
      position: "bottom-right",
      theme: "dark",
    });
  }

  function addErrorNotification(error: unknown) {
    const status = (error as AxiosError)?.response?.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customMessage = (error as any)?.response?.data?.error;

    match(status)
      .with(P.number, () => {
        if (customMessage) {
          addNotification(customMessage, "error");
          return;
        }
        match(status)
          .with(400, () => addNotification("Bad Request", "error"))
          .with(401, () =>
            addNotification("Unauthorized - Please login again", "error")
          )
          .with(403, () =>
            addNotification("You don't have permission to do this", "error")
          )
          .with(404, () => addNotification("Resource not found", "error"))
          .with(500, () =>
            addNotification("Server error - Try again later", "error")
          )
          .otherwise(() =>
            addNotification("An unexpected error occurred", "error")
          );
      })
      .otherwise(() =>
        addNotification("Network Error - Check your connection", "error")
      );
  }

  return {
    addNotification,
    addErrorNotification,
  };
};
