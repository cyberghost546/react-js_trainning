// ---------------------------------------------------------------
// Icon NAME (what Django stores in Category.icon) -> icon COMPONENT
// (what React can draw).
//
// The icons come from the lucide-react package (lucide.dev/icons).
// We import only the ones we use, so the rest of the library never
// ends up in the app the visitor downloads.
//
// Want a new icon for a category?
//   1. Find it on lucide.dev/icons, e.g. "Candle"
//   2. Add it to the import list below
//   3. Add a line:  candle: Candle,
//   4. Type "candle" into the category's Icon field in /admin
//
// The names with a dash need quotes as keys: 'paw-print': PawPrint
// ---------------------------------------------------------------
import {
    Axe, Baby, Biohazard, BookOpen, Bot, Brain, Bug, Castle, Cctv, Cross,
    Dices, Dna, Drama, Droplet, Eye, Film, Fish, Flame, FlaskConical,
    Flashlight, Flower2, Footprints, Gem, Ghost, Glasses, Globe, History,
    Hourglass, House, Lamp, Laptop, Moon, Mountain, MountainSnow, Orbit,
    PawPrint, Puzzle, Radiation, Rocket, Satellite, Scroll, Search, Skull,
    Smartphone, Sparkles, Swords, Tornado, Trees, UserX, UtensilsCrossed,
    VenetianMask, WandSparkles,
} from 'lucide-react'

export const CATEGORY_ICONS = {
    'axe': Axe,
    'baby': Baby,
    'biohazard': Biohazard,
    'book-open': BookOpen,
    'bot': Bot,
    'brain': Brain,
    'bug': Bug,
    'castle': Castle,
    'cctv': Cctv,
    'cross': Cross,
    'dices': Dices,
    'dna': Dna,
    'drama': Drama,
    'droplet': Droplet,
    'eye': Eye,
    'film': Film,
    'fish': Fish,
    'flame': Flame,
    'flask-conical': FlaskConical,
    'flashlight': Flashlight,
    'flower-2': Flower2,
    'footprints': Footprints,
    'gem': Gem,
    'ghost': Ghost,
    'glasses': Glasses,
    'globe': Globe,
    'history': History,
    'hourglass': Hourglass,
    'house': House,
    'lamp': Lamp,
    'laptop': Laptop,
    'moon': Moon,
    'mountain': Mountain,
    'mountain-snow': MountainSnow,
    'orbit': Orbit,
    'paw-print': PawPrint,
    'puzzle': Puzzle,
    'radiation': Radiation,
    'rocket': Rocket,
    'satellite': Satellite,
    'scroll': Scroll,
    'search': Search,
    'skull': Skull,
    'smartphone': Smartphone,
    'sparkles': Sparkles,
    'swords': Swords,
    'tornado': Tornado,
    'trees': Trees,
    'user-x': UserX,
    'utensils-crossed': UtensilsCrossed,
    'venetian-mask': VenetianMask,
    'wand-sparkles': WandSparkles,
}

// Used when a category's icon name isn't in the list above
// (e.g. a typo in the admin) - so it never shows a blank space.
export const FALLBACK_ICON = BookOpen
