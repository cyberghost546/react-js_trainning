import { Link } from 'react-router-dom'


// ---------------------------------------------------------------
// A dark box with a title row. Used for the chart AND both
// "Recent ..." lists - same frame, different insides.
//
// Usage:
//   <Panel title='Recent Users' actionLabel='View all' actionTo='/dashboard/users'>
//       ...anything you want inside...
//   </Panel>
//
// `children` is a special prop: it's whatever you put BETWEEN the
// opening and closing tags. That's what makes Panel reusable - it
// doesn't need to know what it's wrapping.
//
// subtitle, actionLabel and actionTo are optional. Leave them out
// and that part just doesn't show.
// ---------------------------------------------------------------
function Panel({ title, subtitle, actionLabel, actionTo, children }) {
    return (
        <section className='rounded-lg border border-gray-800 bg-gray-900/60 p-5'>

            {/* Title on the left, "View all ->" on the right. */}
            <div className='mb-4 flex items-start justify-between gap-4'>
                <div>
                    <h2 className='text-sm font-bold text-white'>{title}</h2>
                    {subtitle && <p className='text-xs text-gray-500'>{subtitle}</p>}
                </div>

                {/* <Link> changes page WITHOUT reloading the whole app.
                    If `to` is a full URL to another site (like the
                    Django admin), it acts like a normal <a> link. */}
                {actionTo && (
                    <Link to={actionTo} className='whitespace-nowrap text-xs font-medium text-red-500 hover:text-red-400'>
                        {actionLabel} &rarr;
                    </Link>
                )}
            </div>

            {children}
        </section>
    )
}

export default Panel
