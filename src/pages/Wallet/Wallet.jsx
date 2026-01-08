import React, { useEffect, useState } from "react";
import { apiCall } from "../../config/HTTP";
import { Link } from "react-router-dom";
import { message } from "antd";
import UsdtWallet from "./UsdtWallet";
import EUpiWallet from "./EUpiWallet";


const Wallet = () => {
  const [activeTab, setActiveTab] = useState("Add Account");
  const [eWalletTab, setEWalletTab] = useState("Easypaisa"); // New state for e-wallet tabs
  const [accountDetails, setAccountDetails] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    bankName: "",
    branchName: "",
  });
  const [eWalletData, setEWalletData] = useState({
    name: "",
    mobileNumber: "",
    easypaisaUpiId: "", // Separate UPI ID for Easypaisa
    jazzcashUpiId: "",  // Separate UPI ID for JazzCash
  });
  const [bankAmount, setBankAmount] = useState("");
  const [eWalletAmount, setEWalletAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [eWalletErrors, setEWalletErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAmount, setActiveAmount] = useState(null);

  useEffect(() => {
    getBankDetails();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEWalletTabChange = (tab) => {
    setEWalletTab(tab);
  };

  const getBankDetails = async () => {
    try {
      const res = await apiCall("POST", "website/getAccountDetailsOfClient");
      setAccountDetails(res.data);
    } catch (error) {
    //   toast.error("Failed to fetch account details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleEWalletInputChange = (e) => {
    const { name, value } = e.target;
    setEWalletData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setEWalletErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.accountNumber)
      errors.accountNumber = "Account Number is required";
    if (!formData.ifscCode) errors.ifscCode = "IFSC Code is required";
    if (!formData.accountHolder)
      errors.accountHolder = "Account Holder Name is required";
    if (!formData.bankName) errors.bankName = "Bank Name is required";
    // if (!formData.branchName) errors.branchName = "Branch Name is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEWalletForm = () => {
    const errors = {};
    if (!eWalletData.name) errors.name = "Name is required";

    // Validate UPI ID based on selected e-wallet tab
    if (eWalletTab === "Easypaisa" && !eWalletData.easypaisaUpiId) {
      errors.upiId = "Easypaisa UPI ID is required";
    } else if (eWalletTab === "JazzCash" && !eWalletData.jazzcashUpiId) {
      errors.upiId = "JazzCash UPI ID is required";
    }

    if (!eWalletAmount) errors.amount = "Amount is required";
  if (!eWalletAmount || eWalletAmount < 300 || eWalletAmount > 500000) {

    errors.amount = 'Amount must be between ₨300 and ₨500000.';
}

    setEWalletErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBankTransfer = () => {
    const errors = {};
    if (!bankAmount) errors.amount = "Amount is required";
    if (!bankAmount || bankAmount < 300 || bankAmount > 500000) {

    errors.amount = 'Amount must be between ₨300 and ₨5,00,000.';
}
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await apiCall(
        "POST",
        "website/saveAccountDetails",
        formData
      );
      message.success("Account details added successfully!");
      setFormData({
        accountNumber: "",
        ifscCode: "",
        accountHolder: "",
        bankName: "",
        branchName: "",
      });
      getBankDetails();
    } catch (error) {
      message.error("Failed to add account details. Please try again.");
    }
  };

  const handleEWalletSubmit = async (e) => {

    e.preventDefault();
    if (!validateEWalletForm()) return;

    try {
      setIsSubmitting(true);

      // Prepare data based on selected e-wallet tab
      const submitData = {
        amount: eWalletAmount,
        wallet: {
          name: eWalletData.name,
          walletType: eWalletTab,
          upiId: eWalletTab === "Easypaisa"
            ? eWalletData.easypaisaUpiId
            : eWalletData.jazzcashUpiId
        }

      };

      const response = await apiCall(
        "POST",
        "website/withdrawReq",
        submitData
      );

      if (response?.error === false) {
        message.success(`${eWalletTab} transfer request submitted successfully!`);
        setEWalletData({
          ...eWalletData,
          name: "",
          mobileNumber: "",
          easypaisaUpiId: "",
          jazzcashUpiId: ""
        });
        setEWalletAmount("");
      } else {
        message.error(response?.message || `Failed to submit ${eWalletTab} transfer`);
      }
    } catch (error) {
      message.error(error?.data?.message || `Failed to submit ${eWalletTab} transfer. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankTransferSubmit = async (e) => {
    e.preventDefault();
    if (!validateBankTransfer()) return;

    try {
      setIsSubmitting(true);
      const submitData = {
        amount: bankAmount,
      };

      const response = await apiCall(
        "POST",
        "website/withdrawReq",
        submitData
      );

      if (response?.error === false) {
        message.success("Bank transfer request submitted successfully!");
        setBankAmount("");
      } else {
        message.error(response?.message || "Failed to submit bank transfer");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to submit bank transfer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAmountSelect = (selectedAmount, isEWallet = false) => {
    if (isEWallet) {
      setEWalletAmount(selectedAmount.toString());
      setEWalletErrors((prev) => ({ ...prev, amount: "" }));
    } else {
      setBankAmount(selectedAmount.toString());
      setActiveAmount(Number(selectedAmount));

      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleAmountChange = (e, isEWallet = false) => {
    const value = e.target.value;
    if (isEWallet) {
      setEWalletAmount(value);
      setEWalletErrors((prev) => ({ ...prev, amount: "" }));
    } else {
      setBankAmount(value);
      setErrors((prev) => ({ ...prev, amount: "" }));
    setActiveAmount(null);
    }
  };

  
  const handleReset = () => {
    setBankAmount("");
    setActiveAmount(null);
    setErrors({});
  };


  return (
    <div className="bg-white text-black p-2  md:max-w-5xl w-full mx-auto mb-28">
      <div className="flex text-xs font-semibold justify-center mb-4">
        <div className="bg-white rounded-lg mt-1 flex overflow-x-auto">
          <button
            onClick={() => handleTabChange("Add Account")}
            className={`px-4 sm:px-8 py-3 rounded-l-md ${activeTab === "Add Account"
              ? "bg-[--primary] rounded-lg text-white"
              : "text-black"
              }`}
          >
            Account
          </button>
          
          {/* <button
            onClick={() => handleTabChange("E-Wallet Transfer")}
            className={`px-4 sm:px-8 py-3 rounded-r-md ${activeTab === "E-Wallet Transfer"
              ? "bg-[--primary] rounded-lg text-white"
              : "text-black"
              }`}
          >
            USDT
          </button> */}


          <button
            onClick={() => handleTabChange("EUpi")}
            className={`px-4 sm:px-8 py-3 rounded-r-md ${activeTab === "EUpi"
              ? "bg-[--primary] rounded-lg text-white"
              : "text-black"
              }`}
          >
            UPI
          </button>
        </div>
      </div>

      {/* {activeTab === "Existing Account" && (
        <>
          <div className="py-2 px-2 overflow-y-auto max-w-6xl mx-auto md:block hidden">
            {accountDetails ? (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-secondary dark:text-gray-400">
                  <tr className="bg-[#1E1E1E]">
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Account Number
                    </th>
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Account Holder
                    </th>
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Bank Name
                    </th>
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Branch Name
                    </th>
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      IFSC Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b py-2 dark:bg-gray-800 dark:border-gray-700 text-start text-lg font-bold">
                    <td className="px-6">{accountDetails?.accountNumber || '-'}</td>
                    <td className="px-6">{accountDetails?.accountHolder || '-'}</td>
                    <td className="px-6">{accountDetails?.bankName || '-'}</td>
                    <td className="px-6">{accountDetails?.branchName || '-'}</td>
                    <td className="px-6">{accountDetails?.ifscCode || '-'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">No bank account details found</div>
            )}
          </div>

          {accountDetails && (
            <div className="md:hidden block text-gray-500 uppercase bg-gray-50 dark:bg-secondary dark:text-gray-400 py-2">
              <div className="flex items-center px-2 bg-white border-b py-2 dark:bg-gray-800 dark:border-gray-700 text-center text-sm font-bold">
                <span className="flex-1 text-start">Account Number</span>
                <span className="flex-1 text-left pl-4">
                  {accountDetails?.accountNumber || '-'}
                </span>
              </div>

              <div className="flex items-center px-2 bg-white border-b py-2 dark:bg-gray-800 dark:border-gray-700 text-center text-sm font-bold">
                <span className="flex-1 text-start">IFSC Code</span>
                <span className="flex-1 text-left pl-4">
                  {accountDetails?.ifscCode || '-'}
                </span>
              </div>

              <div className="flex items-center px-2 bg-white border-b py-2 dark:bg-gray-800 dark:border-gray-700 text-center text-sm font-bold">
                <span className="flex-1 text-start">Account Holder</span>
                <span className="flex-1 text-left pl-4">
                  {accountDetails?.accountHolder || '-'}
                </span>
              </div>

              <div className="flex items-center px-2 bg-white border-b py-2 dark:bg-gray-800 dark:border-gray-700 text-center text-sm font-bold">
                <span className="flex-1 text-start">Bank Name</span>
                <span className="flex-1 text-left pl-4">
                  {accountDetails?.bankName || '-'}
                </span>
              </div>

              <div className="flex items-center px-2 bg-white py-1 dark:bg-gray-800 dark:border-gray-700 text-center text-sm font-bold">
                <span className="flex-1 text-start">Branch Name</span>
                <span className="flex-1 text-left pl-4">
                  {accountDetails?.branchName || '-'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleBankTransferSubmit} className="p-4 rounded-lg max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-4 max-w-6xl uppercase mt-4 mx-auto">
              <div>
                <label className="block text-sm mb-1">A/C No.</label>
                <input
                  type="text"
                  className="w-full p-2 bg-secondary rounded-md text-white"
                  placeholder="Account Number"
                  value={accountDetails?.accountNumber || ''}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm mb-1">A/C Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-secondary uppercase rounded-md text-white"
                  placeholder="Account Name"
                  value={accountDetails?.accountHolder || ''}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Amount *</label>
                <input
                  type="number"
                  className={`w-full p-2 bg-secondary rounded-md text-white ${errors.amount ? "border-red-500" : ""
                    }`}
                  placeholder="Amount"
                  value={bankAmount}
                  onChange={(e) => handleAmountChange(e, false)}
                />
                {errors.amount && (
                  <span className="text-red-500 text-xs">{errors.amount}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1 mt-10">
              {[300, 1000, 2000, 5000, 10000, 25000].map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  className="bg-secondary px-4 py-1 text-sm font-bold rounded-full text-white"
                  onClick={() => handleQuickAmountSelect(presetAmount, false)}
                >
                  {presetAmount}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="bg-button px-10 py-2 mt-6 text-sm rounded-md block mx-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </>
      )} */}

      {activeTab === "Add Account" && (
        <>
          <form onSubmit={handleSubmit} className="px-3 rounded-lg max-w-6xl mx-auto">
            <div className="grid grid-cols-4 gap-4">
              {/* <div className="col-span-2">
                <label className="block text-sm mb-1">Payment Option *</label>
                <select className="w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black">
                  <option value={''}>Normal</option>
                  <option value={'bank'}>Normal</option>
                </select>
              </div> */}
              <div className="col-span-2">
                <label className="block text-sm mb-1">Name *</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleInputChange}
                  className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${errors.accountHolder ? "border-red-500 border" : ""
                    }`}
                  placeholder="Name"
                />
                {errors.accountHolder && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountHolder}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${errors.bankName ? "border-red-500 border" : ""
                    }`}
                  placeholder="Bank Name"
                />
                {errors.bankName && (
                  <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${errors.accountNumber ? "border-red-500 border" : ""
                    }`}
                  placeholder="Account Number"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              {/* <div className="col-span-1">
                <label className="block text-sm mb-1">Branch</label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-secondary rounded-md text-white ${errors.branchName ? "border-red-500 border" : ""
                    }`}
                  placeholder="Branch"
                />
                {errors.branchName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.branchName}
                  </p>
                )}
              </div> */}



              <div className="col-span-2">
                <label className="block text-sm mb-1">IFSC Number</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className={`w-full p-1.5 border-secondary border-2 bg-white rounded-md text-black ${errors.ifscCode ? "border-red-500 border" : ""
                    }`}
                  placeholder="IFSC Number"
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-[var(--primary)] text-[var(--secondary)] px-8 py-2 mt-6 text-sm rounded-md block"
            >
              {accountDetails ? "UPDATE" : "ADD"}
            </button>
          </form>

          <div className="py-2 px-2 overflow-y-auto max-w-6xl mx-auto md:block hidden">
            {accountDetails ? (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-100  uppercase bg-gray-50 dark:bg-secondary dark:text-gray-100">
                  <tr className="bg-[var(--primary)] text-[var(--secondary)]">
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Account Number
                    </th>
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Name
                    </th>
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Bank Name
                    </th>
                    {/* <th scope="col" className="px-6 lg:py-3 py-1.5">
                      Branch Name
                    </th> */}
                    <th scope="col" className="px-6 lg:py-3 py-1.5">
                      IFSC Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b py-2 text-start text-[--primary] text-lg font-bold">
                    <td className="px-6">{accountDetails?.accountNumber || '-'}</td>
                    <td className="px-6">{accountDetails?.accountHolder || '-'}</td>
                    <td className="px-6">{accountDetails?.bankName || '-'}</td>
                    {/* <td className="px-6">{accountDetails?.branchName || '-'}</td> */}
                    <td className="px-6">{accountDetails?.ifscCode || '-'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">No bank account details found</div>
            )}
          </div>

          {accountDetails && (
            <div className="md:hidden block text-gray-100 uppercase bg-gray-50 py-2">
              <div className="flex items-center px-2 bg-secondary border-b  py-2  text-center text-sm font-bold">
                <span className="flex-1 text-start border-r text-black">Account Number</span>
                <span className="flex-1 text-left pl-4 text-[--primary]">
                  {accountDetails?.accountNumber || '-'}
                </span>
              </div>
              <div className="flex items-center px-2 bg-secondary border-b  py-2  text-center text-sm font-bold">
                <span className="flex-1 text-start border-r text-black">IFSC Code</span>
                <span className="flex-1 text-left pl-4 text-[--primary]">
                   {accountDetails?.ifscCode || '-'}
                </span>
              </div>

              <div className="flex items-center px-2 bg-secondary border-b py-2 text-center text-sm font-bold">
                <span className="flex-1 text-start border-r text-black">Name</span>
                <span className="flex-1 text-left pl-4 text-[--primary]">
                  {accountDetails?.accountHolder || '-'}
                </span>
              </div>

              <div className="flex items-center px-2 bg-secondary border-b py-2 text-center text-sm font-bold">
                <span className="flex-1 text-start border-r text-black">Bank Name</span>
                <span className="flex-1 text-left pl-4 text-[--primary]">
                  {accountDetails?.bankName || '-'}
                </span>
              </div>

              {/* <div className="flex items-center px-2 bg-white py-1 dark:bg-gray-800 dark:border-gray-700 text-center text-sm font-bold">
                <span className="flex-1 text-start">Branch Name</span>
                <span className="flex-1 text-left pl-4">
                  {accountDetails?.branchName || '-'}
                </span>
              </div> */}
            </div>
          )}

          <form onSubmit={handleBankTransferSubmit} className="px-1 rounded-lg max-w-6xl mx-auto">
            <div className="max-w-6xl uppercase mt-4 mx-auto">
              {/* <div>
                <label className="block text-sm mb-1">A/C No.</label>
                <input
                  type="text"
                  className="w-full p-2 bg-secondary rounded-md text-white"
                  placeholder="Account Number"
                  value={accountDetails?.accountNumber || ''}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm mb-1">A/C Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-secondary uppercase rounded-md text-white"
                  placeholder="Account Name"
                  value={accountDetails?.accountHolder || ''}
                  disabled
                />
              </div> */}


                <label className="block text-sm mt-5 mb-1 capitalize text-[--primary] font-semibold">Select Your Amount </label>
            <div className="grid grid-cols-4 md:grid-cols-6 justify-start gap-1 ">
              {[300, 1000, 2000, 5000, 10000, 25000, 500000].map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  className={`px-4 py-2 text-sm font-bold border border-gray-300 rounded-lg 
                  ${
                    activeAmount === presetAmount
                      ? "bg-[--primary] text-[--secondary]"
                      : "bg-white text-[--primary] hover:bg-[--primary] hover:text-[--secondary]"
                  }`}
                  // className="bg-white px-4 py-1 text-sm font-bold hover:bg-[--primary] hover:text-[--secondary] border border-gray-300 rounded-lg text-[--primary]"
                  onClick={() => handleQuickAmountSelect(presetAmount, false)}
                >
                  ₹{presetAmount}
                </button>
              ))}
            </div>

              <div className="relative mt-3 mx-0 md:mx-5">
                <div className="flex items-center  mb-3 justify-between">
                  <label className="block text-sm capitalize text-[--primary] font-semibold">Type Your Amount </label>
                  <Link onClick={handleReset} className="underline text-[14px] font-semibold capitalize ">Reset</Link>
                </div>
                <input
                  type="number"
                  className={`w-full ps-[28px] pe-1.5 py-2 border-black  border-2 bg-white rounded-md text-black ${errors.amount ? "border-red-500" : ""
                    }`}
                  placeholder="Amount"
                  value={bankAmount}
                  onChange={(e) => handleAmountChange(e, false)}
                />
                <div className="absolute top-[53%] left-[10px] text-lg font-bold text-gray-600">₹</div>
                {/* <div className="text-[13px] text-gray-400 capitalize font-semibold mt-1">Available to Withdraw </div> */}
                {errors.amount && (
                  <span className="text-red-500 text-xs">{errors.amount}</span>
                )}
              </div>
            </div>


            <button
              type="submit"
              className="mx-0  bg-green-800 text-[--secondary] md:text-white w-full font-semibold py-3 mt-6 text-sm rounded-md block md:border mb-5 md:border-gray-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>

        </>
      )}

      {activeTab === "E-Wallet Transfer" && (
        <div className="p-4">
<UsdtWallet />
        </div>
      )}



      {activeTab === "EUpi" && (
        <div className="p-4">
<EUpiWallet />
        </div>
      )}
    </div>
  );
};

export default Wallet;