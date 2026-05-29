
import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WordPage from "./pages/WordPage"
import TopicPage from "./pages/TopicPage"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import TopicCard from "./components/TopicCard"
import Home from "./pages/Home"
import Dictionary from "./pages/Dictionary"
import Listening from "./pages/Listening"

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8F7F4] text-gray-900 flex flex-col">

        <Header onMenuClick={() => setMenuOpen(true)} />

        <Sidebar
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary/:word" element={<WordPage />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/topic/:topicId/:subtopicId" element={<TopicPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App