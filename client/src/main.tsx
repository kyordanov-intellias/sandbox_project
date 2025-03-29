import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import { PostsProvider } from "./context/PostsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PostsProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </PostsProvider>
    </BrowserRouter>
  </StrictMode>
);
