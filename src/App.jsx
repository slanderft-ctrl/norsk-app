
import { useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import WordPage from "./pages/WordPage"
import TopicPage from "./pages/TopicPage"
import AuthPage from "./pages/AuthPage"
import AccountPage from "./pages/AccountPage"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import GlobalAiBar from "./components/GlobalAiBar"
import Home from "./pages/Home"
import Dictionary from "./pages/Dictionary"
import Listening from "./pages/Listening"

import LevelTest from "./pages/LevelTest"

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const showAiBar = location.pathname !== "/auth"

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900 flex flex-col pb-28">

      <Header onMenuClick={() => setMenuOpen(true)} />

      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/dictionary/:word" element={<WordPage />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/topic/:topicId/:subtopicId" element={<TopicPage />} />
        <Route path="/level-test" element={<LevelTest />} />
      </Routes>

      {showAiBar && <GlobalAiBar />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
