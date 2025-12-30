'use client'

interface MonthlyGivingChartProps {
  data: Array<{
    month: string
    amount: number
  }>
}

export default function MonthlyGivingChart({ data }: MonthlyGivingChartProps) {
  // Find max value for scaling
  const maxAmount = Math.max(...data.map(d => d.amount))

  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-64">
        {data.map((item, i) => {
          const heightPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="w-full flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-t transition-all duration-300 cursor-pointer hover:opacity-80 relative group"
                  style={{
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(to top, #764ba2, #ff6b35)',
                    minHeight: item.amount > 0 ? '4px' : '0'
                  }}
                  title={`${item.month}: $${item.amount.toLocaleString()}`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div
                      className="px-3 py-2 rounded text-sm whitespace-nowrap"
                      style={{
                        background: 'rgba(26, 10, 46, 0.98)',
                        border: '1px solid rgba(255, 107, 53, 0.5)'
                      }}
                    >
                      <div className="font-bold text-white">${item.amount.toLocaleString()}</div>
                      <div className="text-white/70 text-xs">{item.month}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Month label */}
              <div className="text-xs text-white/60 rotate-0 text-center">
                {item.month}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ background: 'linear-gradient(to right, #764ba2, #ff6b35)' }}
          ></div>
          <span className="text-white/70">Monthly Donations</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-white/60 mb-1">Total</p>
          <p className="text-lg font-bold text-green-400">
            ${data.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/60 mb-1">Average</p>
          <p className="text-lg font-bold text-white">
            ${(data.reduce((sum, d) => sum + d.amount, 0) / data.length).toFixed(0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/60 mb-1">Peak Month</p>
          <p className="text-lg font-bold text-orange-400">
            ${maxAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
