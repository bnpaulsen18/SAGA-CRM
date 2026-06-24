'use client'

interface MonthlyGivingChartProps {
  data: Array<{
    month: string
    amount: number
  }>
}

export default function MonthlyGivingChart({ data }: MonthlyGivingChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount))
  const barFill = 'linear-gradient(to top, #5B4B8A, #E0507A, #F97A5E)'

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-64">
        {data.map((item, i) => {
          const heightPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-t transition-all duration-300 cursor-pointer hover:opacity-90 relative group"
                  style={{
                    height: `${heightPercent}%`,
                    background: barFill,
                    minHeight: item.amount > 0 ? '4px' : '0',
                  }}
                  title={`${item.month}: $${item.amount.toLocaleString()}`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="px-3 py-2 rounded-lg text-sm whitespace-nowrap bg-[var(--surface)] border border-[var(--line)] shadow-lg">
                      <div className="font-bold text-[var(--ink)] tabular-nums">${item.amount.toLocaleString()}</div>
                      <div className="text-[var(--ink-faint)] text-xs">{item.month}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-[var(--ink-faint)] text-center">{item.month}</div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }} />
          <span className="text-[var(--ink-soft)]">Monthly Donations</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--line)]">
        <div className="text-center">
          <p className="text-xs text-[var(--ink-faint)] mb-1">Total</p>
          <p className="text-lg font-bold text-[#4A8C6F] tabular-nums">
            ${data.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--ink-faint)] mb-1">Average</p>
          <p className="text-lg font-bold text-[var(--ink)] tabular-nums">
            ${(data.reduce((sum, d) => sum + d.amount, 0) / data.length).toFixed(0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--ink-faint)] mb-1">Peak Month</p>
          <p className="text-lg font-bold text-[#E0507A] tabular-nums">
            ${maxAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
