function Header({ onMenuClick }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="flex flex-col gap-1 p-1 hover:opacity-70"
      >
        <span className="block w-5 h-0.5 bg-white"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
      </button>

      <span className="text-white font-medium flex-1">Norsk App</span>

      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
        І
      </div>
    </header>
  )
}

export default Header
