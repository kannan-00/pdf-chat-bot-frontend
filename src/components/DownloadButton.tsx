import React, { useState } from "react"

interface DownloadButtonProps {
  url: string
  fileName: string
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ url, fileName }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = objectUrl
      a.download = fileName
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      disabled={downloading}
      onClick={handleDownload}
      className="text-xs uppercase tracking-wider font-semibold bg-primary-color text-light px-2.5 py-1.5 rounded hover:opacity-90 transition cursor-pointer disabled:opacity-70 flex items-center justify-center gap-1.5"
    >
      {downloading ? (
        <>
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          <span>Downloading...</span>
        </>
      ) : (
        "Download"
      )}
    </button>
  )
}
