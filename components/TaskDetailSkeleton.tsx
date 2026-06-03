export default function TaskDetailSkeleton() {
  return (
    <div
      className="animate-pulse space-y-5 border-t border-borderMuted px-4 pb-4 pt-3"
      aria-hidden
    >
      <div className="space-y-2">
        <div className="h-2.5 w-28 rounded bg-borderMuted" />
        <div className="h-3 w-full rounded bg-borderMuted" />
        <div className="h-3 w-[92%] rounded bg-borderMuted" />
      </div>
      <div className="space-y-3 rounded-xl border border-borderMuted bg-accentMuted/20 p-4">
        <div className="h-2.5 w-40 rounded bg-borderMuted" />
        <div className="h-3 w-full rounded bg-borderMuted" />
        <div className="space-y-2 pt-1">
          <div className="h-2.5 w-16 rounded bg-borderMuted" />
          <div className="h-3 w-full rounded bg-borderMuted" />
          <div className="h-16 w-full rounded-lg bg-[#0d1117]/40" />
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-16 rounded bg-borderMuted" />
          <div className="h-3 w-[85%] rounded bg-borderMuted" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-24 rounded-lg bg-borderMuted" />
        <div className="h-6 w-28 rounded-lg bg-borderMuted" />
      </div>
    </div>
  )
}
