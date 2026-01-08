
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { userUpdate } from "../../redux/reducers/user_reducer";
import { domainName } from "../../config/Auth";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { IoChevronDown } from "react-icons/io5";
import MobileFooter from "../../component/mobileFooter/MobileFooter";

export const betChipsData = {
  1000: 1000,
  2000: 2000,
  5000: 5000,
  10000: 10000,
  20000: 20000,
  50000: 50000,
  100000: 100000,
  250000: 250000,
};

const EditStack = ({ closeModal }) => {
  const [keyValues1, setKeyValues1] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate(); const [isOpen, setIsOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("Local - (GMT +5:30)");

  const timezones = [
    "Local - (GMT +5:30)",
    "IST (GMT +05.30)",
    "GST (GMT +04.00)",
    "UTC - (GMT +00.00)",
  ];

  const handleSelect = (zone) => {
    setSelectedZone(zone);
    setIsOpen(false);
  };

  useEffect(() => {
    const betChipsDataItems = JSON.parse(
      localStorage.getItem("clientbetChipsData")
    );
    let betChips = {};
    if (betChipsDataItems != null) {
      betChips = betChipsDataItems;
    } else {
      betChips = betChipsData;
    }

    const updatedKeyValues = Object.entries(betChips).map(([key, value]) => ({
      key,
      value: parseInt(value),
      isEnabled: true,
    }));
    setKeyValues1(updatedKeyValues);
  }, []);

  const handleInputChange = (index, key, value) => {
    const updatedKeyValues = [...keyValues1];
    if (key !== undefined) {
      updatedKeyValues[index].key = key;
    }
    if (value !== undefined) {
      updatedKeyValues[index].value = Number(value);
    }
    setKeyValues1(updatedKeyValues);
  };

  const handleToggleEnable = (index) => {
    const updatedKeyValues = [...keyValues1];
    updatedKeyValues[index].isEnabled = !updatedKeyValues[index].isEnabled;
  };

  const handleAddRow = () => {
  setKeyValues1(updatedKeyValues);
    const updatedKeyValues = [
      ...keyValues1,
      { key: "", value: '', isEnabled: true },
    ];
    setKeyValues1(updatedKeyValues);
  };

  const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

  const submitValue = () => {
    const newBetChipsObject = {};
    keyValues1.forEach((item) => {
      if (item.isEnabled && item.key !== "") {
        newBetChipsObject[item.key] = item.value;
      }
    });

    const Id = user?.data?.userId;
    const dataValue = {
      userId: Id,
      betChipsData: newBetChipsObject,
    };

    dispatch(userUpdate(dataValue)).then((res) => {
      if (res?.payload?.error === false) {
        message.success(res?.payload?.message);
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      }
    });

    localStorage.setItem(
      "clientbetChipsData",
      JSON.stringify(newBetChipsObject)
    );
    closeModal();
  };

  return (

      <div className="w-full relative">
            <div className="text-[15px] gap-3 rounded-t-[5px] text-black bg-[--secondary] px-5 h-[31px] flex items-center font-semibold">
              <img className='!w-[15px] !h-[15px]' src="/images/zetto/homeblack.png" alt="" srcset="" />
              <img className='!w-[13px] !h-[13px] rotate-90 ' src="/images/zetto/arrowblack.png" alt="" srcset="" />
              Settings</div>
        <div className="">
          <div className="my-5">
            <div className="text-center text-[22px] font-semibold mb-2">Security</div>
            <div className="flex mx-auto text-[16px] rounded-md justify-between w-[280px] border h-[42px] border-black"><Link to='/mfa' className='w-full flex px-3 justify-between items-center'>Two Factor Authentication <img className='!w-[25px] !h-[25px]' src="/images/zetto/2factor.png" alt="" srcset="" /></Link></div>
          </div>
          {/* Add Row Button */}
          {/* <div className="flex justify-end px-4 pt-4">
            <button
              onClick={handleAddRow}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded"
            >
              + Add Row
            </button>
          </div> */}
          <div className="text-[22px] text-black font-semibold text-center pt-2 pb-5">Edit your own stake</div>
          {/* Table Form */}
          <form autoComplete="off" className="md:w-[500px] gap-2 m-auto">
            <table className="min-w-full text-sm text-left border border-gray-300">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-1 py-2 border">Price Label</th>
                  <th className="px-1 py-2 border">Price Value</th>
                  {/* <th className="px-1 py-2 border">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {keyValues1.map((item, index) => (
                  <tr key={index} className={item.isEnabled ? "" : "bg-gray-700 opacity-60"}>
                    <td className="px-1 py-2 border">
                      <input
                        type="text"
                        value={item.key}
                        disabled={!item.isEnabled}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value, undefined)
                        }
                        className="w-full p-1 border bg-transparent px-3 border-black text-sm h-[45px] rounded-[5px]"
                      />
                    </td>
                    <td className="px-1 py-2 border">
                      <input
                        type="number"
                        value={item.value}
                        disabled={!item.isEnabled}
                        onChange={(e) =>
                          handleInputChange(index, undefined, e.target.value)
                        }
                        className="w-full p-1 border bg-transparent px-3 border-black text-sm h-[45px] rounded-[5px]"
                      />
                    </td>
                    {/* <td className="px-1 py-2 border text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleEnable(index)}
                        className={`text-xs px-3 py-1 rounded font-semibold text-white ${
                          item.isEnabled
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {item.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </form>

          {/* Submit Button */}
          <div className="py-2 flex items-center md:w-[300px] m-auto justify-end gap-2">
            <span
              onClick={submitValue}
              className="text-xs font-bold py-2 h-[40px] uppercase flex justify-center items-center px-4 w-full rounded-sm text-center focus:outline-none hover:opacity-100 transition-opacity bg-[--primary] text-[--secondary] cursor-pointer"
            >
              Submit
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center my-4">
            <div className="rounded-sm md:w-[180px] m-auto">
              <h2 className="text-center text-[22px] font-semibold text-[#062245] mb-3">
                Select Timezone
              </h2>

              <div className="relative my-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between w-full border border-black rounded-md px-3 py-2 text-gray-800 font-medium shadow-sm hover:border-gray-400 focus:outline-none"
                >
                  <span className="truncate text-sm">{selectedZone.split(" ")[0]}</span>
                  <IoChevronDown
                    className={`text-gray-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {timezones.map((zone, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(zone)}
                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                          selectedZone === zone
                            ? "bg-[--primary] text-[--secondary] font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {zone}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <MobileFooter/>
      </div>
    
  );
};

export default EditStack;
