import PrivateRoute from "./PrivateRoute.jsx";
import LoginSignupPage from "./pages/LoginSIgnup.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { h1 } from "framer-motion/client";
import Photos from "./pages/Photos.jsx";
import NavBar from "./components/navbar/NavBar.jsx";
import Repository from "./pages/Repository.jsx";
import RepoPhotos from "./pages/RepoPhotos.jsx";
import Upload from "./pages/Upload.jsx";
function App() {
  const { userToken } = useAuth();
  console.log(userToken);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              userToken ? <Navigate to="/photos" /> : <LoginSignupPage />
            }
          />
          <Route element={<NavBar />}>
            <Route element={<PrivateRoute />}>
              <Route path="/photos">
                <Route index={true} element={<Photos />} />
                <Route path=":images" element={<RepoPhotos />} />
              </Route>
              <Route path="/albums" element={<Repository />} />
              <Route path="/profile" element={<h1>Profile</h1>} />
              <Route path="/images" element={<h1>Image List</h1>} />
              <Route path="/upload" element={<Upload />} />
              <Route path="*" element={<h1>Error</h1>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
