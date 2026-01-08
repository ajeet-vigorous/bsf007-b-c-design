import { slotsArray } from "../../config/global"
// import CrashC from "../crashC/CrashC";

function Slots() {

    return (
        <div className="text-white bg-[var(--primary)] py-3 divide-x divide-white flex justify-between items-stretch xl:hidden text-center text-[12px] md:text-[16px] font-semibold uppercase h-10">
            {/* <CrashC /> */}
            {slotsArray?.map((element, index) => (
                <div key={index} className="w-full text-center px-[4px] flex justify-center items-center">
                    {element?.name}
                </div>
            ))}
        </div>
    )
}

export default Slots;