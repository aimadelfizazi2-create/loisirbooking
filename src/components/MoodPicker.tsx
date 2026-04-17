import { MOODS } from "@/data/activities";
import { useFilters } from "@/contexts/FiltersContext";

export function MoodPicker() {
  const { moods, setMoods } = useFilters();
  const toggle = (m: string) => {
    setMoods(moods.includes(m) ? moods.filter((x) => x !== m) : [...moods, m]);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {MOODS.map((m) => {
        const active = moods.includes(m);
        return (
          <button
            key={m}
            onClick={() => toggle(m)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${active
              ? "border-primary bg-primary text-primary-foreground shadow-soft"
              : "border-border bg-background hover:border-primary/40"}`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
