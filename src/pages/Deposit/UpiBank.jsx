import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { apiCall, httpPostFormData } from "../../config/HTTP";
import { message } from "antd";

function Deposit() {
    const [bankAcountData, setBankAcountData] = useState();
    const [bankAcountUpi, setBankAcountUpi] = useState();
    const [showAccount, setShowAccount] = useState();
    const [error, setError] = useState({});
    const [fileName, setFileName] = useState("");
    const [flowStep, setFlowStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [bankViewModal, setBankViewModal] = useState(false);
    const [upiViewModal, setUpiViewModal] = useState(false);

    const [payAccountFiel, setPayAccountFiel] = useState({
        amount: "",
        utrNo: "",
        img: "",
    });

    const domainSetting = (() => {
        try {
            const storedData = localStorage.getItem("clientdomainSetting");
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
            return {};
        }
    })();

    const bankDetailsUserDataFun = async () => {
        try {
            const bankDetailsUserData = await apiCall(
                "POST",
                "website/getBankDetailsByUserId"
            );
            if (bankDetailsUserData?.data) {
            
                
                setBankAcountData(bankDetailsUserData?.data?.account);
                setBankAcountUpi(bankDetailsUserData?.data?.upi);
            }
        } catch (error) {
            console.error("Error fetching bank details:", error);
        }
    };

    useEffect(() => {
        bankDetailsUserDataFun();
        if (domainSetting) {
            setBankAcountData(domainSetting?.account);
            setBankAcountUpi(domainSetting?.upi);
        }
    }, []);

    const payment = async (e) => {

        e.preventDefault();

        if (flowStep == 1) {
            if (validateAmount()) {
                setFlowStep(2);
            }
            return;
        }

        if (flowStep == 2) {
            if (selectedMethod) {
                setFlowStep(3);
            } else {
                setError({ ...error, method: "Please select a payment method" });
            }
            return;
        }

        // Final submission
        if (handleValidation()) {
            const data = {
                screenShotImg: payAccountFiel.img,
                amount: payAccountFiel.amount,
                utrNo: payAccountFiel.utrNo,
            };

                   
            try {
                const elementPositionDataResponse = await apiCall(
                    "POST",
                    "website/depositReq",
                    data
                );

                if (elementPositionDataResponse) {
                    if(!elementPositionDataResponse?.error){
                      message.success(elementPositionDataResponse?.message)
                          
                    }
                    setPayAccountFiel({
                        amount: "",
                        utrNo: "",
                        img: "",
                    });
                    setFlowStep(1);
                    setSelectedMethod(null);
                    setFileName("");
                }
            } catch (error) {
                console.error("Error submitting deposit:", error);
            }
        }
    };


     const payment1 = async (e) => {

        if (handleValidation()) {
            const data = {
                screenShotImg: payAccountFiel.img,
                amount: payAccountFiel.amount,
                utrNo: payAccountFiel.utrNo,
            };

                   
            try {
                const elementPositionDataResponse = await apiCall(
                    "POST",
                    "website/depositReq",
                    data
                );

                if (elementPositionDataResponse) {
                    if(!elementPositionDataResponse?.error){
                      message.success(elementPositionDataResponse?.message)
                          
                    }
                    setPayAccountFiel({
                        amount: "",
                        utrNo: "",
                        img: "",
                    });
                    setFlowStep(1);
                    setSelectedMethod(null);
                    setFileName("");
                }
            } catch (error) {
                console.error("Error submitting deposit:", error);
            }
        }
    };
    const validateAmount = () => {
        if (!payAccountFiel.amount || payAccountFiel.amount < 500) {
            setError({ amount: "Amount must be at least 500" });
            return false;
        }
        setError({});
        return true;
    };

    const fileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError({ img: "Please select a valid file." });
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        setFileName(file.name);

        try {
            const fileData = await httpPostFormData("website/fileUpload", formData);

            // Handle the API response structure
            if (fileData?.data?.imageUrl) {
                setPayAccountFiel((prevState) => ({
                    ...prevState,
                    img: fileData.data.imageUrl,
                }));
                setError((prevError) => ({ ...prevError, img: "" }));
            } else {
                throw new Error("Invalid response from file upload API");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setError({ img: "File upload failed. Please try again." });
            setFileName("");
        }
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setPayAccountFiel((prevState) => ({ ...prevState, [name]: value }));
        setError((prevError) => ({ ...prevError, [name]: "" }));
    };

    const handleValidation = () => {
        const errors = {};
const utr = payAccountFiel.utrNo?.toString();

        if (!utr || utr.length < 6 || utr.length > 12) {
            errors.utrNo = "UTR No must be between 6 and 12 digits.";
        }

        if (!payAccountFiel.amount) {
            errors.amount = "Amount Cannot Be Blank.";
        }

        if (!payAccountFiel.img) {
            errors.img = "Please upload a screenshot.";
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const updateStackOnclic = (value) => {
        setPayAccountFiel((prevState) => ({ ...prevState, amount: value }));
        setError((prevError) => ({ ...prevError, amount: "" }));
    };

    const handleMethodClick = (method) => {
        setUpiViewModal(true);
        const filteredData = bankAcountUpi?.[method];
        setShowAccount(filteredData ? { filteredData } : {});
        setError((prevError) => ({ ...prevError, method: "" }));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            payment(e);
        }
    };

    const predefinedValues = [
        "500", "1000", "2000", "3000", "4000", "5000", "10000", "20000"
    ];

    const paymentImage = [
        { imgs: "/deposit/bank2.png", title: "bank", method: "bank" },
        { imgs: "/deposit/bhim.png", title: "bhimUpi", method: "upi" },
        { imgs: "/images/zetto/paytm-pay.png", title: "paytm", method: "upi" },
        { imgs: "/images/zetto/g-pay.png", title: "googlePay", method: "upi" },
        { imgs: "/images/zetto/phonepe-pay.png", title: "phonePay", method: "upi" },
    ];

    return (
        <>
            <div>
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-lg font-bold text-gray-800">Select Your Amount</h1>
                    </div>

                    {/* Amount Selection Grid */}
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-8">
                        {predefinedValues.map((value) => (
                            <button
                                key={value}
                                onClick={() => updateStackOnclic(value)}
                                className={`py-3 px-2 rounded-lg border-2 font-bold text-sm ${payAccountFiel.amount === value
                                    ? 'bg-[--primary] text-[--white]'
                                    : 'bg-white text-[--primary] border-2 border-[--primary]'
                                    }`}
                            >
                                ₹{value}
                            </button>
                        ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium ">Or Enter Custom Amount</label>
                            <div onClick={() => setPayAccountFiel((prevState) => ({ ...prevState, ['amount']: '' }))} className="flex flex-col gap-2 underline text-sm ">
                                Reset
                            </div>
                        </div>
                        <div className="flex w-auto  rounded-lg">
                            <div className="flex items-center px-3 mr-2 border-r rounded-lg  gradient-border">
                                <button id="currency" type="button" className="text-lg font-medium">
                                    <span className="gradient-text">₹</span>
                                </button>
                            </div>

                            <input
                                className={`focus:outline-none px-4 rounded-lg w-full border bg-transparent text-[#212529] text-[13px] py-3 ${error.amount ? "border-red-500 border-2" : "border-gray-300"
                                    }`}
                                type="number"
                                placeholder="Enter Amount"
                                id="amount"
                                name="amount"
                                value={payAccountFiel.amount}
                                onChange={inputChange}
                                onKeyPress={handleKeyPress}
                                min="100"
                            />
                        </div>
                        {error.amount && (
                            <div className="text-red-600 text-sm mt-1 font-bold">
                                {error.amount}
                            </div>
                        )}
                        {flowStep !== 1 && (
                            <span className="text-xs text-gray-500 mt-1 flex gap-2 items-center">
                                <BiInfoCircle /> Redeposit bonus is applicable on deposits above ₹1000
                            </span>
                        )}
                        <span className="text-xs text-gray-500 mt-1 block">
                            Amount value should be between ₹500 and ₹500000
                        </span>
                    </div>


                    <div className="flex justify-end">
                        <button
                            disabled={
                                !payAccountFiel.amount || payAccountFiel.amount < 500 || payAccountFiel.amount > 500000
                            }
                            className={`rounded-lg w-full text-sm font-bold uppercase py-3 px-8 transition-all ${!payAccountFiel.amount || payAccountFiel.amount < 500 || payAccountFiel.amount > 500000
                                    ? "bg-transparent text-gray-500 cursor-not-allowed border border-gray-300"
                                    : "bg-green-800 hover:bg-[--white] hover:text-[--black] text-white hover:border-2 hover:border-green-800"
                                }`}
                            onClick={payment}
                        >
                            Continue
                        </button>
                    </div>

                </div>

                {/* Step 2: Payment Method Selection */}
                {(flowStep === 2 || flowStep === 3) && (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div
                                className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                    setSelectedMethod('bank');
                                    setUpiViewModal(false);
                                    setShowAccount({});
                                }}
                            >
                                <img
                                    src={'/deposit/bank2.png'}
                                    alt={"bank"}
                                    className="h-10 mb-2"
                                />
                                <span className="text-xs capitalize">{'Bank'}</span>
                            </div>
                            <div
                                className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedMethod('upi')}
                            >
                                <img
                                    src={'/deposit/bhim.png'}
                                    alt={"bank"}
                                    className="h-10 mb-2"
                                />
                                <span className="text-xs capitalize">{'UPI'}</span>
                            </div>
                        </div>

                        {selectedMethod === "bank" && (
                            <>
                                <span className="text-sm font-semibold mt-4">Method 1</span>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    <div
                                        className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setBankViewModal(true)}
                                    >
                                        <img
                                            src={'/deposit/bank2.png'}
                                            alt={"bank"}
                                            className="h-10 mb-2"
                                        />
                                        <span className="text-xs capitalize">{'Bank'}</span>
                                    </div>
                                </div>
                                {bankViewModal && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-[11px] w-11/12 max-w-md mx-auto relative">
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <h3 className="text-lg font-medium">Bank Account Details</h3>
                                                <button
                                                    onClick={() => setBankViewModal(false)}
                                                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <div
                                                    className="flex flex-col border rounded-[11px] py-6 px-4"
                                                    style={{ backgroundColor: "rgb(229,231,252)", opacity: 0.9 }}
                                                >
                                                    <div className="flex justify-between mb-3">
                                                        <span className="text-[13px] text-[#666]">Branch Name</span>
                                                        <span className="text-[13px] font-medium">
                                                            {bankAcountData?.branchName}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between mb-3">
                                                        <span className="text-[13px] text-[#666]">Account Holder Name</span>
                                                        <span className="text-[13px] font-medium">
                                                            {bankAcountData?.acHolderName}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between mb-3">
                                                        <span className="text-[13px] text-[#666]">Account Number</span>
                                                        <span className="text-[13px] font-medium">
                                                            {bankAcountData?.accountNumber}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[13px] text-[#666]">IFSC Code</span>
                                                        <span className="text-[13px] font-medium">
                                                            {bankAcountData?.ifscCode}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedMethod == "upi" && (
                            <div>
                                <span className="text-sm font-semibold mt-4">Method 2</span>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {bankAcountUpi && Object.keys(bankAcountUpi).map((method) => (
                                        <div
                                            key={method}
                                            onClick={() => handleMethodClick(method)}
                                            className="flex flex-row justify-center items-center mt-4 rounded-md border border-gray-300 p-2 w-[66px] h-auto"
                                        >
                                            {paymentImage
                                                .filter(item => item.method === selectedMethod)
                                                .map((item, index) => (
                                                    method === item.title && (
                                                        <img
                                                            key={index}
                                                            src={item.imgs}
                                                            alt={item.title}
                                                            className={item.title === 'bhimUpi' ? 'h-[30px]' : ''}
                                                        />
                                                    )
                                                ))
                                            }
                                        </div>
                                    ))}
                                </div>

                                {upiViewModal && (
                                    <>
                                        <div className="grid md:grid-cols-2 grid-cols-1">
                                            <div className="max-w-[350px] mt-2">
                                                <div
                                                    style={{ backgroundImage: 'url("/manual-pg.png")' }}
                                                    className="flex items-center justify-between p-2 rounded-lg border border-blue-200"
                                                >
                                                    <div className="font-semibold text-gray-800">
                                                        <span className="text-sm text-gray-800 break-all">
                                                            {showAccount?.filteredData[0]?.upiId}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(showAccount?.filteredData?.upiId)}
                                                        className="flex items-center space-x-2 bg-[#001F3F] hover:bg-[#00FFE6] hover:text-black text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">Copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="max-w-[350px] mt-2">
                                                {/* <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-semibold text-gray-800">Method 3 (Copy payment details)</span>
                                                </div> */}
                                                <div
                                                    style={{ backgroundImage: 'url("/manual-pg.png")' }}
                                                    className="flex items-center justify-between p-2 rounded-lg border border-blue-200"
                                                >
                                                    <div className="font-semibold text-gray-800">
                                                        <span className="text-sm text-gray-800 break-all">
                                                            {showAccount?.filteredData[0]?.mobNo}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(showAccount?.filteredData?.mobNo)}
                                                        className="flex items-center space-x-2 bg-[#001F3F] hover:bg-[#00FFE6] hover:text-black text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">Copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full flex py-4 px-4 gap-2 flex-col justify-center items-center">
                                            <span className="text-[12px] font-semibold capitalize">{selectedMethod} QR Code</span>
                                            <img
                                                src={showAccount?.filteredData[0]?.image}
                                                alt="QR Code"
                                                title="QR Code"
                                                className="md:h-60 h-52 md:w-[250px] w-60"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Payment Details and Confirmation */}
                {selectedMethod && (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

                        {/* UTR Number and File Upload */}
                        <div className="grid md:grid-cols-1 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Screenshot</label>
                                <div className="border-2 border-dashed bg-transparent border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={fileUpload}
                                        className="hidden"
                                        id="fileInput"
                                    />
                                    <label htmlFor="fileInput" className="cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl text-gray-400 mb-2">+</span>
                                            <span className="text-sm text-gray-600">
                                                {fileName || "Click to upload screenshot"}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                {error.img && (
                                    <div className="text-red-600 text-sm mt-1 font-bold">
                                        {error.img}
                                    </div>
                                )}
                            </div>
                            {payAccountFiel?.img && <div><img src={payAccountFiel?.img} alt=""  height={100} width={100}/></div>}
                           
                            <div>
                                <label className="block text-sm font-medium mb-2">UTR Number</label>
                                <input
                                    className={`focus:outline-none px-4 bg-transparent rounded-lg w-full border text-[#212529] text-[13px] py-3 ${error.utrNo ? "border-red-500 border-2" : "border-gray-300"
                                        }`}
                                    type="number"
                                    placeholder="Enter UTR Number"
                                    value={payAccountFiel.utrNo}
                                    onChange={inputChange}
                                    id="utrNo"
                                    name="utrNo"
                                    maxLength={12}
                                    minLength={6}
                                />
                                {error.utrNo && (
                                    <div className="text-red-600 text-sm mt-1 font-bold">
                                        {error.utrNo}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="rounded-lg w-full text-sm font-bold uppercase bg-green-800 hover:bg-[--white] hover:text-black hover:border-2 hover:border-green-800 text-white py-3 px-8"
                                    onClick={payment1}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes Section */}
                {selectedMethod && <div className="flex flex-col w-full md:px-10 px-4 m-auto md:w-[700px] mb-[100px] md:mb-10">
                    <div className="font-semibold text-[12px] text-club4-second-text2 mb-2">
                        Note:
                    </div>
                    <div className="text-[12px] px-1 md:px-4 text-club4-second-text2 space-y-2">
                        {[
                            "After Deposit, Upload Slip and Enter your deposit amount.",
                            "Copy and Enter 12 Digit UTR number.",
                            "Click on Submit button and receive Points and Bonus instantly.",
                            "ministerexch is not responsible for money deposited to old inactive or closed accounts.",
                            "NEFT receiving times vary from 40 mins to 2 hours.",
                            "Only UTR and RRN Number will be accepted.",
                            "Prior to initiating the deposit, kindly check the active payment details as the deposit details will be changed from time to time.",
                            "Saving the bank details and transferring funds to any old or inactive account results in not being credited to your gaming account or refunded to you.",
                            "Any deposit less than 500 will not be refunded and the deposited amount will not be processed."
                        ].map((note, index) => (
                            <div key={index} className="flex items-start">
                                <span className="min-w-[16px]">{index + 1}.</span>
                                <span className="ml-2">{note}</span>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </>
    );
}

export default Deposit;