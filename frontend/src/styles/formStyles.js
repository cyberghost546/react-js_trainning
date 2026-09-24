// ---------------------------------------------------------------
// Tailwind classes shared by every form on the site (Log In,
// Sign Up, the slides dashboard...).
//
// Change a line here and every form updates together. For a new
// form on another page, just import what you need:
//   import { LABEL_STYLE, INPUT_STYLE } from '../../styles/formStyles'
// ---------------------------------------------------------------

export const LABEL_STYLE = 'block text-sm font-semibold text-gray-200 mb-2'

// placeholder: styles the grey hint text (placeholder='johndoe').
export const INPUT_STYLE = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-600'

// disabled:opacity-50 greys the button out while saving.
// shadow-lg shadow-red-600/30 = a soft red glow under the button
// (/30 means 30% strength).
export const BUTTON_STYLE = 'bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-3 rounded-lg font-bold text-white shadow-lg shadow-red-600/30 transition-colors'

export const FIELD_ERROR_STYLE = 'text-sm text-red-400 mt-1'
