import SlideShow from '../SlideShow/SlideShow'
import StorySections from '../StorySections/StorySections'
import CategoryGrid from '../CategoryGrid/CategoryGrid'


// The homepage ("/") is just its sections stacked top to bottom.
// Want a new section on the homepage? Build it as its own
// component and add one line here.
//
// The PAGE decides the background and the spacing between sections.
// The sections themselves have none - that's what lets you drop
// <CategoryGrid /> onto another page without fighting its padding.
function HomePage() {
    return (
        // <>...</> (a fragment) groups them without an extra <div>.
        <>
            <SlideShow />

            {/* One dark band behind all the sections.
                space-y-20 = the same gap between every section. */}
            <div className='space-y-20 bg-gray-900 px-4 py-14'>
                <StorySections />
                <CategoryGrid />
            </div>
        </>
    )
}

export default HomePage
