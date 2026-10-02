import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { ApiResponse, AuthResponse } from '../types/auth'
import { Terminal, Lock, Mail, User, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export const RegisterPage = () => {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
                name,
                username,
                email,
                password,
            })

            const res = response.data
            if (res.success) {
                setAuth(res.data.user, res.data.access_token, res.data.refresh_token)
                navigate('/dashboard')
            } else {
                setError('error' in res ? res.error : 'Registration failed')
            }
        } catch (err: unknown) {
            if (isAxiosError<{ error?: string }>(err)) {
                const serverError = err.response?.data?.error
                setError(serverError || 'Failed to connect to the server')
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#090A0F] text-slate-200">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 glow-cyan">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                        CodeAbroad <Sparkles className="w-5 h-5 text-emerald-400" />
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Begin your journey to land tech jobs in Japan, Germany & Singapore
                    </p>
                </div>

                {/* Card Form */}
                <div className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Budi Pratama"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#12131A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                                Username
                            </label>
                            <div className="relative">
                                <span className="text-slate-500 text-sm font-mono absolute left-3.5 top-2.5">@</span>
                                <input
                                    type="text"
                                    required
                                    placeholder="budipratama"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                                    className="w-full bg-[#12131A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                <input
                                    type="email"
                                    required
                                    placeholder="budi@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#12131A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#12131A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium underline-offset-4 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
