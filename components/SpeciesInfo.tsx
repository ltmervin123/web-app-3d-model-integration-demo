import { Species } from "@/types/species";

interface SpeciesInfoProps {
  species: Species;
}

const conservationConfig: Record<
  Species["conservationStatus"],
  { label: string; color: string; dot: string; level: number }
> = {
  "Least Concern": {
    label: "Least Concern",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
    level: 1,
  },
  "Near Threatened": {
    label: "Near Threatened",
    color: "bg-lime-50 text-lime-700 ring-lime-600/20 ",
    dot: "bg-lime-500",
    level: 2,
  },
  Vulnerable: {
    label: "Vulnerable",
    color: "bg-amber-50 text-amber-700 ring-amber-600/20 ",
    dot: "bg-amber-500",
    level: 3,
  },
  Endangered: {
    label: "Endangered",
    color: "bg-orange-50 text-orange-700 ring-orange-600/20 ",
    dot: "bg-orange-500",
    level: 4,
  },
  "Critically Endangered": {
    label: "Critically Endangered",
    color: "bg-red-50 text-red-700 ring-red-600/20 ",
    dot: "bg-red-500",
    level: 5,
  },
};

const FamilyIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7V5a2 2 0 012-2h2M3 17v2a2 2 0 002 2h2M17 3h2a2 2 0 012 2v2M17 21h2a2 2 0 002-2v-2M9 12h6M12 9v6"
    />
  </svg>
);

const OrderIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6h18M3 12h18M3 18h18"
    />
  </svg>
);

const HabitatIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
    />
  </svg>
);

const SpeciesIcon = () => (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1.07A6.002 6.002 0 0116 10c0 2.5-2 4-2 6H6c0-2-2-3.5-2-6a6.002 6.002 0 015-5.93V3a1 1 0 011-1z" />
  </svg>
);

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white/60 p-4 transition-colors hover:border-gray-300 hover:bg-white ">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-gray-200 ">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
          {label}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-900 ">{value}</p>
      </div>
    </div>
  );
}

export default function SpeciesInfo({ species }: SpeciesInfoProps) {
  const conservation = conservationConfig[species.conservationStatus];

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {/* Header */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 ">
          <SpeciesIcon />
          Species Profile
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 ">
            {species.commonName}
          </h1>
          <p className="mt-1 text-base italic text-gray-500 ">
            {species.scientificName}
          </p>
        </div>
      </header>

      {/* Conservation status banner */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 ">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-gray-700 ">
            <ShieldIcon />
            <span className="text-sm font-semibold ">Conservation Status</span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${conservation.color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${conservation.dot}`} />
            {conservation.label}
          </span>
        </div>

        {/* Risk scale */}
        <div className="mt-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full ${
                  step <= conservation.level ? conservation.dot : "bg-gray-200 "
                }`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-medium uppercase tracking-wide text-gray-400 ">
            <span>Safe</span>
            <span>At Risk</span>
          </div>
        </div>
      </div>

      {/* Taxonomy & habitat cards */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 ">
          Classification & Habitat
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard
            icon={<FamilyIcon />}
            label="Family"
            value={species.family}
          />
          <InfoCard icon={<OrderIcon />} label="Order" value={species.order} />
        </div>
        <InfoCard
          icon={<HabitatIcon />}
          label="Habitat"
          value={species.habitat}
        />
      </section>
    </div>
  );
}
