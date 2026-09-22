import { useState } from 'react';
import UserMenu from '../UserMenu/UserMenu'
import './Header.css'


function Header() {
    // The single source of truth for "is anyone logged in".
    // null = logged out. An object = logged in.
    // Everything else in this header reacts to this one value.
    const [user, setUser] = useState(null);

    // Fake user for now. Later this becomes a real call to the Django API:
    //   fetch('http://localhost:8000/api/token/', { method: 'POST', ... })
    function HandleLogin() {
        setUser({
            name: 'Christopher Molina',
            email: 'christophermolina@outlook.com',
            avatar: ''
        })
    }

    // Passed down to UserMenu as the onLogout prop. UserMenu can't touch
    // `user` itself - it calls this, and this changes the state here.
    function handleLogout() {
        setUser(null)
    }

    return (
        <>
            {/* justify-between pushes the three children apart:
                title on the left, nav in the middle, auth on the right. */}
            <header className='bg-gray-800 flex items-center justify-between px-8 py-4'>
                <h1 className='text-2xl font-bold  text-white'>Silent <span className='text-red-600'>Evidence</span></h1>

                <nav>
                    <ul className='flex flex-row items-center gap-8 text-amber-50 font-bold text-2xl'>
                        <li>
                            <a href='/Home'>Home</a>
                        </li>

                        {/* This one becomes the category dropdown, fed by
                            /api/categories/ from the Django backend. */}
                        <li>
                            <a href='/Category'>Category</a>
                        </li>

                        <li>
                            <a href='/Video'>Video</a>
                        </li>

                        <li>
                            <a href='/About'>About</a>
                        </li>

                        <li>
                            <a href='/Contact'>Contact</a>
                        </li>
                    </ul>
                </nav>

                {/* The auth slot. One ternary swaps the whole thing:
                    logged out -> Sign Up + Log in
                    logged in  -> the avatar dropdown */}
                <div className='flex items-center gap-4'>
                    {user ? (
                        // Data down (user), callback up (onLogout).
                        <UserMenu user={user} onLogout={handleLogout} />
                    ) : (
                        // A fragment <>...</> groups both buttons without
                        // adding an extra DOM element.
                        <>
                            {/* An <a> navigates to a page. TODO: font-bol -> font-bold */}
                            <a href='/SignUp' className='rounded-md px-4 py-2 font-bol bg-red-600 hover:bg-red-700 text-white'>Sign Up</a>

                            {/* A <button> runs a handler - no navigation. */}
                            <button onClick={HandleLogin} className='text-amber-50'>Log in</button>
                        </>
                    )}
                </div>

            </header>
        </>
    )
}


export default Header
