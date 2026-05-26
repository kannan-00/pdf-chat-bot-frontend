import React, { useRef, useState } from "react"
import { useApp } from "../context/AppContext"
import { ConfirmModal } from "./ConfirmModal"

interface SidebarProps {
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { pdfs, activePdf, setActivePdf, uploadFile, deleteFile, logout, uploading } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0])
      e.target.value = ""
    }
  }

  const handleDelete = async () => {
    if (!confirmDeleteId) return
    const id = confirmDeleteId
    setDeletingId(id)
    await deleteFile(id)
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoggingOut(false)
    setConfirmLogout(false)
    logout()
  }

  const selectPdf = (pdf: typeof pdfs[0]) => {
    setActivePdf(pdf)
    onClose()
  }

  return (
    <div className="w-72 md:w-80 border-r border-dark/10 bg-light flex flex-col h-full text-dark">
      <div className="p-4 md:p-6 border-b border-dark/10 flex items-center justify-between">
        <h1 className="text-base md:text-lg font-bold text-primary-color tracking-widest uppercase">PDF ChatBot</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setConfirmLogout(true)} className="text-xs uppercase tracking-wider font-semibold border border-primary-color text-primary-color px-3 py-1 rounded hover:bg-primary-color hover:text-light transition cursor-pointer">Logout</button>
          <button onClick={onClose} className="md:hidden p-1 text-dark/40 hover:text-dark transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 border-b border-dark/10">
        <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button disabled={uploading} onClick={() => fileInputRef.current?.click()} className="w-full py-3 border border-dashed border-primary-color/40 text-primary-color font-semibold uppercase tracking-wider text-xs rounded hover:bg-primary-color/5 transition disabled:opacity-50 cursor-pointer">
          {uploading ? "Uploading..." : "Upload New PDF"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2">
        <div className="text-[10px] uppercase tracking-widest font-bold text-dark/40 px-2 mb-2">Your Documents</div>
        {pdfs.map((pdf) => {
          const isActive = activePdf?._id === pdf._id
          return (
            <div key={pdf._id} className={`flex items-center justify-between p-1 rounded transition duration-200 ${isActive ? "bg-primary-color text-light" : "hover:bg-dark/5 text-dark/80"}`}>
              <button onClick={() => selectPdf(pdf)} className="flex-1 text-left p-2 text-sm font-medium truncate cursor-pointer">{pdf.fileName}</button>
              <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(pdf._id) }} className={`p-2 cursor-pointer transition shrink-0 ${isActive ? "text-light/60 hover:text-light" : "text-dark/40 hover:text-primary-color"}`} title="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )
        })}
        {pdfs.length === 0 && <div className="text-center py-8 text-xs text-dark/40 italic">No documents uploaded yet.</div>}
      </div>

      <ConfirmModal isOpen={!!confirmDeleteId} title="Delete Document?" message="This action will delete the document and all associated chat logs permanently." confirmText="Delete" loading={!!deletingId} onConfirm={handleDelete} onCancel={() => setConfirmDeleteId(null)} />
      <ConfirmModal isOpen={confirmLogout} title="Sign Out?" message="Are you sure you want to sign out of your account?" confirmText="Sign Out" loading={loggingOut} onConfirm={handleLogout} onCancel={() => setConfirmLogout(false)} />
    </div>
  )
}
