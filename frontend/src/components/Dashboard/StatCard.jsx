// ---------------------------------------------------------------
// One of the number boxes at the top of the Overview:
//
//     [icon]
//     20
//     TOTAL STORIES
//
// Usage:
//   <StatCard icon={<UsersIcon />} value={42} label='Total users' />
//
// icon is a whole JSX element passed as a prop - you can pass
// components around just like strings or numbers.
// ---------------------------------------------------------------
function StatCard({ icon, value, label }) {
    return (
        <div className='rounded-lg border border-gray-800 bg-gray-900/60 p-4'>
            <div className='text-gray-400'>{icon}</div>

            <p className='mt-2 text-2xl font-bold text-white'>{value}</p>

            {/* uppercase + tracking-wider (letter spacing) gives the
                small "TOTAL USERS" label look without typing capitals. */}
            <p className='mt-1 text-xs uppercase tracking-wider text-gray-500'>{label}</p>
        </div>
    )
}

export default StatCard
