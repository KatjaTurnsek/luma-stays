import Loader from "../components/Loader";

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <Loader text="Loading stays..." />
      <button className="btn ui-btn-primary">Luma Primary</button>
    </>
  );
}
