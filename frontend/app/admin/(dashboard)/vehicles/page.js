"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { vehicleService } from "@/services/vehicle.service";
import { brandService } from "@/services/brand.service";
import { VEHICLE_CATEGORIES } from "@/constants/brands";
import { formatCurrency } from "@/utils/formatters";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

const EMPTY_FORM = {
  slug: "",
  name: "",
  brandSlug: "",
  category: "coupe",
  price: "",
  year: "",
  mileage: "0",
  horsepower: "",
  topSpeed: "",
  zeroToSixty: "",
  transmission: "",
  drivetrain: "",
  exteriorColor: "",
  interiorColor: "",
  vin: "",
  description: "",
};

const NUMERIC_FIELDS = ["price", "year", "mileage", "horsepower", "topSpeed", "zeroToSixty"];

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState(null);
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadVehicles() {
    vehicleService.getAll().then(({ data }) => setVehicles(data));
  }

  useEffect(() => {
    loadVehicles();
    brandService.getAll().then(({ data }) => setBrands(data));
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const selectedBrand = brands.find((brand) => brand.slug === form.brandSlug);
    if (!selectedBrand) {
      setError("Choose a brand.");
      setIsSubmitting(false);
      return;
    }

    const payload = { ...form, brand: selectedBrand.name, images: [], featured: false, tags: [], status: "available" };
    NUMERIC_FIELDS.forEach((field) => {
      payload[field] = Number(payload[field]);
    });

    try {
      await vehicleService.create(payload);
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadVehicles();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(vehicleId) {
    if (!confirm("Delete this vehicle listing?")) return;
    await vehicleService.remove(vehicleId);
    loadVehicles();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ivory">Vehicles</h1>
        <Button variant="outline" size="sm" onClick={() => setShowForm((prev) => !prev)}>
          <Plus size={14} /> {showForm ? "Cancel" : "Add Vehicle"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-10 grid grid-cols-1 gap-4 border border-hairline p-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">Brand</label>
            <select
              required
              value={form.brandSlug}
              onChange={(event) => setForm({ ...form, brandSlug: event.target.value })}
              className="w-full border border-hairline bg-void px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="w-full border border-hairline bg-void px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            >
              {VEHICLE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {[
            { key: "slug", label: "Slug (e.g. mclaren-720s)" },
            { key: "name", label: "Model Name" },
            { key: "price", label: "Price (USD)", type: "number" },
            { key: "year", label: "Year", type: "number" },
            { key: "mileage", label: "Mileage", type: "number" },
            { key: "horsepower", label: "Horsepower", type: "number" },
            { key: "topSpeed", label: "Top Speed (mph)", type: "number" },
            { key: "zeroToSixty", label: "0–60 mph (sec)", type: "number", step: "0.1" },
            { key: "transmission", label: "Transmission" },
            { key: "drivetrain", label: "Drivetrain" },
            { key: "exteriorColor", label: "Exterior Color" },
            { key: "interiorColor", label: "Interior Color" },
            { key: "vin", label: "VIN" },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                step={field.step}
                required
                value={form[field.key]}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                className="w-full border border-hairline bg-transparent px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          ))}

          <div className="md:col-span-3">
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">Description</label>
            <textarea
              rows={2}
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full border border-hairline bg-transparent px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          {error && <p className="md:col-span-3 font-body text-xs text-red-400">{error}</p>}

          <div className="md:col-span-3">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Vehicle"}
            </Button>
          </div>
        </form>
      )}

      {vehicles === null ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline text-left font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
              <th className="p-3">Model</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-hairline">
                <td className="p-3 font-body text-sm text-ivory">{vehicle.name}</td>
                <td className="p-3 font-mono text-xs text-graphite">{vehicle.brand}</td>
                <td className="p-3 font-mono text-sm text-gold">{formatCurrency(vehicle.price)}</td>
                <td className="p-3 font-mono text-xs uppercase text-graphite">{vehicle.status}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    aria-label={`Delete ${vehicle.name}`}
                    className="text-graphite transition-colors hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}