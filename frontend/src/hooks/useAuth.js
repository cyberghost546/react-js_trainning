import { createContext, useContext } from 'react'


// The "channel" that carries the logged-in user through the app.
// AuthProvider (auth/AuthContext.jsx) puts the value IN,
// useAuth() below takes it OUT.
//
// Why is it in this file and not with AuthProvider? Vite's hot reload
// wants .jsx files to export only components. So the non-component
// bits (the context and the hook) live here, in a plain .js file.
export const AuthContext = createContext(null)


// A tiny custom hook so components write
//     const { user, logout } = useAuth()
// instead of importing useContext AND AuthContext every time.
//
// Works in any component inside <AuthProvider> (see main.jsx).
export function useAuth() {
    return useContext(AuthContext)
}
