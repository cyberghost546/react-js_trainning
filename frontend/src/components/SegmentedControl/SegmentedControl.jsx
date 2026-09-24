// ---------------------------------------------------------------
// A row of buttons where exactly ONE is selected:
//
//     [ Newest | Oldest ]        [ ▦ | ☰ ]
//
// Usage:
//   const [sort, setSort] = useState('newest')
//
//   <SegmentedControl
//       label='Sort stories'
//       value={sort}
//       onChange={setSort}
//       options={[
//           { value: 'newest', label: 'Newest' },
//           { value: 'oldest', label: 'Oldest' },
//       ]}
//   />
//
// This component doesn't keep its own state. The PARENT owns the
// value and passes it down; clicking calls onChange so the parent
// can update it. (A "controlled component" - same idea as an
// <input value={...} onChange={...} />.)
//
// `label` can be text OR an icon. If it's an icon, also give the
// option an `ariaLabel`, so screen readers know what it means:
//   { value: 'grid', label: <LayoutGrid />, ariaLabel: 'Grid view' }
// ---------------------------------------------------------------
function SegmentedControl({ options, value, onChange, label }) {
    return (
        <div role='group' aria-label={label} className='inline-flex rounded-lg border border-gray-700 bg-gray-900 p-1'>
            {options.map(option => {
                const isSelected = option.value === value

                return (
                    // aria-pressed tells screen readers this button is
                    // a toggle, and whether it's currently switched on.
                    <button
                        key={option.value}
                        type='button'
                        onClick={() => onChange(option.value)}
                        aria-pressed={isSelected}
                        aria-label={option.ariaLabel}
                        className={`flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                            isSelected ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}

export default SegmentedControl
