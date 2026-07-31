"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import { formatCurrency } from "@/utils/formatters";
import Loader from "@/components/ui/Loader";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardService
      .getStats()
      .then(({ data }) => setStats(data))
      .catch(() => setError("Could not load stats."));
  }, []);

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ivory">Dashboard</h1>

      {error && <p className="font-body text-sm text-red-400">{error}</p>}

      {!stats && !error && (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { label: "Total Vehicles", value: stats.totalVehicles },
            { label: "Active Listings", value: stats.activeListings },
            { label: "Total Orders", value: stats.totalOrders },
            { label: "Completed Revenue", value: formatCurrency(stats.totalRevenue) },
          ].map((item) => (
            <div key={item.label} className="border border-hairline p-6">
              <p className="font-display text-2xl text-gold">{item.value}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-graphite">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}