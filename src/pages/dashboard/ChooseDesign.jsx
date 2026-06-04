import { message } from "antd";
import { useEffect, useState } from "react";

export default function ChooseDesign() {
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem("designData"))?.designType || "",
  );

  const onClose = () => {
    localStorage.setItem("dashboardModalOpen", false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const handleSelect = (type) => {
    let designType = {};

    if (type === "backLay") {
      designType = {
        back: "back",
        lay: "lay",
      };
    } else if (type === "lagaiKhai") {
      designType = {
        back: "lagai",
        lay: "khai",
      };
    }
    localStorage.setItem("designData", JSON.stringify({ designType }));
    setSelected(type);
    message.success(`Design ${type} selected successfully!`, 2);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md uppercase bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Choose Design Type
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select the design format you want to play
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSelect("backLay")}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left group
            ${
              selected === "backLay"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between uppercase">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Back Lay
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Standard back & lay design
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  selected === "backLay"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          </button>

          <button
            onClick={() => handleSelect("lagaiKhai")}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left group
            ${
              selected === "lagaiKhai"
                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between uppercase">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Lagai Khai
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Alternative lagai & khai design
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  selected === "lagaiKhai"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
