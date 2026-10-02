import { garments } from "../garments";
import GarmentCard from "./GarmentCard";

type Props = { activeId: string; busy: boolean; onPick: (id: string) => void };

export default function GarmentSelector({ activeId, busy, onPick }: Props) {
  return (
    <section className="px-6 pb-5 pt-2">
      <h2 className="mb-3 text-sm font-medium tracking-widest text-neutral-500">Choose your outfit</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-1">
        {garments.map((g) => (
          <GarmentCard key={g.id} g={g} active={g.id === activeId} disabled={busy} onPick={() => onPick(g.id)} />
        ))}
      </div>
    </section>
  );
}
