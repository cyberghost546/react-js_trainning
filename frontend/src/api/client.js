// ---------------------------------------------------------------
// One place that knows where the Django backend lives.
//
// Why bother? Without this file you end up writing
// "http://localhost:8000" in five different components. The day you
// deploy the site, that address changes - and you have to hunt down
// every copy. Here you change one line.
// ---------------------------------------------------------------

export const API_HOST = 'http://localhost:8000'


// Django REST Framework usually sends images as a full URL already
// ("http://localhost:8000/media/slides/case1.jpg"). But if it ever
// sends just the path ("/media/slides/case1.jpg"), that would point at
// localhost:5173/media/... - React's server, which doesn't have it.
// So: full URL -> use it as is. Just a path -> stick the backend's
// address on the front.
export function mediaUrl(path) {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${API_HOST}${path}`
}


// A small wrapper around fetch so components don't repeat this.
// "async/await" is just a nicer way to write .then() chains.
async function getJSON(path) {
    const response = await fetch(`${API_HOST}${path}`)

    // fetch does NOT throw on a 404 or 500 - it only throws if the
    // network itself failed. So we have to check response.ok ourselves.
    if (!response.ok) {
        const error = new Error(`Request failed: ${response.status}`)

        // Keep the number too, so a page can react to specific
        // answers - e.g. 404 means "that doesn't exist".
        error.status = response.status
        throw error
    }

    return response.json()
}


// One function per endpoint. Components call these instead of
// writing fetch() with a hardcoded URL.
export function getCategories() {
    return getJSON('/api/categories/')
}

export function getSlides() {
    return getJSON('/api/slides/')
}

// One category by its slug. Throws an error with .status 404 if
// there's no such category.
export function getCategory(slug) {
    return getJSON(`/api/categories/${slug}/`)
}

// { story_of_the_day: {...} or null, story_of_the_week: {...} or null }
export function getFeaturedStories() {
    return getJSON('/api/stories/featured/')
}

// One whole story (with its body) for the story page. Opening it
// also adds 1 to the story's view count. Throws an error with
// .status 404 for a draft or a story that doesn't exist.
//
// authRequest (not getJSON) because it sends the login cookie - so
// Django can answer "liked: true / saved: true" for YOU.
// It's defined further down; that's fine, because by the time this
// function is CALLED the whole file has loaded.
export function getStory(id) {
    return authRequest(`/api/stories/${id}/`)
}

// { id: 7 } - a random published story. Throws with .status 404 if
// there are no stories at all.
export function getRandomStory() {
    return getJSON('/api/stories/random/')
}

// Published stories. `filters` is an object, all keys optional:
//   getStories()                                        -> all, newest first
//   getStories({ category: 'paranormal' })              -> one category
//   getStories({ category: 'paranormal', sort: 'oldest' })
//   getStories({ sort: 'popular', limit: 3 })           -> top 3 by views
//
// URLSearchParams turns { category: 'paranormal', sort: 'oldest' }
// into "category=paranormal&sort=oldest" - and safely escapes any
// weird characters, which gluing strings together by hand wouldn't.
export function getStories(filters = {}) {
    const query = new URLSearchParams(filters).toString()
    return getJSON(`/api/stories/?${query}`)
}


// ---------------------------------------------------------------
// Requests that need to know WHO you are: logging in and out, and
// the admin dashboard.
//
// These are different from getJSON in two ways:
//   1. credentials: 'include' - send the login cookie along, so
//      Django knows it's you.
//   2. X-CSRFToken header - Django refuses any POST/PATCH/DELETE
//      from a logged-in user that doesn't carry this token. It's
//      protection against other websites sending requests with
//      your cookie.
// ---------------------------------------------------------------

// document.cookie is ONE string like "csrftoken=abc123; theme=dark".
// This splits it up and finds the piece we want.
function getCookie(name) {
    const cookies = document.cookie.split('; ')

    for (const cookie of cookies) {
        const [key, value] = cookie.split('=')
        if (key === name) return value
    }

    return null
}

async function authRequest(path, method = 'GET', body = null) {
    const response = await fetch(`${API_HOST}${path}`, {
        method: method,
        body: body,
        credentials: 'include',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            // No 'Content-Type' on purpose! When body is FormData the
            // browser has to write that header itself - it includes a
            // random "boundary" string that separates the fields.
        },
    })

    if (!response.ok) {
        // Django explains what went wrong in the body, e.g.
        // {"title":["This field is required."]}. Put it in the error
        // so we can show it on screen.
        const details = await response.text()
        const error = new Error(`Request failed: ${response.status} ${details}`)

        // The number on its own too (404, 403...) - same as getJSON.
        error.status = response.status

        // Also keep the details as an object, so a form can show each
        // message under the right input (error.data.password, ...).
        // try/catch because if Django crashes it sends an HTML page,
        // and JSON.parse would throw on that.
        try {
            error.data = JSON.parse(details)
        } catch {
            error.data = { detail: `Server error (${response.status})` }
        }

        throw error
    }

    // DELETE and logout answer "204 No Content" - there's no JSON to
    // read, and calling .json() on nothing would throw.
    if (response.status === 204) return null

    return response.json()
}


// --- Accounts ---

// Answers with the logged-in user, or null if nobody is.
export function getCurrentUser() {
    return authRequest('/api/accounts/me/')
}

export function loginRequest(username, password) {
    const data = new FormData()
    data.append('username', username)
    data.append('password', password)
    return authRequest('/api/accounts/login/', 'POST', data)
}

export function signupRequest(username, email, password) {
    const data = new FormData()
    data.append('username', username)
    data.append('email', email)
    data.append('password', password)
    return authRequest('/api/accounts/signup/', 'POST', data)
}

export function logoutRequest() {
    return authRequest('/api/accounts/logout/', 'POST')
}


// --- Likes, saves and comments (logged in) ---

// Click once = like, again = unlike. Answers { liked, like_count }.
export function likeStory(id) {
    return authRequest(`/api/stories/${id}/like/`, 'POST')
}

// Same idea for bookmarks. Answers { saved }.
export function saveStory(id) {
    return authRequest(`/api/stories/${id}/save/`, 'POST')
}

// Anyone can read comments, so a plain getJSON is enough.
// [ { id, author, body, created_at }, ... ] newest first.
export function getComments(storyId) {
    return getJSON(`/api/stories/${storyId}/comments/`)
}

// Answers with the new comment, in the same shape as the list above.
export function postComment(storyId, body) {
    const data = new FormData()
    data.append('body', body)
    return authRequest(`/api/stories/${storyId}/comments/`, 'POST', data)
}


// --- Dashboard (admin only) ---

// Numbers, chart data and recent lists for the Overview page.
export function getDashboardStats() {
    return authRequest('/api/dashboard/stats/')
}

export function getAllSlides() {
    return authRequest('/api/dashboard/slides/')
}

// formData, not a plain object: we're uploading an image file, and
// JSON can't carry files.
export function createSlide(formData) {
    return authRequest('/api/dashboard/slides/', 'POST', formData)
}

// PATCH = "change only the fields I send". So editing a title without
// choosing a new image keeps the old image.
export function updateSlide(id, formData) {
    return authRequest(`/api/dashboard/slides/${id}/`, 'PATCH', formData)
}

export function deleteSlide(id) {
    return authRequest(`/api/dashboard/slides/${id}/`, 'DELETE')
}
