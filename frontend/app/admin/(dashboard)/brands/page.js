"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { brandService } from "@/services/brand.service";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

const EMPTY_FORM = { slug: "", name: "", country: "", founded: "", logo: "", description: "" };

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadBrands() {
    brandService.getAll().then(({ data }) => setBrands(data));
  }

  useEffect(loadBrands, []);

  async function handleAdd(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await brandService.create({ ...form, founded: Number(form.founded) });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadBrands();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create brand.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(brandId) {
    if (!confirm("Delete this brand? This does not delete its vehicles.")) return;
    await brandService.remove(brandId);
    loadBrands();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ivory">Brands</h1>
        <Button variant="outline" size="sm" onClick={() => setShowForm((prev) => !prev)}>
          <Plus size={14} /> {showForm ? "Cancel" : "Add Brand"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-10 grid grid-cols-1 gap-4 border border-hairline p-6 md:grid-cols-2">
          {[
            { key: "slug", label: "Slug (e.g. mclaren)" },
            { key: "name", label: "Name" },
            { key: "country", label: "Country" },
            { key: "founded", label: "Founded (year)", type: "number" },
            { key: "logo", label: "Logo path (optional)" },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                required={field.key !== "logo"}
                value={form[field.key]}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                className="w-full border border-hairline bg-transparent px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full border border-hairline bg-transparent px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          {error && <p className="md:col-span-2 font-body text-xs text-red-400">{error}</p>}

          <div className="md:col-span-2">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Brand"}
            </Button>
          </div>
        </form>
      )}

      {brands === null ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline text-left font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Country</th>
              <th className="p-3">Founded</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b border-hairline">
                <td className="p-3 font-body text-sm text-ivory">{brand.name}</td>
                <td className="p-3 font-mono text-xs text-graphite">{brand.slug}</td>
                <td className="p-3 font-body text-sm text-ivory">{brand.country}</td>
                <td className="p-3 font-mono text-xs text-graphite">{brand.founded}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(brand.id)}
                    aria-label={`Delete ${brand.name}`}
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