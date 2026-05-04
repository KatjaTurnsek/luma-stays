import checkCircleIcon from "../assets/icons/check-circle.svg";
import closeIcon from "../assets/icons/add.svg";
import alertTriangleIcon from "../assets/icons/alert-triangle.svg";
import infoIcon from "../assets/icons/info.svg";

const ALERT_CONTENT = {
  success: {
    title: "Success",
    icon: checkCircleIcon,
  },
  error: {
    title: "Error",
    icon: closeIcon,
  },
  warning: {
    title: "Warning",
    icon: alertTriangleIcon,
  },
  info: {
    title: "Info",
    icon: infoIcon,
  },
};

/**
 * Displays a reusable UI alert message.
 * @param {object} props - Component props.
 * @param {string} props.message - Alert message.
 * @param {"success" | "error" | "warning" | "info"} props.type - Alert type.
 * @param {Function} [props.onClose] - Optional close handler.
 * @returns {JSX.Element|null} Alert component.
 */
export default function UiAlert({ message, type = "error", onClose }) {
  if (!message) {
    return null;
  }

  const alert = ALERT_CONTENT[type] || ALERT_CONTENT.info;

  return (
    <div className={`ui-alert ui-alert--${type}`} role="alert">
      <div className="ui-alert__content">
        <img
          className="ui-alert__icon"
          src={alert.icon}
          alt=""
          aria-hidden="true"
        />

        <div>
          <h2>{alert.title}</h2>
          <p>{message}</p>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          className="ui-alert__close"
          onClick={onClose}
          aria-label="Close message"
        >
          ×
        </button>
      )}
    </div>
  );
}
