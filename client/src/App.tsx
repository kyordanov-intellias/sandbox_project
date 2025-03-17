import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.component";
import Login from "./components/Login/Login.component";
import Register from "./components/Register/Register.component";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<h1>Home Page</h1>} />
        <Route path="/posts" element={<h1>Posts Page</h1>} />
        <Route path="/messenger" element={<h1>Messenger Page</h1>} />
        <Route path="/profile" element={<h1>Profile Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
