export default function UiAlert({ message, type = "error" }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`ui-alert ui-alert--${type}`} role="alert">
      {message}
    </div>
  );
}
