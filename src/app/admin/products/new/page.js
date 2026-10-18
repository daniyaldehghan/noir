"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, PackagePlus, CheckCircle2 } from "lucide-react";

const initialForm = {
  name: "",
  slug: "",
  category: "Niche",
  description: "",
  price: "",
  stock: "10",
  image: "",
  tag: "",
  volume: "100 ml",
  fragranceFamily: "",
  topNotes: "",
  heartNotes: "",
  baseNotes: "",
  longevity: "",
  sillage: "",
  season: [],
  gender: "Unisex",
};

export default function NewProductPage() {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "name" && !previous.slug
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError(false);
    setCreatedProduct(null);

    try {
      let imageUrl = "";

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "آپلود عکس ناموفق بود.");
        }

        imageUrl = uploadResult.url;
      } else {
        throw new Error("لطفاً عکس محصول را انتخاب کن.");
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          ...form,
          image: imageUrl,
          images: [imageUrl],
          price: Number(form.price),
          stock: Number(form.stock),
          currency: "USD",
          scentNotes: {
            top: form.topNotes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            heart: form.heartNotes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            base: form.baseNotes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create product.");
      }

      setMessage("Fragrance created successfully.");
      setCreatedProduct(data.product);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      setError(true);
      setMessage(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full border border-white/10 bg-[#171717] px-4 py-3.5 text-sm text-[#f0ebe2] outline-none transition placeholder:text-white/25 focus:border-[#c5a46d]";

  return (
    <main className="min-h-screen bg-[#101010] px-5 py-12 text-[#f0ebe2] md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-3 text-[10px] tracking-[0.18em] text-white/50 transition hover:text-[#c5a46d]"
        >
          <ArrowLeft size={15} />
          BACK TO STORE
        </Link>

        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="mb-4 text-[10px] tracking-[0.3em] text-[#c5a46d]">
            NOIR / INVENTORY
          </p>
          <h1 className="noir-serif text-4xl sm:text-6xl">
            Add a fragrance<span className="text-[#c5a46d]">.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
            Add a fragrance to your collection. Product details will be saved to
            your database and displayed in the store.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className={`mb-7 flex items-start gap-3 border p-4 text-sm ${
              error
                ? "border-red-500/30 bg-red-500/5 text-red-300"
                : "border-[#c5a46d]/30 bg-[#c5a46d]/5 text-[#c5a46d]"
            }`}
          >
            {error ? null : <CheckCircle2 size={18} />}
            <div>
              <p>{message}</p>
              {createdProduct?.slug && (
                <Link
                  href={`/product/${createdProduct.slug}`}
                  className="mt-2 inline-block underline underline-offset-4"
                >
                  View product
                </Link>
              )}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-8">
            <section className="border border-white/10 p-5 sm:p-8">
              <h2 className="noir-serif text-2xl">Product details</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="text-xs text-white/65">
                  Fragrance name *
                  <input
                    required
                    maxLength={120}
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="e.g. Oud Imperial"
                    className={inputClass}
                  />
                </label>

                <label className="text-xs text-white/65">
                  Slug *
                  <input
                    required
                    name="slug"
                    value={form.slug}
                    onChange={updateField}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    title="Use lowercase English letters, numbers and hyphens."
                    placeholder="oud-imperial"
                    className={inputClass}
                  />
                </label>

                <label className="text-xs text-white/65">
                  Category *
                  <select
                    required
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="Niche">Niche</option>
                    <option value="Woody">Woody</option>
                    <option value="Floral">Floral</option>
                    <option value="Oriental">Oriental</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </label>

                <label className="text-xs text-white/65">
                  Tag
                  <input
                    name="tag"
                    value={form.tag}
                    onChange={updateField}
                    placeholder="NEW ARRIVAL"
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="mt-5 block text-xs text-white/65">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  maxLength={5000}
                  rows={5}
                  placeholder="Describe the fragrance, its notes and character..."
                  className={`${inputClass} resize-y`}
                />
              </label>
            </section>

            <section className="border border-white/10 p-5 sm:p-8">
              <h2 className="noir-serif text-2xl">Fragrance specifications</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ["volume", "Volume", "100 ml"],
                  ["fragranceFamily", "Fragrance family", "Woody, Floral..."],
                  ["topNotes", "Top notes", "Bergamot, Lemon"],
                  ["heartNotes", "Heart notes", "Rose, Jasmine"],
                  ["baseNotes", "Base notes", "Amber, Musk"],
                  ["longevity", "Longevity", "8–10 hours"],
                  ["sillage", "Sillage", "Moderate, Strong"],
                ].map(([name, label, placeholder]) => (
                  <label key={name} className="text-xs text-white/65">
                    {label}
                    <input
                      name={name}
                      value={form[name]}
                      onChange={updateField}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </label>
                ))}

                <label className="text-xs text-white/65">
                  Gender
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </label>
              </div>

              <div className="mt-6">
                <p className="text-xs text-white/65">Suitable seasons</p>
                <div className="mt-3 flex flex-wrap gap-4">
                  {["Spring", "Summer", "Autumn", "Winter"].map((season) => (
                    <label
                      key={season}
                      className="flex items-center gap-2 text-xs text-white/65"
                    >
                      <input
                        type="checkbox"
                        checked={form.season.includes(season)}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            season: event.target.checked
                              ? [...previous.season, season]
                              : previous.season.filter(
                                  (item) => item !== season
                                ),
                          }))
                        }
                        className="accent-[#c5a46d]"
                      />
                      {season}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="border border-white/10 p-5 sm:p-8">
              <h2 className="noir-serif text-2xl">Pricing & inventory</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="text-xs text-white/65">
                  Price (USD) *
                  <input
                    required
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={updateField}
                    min="0"
                    step="0.01"
                    placeholder="120.00"
                    className={inputClass}
                  />
                </label>

                <label className="text-xs text-white/65">
                  Stock quantity *
                  <input
                    required
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={updateField}
                    min="0"
                    step="1"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="border border-white/10 p-5">
              <h2 className="noir-serif text-2xl">Product image</h2>

              <div className="mt-5 flex aspect-[4/5] items-center justify-center overflow-hidden border border-dashed border-white/15 bg-[#171717]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    <ImagePlus size={30} strokeWidth={1} />
                    <span className="text-[10px] tracking-[0.15em]">
                      IMAGE PREVIEW
                    </span>
                  </div>
                )}
              </div>

              <label className="mt-5 block text-xs text-white/65">
                Choose image *
                <input
                  required
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={`${inputClass} file:mr-3 file:border-0 file:bg-[#c5a46d] file:px-3 file:py-2 file:text-xs file:text-[#101010]`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    if (
                      !["image/jpeg", "image/png", "image/webp"].includes(
                        file.type
                      )
                    ) {
                      setMessage("فرمت عکس باید JPG، PNG یا WEBP باشد.");
                      setError(true);
                      event.target.value = "";
                      return;
                    }

                    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
                      setMessage(
                        "حجم عکس باید بیشتر از صفر و حداکثر ۵ مگابایت باشد."
                      );
                      setError(true);
                      event.target.value = "";
                      return;
                    }

                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                    setMessage("");
                    setError(false);
                  }}
                />
              </label>

              <p className="mt-3 text-[11px] leading-5 text-white/35">
                JPG, PNG or WEBP · Maximum 5 MB
              </p>
            </section>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-3 bg-[#c5a46d] px-5 py-4 text-[10px] font-medium tracking-[0.18em] text-[#101010] transition hover:bg-[#e0c79b] disabled:cursor-wait disabled:opacity-50"
            >
              <PackagePlus size={17} />
              {saving ? "SAVING PRODUCT..." : "CREATE PRODUCT"}
            </button>

            <p className="text-[11px] leading-5 text-white/35">
              Required fields are marked with *. The product is saved as active
              and can appear in the storefront immediately.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
