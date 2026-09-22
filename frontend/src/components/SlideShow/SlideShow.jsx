import { useState, useEffect } from 'react'


// Django serves uploaded images at a relative path like
// "/media/slides/case1.jpg". This app runs on port 5173, so that path
// would resolve to localhost:5173/media/... which doesn't exist.
// We prepend the API host to fix that.
// TODO: this belongs in src/api/client.js, so the URL lives in one place.
const API_HOST = 'http://localhost:8000'


function SlideShow() {
    // The slides from the API. Starts as [] - NOT null - because the
    // first render happens before the data arrives, and we need
    // something we can safely call .length on.
    const [slides, setSlides] = useState([])

    // The whole slideshow is one number: which slide is showing.
    const [index, setIndex] = useState(0)

    useEffect(() => {
        fetch(`${API_HOST}/api/slides/`)
            .then(res => res.json())
            .then(data => setSlides(data))

        // The empty [] means "run once, after the first render".
        // Leave it off and the fetch sets state, which re-renders,
        // which fetches again - an infinite loop.
    }, [])

    // % (remainder) is what makes it wrap around. With 3 slides:
    // 1%3=1, 2%3=2, 3%3=0 - back to the start. Without it, index runs
    // past the end and slides[3] is undefined.
    function next() {
        setIndex(i => (i + 1) % slides.length)
    }

    // Backwards needs the extra "+ slides.length" because in JavaScript
    // -1 % 3 is -1, not 2.
    function prev() {
        setIndex(i => (i - 1 + slides.length) % slides.length)
    }

    // Guard: on the first render slides is still empty, so slides[0]
    // would be undefined and reading .image off it would throw.
    if (slides.length === 0) {
        return <div className='h-125 flex items-center justify-center text-white'>Loading...</div>
    }

    const slide = slides[index]

    return (
        // relative = positioning anchor for the arrows and dots below.
        // overflow-hidden crops the image to this box.
        <div className='relative w-full h-125 overflow-hidden'>

            {/* object-cover fills the box without squashing the photo. */}
            <img
                src={`${API_HOST}${slide.image}`}
                alt={slide.title}
                className='w-full h-full object-cover'
            />

            {/* Caption over the image. The gradient keeps white text
                readable no matter how light the photo is. */}
            <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-8'>
                <h2 className='text-3xl font-bold text-white'>{slide.title}</h2>
                <p className='text-gray-200'>{slide.description}</p>
            </div>

            {/* top-1/2 + -translate-y-1/2 is the standard way to centre
                something vertically: move it down half the parent, then
                back up half its own height.
                aria-label matters here - the button is just an arrow
                character, so a screen reader would otherwise get nothing. */}
            <button
                onClick={prev}
                aria-label='Previous slide'
                className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center'
            >
                &#8249;
            </button>

            <button
                onClick={next}
                aria-label='Next slide'
                className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center'
            >
                &#8250;
            </button>

            {/* The dots. map's second argument is the position, which is
                exactly what we set the index to on click.
                key is required - React uses it to track which element is
                which between renders. Use the database id, never the
                array position. */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default SlideShow
