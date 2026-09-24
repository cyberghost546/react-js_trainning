import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LABEL_STYLE, INPUT_STYLE, BUTTON_STYLE } from '../../styles/formStyles'


// The Log In page (/login).
function LogIn() {
    // login() comes from AuthProvider - it talks to Django AND
    // updates the user everywhere (the Header switches to your avatar).
    const { login } = useAuth()

    // navigate('/somewhere') = change page from code, e.g. after a
    // successful login. (A link needs a click; this doesn't.)
    const navigate = useNavigate()

    // If ProtectedRoute sent us here, it left a note in location.state
    // saying where you were trying to go.
    const location = useLocation()

    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)

    // Same trick as the dashboard: one handler for every input,
    // matched by the input's `name`.
    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError(null)
        setSaving(true)

        try {
            await login(form.username, form.password)

            // ?. = "optional chaining". If location.state is null
            // (you clicked Log In in the header), this gives undefined
            // instead of crashing, and || falls back to the homepage.
            navigate(location.state?.from || '/')
        } catch (err) {
            // err.data is Django's answer, e.g.
            // { detail: 'Wrong username or password.' }.
            // If there's no err.data, the request never reached Django.
            setError(err.data?.detail || 'Could not reach the server. Is Django running?')
            setSaving(false)
        }
    }

    return (
        // max-w-md + mx-auto = a narrow card centred on the page.
        <div className='max-w-md mx-auto my-16 px-4'>
            <form onSubmit={handleSubmit} className='bg-slate-900 rounded-lg p-8 space-y-4 text-white'>
                <h1 className='text-2xl font-bold'>Log In</h1>

                {error && (
                    <p className='bg-red-900/50 border border-red-600 text-red-100 rounded-md p-3 text-sm'>
                        {error}
                    </p>
                )}

                <div>
                    <label htmlFor='username' className={LABEL_STYLE}>Username</label>
                    {/* autoComplete tells the browser's password manager
                        what this box is, so it can fill it in for you. */}
                    <input
                        id='username'
                        name='username'
                        value={form.username}
                        onChange={handleChange}
                        autoComplete='username'
                        required
                        className={INPUT_STYLE}
                    />
                </div>

                <div>
                    <label htmlFor='password' className={LABEL_STYLE}>Password</label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={form.password}
                        onChange={handleChange}
                        autoComplete='current-password'
                        required
                        className={INPUT_STYLE}
                    />
                </div>

                <button type='submit' disabled={saving} className={`${BUTTON_STYLE} w-full`}>
                    {saving ? 'Logging in...' : 'Log In'}
                </button>

                <p className='text-sm text-gray-400 text-center'>
                    No account yet?{' '}
                    <a href='/signup' className='text-red-400 hover:text-red-300'>Sign up</a>
                </p>
            </form>
        </div>
    )
}

export default LogIn
