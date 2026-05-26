import React, { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { DownloadButton } from "./DownloadButton"

interface ChatProps {
  onMenuClick: () => void
}

export const Chat: React.FC<ChatProps> = ({ onMenuClick }) => {
  const { activePdf, messages, askQuestion, loading, uploadFile, uploading } = useApp()
  const [input, setInput] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const text = input
    setInput("")
    await askQuestion(text)
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!activePdf) return (
    <div className="flex-1 flex flex-col h-full bg-light text-dark">
      <div className="p-4 border-b border-dark/10 flex items-center gap-3 md:hidden">
        <button onClick={onMenuClick} className="p-1 text-dark/50 hover:text-dark transition cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-bold uppercase tracking-widest text-primary-color">PDF ChatBot</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary-color mb-1">No PDF Selected</h2>
        <p className="text-xs text-dark/60 max-w-xs mb-5">Select a document from the sidebar or upload a new one to start chatting.</p>
        <input ref={uploadRef} type="file" accept=".pdf" className="hidden" onChange={async (e) => { if (e.target.files?.[0]) { await uploadFile(e.target.files[0]); e.target.value = "" } }} />
        <button disabled={uploading} onClick={() => uploadRef.current?.click()} className="px-6 py-2.5 bg-primary-color text-light text-xs uppercase tracking-widest font-semibold rounded hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>
    </div>
  )

  const docUrl = `http://localhost:5000/${activePdf.filePath.replace(/\\/g, "/")}`

  return (
    <div className="flex-1 flex flex-col h-full bg-light text-dark min-w-0">
      <div className="p-4 md:p-6 border-b border-dark/10 bg-light flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden shrink-0 p-1 text-dark/50 hover:text-dark transition cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="flex-1 text-sm font-bold uppercase tracking-widest text-primary-color truncate">{activePdf.fileName}</h2>
        <div className="flex gap-2 shrink-0">
          <a href={docUrl} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-wider font-semibold border border-dark/20 text-dark px-2.5 py-1.5 rounded hover:bg-dark/5 transition cursor-pointer">View</a>
          <DownloadButton url={docUrl} fileName={activePdf.fileName} />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 ${messages.length === 0 ? "flex flex-col justify-center animate-fade-in" : ""}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-full border border-dark/10 flex items-center justify-center text-primary-color mb-4 bg-light">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-color mb-1">Start the Conversation</h3>
            <p className="text-xs text-dark/60 max-w-xs leading-relaxed uppercase tracking-wider">
              Ask your first question about <span className="font-semibold text-dark">{activePdf.fileName}</span> below.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.sender === "user"
            const isCopied = copiedIndex === i
            return (
              <div key={i} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-xl px-4 py-3 rounded text-sm leading-relaxed shadow-sm border flex items-start gap-3 ${isUser ? "bg-primary-color text-light border-primary-color" : "bg-light text-dark border-dark/10"}`}>
                  <span className="flex-1">{msg.text}</span>
                  {!isUser && (
                    <button onClick={() => handleCopy(msg.text, i)} className={`shrink-0 p-0.5 transition cursor-pointer flex items-center gap-1 ${isCopied ? "text-primary-color" : "text-dark/40 hover:text-primary-color"}`} title="Copy">
                      {isCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-light text-dark/60 border border-dark/10 px-4 py-3 rounded text-xs tracking-wider animate-pulse uppercase font-semibold">AI is analyzing document...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 md:p-6 border-t border-dark/10 bg-light flex gap-2 md:gap-3">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask about ${activePdf.fileName}...`} className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-dark/20 focus:border-primary-color focus:outline-none rounded bg-light text-dark text-sm placeholder:text-dark/40 min-w-0" />
        <button type="submit" disabled={loading || !input.trim()} className="px-4 md:px-6 py-2.5 md:py-3 bg-primary-color text-light uppercase tracking-wider font-semibold text-xs rounded hover:opacity-90 transition disabled:opacity-50 cursor-pointer shrink-0">Send</button>
      </form>
    </div>
  )
}
