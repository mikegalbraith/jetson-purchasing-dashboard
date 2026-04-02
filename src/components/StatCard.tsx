interface StatCardProps {
  label: string
  value: string
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatCard({ label, value, subtext, trend }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && <p className={`text-xs mt-1 ${trendColor}`}>{subtext}</p>}
    </div>
  )
}
