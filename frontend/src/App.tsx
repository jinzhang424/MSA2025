import { BrowserRouter, Routes, Route } from "react-router"
import LandingPage from "./pages/LandingPage"
import ProjectDiscovery from "./pages/ProjectDiscoveryPage"
import ProjectCreationPage from "./pages/ProjectCreationPage"
import ProjectPage from "./pages/ProjectPage"
import AboutUsPage from "./pages/AboutUsPage"

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/discover-projects" element={<ProjectDiscovery/>}/>
          <Route path="/create-project" element={<ProjectCreationPage/>}/>
          <Route path="/project/:id" element={<ProjectPage/>}/>
          <Route path="/about-us" element={<AboutUsPage/>}/>
        </Routes>
      </BrowserRouter>
    )
}

export default App
