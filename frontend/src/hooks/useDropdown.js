import { useState, useRef, useEffect } from 'react'


// ---------------------------------------------------------------
// A CUSTOM HOOK.
//
// The header now has four dropdowns: Categories, Forums, Explore and
// the user avatar menu. All four need exactly the same behaviour:
//   - open/close when the trigger is clicked
//   - close when you click somewhere else on the page
//   - close when you press Escape
//
// Copy-pasting that into four components would mean fixing every bug
// four times. Instead we pull the logic out into a function that
// uses hooks, and each component calls it.
//
// Two rules for custom hooks:
//   1. The name MUST start with "use" - that's how React knows to
//      apply the rules of hooks to it.
//   2. It's a plain function. State created inside is separate for
//      every component that calls it, so two dropdowns never share
//      an "open" value.
// ---------------------------------------------------------------

export function useDropdown() {
    const [open, setOpen] = useState(false)

    // A handle on the real DOM node, so we can ask the browser
    // "was this click inside my dropdown?". Unlike state, changing
    // .current does NOT cause a re-render.
    const ref = useRef(null)

    useEffect(() => {
        // Closed? Then there's nothing to listen for.
        if (!open) return

        function handleClickOutside(event) {
            // event.target is the element that was clicked.
            // ref.current.contains(node) is true when that node is
            // inside our wrapper. So "exists AND does not contain"
            // means the click landed elsewhere - close up.
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }

        function handleEscape(event) {
            if (event.key === 'Escape') setOpen(false)
        }

        // 'mousedown' rather than 'click': with 'click', the very press
        // that opens the menu also bubbles up to document and would
        // instantly close it again.
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        // CLEANUP. React runs this before the next effect and when the
        // component is removed. Skip it and you add a new listener
        // every time the menu opens - ten opens, ten listeners, all
        // firing on every click.
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    function toggle() {
        // The function form: React hands us the latest value rather
        // than whatever `open` was when this render captured it.
        setOpen(v => !v)
    }

    function close() {
        setOpen(false)
    }

    // A hook can return anything. We return an object so the component
    // can pick out what it needs by name.
    return { open, toggle, close, ref }
}
