import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomStory } from '../../api/client'
import NotFound from '../NotFound/NotFound'


// ---------------------------------------------------------------
// The page at /random. It shows nothing of its own: it asks Django
// for a random story, then jumps straight to /stories/<that id>.
//
// Because it's just a URL, ANY link can be a "surprise me" button:
//   <Link to='/random'>Random story</Link>
// ---------------------------------------------------------------
function RandomStory() {
    const navigate = useNavigate()
    const [noStories, setNoStories] = useState(false)

    useEffect(() => {
        let ignore = false

        getRandomStory()
            .then(data => {
                // replace: true = swap /random out of the browser
                // history. Otherwise pressing Back from the story would
                // land on /random again - which picks a NEW story and
                // jumps forward, so you could never get back.
                if (!ignore) navigate(`/stories/${data.id}`, { replace: true })
            })
            .catch(err => {
                if (ignore) return
                if (err.status === 404) {
                    setNoStories(true)
                } else {
                    console.error('Could not pick a random story:', err)
                }
            })

        return () => {
            ignore = true
        }
    }, [navigate])

    if (noStories) {
        return <NotFound title='No stories yet' message='Once stories are published, this picks one at random.' />
    }

    return <p className='bg-gray-900 py-24 text-center text-gray-400'>Finding you a story...</p>
}

export default RandomStory
