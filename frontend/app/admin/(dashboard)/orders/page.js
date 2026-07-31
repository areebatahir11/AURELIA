"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/order.service";
import Loader from "@/components/ui/Loader";

const ORDER_STATUSES = ["Pending", "Confirmed", "In Process", "Completed", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  function loadOrders() {
    orderService.getAllAdmin().then(({ data }) => setOrders(data));
  }

  useEffect(loadOrders, []);

  async function handleStatusChange(orderId, status) {
    setError("");
    try {
      await orderService.updateStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not update this order's status.");
    }
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ivory">Orders</h1>

      {error && <p className="mb-4 font-body text-xs text-red-400">{error}</p>}

      {orders === null ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : orders.length === 0 ? (
        <p className="font-body text-sm text-graphite">No orders yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline text-left font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
              <th className="p-3">Contact</th>
              <th className="p-3">Vehicle ID</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-hairline">
                <td className="p-3">
                  <p className="font-body text-sm text-ivory">{order.contactName}</p>
                  <p className="font-mono text-xs text-graphite">{order.contactEmail}</p>
                </td>
                <td className="p-3 font-mono text-xs text-graphite">{order.vehicleId}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    className="border border-hairline bg-void px-3 py-1.5 font-mono text-xs uppercase text-ivory focus:border-gold focus:outline-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}