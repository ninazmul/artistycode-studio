import { useState } from "react";
import { Banknote, CreditCard, Wallet, Building2 } from "lucide-react";

const paymentMethods = [
  {
    name: "bKash",
    icon: <Wallet className="w-5 h-5 mr-2 text-pink-500" />,
    details: "bKash Number: +8801580845746\nType: Personal",
    color: "bg-pink-500/10 border-pink-500",
  },
  {
    name: "Payoneer",
    icon: <CreditCard className="w-5 h-5 mr-2 text-orange-400" />,
    details: "Payoneer Email: nazmulsaw@gmail.com",
    color: "bg-orange-400/10 border-orange-400",
  },
  {
    name: "Bank",
    icon: <Building2 className="w-5 h-5 mr-2 text-green-500" />,
    details:
      "Bank Name: Islami Bank Bangladesh PLC (IBBPLC)\nA/C: 2050 462 02 002836 00\nBranch: Kaliakair, Gazipur\nSwift code: IBBLBDDH158\nRouting number: 125330792",
    color: "bg-green-500/10 border-green-500",
  },
];

const PaymentOptions = () => {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  const toggleMethod = (name: string) => {
    setActiveMethod((prev) => (prev === name ? null : name));
  };

  return (
    <div className="mt-4 space-y-3">
      {paymentMethods.map((method) => (
        <div
          key={method.name}
          className={`rounded-xl border p-4 transition-all duration-300 ${method.color}`}
        >
          <button
            onClick={() => toggleMethod(method.name)}
            className="flex items-center w-full text-left text-base font-semibold text-white hover:opacity-80"
          >
            {method.icon}
            {method.name}
          </button>

          {activeMethod === method.name && (
            <pre className="text-sm text-white font-medium mt-3 whitespace-pre-wrap">
              {method.details}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentOptions;
