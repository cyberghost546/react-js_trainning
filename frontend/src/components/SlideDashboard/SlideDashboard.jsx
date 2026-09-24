import { useState, useEffect, useRef } from 'react'
import { getAllSlides, createSlide, updateSlide, deleteSlide, mediaUrl } from '../../api/client'
import { LABEL_STYLE, INPUT_STYLE, BUTTON_STYLE } from '../../styles/formStyles'


// ===============================================================
// THE SLIDES DASHBOARD  (/dashboard)
//
// Left: a form to add a new slide, or edit one you clicked.
// Right: every slide in the database, hidden ones included.
//
// Only admins can use it. App.jsx wraps it in <ProtectedRoute
// adminOnly>, and Django checks again on every request (the login
// cookie is sent along with each one).
// ===============================================================


// What a blank form looks like. Used on first load, after saving,
// and when you press Cancel - one place to change it.
// (The image isn't in here - see imageFile below for why.)
const EMPTY_FORM = {
    title: '',
    description: '',
    order: 0,
    is_active: true,
}


function SlideDashboard() {
    // Every slide, straight from the API.
    const [slides, setSlides] = useState([])

    // All the text fields of the form live in ONE object. With four
    // fields that's easier than four separate useState calls.
    const [form, setForm] = useState(EMPTY_FORM)

    // The picked image file. Kept apart from `form` because a file
    // input can't be "controlled" - React can read what you picked,
    // but it's not allowed to set the value.
    const [imageFile, setImageFile] = useState(null)

    // null = the form is creating a new slide.
    // a number = the form is editing the slide with that id.
    const [editingId, setEditingId] = useState(null)

    const [error, setError] = useState(null)

    // True while a save is happening, so the button can be disabled
    // and you can't double-click and create two copies.
    const [saving, setSaving] = useState(false)

    // Since we can't clear a file input through state, we grab the
    // real DOM element and clear it by hand (see resetForm).
    const fileInputRef = useRef(null)


    // Asks Django for the list and puts it in state. It's a separate
    // function because we need it in two places: on page load, and
    // after every save/delete so the list shows the change.
    function loadSlides() {
        getAllSlides()
            .then(data => setSlides(data))
            .catch(err => setError(err.message))
    }

    useEffect(() => {
        loadSlides()
    }, [])


    // ONE change handler for every text input, instead of one each.
    // It works because every input has a `name` that matches a key
    // in `form` (name='title' -> form.title).
    //
    // [name]: value  is a "computed key" - it means "use whatever is
    // inside the variable `name` as the key". So typing in the title
    // box runs  { ...form, title: 'what you typed' }.
    //
    // ...form copies all the other fields over unchanged. You must
    // make a NEW object - React only re-renders if the object is new.
    function handleChange(event) {
        const { name, value, type, checked } = event.target

        // Checkboxes keep their on/off in .checked, not .value.
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    }

    function handleFileChange(event) {
        // .files is a list (inputs can allow many). We only want one.
        setImageFile(event.target.files[0])
    }

    function resetForm() {
        setForm(EMPTY_FORM)
        setImageFile(null)
        setEditingId(null)
        fileInputRef.current.value = ''
    }

    // Fills the form with an existing slide so you can change it.
    function startEdit(slide) {
        setEditingId(slide.id)
        setForm({
            title: slide.title,
            description: slide.description,
            order: slide.order,
            is_active: slide.is_active,
        })
        setImageFile(null)
        fileInputRef.current.value = ''

        // The form is at the top - jump there so you can see it filled in.
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleSubmit(event) {
        // Stop the browser's default "submit = reload the page".
        event.preventDefault()
        setError(null)

        // FormData is how you send a file to a server. It's like a
        // JSON object that is allowed to carry files.
        // Everything becomes text: true -> "true", 3 -> "3".
        // Django turns them back into the right types.
        const data = new FormData()
        data.append('title', form.title)
        data.append('description', form.description)
        data.append('order', form.order)
        data.append('is_active', form.is_active)

        // When editing, no new file = keep the old image. So only
        // send "image" if one was actually picked.
        if (imageFile) {
            data.append('image', imageFile)
        }

        setSaving(true)

        // try/catch/finally is the async/await version of
        // .then/.catch/.finally.
        try {
            if (editingId) {
                await updateSlide(editingId, data)
            } else {
                await createSlide(data)
            }
            resetForm()
            loadSlides()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(slide) {
        // confirm() shows the browser's OK/Cancel box. Cheap safety net.
        if (!window.confirm(`Delete "${slide.title}"? This can't be undone.`)) {
            return
        }

        try {
            await deleteSlide(slide.id)

            // Don't leave the form editing something that's gone.
            if (editingId === slide.id) resetForm()

            loadSlides()
        } catch (err) {
            setError(err.message)
        }
    }

    // When editing, find that slide so we can show its current image.
    const editingSlide = slides.find(s => s.id === editingId)


    return (
        // No padding here - DashboardLayout's <main> already adds it,
        // so every dashboard page lines up the same.
        <div className='max-w-6xl text-white'>
            <h1 className='text-2xl font-bold mb-6'>Slideshow</h1>

            {/* Only shows when there IS an error. */}
            {error && (
                <div className='bg-red-900/50 border border-red-600 text-red-100 rounded-md p-4 mb-6'>
                    <p className='break-all'>{error}</p>
                </div>
            )}

            {/* One column on small screens. On large screens: 3 columns,
                the form takes 1 and the list takes 2. */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                {/* ---------- THE FORM ---------- */}
                <form onSubmit={handleSubmit} className='bg-slate-900 rounded-lg p-6 space-y-4 h-fit'>
                    <h2 className='text-xl font-bold'>
                        {editingId ? 'Edit slide' : 'Add a new slide'}
                    </h2>

                    <div>
                        <label htmlFor='title' className={LABEL_STYLE}>Title</label>
                        {/* value + onChange = a "controlled input". React
                            state is the truth; the input just shows it. */}
                        <input
                            id='title'
                            name='title'
                            value={form.title}
                            onChange={handleChange}
                            required
                            className={INPUT_STYLE}
                        />
                    </div>

                    <div>
                        <label htmlFor='description' className={LABEL_STYLE}>Story</label>
                        <textarea
                            id='description'
                            name='description'
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className={INPUT_STYLE}
                        />
                    </div>

                    <div>
                        <label htmlFor='image' className={LABEL_STYLE}>Image</label>

                        {editingSlide && (
                            <img
                                src={mediaUrl(editingSlide.image)}
                                alt=''
                                className='w-full h-32 object-cover rounded-md mb-2'
                            />
                        )}

                        {/* No value= here - file inputs can't be controlled.
                            required only when creating: a new slide needs a
                            picture, an edited one already has one. */}
                        <input
                            id='image'
                            type='file'
                            accept='image/*'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            required={!editingId}
                            // file: styles the "Choose File" button that
                            // the browser draws inside a file input.
                            className='text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-white hover:file:bg-slate-600 file:cursor-pointer'
                        />
                        {editingId && (
                            <p className='text-xs text-gray-400 mt-1'>Leave empty to keep the current image.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor='order' className={LABEL_STYLE}>Order (lower shows first)</label>
                        <input
                            id='order'
                            name='order'
                            type='number'
                            min='0'
                            value={form.order}
                            onChange={handleChange}
                            required
                            className={INPUT_STYLE}
                        />
                    </div>

                    {/* checked= instead of value= for checkboxes. */}
                    <label className='flex items-center gap-2 text-sm'>
                        <input
                            name='is_active'
                            type='checkbox'
                            checked={form.is_active}
                            onChange={handleChange}
                        />
                        Show on the homepage
                    </label>

                    <div className='flex gap-3 pt-2'>
                        <button
                            type='submit'
                            disabled={saving}
                            className={BUTTON_STYLE}
                        >
                            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add slide'}
                        </button>

                        {/* type='button' matters! Inside a <form>, a button
                            without a type counts as "submit". */}
                        {editingId && (
                            <button
                                type='button'
                                onClick={resetForm}
                                className='border border-slate-600 hover:bg-slate-800 px-4 py-2 rounded-md'
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* ---------- THE LIST ---------- */}
                <div className='lg:col-span-2 space-y-4'>
                    {slides.length === 0 && (
                        <p className='text-gray-300'>No slides yet. Add your first one with the form.</p>
                    )}

                    {slides.map(slide => (
                        <div key={slide.id} className='bg-slate-900 rounded-lg p-4 flex gap-4'>
                            {/* shrink-0 stops the flex row from squashing
                                the picture when the text is long. */}
                            <img
                                src={mediaUrl(slide.image)}
                                alt={slide.title}
                                className='w-40 h-24 object-cover rounded-md shrink-0'
                            />

                            {/* flex-1 = take all the space that's left.
                                min-w-0 lets long text wrap instead of
                                pushing the buttons off the card. */}
                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2'>
                                    <h3 className='font-bold truncate'>{slide.title}</h3>
                                    {!slide.is_active && (
                                        <span className='text-xs bg-slate-700 text-gray-300 px-2 py-0.5 rounded'>Hidden</span>
                                    )}
                                </div>
                                {/* line-clamp-2 cuts long stories to 2 lines with "..." */}
                                <p className='text-sm text-gray-400 line-clamp-2'>{slide.description}</p>
                                <p className='text-xs text-gray-500 mt-1'>Order: {slide.order}</p>
                            </div>

                            <div className='flex flex-col gap-2 shrink-0'>
                                {/* An arrow function, not onClick={startEdit(slide)}.
                                    That would CALL it during render, straight away,
                                    for every slide. The arrow waits for the click. */}
                                <button
                                    type='button'
                                    onClick={() => startEdit(slide)}
                                    className='text-sm border border-slate-600 hover:bg-slate-800 px-3 py-1 rounded-md'
                                >
                                    Edit
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleDelete(slide)}
                                    className='text-sm border border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded-md'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SlideDashboard
