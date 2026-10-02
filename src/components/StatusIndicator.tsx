export default function StatusIndicator({ label, live }: { label: string; live: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-4 py-2 text-sm font-medium tracking-widest">
      <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-red-500 animate-pulse" : "bg-neutral-400"}`} />
      {label}
    </div>
  );
}
