import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'


// ---------------------------------------------------------------
// For buttons that only work when you're logged in (Like, Save,
// Comment...).
//
// Usage:
//   const requireLogin = useRequireLogin()
//
//   function handleClick() {
//       if (!requireLogin()) return    // not logged in -> sent to /login
//       ...do the thing...
//   }
//
// It remembers the page you were on (state.from), and the Log In
// page sends you back there afterwards - the same trick
// ProtectedRoute uses.
// ---------------------------------------------------------------
export function useRequireLogin() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // A hook can return a FUNCTION. The component calls it later,
    // inside a click handler (hooks themselves can't be called there).
    return function requireLogin() {
        if (user) return true

        navigate('/login', { state: { from: location.pathname } })
        return false
    }
}
