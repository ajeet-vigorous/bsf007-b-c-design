import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdOutlineContentCopy } from "react-icons/md";
import { apiCall, httpPostFormData } from "../../config/HTTP";


function Deposit() {
  const [tabValue, SetTabValue] = useState(1);

  const [active, setActive] = useState(false);
  const [bankAcountData, setBankAcountData] = useState();
  const [bankAcountUpi, setBankAcountUpi] = useState();
  const [showAccount, setShowAccount] = useState();
  const [error, setError] = useState({});
  const [fileName, setFileName] = useState("");

  let domainSetting = null;
  try {
    const storedData = localStorage.getItem("clientdomainSetting");
  
    if (storedData) {
      domainSetting = JSON.parse(storedData);
    } else {
      console.error("No data found in localStorage for clientdomainSetting");
      domainSetting = {};
    }
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    domainSetting = {};
  }
  const bankDetailsUserDataFun = async () => {
    let bankDetailsUserData = await apiCall(
      "POST",
      "website/getBankDetailsByUserId"
    );
    if (bankDetailsUserData?.data) {
      setBankAcountData(bankDetailsUserData?.data?.account);
      setBankAcountUpi(bankDetailsUserData?.data?.upi);
    }
  };

  useEffect(() => {
    bankDetailsUserDataFun();
    if (domainSetting) {
      setBankAcountData(domainSetting?.account);
      setBankAcountUpi(domainSetting?.upi);
    }
  }, []);
  
  const toggleAccordion = () => {
    setActive(!active);
  };

  const [payAccountFiel, setPayAccountFiel] = useState({
    amount: "",
    utrNo: "",
    img: "",
  });

  const payment = async (e) => {
    e.preventDefault();
    // setIsFetching(true); ${baseUrl.BASE_IMAGE_DOMAIN}/${payAccountFiel.img}
    if (setErrohandleValidation()) {
      const data = {
        screenShotImg: `${payAccountFiel.img}`,
        amount: payAccountFiel.amount,
        utrNo: payAccountFiel.utrNo,
      };

      let elementPositionDataResponse = await apiCall(
        "POST",
        "website/depositReq",
        data
      );

      if (elementPositionDataResponse) {
        // const toastId = toast.success(elementPositionDataResponse?.message);
        // setTimeout(() => toast.dismiss(toastId), 1000);
        setPayAccountFiel((prevState) => ({
          ...prevState,
          amount: "",
          utrNo: "",
          img: " ",
        }));
      } else {
        // const toastId = toast.error(elementPositionDataResponse?.message);
        // setTimeout(() => toast.dismiss(toastId), 1000);
      }
    }
    // setIsFetching(false);
  };

  const fileUpload = async (e) => {
    // let { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      setFileName(file.name);
      try {
        let fileData = await httpPostFormData("website/fileUpload", formData);
        // const toastId = toast.success(fileData?.message);
        // setTimeout(() => toast.dismiss(toastId), 1000);

        setPayAccountFiel((prevState) => ({
          ...prevState,
          img: fileData?.data?.imageUrl,
        }));
        setError((prevError) => ({ ...prevError, img: "" }));
      } catch (error) {
        // const toastId = toast.error("Error uploading file:");
        // setTimeout(() => toast.dismiss(toastId), 1000);
        console.error("Error uploading file:", error);
      }
    } else {
      const errorMessage = "Please select a valid file.";
      setPayAccountFiel((prevState) => ({
        ...prevState,
        errorMessage,
      }));
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setPayAccountFiel((prevState) => ({ ...prevState, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" }));
  };

  const setErrohandleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (
      !payAccountFiel.utrNo ||
      payAccountFiel.utrNo.length < 6 ||
      payAccountFiel.utrNo.length > 12
    ) {
      formIsValid = false;
      errors.utrNo = "UTR No must be between 6 and 12 digits.";
    }

    if (!payAccountFiel.amount) {
      formIsValid = false;
      errors.amount = "Amount Cannot Be Blank.";
    }

    if (!payAccountFiel.utrNo) {
      formIsValid = false;
      errors.utrNo = "New UTR No Cannot Be Blank.";
    }

    if (!payAccountFiel.img) {
      formIsValid = false;
      errors.img = "Img Cannot Be Blank.";
    }

    setError(errors);
    return formIsValid;
  };

  const updateStackOnclic = (value) => {
    setPayAccountFiel((prevState) => ({ ...prevState, amount: value }));
    setError((prevError) => ({ ...prevError, amount: "" }));
  };

  const predefinedValues = [
    "500",
    "1000",
    "2000",
    "3000",
    "4000",
    "5000",
    "10000",
    "20000",
  ];

  const paymentImage = [
    { imgs: "/deposit/bank2.png", title: "bank" },
    { imgs: "/deposit/bhim.png", title: "bhimUpi" },
    { imgs: "/deposit/paytm.png", title: "paytm" },
    { imgs: "/deposit/googlepay.png", title: "googlePay" },
    { imgs: "/deposit/phonepe.svg", title: "phonePay" },
  ];

  const [selectedMethod, setSelectedMethod] = useState(null);
  const handleMethodClick = async (method) => {
    setSelectedMethod((prevMethod) => (prevMethod === method ? null : method));
    const filteredData = bankAcountUpi[method];
    setShowAccount(filteredData ? { filteredData } : {});
  };

  const bankAcountShowOnly = () => {
    setSelectedMethod(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      payment(e);
    }
  };

  const [copied, setCopied] = useState(false);


  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };


  return (
    <>
      <section className="w-full md:max-w-5xl mx-auto flex justify-center  ">
        <div className="lg:w-[97%] md:w-[75%] lg:px-0 px-4 w-full  b     sm:rounded-md">
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-3 items-center gap-2 ">
            <div
              onClick={() => bankAcountShowOnly()}
              className={`flex  flex-row justify-center items-center h-[84px] rounded-md  ${selectedMethod === "bank" ? "opacity-50" : ""
                }`}
              style={{ boxShadow: '2px 2px 2px 0px #00000040' }}>
              {paymentImage?.map((item, index) => (
                <div
                  onClick={() => bankAcountShowOnly()}
                  key={index}
                  className="   flex flex-row justify-center items-center">
                  {item.title === "bank" && (
                    <img
                      src={item.imgs}
                      alt={item.title}
                      className="h-12  lg:w-[75px] w-[75px] border px-2 py-2 "
                    />
                  )}
                </div>
              ))}
            </div>
            {bankAcountUpi
              ? Object.keys(bankAcountUpi).map((method) => (
                <div
                  key={method}
                  onClick={() => handleMethodClick(method)}
                  className={`flex  flex-row   justify-center items-center h-[84px]  rounded-md  ${selectedMethod !== method && ""
                    }`}
                    style={{boxShadow:'2px 2px 2px 0px #00000040'}}
                  >
                    {paymentImage?.map((item, index) => (
                      <div
                        key={index}
                        className=" flex flex-row justify-center items-center"
                        onClick={() => handleMethodClick(method)}
                      >
                        {method === item.title && (
                          <img
                            src={item.imgs}
                            alt={item.title}
                            className={`${item.title==='bhimUpi'? 'h-[30px]':''}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              : null}
          </div>

          <div className="pt-5  text-[#343434] text-15px font-bold">
            {" "}
            Make Your Payment On Detailed Below{" "}
          </div>

          <div className="    ">
            <div className="flex-1 h-full ">
              {selectedMethod ? (
                <div
                  className=" flex flex-col border rounded-[11px] my-3 pt-1 px-1 "
                  style={{ backgroundColor: "rgb(229,231,252)", opacity: 0.9 }}
                >
                  <div className="border-b  border-[#666] p-2">
                    <div className="flex justify-between">
                      <span className="text-[13px]  text-[#666]">
                        Mobile Number
                      </span>
                      <span className="text-[13px]">{showAccount?.filteredData?.mobNo}</span>
                    </div>
                    <div className="flex justify-between ">
                      <span className="text-[13px] whitespace-nowrap  text-[#666]">Upi Id</span>

                      <div className="w-full flex justify-end items-center gap-1">
                        {copied && <span className="bg-[#5dae32] text-[13px] py-1 text-white px-6 ">Copied.</span>}
                        <span className="text-[13px]">{showAccount?.filteredData?.upiId}</span>
                        <MdOutlineContentCopy onClick={() => { handleCopy(showAccount?.filteredData?.upiId) }} className="h-5" />
                      </div>

                    </div>

                  </div>

                  <div className="w-full flex py-4 px-4 gap-2 flex-col justify-center items-center">
                    <span className="text-[18px] font-semibold capitalize">{selectedMethod} QR Code</span>
                    <img
                      src={showAccount?.filteredData?.image}
                      alt="QR Code"
                      title="QR Code"
                      className="md:h-60 h-52 md:w-[250px] w-60"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className=" flex flex-col border rounded-[11px] my-3 py-6 px-2 "
                  style={{ backgroundColor: "rgb(229,231,252)", opacity: 0.9 }}
                >
                  <div className="flex justify-between">
                    <span className="text-[13px]  text-[#666]">
                      Branch Name
                    </span>
                    <span className="text-[13px]">
                      {bankAcountData?.branchName}
                    </span>
                  </div>
                  <div className="flex justify-between ">
                    <span className="text-[13px] text-[#666]">
                      Account Holder Name
                    </span>
                    <span className="text-[13px]">
                      {bankAcountData?.acHolderName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-[#666] ">
                      Account Number
                    </span>
                    <span className="text-[13px]">
                      {bankAcountData?.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#666]">IFSC Code</span>
                    <span className="text-[13px] ">
                      {bankAcountData?.ifscCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:grid lg:grid-cols-[0.6fr_1.4fr] gap-5  grid grid-cols-1 ">
              <div
                className=" w-full flex flex-col border rounded-[11px] mt-3 py-6 px-2  "
                style={{ backgroundColor: "rgb(229,231,252)", opacity: 0.9 }}
              >
                <div className="w-full ">
                  <input
                    className={`focus:outline-none px-2 rounded-lg w-full border-[1px] border-blue-900  text-[#212529] text-[13px]  py-3 ${error.amount ? "border-red-500 border-2 w-full" : ""
                      }`}
                    type="number"
                    placeholder="Enter Amount"
                    id="amount"
                    name="amount"
                    value={payAccountFiel.amount}
                    onChange={inputChange}
                    onKeyPress={handleKeyPress}
                  />
                  {error.amount && (
                    <div className="text-red-600 text-sm mb-1 font-bold bg-red text-left">
                      {error.amount}
                    </div>
                  )}
                  <span className="text-[10px] font-semibold ">
                    You can add upto 100,000 Minimum 100 required
                  </span>
                </div>
                <div className="mt-1">
                  <input
                    className={`focus:outline-none px-2 rounded-lg w-full border-[1px] border-blue-900  text-[#212529] text-[13px]  py-3 ${error.utrNo ? "border-red-500 border-2 w-full" : ""
                      }`}
                    type="text"
                    placeholder="Enter Unique Transaction Reference"
                    value={payAccountFiel.utrNo}
                    onChange={inputChange}
                    id="utrNo"
                    name="utrNo"
                    maxLength={12}
                    minLength={6}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {error.utrNo && (
                  <div className="text-red-600 font-bold text-sm mb-1 text-left">
                    {error.utrNo}
                  </div>
                )}
              </div>
              <div
                className="flex justify-center items-center border rounded-[11px] mt-3 px-2 lg:w-[50%] w-full py-5"
                style={{ backgroundColor: "rgb(229,231,252)", opacity: 0.9 }}
              >
                <div className="flex flex-col justify-center items-center bg-white mx-1 py-4  rounded-lg w-full h-full">
                  <label
                    className="relative cursor-pointerx border border-dashed border-[rgb(0,8,73)] rounded-lg p-5  w-20 h-18  flex justify-center items-center  "
                    style={{
                      backgroundColor: "rgb(229,231,252)",
                      opacity: 0.9,
                    }}
                  >
                    <input
                      className={`hidden focus:outline-none text-sm text-[#f36c21] rounded-lg font-bold w-full p-2 ${error.img ? "border-red-500 border-2" : ""
                        }`}
                      type="file"
                      accept="image/*"
                      onChange={(event) => fileUpload(event)}
                    />
                    <span className="text-4xl text-black">+</span>
                  </label>

                  <span className="m-1 text-sm font-bold text-[#343434]">
                    {fileName
                      ? `${fileName}`
                      : "Click here to Upload Payment Screenshot"}
                  </span>
                  {error.img && (
                    <div className="text-red-600 font-bold text-sm mb-1 text-left">
                      {error.img}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[14px] text-[#f00]">
            <h2 className="text-[18px] font-semibold">
              <span className="inline-block">
                <img
                  className="h-[25px]"
                  src="/winjaImages/images/alirt.svg"
                ></img>
              </span>{" "}
              Note:
            </h2>
            <p>
              <span>1.</span> Deposit money only in the below available accounts
              to get the fastest credits and avoid possible delays.
            </p>
            <p>
              <span>2.</span> Deposits made 45 minutes after the account removal
              from the site are valid &amp; will be added to their wallets.
            </p>
            <p>
              <span>3.</span> Site is not responsible for money deposited to
              Old, Inactive or Closed accounts.
            </p>
            <p>
              <span>4.</span> After deposit, add your UTR and amount to receive
              balance.{" "}
            </p>
            <p>
              <span>5.</span> In case of account modification: payment valid for
              1 hour after changing account details in deposit page.{" "}
            </p>
          </div>
          <div className="w-full flex justify-end py-4">
            <button
              className="rounded-lg bg-[rgba(0,8,73,0.9)] text-sm font-bold uppercase text-white py-[12px] "
              onClick={payment}
            >
              <span className="px-9 ">Submit</span>
            </button>
          </div>

          <div className="flex  flex-col justify-end items-center">
            <span className="text-[#343434] text-[15.5px]">
              Accept, process & disburse digital payments for your business
            </span>
            <span className="text-[rgba(0,8,73,0.9)] mt-3 font-semibold">
              Fast and Secure Payment
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Deposit;