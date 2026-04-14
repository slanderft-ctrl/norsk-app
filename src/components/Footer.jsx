function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 px-4 py-3 flex items-center gap-3">
      <span className="text-xs text-gray-400 whitespace-nowrap">Запитати ШІ</span>
      <input
        type="text"
        placeholder="Як утворюється множина в норвезькій?..."
        className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg outline-none border border-gray-700 focus:border-blue-500"
      />
      <button className="text-white bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-sm">
        →
      </button>
    </footer>
  )
}

export default Footer
