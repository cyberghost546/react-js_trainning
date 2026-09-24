import { useState, useEffect } from 'react'
import NavDropdown from '../NavDropdown/NavDropdown'
import { getCategories } from '../../api/client'


// ---------------------------------------------------------------
// The Categories menu. Unlike Forums and Explore, its contents come
// from the Django database (/api/categories/).
//
// Notice what this component does NOT do: it has no open/close logic,
// no useRef, no click-outside handler. It only fetches data, reshapes
// it, and hands it to NavDropdown. That's "composition" - small
// components each doing one job.
// ---------------------------------------------------------------

function CategoryDropdown() {
    // Start as an empty array, NOT null. The first render happens
    // before the data arrives, and NavDropdown will immediately call
    // .map() and .length on this. An empty array is safe; null crashes.
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => {
                // If Django isn't running, or CORS blocks the request,
                // we land here. Log it and leave the list empty rather
                // than letting the whole page crash.
                console.error('Could not load categories:', err)
            })

        // The empty [] means "run once, after the first render".
        // Leave it out and the fetch sets state -> re-render -> fetch
        // again -> forever. The most common useEffect bug there is.
    }, [])

    // The API gives us { id, name, slug }, but NavDropdown expects
    // { label, href }. This translates between the two shapes, so
    // NavDropdown never has to know what a "slug" is.
    const items = categories.map(cat => ({
        label: cat.name,
        href: `/category/${cat.slug}`,
    }))

    return <NavDropdown label='Categories' items={items} />
}

export default CategoryDropdown
