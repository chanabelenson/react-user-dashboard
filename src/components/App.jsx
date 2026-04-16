import { Route, Routes, Navigate } from "react-router-dom";
import { UserProvider } from "../features/auth/context/UserContext";
import { TodosCacheProvider } from "../features/todos/cache/TodosCash.jsx";
import { AlbunsCacheProvider } from "../features/albums/cache/albumsCash.jsx";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Home from "../features/shared/components/Home";
import Todos from "../features/todos/pages/Todos.jsx";
import RegisterDetails from "../features/auth/pages/RegisterDetails";
import Albums from "../features/albums/pages/Albums.jsx";
import Posts from "../features/posts/pages/Posts.jsx";
import PostDetails from "../features/posts/pages/PostDetails.jsx";
import AlbumsPhotos from "../features/albums/pages/AlbumsPhotosNew.jsx";
import ProtectedRoute from "../features/auth/pages/ProtectedRoute.jsx";
import Forbidden from "../features/auth/pages/Forbidden.jsx";
import NotFound from "../features/auth/pages/NotFound.jsx";
import '../styles/global.css';

function App() {
  return (
    <UserProvider>
      <TodosCacheProvider>
        <AlbunsCacheProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/register/more_details"
              element={<RegisterDetails />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/users/:userId/home" element={<Home />} />
              <Route path="/users/:userId/todos" element={<Todos />} />
              <Route path="/users/:userId/posts" element={<Posts />} />
              <Route
                path="/users/:userId/posts/:postId"
                element={<PostDetails />}
              />
              <Route path="/users/:userId/albums" element={<Albums />} />
              <Route
                path="/users/:userId/albums/:albumId"
                element={<AlbumsPhotos />}
              />
            </Route>
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AlbunsCacheProvider>
      </TodosCacheProvider>
    </UserProvider>
  );
}

export default App;