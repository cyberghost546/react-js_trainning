import { useState } from 'react'
import { INPUT_STYLE } from '../../styles/formStyles'


// The two eye icons (from heroicons.com, "outline" style).
// Small components in the same file, like FooterColumn in Footer.jsx.
function EyeIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
    )
}

function EyeOffIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
        </svg>
    )
}


// ---------------------------------------------------------------
// A password box with a "show / hide" eye button.
//
// Use it exactly like a normal <input>:
//   <PasswordInput id='password' name='password' value={...} onChange={...} />
//
// Every prop you give it is passed straight on to the real <input>
// (that's the {...props} below), so placeholder, required,
// autoComplete... all just work without listing them one by one.
//
// Each PasswordInput has its OWN `visible` state. On the sign-up
// form, clicking the eye on "Password" doesn't reveal "Confirm
// password" - they're two separate copies of this component.
// ---------------------------------------------------------------
function PasswordInput(props) {
    const [visible, setVisible] = useState(false)

    return (
        // relative = the anchor for the eye button, which is absolute.
        <div className='relative'>
            {/* {...props} copies every prop onto the input.
                type and className come AFTER it, so ours win.
                pr-12 = extra padding on the right, so long passwords
                don't run underneath the eye. */}
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                className={`${INPUT_STYLE} pr-12`}
            />

            {/* type='button' matters: inside a <form>, a button with no
                type is a submit button - clicking the eye would send
                the form. */}
            <button
                type='button'
                onClick={() => setVisible(v => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors'
            >
                {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    )
}

export default PasswordInput
