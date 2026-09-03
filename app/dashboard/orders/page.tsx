import { getAllOrders } from "@/lib/actions/order.actions";
import JsonToExcel from "../components/JsonToExcel";
import { Gift, PackageCheck, PackageMinus } from "lucide-react";
import OrderTable from "../components/OrderTable";

const Page = async () => {
  const orders = await getAllOrders();

  // O(N) single-pass aggregation using Map — no nested array.find()
  const groupMap = new Map<string, { count: number; data: any[] }>();
  for (const order of orders) {
    const key = order?.resourceTitle || "Unknown";
    if (!groupMap.has(key)) groupMap.set(key, { count: 0, data: [] });
    const entry = groupMap.get(key)!;
    entry.count++;
    entry.data.push(order);
  }

  const delivered = orders.filter((o: any) => o.delivered).length;
  const pending = orders.length - delivered;

  return (
    <section className="min-h-screen bg-[#080808] text-white px-5 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-1">Revenue</p>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-sm text-white/40 mt-1">Track purchases, manage deliveries, and monitor performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/15 text-[11px] font-medium text-emerald-400">
              <PackageCheck className="w-3.5 h-3.5" />
              {delivered} Delivered
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/15 text-[11px] font-medium text-amber-400">
              <PackageMinus className="w-3.5 h-3.5" />
              {pending} Pending
            </div>
          </div>
        </div>

        {/* Product Stats Cards */}
        {groupMap.size > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(groupMap.entries()).map(([resourceTitle, { count, data }]) => (
              <div
                key={resourceTitle}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d] hover:bg-[#111] hover:border-white/10 transition-all duration-300 p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4 text-white/50" />
                  </div>
                  <p className="text-sm text-white/60 line-clamp-1 font-medium">{resourceTitle}</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold tabular-nums">{count}</p>
                    <p className="text-xs text-white/30 mt-0.5">total orders</p>
                  </div>
                  <JsonToExcel data={data} fileName={`${resourceTitle}.xlsx`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">
            All Orders ({orders.length})
          </p>
          <OrderTable orders={orders} />
        </div>
      </div>
    </section>
  );
};

export default Page;
