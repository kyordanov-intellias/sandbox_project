import { lazy, Suspense } from "react";
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
const CreatePost = lazy(
  () => import("./components/CreatePost/CreatePost.component")
);

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route
            path="/profile/:profileId"
            // TODO -> in future you can search other users
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
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
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
