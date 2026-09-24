import { Volume2, Square, Maximize } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'
import SegmentedControl from '../SegmentedControl/SegmentedControl'


// The three text sizes. The values match SIZE_CLASSES in StoryBody.
// Each label is a letter "A" drawn a bit bigger than the last.
const SIZE_OPTIONS = [
    { value: 'normal', label: <span className='text-xs'>A</span>, ariaLabel: 'Normal text' },
    { value: 'large', label: <span className='text-sm'>A</span>, ariaLabel: 'Large text' },
    { value: 'xlarge', label: <span className='text-base'>A</span>, ariaLabel: 'Extra large text' },
]

const TOOL_BUTTON = 'inline-flex items-center gap-1.5 rounded-md border border-gray-700 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-500 hover:text-white'


// ---------------------------------------------------------------
// The row of reading tools under the story's intro:
//   [Listen] [Focus]                                [A A A]
//
// Props:
//   speechPieces     - the texts to read out loud (a list)
//   onFocus          - called when "Focus" is clicked
//   textSize         - 'normal' | 'large' | 'xlarge'
//   onTextSizeChange - called with the new size
//
// The toolbar doesn't own the text size - StoryPage does, because
// the story text AND Focus mode both need to know it.
// ---------------------------------------------------------------
function ReadingToolbar({ speechPieces, onFocus, textSize, onTextSizeChange }) {
    const { supported, speaking, speak, stop } = useSpeech()

    return (
        // flex-wrap: on a phone the size buttons drop to a second line
        // instead of squashing everything.
        <div className='flex flex-wrap items-center justify-between gap-3 border-y border-gray-800 py-3'>
            <div className='flex gap-2'>
                {/* No speech in this browser -> no button, rather than
                    a button that does nothing. */}
                {supported && (
                    <button
                        type='button'
                        onClick={() => (speaking ? stop() : speak(speechPieces))}
                        aria-pressed={speaking}
                        className={TOOL_BUTTON}
                    >
                        {speaking ? <Square className='h-3.5 w-3.5' /> : <Volume2 className='h-3.5 w-3.5' />}
                        {speaking ? 'Stop' : 'Listen'}
                    </button>
                )}

                <button type='button' onClick={onFocus} className={TOOL_BUTTON}>
                    <Maximize className='h-3.5 w-3.5' />
                    Focus
                </button>
            </div>

            <div className='flex items-center gap-2 text-xs text-gray-500'>
                Text size
                <SegmentedControl label='Text size' options={SIZE_OPTIONS} value={textSize} onChange={onTextSizeChange} />
            </div>
        </div>
    )
}

export default ReadingToolbar
