const styles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  received: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  onboarding: 'bg-yellow-100 text-yellow-700',
  'in-stock': 'bg-green-100 text-green-700',
  'low-stock': 'bg-yellow-100 text-yellow-700',
  'out-of-stock': 'bg-red-100 text-red-700',
  'on-order': 'bg-blue-100 text-blue-700',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.replace('-', ' ')}
    </span>
  )
}
