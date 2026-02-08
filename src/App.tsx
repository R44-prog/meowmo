import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './components/landing/LandingPage'
import { AppShell } from './components/layout/AppShell'
import { TimelinePage } from './pages/TimelinePage'
import { InsightsPage } from './pages/InsightsPage'
import { ProfilePage } from './pages/ProfilePage'
import { ChallengesPage } from './pages/ChallengesPage'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { PrivacyLock } from './components/auth/PrivacyLock'
import { AdminPanel } from './components/admin/AdminPanel'
import { SyncStatus } from './components/ui/SyncStatus'

function App() {
    const [hasJoined, setHasJoined] = useState<boolean>(localStorage.getItem('hasJoined') === 'true')
    const [catName, setCatName] = useState<string | null>(localStorage.getItem('catName'))
    const [tempName, setTempName] = useState('')
    const [privacyEnabled, setPrivacyEnabled] = useState<boolean>(localStorage.getItem('privacyLockEnabled') === 'true')

    // Global Modals (Settings/Admin accessible from Profile)
    // We can move these to ProfilePage context later, but keeping simple for now.

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
                        <div className="space-y-2">
                            <label htmlFor="cat-name-input" className="sr-only">Cat's Name</label>
                            <input
                                id="cat-name-input"
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder="e.g. Luna"
                                className="w-full px-4 py-3 bg-white border border-neutral/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-lg text-center calm-shadow"
                                autoFocus
                                aria-required="true"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!tempName.trim()}
                            className="w-full px-8 py-3 bg-accent text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent/10"
                            aria-label={`Continue with name ${tempName}`}
                        >
                            Get Started
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    const appRoutes = (
        <Routes>
            <Route element={<AppShell />}>
                <Route path="/" element={<TimelinePage catName={catName} />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );

    return (
        <BrowserRouter basename="/meowmo">
            <SyncStatus />
            {privacyEnabled ? (
                <PrivacyLock>{appRoutes}</PrivacyLock>
            ) : (
                appRoutes
            )}
        </BrowserRouter>
    )
}

export default App
