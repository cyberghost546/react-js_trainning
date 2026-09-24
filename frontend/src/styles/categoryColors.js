// ---------------------------------------------------------------
// The colours a category can have.
//
// Django stores just a word ('purple') in Category.color. This turns
// that word into real Tailwind classes. Same idea as accents.js:
// Tailwind can only create classes it sees written out IN FULL, so
// we can't build 'from-' + color + '-950' while the app runs.
//
//   tile    - (homepage grid) border colour, the top colour of the
//             background gradient, and a brighter border on hover
//   icon    - the icon's colour
//   iconBox - (category page header) the square around the big icon
//
// Adding a colour = add it here AND to COLOR_CHOICES in
// backend/categories/models.py, so the admin dropdown offers it.
// ---------------------------------------------------------------
export const CATEGORY_COLORS = {
    red: {
        tile: 'border-red-900/60 from-red-950/70 hover:border-red-600',
        icon: 'text-red-500',
        iconBox: 'border-red-900/70 bg-red-950/60',
    },
    rose: {
        tile: 'border-rose-900/60 from-rose-950/70 hover:border-rose-600',
        icon: 'text-rose-400',
        iconBox: 'border-rose-900/70 bg-rose-950/60',
    },
    orange: {
        tile: 'border-orange-900/60 from-orange-950/70 hover:border-orange-600',
        icon: 'text-orange-400',
        iconBox: 'border-orange-900/70 bg-orange-950/60',
    },
    amber: {
        tile: 'border-amber-900/60 from-amber-950/70 hover:border-amber-600',
        icon: 'text-amber-400',
        iconBox: 'border-amber-900/70 bg-amber-950/60',
    },
    emerald: {
        tile: 'border-emerald-900/60 from-emerald-950/70 hover:border-emerald-600',
        icon: 'text-emerald-400',
        iconBox: 'border-emerald-900/70 bg-emerald-950/60',
    },
    teal: {
        tile: 'border-teal-900/60 from-teal-950/70 hover:border-teal-600',
        icon: 'text-teal-400',
        iconBox: 'border-teal-900/70 bg-teal-950/60',
    },
    blue: {
        tile: 'border-blue-900/60 from-blue-950/70 hover:border-blue-600',
        icon: 'text-blue-400',
        iconBox: 'border-blue-900/70 bg-blue-950/60',
    },
    indigo: {
        tile: 'border-indigo-900/60 from-indigo-950/70 hover:border-indigo-600',
        icon: 'text-indigo-400',
        iconBox: 'border-indigo-900/70 bg-indigo-950/60',
    },
    purple: {
        tile: 'border-purple-900/60 from-purple-950/70 hover:border-purple-600',
        icon: 'text-purple-400',
        iconBox: 'border-purple-900/70 bg-purple-950/60',
    },
    fuchsia: {
        tile: 'border-fuchsia-900/60 from-fuchsia-950/70 hover:border-fuchsia-600',
        icon: 'text-fuchsia-400',
        iconBox: 'border-fuchsia-900/70 bg-fuchsia-950/60',
    },
}
