import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.component";
import Home from "./components/Home/Home.components";
import Login from "./components/Login/Login.component";
import Register from "./components/Register/Register.component";
import { Profile } from "./components/Profile/Profile.component";
import { Admin } from "./components/Admin/Admin.component";
import { Posts } from "./components/Posts/Posts.components";
import { CreatePost } from "./components/CreatePost/CreatePost.component";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute.component";
import { AuthRoute } from "./components/AuthRoute/AuthRoute.component";

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
        <Route 
          path="/profile/:profileId" 
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
    </>
  );
}

export default App;
