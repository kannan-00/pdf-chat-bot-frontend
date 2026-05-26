import React from "react"
import { createPortal } from "react-dom"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-dark/75 backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
      <div className="bg-light border border-dark/15 p-8 rounded shadow-2xl text-center max-w-sm w-full">
        <h3 className="text-base font-bold uppercase tracking-widest text-primary-color mb-3">{title}</h3>
        <p className="text-xs text-dark/60 uppercase tracking-wider mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button disabled={loading} onClick={onCancel} className="flex-1 py-2.5 text-xs border border-dark/20 text-dark uppercase tracking-widest font-semibold rounded hover:bg-dark/5 transition cursor-pointer disabled:opacity-40">{cancelText}</button>
          <button disabled={loading} onClick={onConfirm} className="flex-1 py-2.5 text-xs bg-primary-color text-light uppercase tracking-widest font-semibold rounded hover:opacity-90 transition cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                <span>Please wait...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
