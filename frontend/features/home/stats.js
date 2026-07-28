import { dashboardService } from "@/services/dashboard.service";
import { formatCurrency } from "@/utils/formatters";

export default async function Stats() {
  const { data: stats } = await dashboardService.getStats();

  const items = [
    { label: "Vehicles in Collection", value: stats.totalVehicles },
    { label: "Active Listings", value: stats.activeListings },
    { label: "Vehicles Placed", value: stats.totalOrders },
    { label: "Portfolio Value", value: formatCurrency(stats.totalRevenue) },
  ];

  return (
    <section className="border-t border-hairline bg-surface px-6 py-16 lg:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="font-display text-3xl text-gold md:text-4xl">{item.value}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-graphite">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}