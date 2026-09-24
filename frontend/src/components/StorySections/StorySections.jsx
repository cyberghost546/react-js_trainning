import { useState, useEffect } from 'react'
import { getFeaturedStories } from '../../api/client'
import SectionHeading from './SectionHeading'
import StoryCard from './StoryCard'
import EmptyState from './EmptyState'


// ===============================================================
// THE HOMEPAGE STORY SECTIONS
//
//   Story of the Day   (yellow)  - picked in the Django admin
//   Story of the Week  (red)     - picked in the Django admin
//   Story Battle       (red)     - always empty for now: there's
//                                  no Battle model yet
//
// This file only fetches data and arranges the pieces. The pieces
// themselves (SectionHeading, StoryCard, EmptyState) don't know or
// care where their data comes from - so they can be reused on any
// page.
// ===============================================================
function StorySections() {
    // null = still loading. Then { story_of_the_day, story_of_the_week },
    // where each one is a story object or null (nothing picked).
    const [featured, setFeatured] = useState(null)

    useEffect(() => {
        getFeaturedStories()
            .then(data => setFeatured(data))
            .catch(err => {
                console.error('Could not load featured stories:', err)
                // Visitors don't need a technical error here. Treat it
                // as "nothing picked" and the empty boxes show instead.
                setFeatured({ story_of_the_day: null, story_of_the_week: null })
            })
    }, [])

    // Still loading: show nothing for a moment, rather than flashing
    // "No story picked" and then swapping it for the real card.
    if (featured === null) {
        return null
    }

    const day = featured.story_of_the_day
    const week = featured.story_of_the_week

    return (
        // A centred column. No background or outer padding here - the
        // PAGE using this component decides those (see HomePage.jsx),
        // so it can sit on any page without a double gap.
        <div className='mx-auto max-w-4xl space-y-14'>

            <section>
                <SectionHeading title='Story of the Day' badge="Today's pick" accent='yellow' />

                {/* Ternary: a card if a story is picked, the empty box if not. */}
                {day ? (
                    <StoryCard story={day} accent='yellow' />
                ) : (
                    <EmptyState title='No story picked today' message='Check back later for today’s pick.' />
                )}
            </section>

            <section>
                <SectionHeading title='Story of the Week' badge="This week's pick" accent='red' />

                {week ? (
                    <StoryCard story={week} accent='red' />
                ) : (
                    <EmptyState title='No story picked this week' message='Check back later for this week’s pick.' />
                )}
            </section>

            <section>
                <SectionHeading title='Story Battle' badge='Showdown' badgeStyle='tag' accent='red' />
                <EmptyState
                    title='No battle active right now'
                    message='Check back soon — the next showdown is coming.'
                />
            </section>
        </div>
    )
}

export default StorySections
