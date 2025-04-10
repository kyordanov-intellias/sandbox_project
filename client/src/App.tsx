import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header/Header.component";
import Home from "./components/Home/Home.components";
import Login from "./components/Login/Login.component";
import Register from "./components/Register/Register.component";
import PrivateRoute from "./components/Route-Guards/PrivateRoute/PrivateRoute.component";
import AuthRoute from "./components/Route-Guards/AuthRoute/AuthRoute.component";
import Profile from "./components/Profile/Profile.component";

const Posts = lazy(() => import("./components/Posts/Posts.components"));
const Admin = lazy(() => import("./components/Admin/Admin.component"));

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route
          path="/messenger"
          element={
            <PrivateRoute>
              <h1>Messenger Page</h1>
            </PrivateRoute>
          }
        />
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
