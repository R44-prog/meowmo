import { useState } from 'react'
import { Plus } from 'lucide-react'
import { LandingPage } from './components/LandingPage'

function App() {
    const [hasJoined, setHasJoined] = useState<boolean>(localStorage.getItem('hasJoined') === 'true')
    const [catName, setCatName] = useState<string | null>(localStorage.getItem('catName'))
    const [tempName, setTempName] = useState('')

    const handleJoin = () => {
        localStorage.setItem('hasJoined', 'true')
        setHasJoined(true)
    }

    const handleOnboarding = (e: React.FormEvent) => {
        e.preventDefault()
        if (tempName.trim()) {
            localStorage.setItem('catName', tempName.trim())
            setCatName(tempName.trim())
        }
    }

    if (!hasJoined) {
        return <LandingPage onJoin={handleJoin} />
    }

    if (!catName) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-md space-y-8 text-center animate-in fade-in duration-700">
                    <h1 className="text-3xl font-semibold tracking-tight text-accent">What's your cat's name?</h1>
                    <form onSubmit={handleOnboarding} className="space-y-4">
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="e.g. Luna"
                            className="w-full px-4 py-3 bg-white border border-neutral/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-lg text-center calm-shadow"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!tempName.trim()}
                            className="px-8 py-3 bg-accent text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-24 bg-background">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-neutral/10">
                <h1 className="text-xl font-semibold tracking-tight italic text-accent">{catName}'s Timeline</h1>
                <button className="text-sm font-medium text-accent opacity-60 hover:opacity-100 transition-opacity" onClick={() => {
                    localStorage.removeItem('catName')
                    localStorage.removeItem('hasJoined')
                    setCatName(null)
                    setHasJoined(false)
                }}>
                    Reset
                </button>
            </header>

            <main className="px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-neutral/5 rounded-3xl flex items-center justify-center text-neutral/40 border border-neutral/10">
                    <Plus size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-medium text-accent">No logs yet</h2>
                    <p className="text-sm opacity-60 max-w-xs">Tap the button below to log your first photo and start the timeline.</p>
                </div>
            </main>

            {/* Floating Action Button */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-transform" aria-label="Log">
                <Plus size={32} />
            </button>
        </div>
    )
}

export default App
