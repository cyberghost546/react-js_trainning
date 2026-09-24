import { useState, useEffect } from 'react'


// ---------------------------------------------------------------
// Read text out loud, using the voice built into the browser
// (the Web Speech API - no server, no API key, free).
//
// Usage:
//   const { supported, speaking, speak, stop } = useSpeech()
//
//   speak(['First paragraph.', 'Second paragraph.'])
//   stop()
//
// supported - false in the rare browser without speech: hide the button
// speaking  - true while it's talking: show "Stop" instead of "Listen"
// ---------------------------------------------------------------
export function useSpeech() {
    // Checked once. 'speechSynthesis' in window = "does this browser
    // have the speech feature at all?"
    const supported = 'speechSynthesis' in window

    const [speaking, setSpeaking] = useState(false)

    // Leave the page while it's talking -> stop talking.
    // A cleanup function with an empty [] runs when the component
    // using this hook disappears.
    useEffect(() => {
        return () => {
            if (supported) window.speechSynthesis.cancel()
        }
    }, [supported])

    // `pieces` is a list of texts. Why not one big string? Chrome's
    // voices can stop by themselves partway through very long text,
    // so it's safer to queue one short piece (paragraph) at a time.
    // speechSynthesis plays queued pieces one after another.
    function speak(pieces) {
        if (!supported) return

        // Stop anything that's still playing first.
        window.speechSynthesis.cancel()

        pieces.forEach((text, index) => {
            const utterance = new SpeechSynthesisUtterance(text)

            // When the LAST piece finishes, we're done talking.
            if (index === pieces.length - 1) {
                utterance.onend = () => setSpeaking(false)
            }

            // A real problem (no voice available, etc.) -> give up.
            // "interrupted" / "canceled" just mean WE stopped it on
            // purpose (with cancel()), so those aren't problems.
            utterance.onerror = event => {
                if (event.error !== 'interrupted' && event.error !== 'canceled') {
                    setSpeaking(false)
                }
            }

            window.speechSynthesis.speak(utterance)
        })

        setSpeaking(true)
    }

    function stop() {
        if (!supported) return
        window.speechSynthesis.cancel()
        setSpeaking(false)
    }

    return { supported, speaking, speak, stop }
}
