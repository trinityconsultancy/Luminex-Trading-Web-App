export function LuminexLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Upward arrow - main symbol */}
      <path
        d="M 50 10 L 80 50 L 65 50 L 65 85 L 35 85 L 35 50 L 20 50 Z"
        fill="#22c55e"
        className="transition-all duration-300 hover:fill-[#16a34a]"
      />
      {/* Accent curve */}
      <path d="M 15 60 Q 30 75 50 70" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
