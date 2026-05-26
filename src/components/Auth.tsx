import React, { useState } from "react"
import { useApp } from "../context/AppContext"

export const Auth: React.FC = () => {
  const { login, registerUser } = useApp()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await registerUser(name, email, password)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-light text-dark p-4">
      <div className="w-full max-w-md border border-dark/10 p-8 rounded bg-light shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-primary-color mb-6 uppercase tracking-wider">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>
        {error && (
          <div className="mb-4 p-3 text-sm bg-primary-color/10 border border-primary-color/20 text-primary-color rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-dark/60 font-semibold mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-dark/20 focus:border-primary-color focus:outline-none rounded bg-light text-dark"
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-dark/60 font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-dark/20 focus:border-primary-color focus:outline-none rounded bg-light text-dark"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-dark/60 font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-dark/20 focus:border-primary-color focus:outline-none rounded bg-light text-dark"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-color text-light uppercase tracking-wider font-semibold rounded hover:opacity-90 active:scale-98 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setError("")
          }}
          className="w-full text-center mt-6 text-xs uppercase tracking-widest font-semibold text-dark/60 hover:text-primary-color transition cursor-pointer"
        >
          {isLogin ? "Need an account? Sign Up" : "Have an account? Sign In"}
        </button>
      </div>
    </div>
  )
}
