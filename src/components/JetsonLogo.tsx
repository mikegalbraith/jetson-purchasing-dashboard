export default function JetsonLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="96" fill="#3CD567" />
      <text
        x="256"
        y="320"
        textAnchor="middle"
        fill="white"
        fontSize="280"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        J
      </text>
    </svg>
  )
}
