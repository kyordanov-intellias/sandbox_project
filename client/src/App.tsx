import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.component";
import Home from "./components/Home/Home.components";
import Login from "./components/Login/Login.component";
import Register from "./components/Register/Register.component";
import { Profile } from "./components/Profile/Profile.component";
import { Admin } from "./components/Admin/Admin.component";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<h1>Posts Page</h1>} />
        <Route path="/messenger" element={<h1>Messenger Page</h1>} />
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
