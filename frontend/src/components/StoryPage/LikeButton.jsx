import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useRequireLogin } from '../../hooks/useRequireLogin'
import { likeStory } from '../../api/client'
import { pluralize } from '../../utils/format'


// ---------------------------------------------------------------
// The Like button + "12 likes".
//
// Usage:
//   <LikeButton key={story.id} storyId={story.id}
//       initialLiked={story.liked} initialCount={story.like_count} />
//
// "initial..." props: the button starts from what Django said, then
// keeps its OWN state as you click. (That's why StoryPage gives it a
// key - a new story = a fresh button, starting from the new values.)
// ---------------------------------------------------------------
function LikeButton({ storyId, initialLiked, initialCount }) {
    const requireLogin = useRequireLogin()

    const [liked, setLiked] = useState(initialLiked)
    const [count, setCount] = useState(initialCount)

    // True while waiting for Django - the button is disabled so a
    // fast double-click can't send two likes at once.
    const [busy, setBusy] = useState(false)

    async function handleClick() {
        if (!requireLogin()) return

        setBusy(true)
        try {
            // Django toggles it and tells us the new truth, so we use
            // ITS numbers instead of guessing (+1 / -1) ourselves.
            const data = await likeStory(storyId)
            setLiked(data.liked)
            setCount(data.like_count)
        } catch (err) {
            console.error('Could not like story:', err)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className='flex items-center gap-4'>
            <button
                type='button'
                onClick={handleClick}
                disabled={busy}
                aria-pressed={liked}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
                    liked
                        ? 'border-red-600 bg-red-600/15 text-red-400'
                        : 'border-gray-600 text-gray-200 hover:border-gray-400'
                }`}
            >
                {/* fill-current fills the heart with the text colour -
                    an outline heart becomes a solid one. */}
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
            </button>

            <span className='text-sm text-gray-500'>{pluralize(count, 'like', 'likes')}</span>
        </div>
    )
}

export default LikeButton
