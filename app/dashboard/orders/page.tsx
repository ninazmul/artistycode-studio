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
              <h3 className="text-purple text-3xl font-bold text-center sm:text-left py-5 md:py-10">
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
                <Card className="flex items-center bg-black-200 border border-gray-300 shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-7xl w-1/5 text-center">
                    <Gift className="text-5xl text-orange-500" />
                  </div>
                  <div className="flex-1 ml-4 space-y-2">
                    <p className="text-lg font-semibold text-white flex items-center gap-2">
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

      <div className="wrapper my-8">
        <OrderTable orders={paidOrders} />
      </div>
    </>
  );
};

export default Page;
