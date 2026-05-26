import React, { useState } from "react"
import { AppProvider, useApp } from "./context/AppContext"
import { Auth } from "./components/Auth"
import { Sidebar } from "./components/Sidebar"
import { Chat } from "./components/Chat"

const MainApp: React.FC = () => {
  const { token, uploading } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!token) return <Auth />

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-light relative">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-dark/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed md:static z-40 h-full transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <Chat onMenuClick={() => setSidebarOpen(true)} />

      {uploading && (
        <div className="absolute inset-0 bg-dark/85 backdrop-blur-xs z-50 flex flex-col items-center justify-center text-light">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            <div className="absolute inset-0 border border-primary-color/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-primary-color border-r-primary-color/40 rounded-full animate-spin"></div>
            <div className="w-12 h-12 bg-primary-color rounded-full animate-pulse flex items-center justify-center font-bold tracking-widest text-xs text-light">AI</div>
          </div>
          <h2 className="text-base font-bold uppercase tracking-widest text-light">Uploading Document</h2>
          <p className="text-[10px] text-light/50 tracking-widest uppercase mt-2 animate-pulse">Extracting text & generating embeddings</p>
        </div>
      )}
    </div>
  )
}

const App: React.FC = () => (
  <AppProvider>
    <MainApp />
  </AppProvider>
)

export default App
