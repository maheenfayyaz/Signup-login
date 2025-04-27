

import { Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import CreateTask from "./Pages/CreateTask";

function App() {
  console.log("Rendering App component");

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<Login />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/create-task" element={<CreateTask />} />
      </Routes>
    </>
  );
}

export default App;