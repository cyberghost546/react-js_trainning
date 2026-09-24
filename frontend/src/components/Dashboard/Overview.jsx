import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardStats, API_HOST } from '../../api/client'
import StatCard from './StatCard'
import Panel from './Panel'
import BarChart from './BarChart'
import { UsersIcon, PhotoIcon, EyeIcon, TagIcon } from './DashboardIcons'


// ===============================================================
// THE DASHBOARD HOME PAGE  (/dashboard)
//
// Top to bottom:
//   1. Title
//   2. Four number cards               (StatCard x4)
//   3. Sign-ups per day, last 7 days   (Panel + BarChart)
//   4. Recent users | recent slides    (Panel x2)
//
// All the data comes from ONE request: /api/dashboard/stats/
// ===============================================================
function Overview() {
    const { user } = useAuth()

    // null until the API answers. Then it looks like:
    // { stats: {...}, signups: [...], recent_users: [...], recent_slides: [...] }
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        getDashboardStats()
            .then(result => setData(result))
            .catch(err => setError(err.message))
    }, [])

    if (error) {
        return <p className='text-red-400'>Could not load the dashboard: {error}</p>
    }

    if (!data) {
        return <p className='text-gray-400'>Loading...</p>
    }

    // The cards, as data. Adding a fifth card = one more line here.
    // (Once there's a Story model: { label: 'Total stories', value: data.stats.total_stories, icon: <BookIcon /> })
    const cards = [
        { label: 'Total users', value: data.stats.total_users, icon: <UsersIcon /> },
        { label: 'Slides', value: data.stats.total_slides, icon: <PhotoIcon /> },
        { label: 'On homepage', value: data.stats.active_slides, icon: <EyeIcon /> },
        { label: 'Categories', value: data.stats.total_categories, icon: <TagIcon /> },
    ]

    return (
        <div className='space-y-6'>

            {/* ---------- 1. TITLE ---------- */}
            <div>
                <h1 className='text-2xl font-bold'>Overview</h1>
                <p className='text-sm text-gray-400'>
                    Welcome back, {user.username}. Here's what's happening on the site.
                </p>
            </div>

            {/* ---------- 2. NUMBER CARDS ---------- */}
            {/* 1 column on phones, 2 on tablets, 4 on big screens. */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {cards.map(card => (
                    <StatCard key={card.label} icon={card.icon} value={card.value} label={card.label} />
                ))}
            </div>

            {/* ---------- 3. CHART ---------- */}
            <Panel title='Activity — Last 7 Days' subtitle='New sign-ups per day'>
                <BarChart data={data.signups} color='bg-blue-500' legend='New users' />
            </Panel>

            {/* ---------- 4. RECENT LISTS ---------- */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>

                {/* There's no Users page in React yet, so "View all"
                    opens Django's admin user list instead. */}
                <Panel title='Recent Users' actionLabel='View all' actionTo={`${API_HOST}/admin/auth/user/`}>
                    {data.recent_users.length === 0 && <p className='text-sm text-gray-500'>No users yet.</p>}

                    {/* divide-y = a thin line BETWEEN rows (not above the first). */}
                    <ul className='divide-y divide-gray-800'>
                        {data.recent_users.map(u => (
                            <li key={u.id} className='flex items-center gap-3 py-2'>
                                <span className='flex h-7 w-7 items-center justify-center rounded-full bg-red-900 text-xs font-bold text-red-100'>
                                    {u.username[0].toUpperCase()}
                                </span>
                                <span className='flex-1 text-sm text-white'>{u.username}</span>

                                {/* Django sends "2026-09-24T12:30:00Z".
                                    new Date() reads that, and
                                    toLocaleDateString() prints it the way
                                    YOUR computer formats dates (9/24/2026). */}
                                <span className='text-xs text-gray-500'>
                                    {new Date(u.date_joined).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Panel>

                <Panel title='Recent Slides' actionLabel='Manage' actionTo='/dashboard/slides'>
                    {data.recent_slides.length === 0 && <p className='text-sm text-gray-500'>No slides yet.</p>}

                    <ul className='divide-y divide-gray-800'>
                        {data.recent_slides.map(slide => (
                            <li key={slide.id} className='flex items-center gap-3 py-2'>
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate text-sm text-white'>{slide.title}</p>
                                    <p className='text-xs text-gray-500'>Order {slide.order}</p>
                                </div>

                                {/* The little badge. Same shape either way,
                                    only the colours and word change. */}
                                <span
                                    className={`rounded-md border px-2 py-0.5 text-xs ${
                                        slide.is_active
                                            ? 'border-red-800 bg-red-950 text-red-400'
                                            : 'border-gray-700 text-gray-400'
                                    }`}
                                >
                                    {slide.is_active ? 'active' : 'hidden'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Panel>
            </div>
        </div>
    )
}

export default Overview
