import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import QuestionPage from "./pages/QuestionPage";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/question/:id" element={<QuestionPage />} />
    </Routes>
  );
}

export default App;
