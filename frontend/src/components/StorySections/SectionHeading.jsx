import { ACCENTS } from '../../styles/accents'


// ---------------------------------------------------------------
// A section title with a coloured bar in front and a small badge:
//
//     ▌ Story of the Day  (Today's pick)
//
// Usage:
//   <SectionHeading title='Story of the Day' badge="Today's pick" accent='yellow' />
//   <SectionHeading title='Story Battle' badge='Showdown' badgeStyle='tag' accent='red' />
//
// badgeStyle:
//   'pill' (default) - rounded box with a border
//   'tag'            - plain UPPERCASE letters, like "SHOWDOWN"
//   'plain'          - quiet grey text, like "52 categories"
// ---------------------------------------------------------------
function SectionHeading({ title, badge, accent = 'red', badgeStyle = 'pill' }) {
    const colors = ACCENTS[accent]

    return (
        <div className='mb-4 flex items-center gap-3'>
            {/* The coloured bar is just an empty span with a
                width, height and background colour. */}
            <span className={`h-5 w-1 rounded-full ${colors.bar}`} />

            <h2 className='text-xl font-bold text-white'>{title}</h2>

            {badge && badgeStyle === 'pill' && (
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${colors.badge}`}>
                    {badge}
                </span>
            )}

            {badge && badgeStyle === 'tag' && (
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${colors.text}`}>
                    {badge}
                </span>
            )}

            {badge && badgeStyle === 'plain' && (
                <span className='text-sm text-gray-500'>{badge}</span>
            )}
        </div>
    )
}

export default SectionHeading
