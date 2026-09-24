import { Link } from 'react-router-dom'


// ---------------------------------------------------------------
// The "nothing here" page.
//
// Used in three places, with different words:
//   <NotFound />                                    any unknown URL (App.jsx)
//   <NotFound title='Story not found' message='...' />       StoryPage
//   <NotFound title='Category not found' message='...' />    CategoryPage
//
// Props with a default value (title = '...') are optional - leave
// them out and the default is used.
// ---------------------------------------------------------------
function NotFound({
    title = 'Page not found',
    message = "This page doesn't exist - or it hasn't been built yet.",
}) {
    return (
        <div className='bg-gray-900 px-4 py-24 text-center'>
            <h1 className='text-2xl font-bold text-white'>{title}</h1>
            <p className='mt-2 text-gray-400'>{message}</p>
            <Link to='/' className='mt-6 inline-block text-sm font-semibold text-red-500 hover:text-red-400'>
                &larr; Back to the homepage
            </Link>
        </div>
    )
}

export default NotFound
