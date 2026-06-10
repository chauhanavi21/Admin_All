import { useMemo, useState } from 'react'
import { Package, Plus, Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/UiPrimitives'
import { mockProducts, type ProductSummary } from '../data/dashboardData'

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function StatusBadge({ status }: { status: ProductSummary['status'] }) {
  const map = {
    active: 'badge-green',
    draft: 'badge-yellow',
    archived: 'badge-gray',
  }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'low-stock'>('all')

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.app.toLowerCase().includes(search.toLowerCase())
      const matchFilter =
        filter === 'all' ||
        (filter === 'active' && p.status === 'active') ||
        (filter === 'draft' && p.status === 'draft') ||
        (filter === 'low-stock' && p.stock < 15)
      return matchSearch && matchFilter
    })
  }, [search, filter])

  const stats = {
    total: mockProducts.length + 35,
    active: mockProducts.filter((p) => p.status === 'active').length + 30,
    lowStock: mockProducts.filter((p) => p.stock < 15).length,
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Products & services"
        description="Catalog preview across all apps — backend sync coming later"
        action={
          <button type="button" className="btn btn-primary opacity-60" disabled title="Coming soon">
            <Plus className="h-4 w-4" />
            Add product
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total items', value: stats.total },
          { label: 'Active listings', value: stats.active },
          { label: 'Low stock alerts', value: stats.lowStock, warn: true },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-5 ${
              s.warn ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-white'
            }`}
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search products or apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'draft', 'low-stock'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No products found"
          description="Try a different search or filter."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr className="text-slate-500">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">App</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-50 transition hover:bg-indigo-50/20"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-400">Updated {product.updatedAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {product.app}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        product.stock < 15 ? 'font-semibold text-amber-600' : 'text-slate-600'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
