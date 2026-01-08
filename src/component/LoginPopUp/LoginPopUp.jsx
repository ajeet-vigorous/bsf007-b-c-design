import { IoCloseSharp } from "react-icons/io5";
import settings from "../../domainConfig";

export default function LoginPopUp({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
      <div className="w-[90%] md:w-[400px] bg-white rounded-lg shadow-lg mt-10 p-6 relative transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          <IoCloseSharp />
        </button>
        <div className="text-xl font-semibold flex justify-center text-gray-800 mb-4">
          <img
            className=" w-[100px]"
            src={settings.logo}
            alt="logo"
          />
        </div>
        <div className="text-[14px] font-semibold text-center">
          Please login before placing a bet
        </div>
        <div className="flex justify-center">
          <button className="rounded-[4px] text-[13px] uppercase border border-gray-300 px-10 py-2 my-3">
            Sign Up
          </button>
        </div>

        <div className="text-[13px] text-center">OR</div>

        <div className="flex justify-center">
          <button onClick={()=> window.location.href = "/login"} className="rounded-[4px] text-[13px] uppercase bg-[--primary] text-[--secondary] px-10 py-2 my-3">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
