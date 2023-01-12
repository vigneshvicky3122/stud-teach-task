import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Create from "./components/Create";

export const url = "https://student-assign-mentor.onrender.com/index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={"/dashboard"} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<Create />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
