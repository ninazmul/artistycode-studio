import { getAllOrders } from "@/lib/actions/order.actions";
import JsonToExcel from "../components/JsonToExcel";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import OrderTable from "../components/OrderTable";

const Page = async () => {
  const paidOrders = await getAllOrders();

  const groupedOrders = paidOrders.reduce((acc: any, order: any) => {
    const resourceTitle = order?.resourceTitle;
    if (!acc[resourceTitle]) {
      acc[resourceTitle] = [];
    }
    acc[resourceTitle].push(order);
    return acc;
  }, {});

  return (
    <>
      <section className="py-5">
        <div className="wrapper ">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-3xl font-bold text-center sm:text-left py-5 md:py-10">
                Total Paid Orders{" "}
              </h3>
              <p className="text-3xl font-bold text-primary-900">
                {paidOrders.length}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedOrders).map(([resourceTitle, orders]) => (
              <div key={resourceTitle}>
                <Card className="flex items-center p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl hover:scale-[1.03] transition-all duration-300">
                  <div className="text-7xl w-1/5 text-center">
                    <Gift className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white" />
                  </div>
                  <div className="flex-1 ml-4 space-y-2">
                    <p className="text-sm text-white/60 flex items-center gap-2">
                      {resourceTitle}
                      <JsonToExcel
                        data={orders as any[]}
                        fileName={`${resourceTitle}.xlsx`}
                      />
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <OrderTable orders={paidOrders} />
      </div>
    </>
  );
};

export default Page;
