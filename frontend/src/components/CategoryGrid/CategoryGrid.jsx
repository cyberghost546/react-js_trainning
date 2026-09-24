import { useState, useEffect } from 'react'
import { getCategories } from '../../api/client'
import SectionHeading from '../StorySections/SectionHeading'
import CategoryTile from './CategoryTile'


// How many tiles to show before "Show all" is clicked.
// 18 = three full rows of six on a big screen.
const FIRST_COUNT = 18


// ===============================================================
// "BROWSE BY CATEGORY" - a grid of category tiles.
//
// Data: /api/categories/ (the same endpoint the header dropdown and
// footer use). Each category comes with its icon, colour and how
// many published stories it has.
// ===============================================================
function CategoryGrid() {
    const [categories, setCategories] = useState([])

    // false = only the first FIRST_COUNT tiles, true = all of them.
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => console.error('Could not load categories:', err))
    }, [])

    // Nothing loaded (yet) - don't show an empty heading.
    if (categories.length === 0) {
        return null
    }

    // Categories with the most stories first.
    //
    // [...categories] makes a COPY first. .sort() changes the array
    // it's called on, and you must never change state directly -
    // React wouldn't notice, and the screen could get out of sync.
    //
    // (a, b) => b.story_count - a.story_count means "bigger count
    // first". When counts are equal, the original order is kept.
    const sorted = [...categories].sort((a, b) => b.story_count - a.story_count)

    // .slice(0, 18) = the first 18. Also makes a copy - the full list
    // stays untouched.
    const visible = showAll ? sorted : sorted.slice(0, FIRST_COUNT)

    return (
        <section className='mx-auto max-w-6xl'>
            <SectionHeading
                title='Browse by Category'
                badge={`${categories.length} categories`}
                badgeStyle='plain'
                accent='red'
            />

            {/* 2 columns on phones, 3 on tablets, 6 on big screens. */}
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
                {visible.map(category => (
                    <CategoryTile key={category.id} category={category} />
                ))}
            </div>

            {/* Only needed when there are more than fit in the first rows. */}
            {sorted.length > FIRST_COUNT && (
                <div className='mt-6 text-center'>
                    <button
                        type='button'
                        onClick={() => setShowAll(!showAll)}
                        className='rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white'
                    >
                        {showAll ? 'Show fewer' : `Show all ${sorted.length} categories`}
                    </button>
                </div>
            )}
        </section>
    )
}

export default CategoryGrid
