import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Privacy from "./Privacy";
import Terms from "./Terms";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}
