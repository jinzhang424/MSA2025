import { BrowserRouter, Routes, Route } from "react-router"
import LandingPage from "./pages/LandingPage"
import ProjectDiscovery from "./pages/ProjectDiscoveryPage"

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/discover-projects" element={<ProjectDiscovery/>}/>
        </Routes>
      </BrowserRouter>
    )
}

export default App
