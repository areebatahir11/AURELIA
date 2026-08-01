"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { orderService } from "@/services/order.service";
import { vehicleService } from "@/services/vehicle.service";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ReservationTimeline from "@/features/orders/ReservationTimeline";

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadOrders() {
      const { data: myOrders } = await orderService.getAll();
      console.log("MY ORDERS FROM API:", myOrders);
      const { data: allVehicles } = await vehicleService.getAll();
      const enriched = myOrders.map((order) => ({
        ...order,
        vehicle: allVehicles.find((vehicle) => vehicle.id === order.vehicleId),
      }));
      console.log("ENRICHED ORDERS:", enriched);
      setOrders(enriched);
    }
    loadOrders();
  }, [isAuthenticated]);

  console.log("STATE ORDERS:", orders);
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              My Account
            </p>
            <h1 className="mt-2 font-display text-3xl text-ivory">
              {user.name}
            </h1>
            <p className="font-body text-sm text-graphite">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>

        <h2 className="mb-6 font-display text-xl text-ivory">
          Reservation History
        </h2>

        {orders === null ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No reservations yet"
            description="Once you reserve a vehicle, it will show up here with its current status."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-hairline bg-surface/30 p-6 transition-colors duration-300 hover:border-gold/40"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Side */}
                  <div className="flex-1">
                    <p className="font-display text-2xl text-ivory">
                      {order.vehicle ? order.vehicle.name : "Vehicle"}
                    </p>

                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                      Reservation Request
                    </p>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
                          Submitted
                        </p>

                        <p className="mt-1 font-body text-sm text-ivory">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
                          Phone
                        </p>

                        <p className="mt-1 font-body text-sm text-ivory">
                          {order.contactPhone}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
                          Email
                        </p>

                        <p className="mt-1 font-body text-sm text-ivory break-all">
                          {order.contactEmail}
                        </p>
                      </div>

                      {order.notes && (
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
                            Notes
                          </p>

                          <p className="mt-1 font-body text-sm text-ivory">
                            {order.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side */}

                  <div className="min-w-[240px] border-t border-hairline pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                      Reservation Progress
                    </p>

                    <ReservationTimeline currentStatus={order.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
