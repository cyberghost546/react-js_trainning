import { useState, useRef, useEffect } from 'react'


// Props come from Header:
//   user     - who is logged in (so we can show name, email, avatar)
//   onLogout - a callback UP to Header. This component cannot clear the
//              user itself; it only asks its parent to. State lives in
//              the parent, data flows down, callbacks go up.
function UserMenu({ user, onLogout }) {
    // Whether the dropdown is showing is nobody's business but ours,
    // so it stays local. Header doesn't know or care.
    const [open, setOpen] = useState(false)

    // useRef gives us a handle on the real DOM node, so we can ask the
    // browser "was this click inside my menu?". Unlike state, changing
    // .current does NOT trigger a re-render.
    // Starts as null - React fills it in with the real <div> after render.
    const menuRef = useRef(null)


    // document.addEventListener touches the world outside React, which
    // makes it a side effect - so it belongs in useEffect, not in render.
    useEffect(() => {
        // No menu open, no listener needed.
        if (!open) return

        function handleClickOutside(event) {
            // event.target is the element that was clicked.
            // .contains() is a real DOM method: true when that element is
            // inside our div. So "ref exists AND does not contain it" means
            // the click landed somewhere else on the page - close up.
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        // 'mousedown' rather than 'click': with 'click', the same press
        // that opens the menu bubbles up to document and instantly
        // closes it again.
        document.addEventListener('mousedown', handleClickOutside)

        // Cleanup. Runs before the next effect and on unmount. Without it
        // we'd stack a new listener every time the menu opens - ten opens,
        // ten listeners, all firing on every click.
        return () => document.removeEventListener('mousedown', handleClickOutside)

        // [open] = re-run this effect whenever `open` changes.
    }, [open])

    // Fallback for when the user has no avatar image.
    // 'Christopher Molina' -> ['Christopher', 'Molina'] -> ['C','M'] -> 'CM'
    const initials = user.name
        .split(' ')
        .map(p => p[0])
        .join('')
        .toUpperCase()

    return (
        // 'relative' is the positioning anchor: the panel below is
        // 'absolute', which positions against the nearest positioned
        // ancestor. Without this the panel flies to the page corner.
        //
        // The ref goes on this outer div - not the button - so clicks on
        // the button AND inside the panel both count as "inside".
        <div className='relative' ref={menuRef}>

            {/* The trigger. h-11 w-11 makes it square, rounded-full makes
                that square a circle, flex+items-center+justify-center
                centres the initials, overflow-hidden crops a real image
                to the circle. */}
            <button
                className='h-11 w-11 rounded-full overflow-hidden flex items-center justify-center bg-red-600 text-white font-bold'
                onClick={() => setOpen(v => !v)}
            >
                {/* Function form: React hands us the latest value rather
                    than whatever `open` was when this render captured it. */}
                {user.avatar
                    ? <img className='h-full w-full object-cover' src={user.avatar} alt={user.name} />
                    : initials}
            </button>

            {/* `open && (...)` - when open is false, `false` renders as
                nothing. The standard React idiom for "show this only if". */}
            {open && (
                <div className='absolute right-0 mt-2 w-56 bg-gray-800 z-50 rounded-lg text-white'>
                    {/* z-50 lifts the panel above page content below it. */}

                    {/* Who's logged in. The padding and bottom border belong
                        here, on the inner block, so this reads as one framed
                        section - not on the outer panel. */}
                    <div className='px-4 py-3 border-b border-gray-700'>
                        <p className='font-bold'>{user.name}</p>
                        <p className='text-sm text-gray-400'>{user.email}</p>

                        {/* Two things happen: close the menu, then call the
                            prop. We don't know what onLogout does - that's
                            Header's business. We just call it. */}
                        <button onClick={() => { setOpen(false); onLogout() }}>
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu
