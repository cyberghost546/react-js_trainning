import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'


// ---------------------------------------------------------------
// The frame around every PUBLIC page: header on top, footer at the
// bottom, the page itself in between (<Outlet />).
//
// The dashboard has its own frame (DashboardLayout) with a sidebar
// instead - see App.jsx for which pages use which.
// ---------------------------------------------------------------
function SiteLayout() {
    return (
        // min-h-screen + flex-col + flex-1 on the middle section is the
        // standard "sticky footer" trick: if the page content is short,
        // the footer still sits at the bottom of the window instead of
        // floating halfway up the screen.
        <div className='home min-h-screen flex flex-col'>
            <Header />

            <main className='flex-1'>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default SiteLayout
