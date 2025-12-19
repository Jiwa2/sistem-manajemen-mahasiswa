import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import "./index.css";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* halaman login */}
        <Route path="/" element={<Login />} />

        {/* halaman utama */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
