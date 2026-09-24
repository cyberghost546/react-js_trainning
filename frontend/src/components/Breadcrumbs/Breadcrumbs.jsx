import { Link } from 'react-router-dom'


// ---------------------------------------------------------------
// "Home / Paranormal" - the little trail showing where you are.
//
// Usage:
//   <Breadcrumbs items={[
//       { label: 'Home', to: '/' },
//       { label: 'Categories', to: '/categories' },
//       { label: 'Paranormal' },          <- no `to` = the current page
//   ]} />
//
// Works for any depth - a story page later could be
// Home / Paranormal / The Census Taker.
// ---------------------------------------------------------------
function Breadcrumbs({ items }) {
    return (
        // <nav aria-label> + <ol> is the standard HTML for breadcrumbs,
        // so screen readers announce it as a "Breadcrumb" list.
        <nav aria-label='Breadcrumb'>
            <ol className='flex items-center gap-2 text-xs text-gray-500'>
                {items.map((item, index) => (
                    <li key={item.label} className='flex items-center gap-2'>
                        {/* A slash BEFORE every item except the first. */}
                        {index > 0 && <span aria-hidden='true'>/</span>}

                        {item.to ? (
                            <Link to={item.to} className='transition-colors hover:text-gray-300'>
                                {item.label}
                            </Link>
                        ) : (
                            // aria-current='page' marks "you are here".
                            <span aria-current='page' className='text-gray-300'>{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs
