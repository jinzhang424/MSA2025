import { BrowserRouter, Routes, Route } from "react-router"
import LandingPage from "./pages/LandingPage"
import ProjectDiscovery from "./pages/ProjectDiscoveryPage"
import ProjectCreationPage from "./pages/ProjectCreationPage"

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/discover-projects" element={<ProjectDiscovery/>}/>
          <Route path="/create-project" element={<ProjectCreationPage/>}/>
        </Routes>
      </BrowserRouter>
    )
}

export default App
