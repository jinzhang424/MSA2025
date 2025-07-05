import { BrowserRouter, Routes, Route } from "react-router"
import LandingPage from "./pages/LandingPage"

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
        </Routes>
      </BrowserRouter>
    )
}

export default App
