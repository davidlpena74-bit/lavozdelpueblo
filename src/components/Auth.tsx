import { useState } from 'react'
import { supabase } from '../services/supabase'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()

        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Acceso Ciudadano</h1>
                <p className="mb-4 text-center text-gray-600">Únete a La Voz del Pueblo</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        className="border p-2 rounded"
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Enviando enlace...' : 'Enviar enlace mágico'}
                    </button>
                </form>
            </div>
        </div>
    )
}
