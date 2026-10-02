import { formatPrice, type Garment } from "../garments";

type Props = { g: Garment; active: boolean; disabled: boolean; onPick: () => void };

export default function GarmentCard({ g, active, disabled, onPick }: Props) {
  return (
    <div className={`w-52 shrink-0 rounded-3xl bg-white p-3 border-2 ${active ? "border-ink" : "border-line"}`}>
      <img src={g.image} alt={g.name} className="aspect-[4/3] w-full rounded-2xl object-cover bg-neutral-100" />
      <div className="mt-3 flex items-baseline justify-between px-1">
        <span className="font-medium">{g.name}</span>
        <span className="text-neutral-500 text-sm">{formatPrice(g.price)}</span>
      </div>
      <button onClick={onPick} disabled={disabled}
        className={`mt-3 w-full min-h-12 rounded-full text-sm font-medium tracking-widest transition-colors disabled:opacity-50
          ${active ? "bg-ink text-white" : "border border-ink text-ink active:bg-ink active:text-white"}`}>
        {active ? "WEARING" : "TRY ON"}
      </button>
    </div>
  );
}
