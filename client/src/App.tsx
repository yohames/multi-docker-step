import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import OtherPage from "./OtherPage";
import Fib from "./jib";

function App() {
  return (
    <>
      <div className="card">
        <Link to="/">Home</Link> | <Link to="/otherpage">Other Page</Link>
      </div>
      <Routes>
        <Route path="/" Component={Fib} />
        <Route path="/otherpage" Component={OtherPage} />
      </Routes>
    </>
  );
}

export default App;
