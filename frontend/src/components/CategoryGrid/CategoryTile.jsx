import { CATEGORY_COLORS } from '../../styles/categoryColors'
import { CATEGORY_ICONS, FALLBACK_ICON } from './categoryIcons'
import { pluralize } from '../../utils/format'


// ---------------------------------------------------------------
// One square in the "Browse by Category" grid:
//
//        [icon]
//     Ghost Stories
//        1 story
//
// Usage:
//   <CategoryTile category={category} />
//
// `category` comes straight from /api/categories/:
//   { id, name, slug, icon, color, story_count, ... }
// ---------------------------------------------------------------
function CategoryTile({ category }) {
    // Look up the colour classes and the icon component by name.
    // || = "or, if that's missing, use this instead" - so a colour or
    // icon name the frontend doesn't know can't break the tile.
    const colors = CATEGORY_COLORS[category.color] || CATEGORY_COLORS.red
    const Icon = CATEGORY_ICONS[category.icon] || FALLBACK_ICON

    // "1 story" but "0 stories" / "5 stories" (utils/format.js).
    const countText = pluralize(category.story_count, 'story', 'stories')

    return (
        // The whole tile is one link.
        // bg-linear-to-b from-X to-gray-900 = a gradient from the
        // category colour at the top to dark grey at the bottom.
        // (the "from-" colour is inside colors.tile)
        // hover:-translate-y-0.5 lifts the tile a tiny bit on hover.
        <a
            href={`/category/${category.slug}`}
            className={`flex flex-col items-center gap-2 rounded-xl border bg-linear-to-b to-gray-900 px-3 py-5 text-center transition hover:-translate-y-0.5 ${colors.tile}`}
        >
            {/* Icon is a variable holding a component, so it's used
                like any component: <Icon />. It MUST start with a
                capital letter - <icon /> would make React look for an
                HTML tag called "icon". Lucide icons accept
                className and strokeWidth as props. */}
            <Icon className={`h-6 w-6 ${colors.icon}`} strokeWidth={1.75} />

            <span className='text-sm font-bold text-white'>{category.name}</span>
            <span className='text-xs text-gray-500'>{countText}</span>
        </a>
    )
}

export default CategoryTile
