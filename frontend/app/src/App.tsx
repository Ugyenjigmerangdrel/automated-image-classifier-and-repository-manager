import { ThemeProvider } from './context/theme-provider.tsx'
import { useAuth } from './context/AuthContext.tsx';
import Gallery from "./components/pages/Gallery.tsx";
import Album from './components/pages/Album.tsx';
import AlbumPhoto from './components/pages/AlbumPhotos.tsx';
import Upload from './components/pages/Upload.tsx';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.tsx';
import LoginSignup from './components/pages/LoginSignup.tsx';
import SideBar from './components/dashboard/Sidebar.tsx';

function App() {
  const { userToken } = useAuth();
  console.log(userToken)
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"><Router>
        <Routes>
          <Route
            path="/"
            element={
              userToken ? <Navigate to="/photos" /> : <LoginSignup />
            }
          />
          <Route element={ <SideBar /> }>
            <Route element={<PrivateRoute />}>
              <Route path="/photos">
                <Route index={true} element={<Gallery />} />
                <Route path=":images" element={<AlbumPhoto />} />
              </Route>
              <Route path="/album" element={<Album />} />
              <Route path="/profile" element={<h1>Profile</h1>} />
              <Route path="/images" element={<h1>Image List</h1>} />
              <Route path="/upload" element={<Upload />} />
              <Route path="*" element={<h1>Error</h1>} />
            </Route>
          </Route>
        </Routes>
      </Router></ThemeProvider>
     
    </>
  )
}

export default App
