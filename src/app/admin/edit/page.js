
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  LoaderCircle,
  ArrowLeft,
  Package,
} from "lucide-react";

export default function EditPerfumesPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  async function loadProducts() {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load perfumes.");
      }

      setProducts(data.products || []);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function saveProduct(e) {
    e.preventDefault();

    if (!selected) return;

    try {
      setSaving(true);
      setMessage("");

      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selected),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update perfume.");
      }

      setMessage("Perfume updated successfully.");
      setSelected(null);

      await loadProducts();
    } catch (error) {
      setMessage(error.message || "Failed to update perfume.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setMessage("");

      const res = await fetch(
        `/api/products?id=${encodeURIComponent(product._id)}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete perfume.");
      }

      setProducts((prev) =>
        prev.filter((item) => item._id !== product._id)
      );

      setMessage("Perfume deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Failed to delete perfume.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <main className="min-h-screen bg-[#0b0b0b] p-5 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/admin"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-amber-500/50 hover:text-amber-400"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mt-6">
            <p className="mb-2 text-xs tracking-[0.35em] text-amber-500">
              NOIR ADMIN
            </p>

            <h1 className="text-3xl font-semibold md:text-4xl">
              Edit Perfumes
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Manage, edit, and delete perfumes in your store.
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
          <Search size={19} className="shrink-0 text-gray-400" />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search perfumes by name..."
            className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-500"
          />

          <span className="whitespace-nowrap text-xs text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Feedback */}
        {message && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="shrink-0 text-gray-500 hover:text-white"
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Product List */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
            <LoaderCircle className="animate-spin" />
            Loading perfumes...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-10 text-center">
            <Package
              size={32}
              className="mx-auto mb-4 text-gray-600"
            />

            <p className="text-gray-300">No perfumes found.</p>

            <p className="mt-2 text-sm text-gray-500">
              Try another search term or add a new perfume.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col gap-4 border-b border-white/10 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-500">
                        NO IMAGE
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-medium">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      ${Number(product.price || 0).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Stock: {product.stock ?? 0}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected({
                        ...product,
                        price: product.price ?? 0,
                        stock: product.stock ?? 0,
                      });

                      setMessage("");
                    }}
                    className="flex items-center gap-2 rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400 transition hover:bg-amber-500/10"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === product._id}
                    onClick={() => deleteProduct(product)}
                    className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === product._id ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 min-w-10 rounded-lg border px-3 text-sm transition ${
                  currentPage === page
                    ? "border-amber-500 bg-amber-500 text-black"
                    : "border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-500">
            Showing {startIndex + 1}–
            {Math.min(
              startIndex + itemsPerPage,
              filteredProducts.length
            )}{" "}
            of {filteredProducts.length} perfumes
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveProduct}
            className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#151515] p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs tracking-widest text-amber-500">
                  NOIR ADMIN
                </p>

                <h2 className="text-xl font-semibold">
                  Edit Perfume
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-gray-300">
                Perfume Name
                <input
                  required
                  value={selected.name || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      name: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black p-3 text-white outline-none focus:border-amber-500"
                />
              </label>

              <label className="text-sm text-gray-300">
                Price (USD)
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={selected.price}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      price: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black p-3 text-white outline-none focus:border-amber-500"
                />
              </label>

              <label className="text-sm text-gray-300">
                Stock Quantity
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={selected.stock}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      stock: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black p-3 text-white outline-none focus:border-amber-500"
                />
              </label>

              <label className="text-sm text-gray-300">
                Category
                <input
                  value={selected.category || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      category: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black p-3 text-white outline-none focus:border-amber-500"
                />
              </label>

              <label className="text-sm text-gray-300 sm:col-span-2">
                Image URL
                <input
                  value={selected.image || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      image: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black p-3 text-white outline-none focus:border-amber-500"
                />
              </label>

              <label className="text-sm text-gray-300 sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  value={selected.description || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black p-3 text-white outline-none focus:border-amber-500"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
