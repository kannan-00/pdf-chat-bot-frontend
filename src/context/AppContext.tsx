import React, { createContext, useState, useEffect, useContext } from "react"

export interface Message { sender: "user" | "bot"; text: string }
export interface Pdf { _id: string; fileName: string; filePath: string; createdAt: string }

interface AppContextType {
  token: string | null; pdfs: Pdf[]; activePdf: Pdf | null; messages: Message[]; loading: boolean; uploading: boolean
  setActivePdf: (pdf: Pdf | null) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  login: (e: string, p: string) => Promise<void>
  registerUser: (n: string, e: string, p: string) => Promise<void>
  logout: () => void
  uploadFile: (f: File) => Promise<void>
  deleteFile: (id: string) => Promise<void>
  askQuestion: (q: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [activePdf, setActivePdf] = useState<Pdf | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)

  const req = async (path: string, method = "GET", body?: any, isFile = false) => {
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {}
    if (!isFile && body) headers["Content-Type"] = "application/json"
    const res = await fetch(`${API}${path}`, {
      method, headers, body: isFile ? body : body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Error")
    return data
  }

  const fetchPdfs = () => req("/pdf").then(setPdfs).catch(() => {})

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      fetchPdfs()
    } else {
      localStorage.removeItem("token")
      setPdfs([])
      setActivePdf(null)
      setMessages([])
    }
  }, [token])

  useEffect(() => {
    if (activePdf) req(`/pdf/${activePdf._id}/messages`).then(setMessages).catch(() => {})
    else setMessages([])
  }, [activePdf])

  const login = (email: string, password: string) =>
    req("/auth/login", "POST", { email, password }).then((d) => setToken(d.token))

  const registerUser = (name: string, email: string, password: string) =>
    req("/auth/register", "POST", { name, email, password }).then((d) => setToken(d.token))

  const logout = () => setToken(null)

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("pdf", file)
      await req("/pdf/upload", "POST", fd, true)
      const refreshed = await req("/pdf")
      setPdfs(refreshed)
      if (refreshed.length > 0) {
        setActivePdf(refreshed[refreshed.length - 1])
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      alert(error.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (pdfId: string) => {
    setLoading(true)
    try {
      await req(`/pdf/${pdfId}`, "DELETE")
      if (activePdf?._id === pdfId) {
        setActivePdf(null)
        setMessages([])
      }
      await fetchPdfs()
    } finally {
      setLoading(false)
    }
  }

  const askQuestion = async (text: string) => {
    if (!activePdf) return
    setMessages((prev) => [...prev, { sender: "user", text }])
    setLoading(true)
    try {
      const d = await req("/pdf/query", "POST", { pdfId: activePdf._id, question: text })
      setMessages((prev) => [...prev, { sender: "bot", text: d.answer }])
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Query failed." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppContext.Provider value={{ token, pdfs, activePdf, messages, loading, uploading, setActivePdf, setMessages, login, registerUser, logout, uploadFile, deleteFile, askQuestion }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const c = useContext(AppContext)
  if (!c) throw new Error("useApp error")
  return c
}
