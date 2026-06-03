export default function HorizonMenuLines({ className = '' }: { className?: string }) {
  return (
    <span className={`flex w-5 flex-col gap-1.5 ${className}`} aria-hidden>
      <span className="block h-0.5 w-full rounded-full bg-white" />
      <span className="block h-0.5 w-full rounded-full bg-white" />
      <span className="block h-0.5 w-full rounded-full bg-white" />
    </span>
  )
}
