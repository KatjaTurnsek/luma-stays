export default function Loader({ text = "Loading..." }) {
  return (
    <div className="ui-loader" role="status" aria-live="polite">
      <span className="ui-loader__spinner"></span>
      <span>{text}</span>
    </div>
  );
}
