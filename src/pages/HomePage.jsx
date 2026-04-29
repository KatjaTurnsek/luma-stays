import UiAlert from "../components/UiAlert";

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>

      <UiAlert message="This is a success message." type="success" />
      <UiAlert message="This is an error message." type="error" />

      <button className="btn ui-btn-primary">Luma Primary</button>
    </>
  );
}
