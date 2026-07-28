"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import { compareService } from "@/services/compare.service";
import { formatCurrency } from "@/utils/formatters";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

const SPEC_ROWS = [
  { label: "Price", key: "price", format: formatCurrency },
  { label: "Horsepower", key: "horsepower", suffix: " hp" },
  { label: "0–60 mph", key: "zeroToSixty", suffix: " s" },
  { label: "Top speed", key: "topSpeed", suffix: " mph" },
  { label: "Transmission", key: "transmission" },
  { label: "Drivetrain", key: "drivetrain" },
];

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();
  const [vehicles, setVehicles] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (compareList.length === 0) return;
    compareService.getByIds(compareList).then(({ data }) => setVehicles(data));
  }, [compareList]);

  const displayVehicles = compareList.length === 0 ? [] : vehicles;

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Side by Side" title="Compare Vehicles" description="Up to 3 vehicles at once." />

        {displayVehicles === null ? (
          <div className="mt-16 flex justify-center">
            <Loader />
          </div>
        ) : displayVehicles.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No vehicles selected for comparison"
              description="Add up to three vehicles from any listing to compare them here."
              actionLabel="Browse the collection"
              onAction={() => router.push("/collection")}
            />
          </div>
        ) : (
          <div className="mt-16 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-hairline p-4 text-left font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                    Spec
                  </th>
                  {displayVehicles.map((vehicle) => (
                    <th key={vehicle.id} className="border-b border-hairline p-4 text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
                            {vehicle.brand}
                          </p>
                          <p className="font-display text-lg text-ivory">{vehicle.name}</p>
                        </div>
                        <button
                          aria-label={`Remove ${vehicle.name}`}
                          onClick={() => removeFromCompare(vehicle.id)}
                          className="text-graphite transition-colors hover:text-gold"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="border-b border-hairline p-4 font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                      {row.label}
                    </td>
                    {displayVehicles.map((vehicle) => (
                      <td key={vehicle.id} className="border-b border-hairline p-4 font-mono text-sm text-ivory">
                        {row.format ? row.format(vehicle[row.key]) : `${vehicle[row.key]}${row.suffix || ""}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}