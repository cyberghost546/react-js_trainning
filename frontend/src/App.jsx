import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/SiteLayout/SiteLayout'
import HomePage from './components/HomePage/HomePage'
import LogIn from './components/LogIn/LogIn'
import SignUp from './components/SignUp/SignUp'
import CategoryPage from './components/CategoryPage/CategoryPage'
import StoryPage from './components/StoryPage/StoryPage'
import RandomStory from './components/RandomStory/RandomStory'
import NotFound from './components/NotFound/NotFound'
import ProtectedRoute from './auth/ProtectedRoute'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import Overview from './components/Dashboard/Overview'
import SlideDashboard from './components/SlideDashboard/SlideDashboard'
import './App.css'

function App() {

  return (
    // Two groups of pages, each with its own "layout route".
    // A layout route has no path of its own (or a path its children
    // build on). Its element is a frame with an <Outlet />, and
    // React Router puts the matching child page into that Outlet.
    <Routes>

      {/* ---------- PUBLIC SITE: header + footer ---------- */}
      <Route element={<SiteLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />

        {/* :slug is a URL parameter - a placeholder that matches
            anything. /category/paranormal and /category/cryptids
            both show CategoryPage, which reads the slug with
            useParams() to know which one to load. */}
        <Route path='/category/:slug' element={<CategoryPage />} />

        {/* Same idea: /stories/5, /stories/12 ... -> StoryPage reads
            the :id with useParams(). */}
        <Route path='/stories/:id' element={<StoryPage />} />

        {/* Picks a random story and jumps to it. */}
        <Route path='/random' element={<RandomStory />} />

        {/* path='*' = "any URL nothing above matched". Without it, a
            link to a page that doesn't exist yet (/about, /settings...)
            shows an empty gap between the header and footer. React
            Router always prefers a more specific match, so this only
            catches what's left over - its position doesn't matter. */}
        <Route path='*' element={<NotFound />} />
      </Route>

      {/* ---------- ADMIN DASHBOARD: sidebar, no site header ---------- */}
      {/* The guard wraps the whole layout, so EVERY page inside is
          admins-only - no need to protect each one separately. */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* index = the page at exactly /dashboard */}
        <Route index element={<Overview />} />

        {/* Child paths have no leading "/" - they're added to the
            parent's path: 'slides' -> /dashboard/slides */}
        <Route path='slides' element={<SlideDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
