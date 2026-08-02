"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { vehicleService } from "@/services/vehicle.service";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import VehicleCard from "@/features/vehicles/VehicleCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState({ query: "", vehicles: [] });

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    vehicleService.search(query).then(({ data }) => {
      if (!cancelled) setResults({ query, vehicles: data });
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const isLoading = query !== "" && results.query !== query;
  const displayVehicles = query === "" ? [] : results.vehicles;

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Search Results"
          title={query ? `"${query}"` : "Search the collection"}
          description={
            !isLoading ? `${displayVehicles.length} vehicle${displayVehicles.length === 1 ? "" : "s"} found` : undefined
          }
        />

        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Loader />
          </div>
        ) : displayVehicles.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={query ? "No vehicles matched that search" : "Type something to search"}
              description={query ? "Try a brand name, model, or keyword like 'convertible' or 'electric'." : undefined}
            />
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 pt-32 pb-24 lg:px-12">
          <div className="mx-auto max-w-7xl flex justify-center">
            <Loader />
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}