import { getAllOrders } from "@/lib/actions/order.actions";
import JsonToExcel from "../components/JsonToExcel";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import OrderTable from "../components/OrderTable";

const Page = async () => {
  const paidOrders = await getAllOrders();

  const groupedOrders = paidOrders.reduce((acc: any, order: any) => {
    const key = order?.resourceTitle || "Unknown";

    if (!acc[key]) acc[key] = [];
    acc[key].push(order);

    return acc;
  }, {});

  return (
    <section className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HERO HEADER */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Orders
          </h1>
          <p className="text-white/60 max-w-xl">
            Track purchases, manage deliveries, and monitor performance.
          </p>

          {/* subtle divider */}
          <div className="h-px w-full bg-white/10 mt-6" />
        </div>

        {/* STATS GRID (Separated properly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedOrders).map(([resourceTitle, orders]) => (
            <Card
              key={resourceTitle}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-white/20"
            >
              {/* glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/10 to-transparent" />

              <div className="relative flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <Gift className="w-6 h-6 text-white/80" />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-white/50">{resourceTitle}</p>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-semibold">
                      {paidOrders.length}
                    </p>

                    <JsonToExcel
                      data={orders as any[]}
                      fileName={`${resourceTitle}.xlsx`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* TABLE SECTION */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <OrderTable orders={paidOrders} />
        </div>
      </div>
    </section>
  );
};

export default Page;
