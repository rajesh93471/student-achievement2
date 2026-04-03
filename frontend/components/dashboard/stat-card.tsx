export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-6 relative overflow-hidden animate-fade-up hover:border-brand-200 hover:shadow-panel transition-all group">
      {/* Ambient glow spot */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-50 blur-2xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity" />

      {/* Label */}
      <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">
        {label}
      </p>

      {/* Value */}
      <p className="font-display text-3xl font-semibold text-brand-700 leading-none mb-1.5 transition-transform group-hover:translate-x-0.5">
        {value}
      </p>

      {/* Helper */}
      <p className="font-sans text-[11px] text-slate-400 font-semibold uppercase tracking-tight">
        {helper}
      </p>
    </div>
  );
}
