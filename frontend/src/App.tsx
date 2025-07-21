import { BrowserRouter, Routes, Route } from "react-router"
import LandingPage from "./pages/LandingPage"
import ProjectDiscovery from "./pages/ProjectDiscoveryPage"
import ProjectPage from "./pages/ProjectPage"
import AboutUsPage from "./pages/AboutUsPage"
import LoginPage from "./pages/LoginPage"
import RegisterationPage from "./pages/RegisterationPage"
import UserDashboard from "./pages/UserDashboard"
import { getUserProfile } from "./api/User"
import { useDispatch } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { setCredentials } from "./store/userSlice"
import { useEffect } from "react"

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('jwtToken');
  console.log(token)

  const {data: user, isError, error, isSuccess} = useQuery({
    queryKey: ['GetUserProfile', token],
    queryFn: () => getUserProfile(token!),
    enabled: !!token,
    retry: false
  })

  useEffect(() => {
    if (isError) {
      toast.error("Session has expired or error occurred while getting your profile");
      console.error("Error while 'relogging' user", error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && user) {
      user.token = token!;
      dispatch(setCredentials(user));
    }
  }, [isSuccess, user, token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/discover-projects" element={<ProjectDiscovery/>}/>
        <Route path="/project/:id" element={<ProjectPage/>}/>
        <Route path="/about-us" element={<AboutUsPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterationPage/>}/>
        <Route path="/dashboard" element={<UserDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
