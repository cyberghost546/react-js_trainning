import { splitParagraphs } from '../../utils/format'


// The text sizes the reader can pick (ReadingToolbar), as Tailwind
// classes. leading-* = line height - bigger text needs taller lines.
const SIZE_CLASSES = {
    normal: 'text-lg leading-8',
    large: 'text-xl leading-9',
    xlarge: 'text-2xl leading-10',
}


// ---------------------------------------------------------------
// The story text itself. Used on the page AND in Focus mode, so the
// paragraph logic lives in one place.
//
// Usage:
//   <StoryBody body={story.body} size='large' />
// ---------------------------------------------------------------
function StoryBody({ body, size = 'normal' }) {
    const paragraphs = splitParagraphs(body)

    return (
        // The text goes in as plain text, NEVER as HTML
        // (dangerouslySetInnerHTML). Anyone can write a story, and HTML
        // would let them sneak a <script> in. As plain text, React
        // shows "<script>" as harmless letters.
        <div className={`space-y-6 text-gray-200 ${SIZE_CLASSES[size] || SIZE_CLASSES.normal}`}>
            {/* key={index} is OK here - the usual "use the id, not the
                position" rule is about lists that can be reordered or
                edited. Paragraphs never move, and they don't have ids.
                whitespace-pre-line keeps single line breaks inside a
                paragraph (poems, dialogue). */}
            {paragraphs.map((paragraph, index) => (
                <p key={index} className='whitespace-pre-line'>{paragraph}</p>
            ))}
        </div>
    )
}

export default StoryBody
