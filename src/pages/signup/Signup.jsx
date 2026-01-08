
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { httpPost } from "../../config/HTTP";
import { FaWhatsapp } from "react-icons/fa";
import { login } from "../../redux/reducers/auth.reducer";

function SignUp({ isSignUpOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otpData, setOtpData] = useState("");
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [countryCode, setCountryCode] = useState("91");
 
 const handleSelectCode = (code) => {
   setCountryCode(code);
   setIsDropdownOpen(false);
 };

  const [user, setUser] = useState({
    name: "",
    mobileNo: "",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    otp: ""
  });

  const domainSetting = JSON.parse(localStorage.getItem("clientdomainSetting"));
  const isOtpEnabled = domainSetting?.isSignUpOtp == true;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    let truncatedValue = value;

    if (name === "username") {
      truncatedValue = value.replace(/\s/g, "");
    }
    if (name === "mobileNo") {
      if (value.length > 10) {
        return setErrors({
          ...errors,
          mobileNo: "Mobile number must be 10 digits",
        });
      }
      truncatedValue = value.slice(0, 10);
    }

    setUser({ ...user, [name]: truncatedValue });
    setErrors({ ...errors, [name]: "" });
  };

  const handleOnSubmit = async (e) => {
  e.preventDefault();


    if (!user.mobileNo || user.mobileNo.length !== 10) {
      setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
      return;
    }

    if (!user.name || user.name.length < 3) {
      setErrors({ ...errors, name: "Name must be at least 3 characters long" });
      return;
    }

    if (!user.password || user.password.length < 6) {
      setErrors({
        ...errors,
        password: "Password must be at least 6 characters long and must be in the format: Ab1234",
      });
      return;
    }
    if (!user.confirmPassword || user.confirmPassword.length < 6) {
  setErrors({
    ...errors,
    confirmPassword: "Confirm password must be at least 6 characters long",
  });
  return;
}

if (user.password !== user.confirmPassword) {
  setErrors({
    ...errors,
    confirmPassword: "Passwords do not match",
  });
  return;
}

    // if (!/[A-Z]/.test(user.password)) {
    //   setErrors({ ...errors, password: "Password must contain at least one uppercase letter" });
    //   return;
    // }

    if (!/[a-z]/.test(user.password)) {
      setErrors({ ...errors, password: "Password must contain at least one lowercase letter" });
      return;
    }

    if (!/\d/.test(user.password)) {
      setErrors({ ...errors, password: "Password must contain at least one digit" });
      return;
    }

  setLoading(true);

  try {
    const registerPayload = {
      domainUrl: window.location.origin,
      name: user.name,
      username: user.username,
      mobileNo: `${countryCode}${user.mobileNo}`,
      password: user.password,
    };

    if (user.referralCode) {
      registerPayload.referralCode = user.referralCode;
    }

    if (user.otp) {
      registerPayload.otp = user.otp;
    }

    // Step 1: Register User
    const registerResponse = await httpPost("website/registerClient", registerPayload);

    if (!registerResponse?.error) {
      message.success(registerResponse?.message || "Registration successful!");

      const loginPayload = {
        username: user.username,
        password: user.password,
        isClient: true,
        host: window.location.host,
      };
      try {
        
        const loginResult = await dispatch(login(loginPayload));
        if (!loginResult?.payload?.userinfo?.error) {
          // Login successful
          localStorage.setItem("isRedirected", "false");
          window.location.href = "/dashboard"; // or navigate("/dashboard")
        } else {
          message.error(loginResult?.message || "Auto login failed. Please login manually.");
          window.location.href = "/"; // fallback
        }
      } catch (loginError) {
        console.error("Auto login failed:", loginError);
        message.warning("Registered! But auto login failed. Redirecting to login...");
      
      }

      // Reset form
      setUser({
        name: "",
        username: "",
        mobileNo: "",
        password: "",
        confirmPassword: "",
        referralCode: "",
        otp: ""
      });

    } else {
      message.error(registerResponse?.message || "Registration failed.");
    }
  } catch (error) {
    console.error("Registration Error:", error);
  } finally {
    setLoading(false);
  }
};

//   const handleOnSubmit = async (e) => {
//     e.preventDefault();

//     if (!user.mobileNo || user.mobileNo.length !== 10) {
//       setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
//       return;
//     }

//     if (!user.name || user.name.length < 3) {
//       setErrors({ ...errors, name: "Name must be at least 3 characters long" });
//       return;
//     }

//     if (!user.password || user.password.length < 6) {
//       setErrors({
//         ...errors,
//         password: "Password must be at least 6 characters long and must be in the format: Ab1234",
//       });
//       return;
//     }
//     if (!user.confirmPassword || user.confirmPassword.length < 6) {
//   setErrors({
//     ...errors,
//     confirmPassword: "Confirm password must be at least 6 characters long",
//   });
//   return;
// }

// if (user.password !== user.confirmPassword) {
//   setErrors({
//     ...errors,
//     confirmPassword: "Passwords do not match",
//   });
//   return;
// }

//     // if (!/[A-Z]/.test(user.password)) {
//     //   setErrors({ ...errors, password: "Password must contain at least one uppercase letter" });
//     //   return;
//     // }

//     if (!/[a-z]/.test(user.password)) {
//       setErrors({ ...errors, password: "Password must contain at least one lowercase letter" });
//       return;
//     }

//     if (!/\d/.test(user.password)) {
//       setErrors({ ...errors, password: "Password must contain at least one digit" });
//       return;
//     }

//     setLoading(true);

//     try {
//       const loginDetails = {
//         domainUrl: window.location.origin,
//         name: user.name,
//         username: user.username,
//         mobileNo: `${countryCode}${user.mobileNo}`,
//         password: user.password,
//       };

//       if (user.referralCode) {
//         loginDetails.referralCode = user.referralCode;
//       }

//       if (user.otp) {
//         loginDetails.otp = user.otp;
//       }

//       const response = await httpPost("website/registerClient", loginDetails);
//       console.log(response, "gggggggggggggg");
      
//       if (response) {
//         setUser({
//           name: "",
//           username: "",
//           mobileNo: "",
//           password: "",
//           referralCode: "",
//           otp: ""
//         });
//         window.location.href = "/";
//         message.success(response?.message);
//       } else {
//         message.error("Registration failed. Please check your details.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleGetOtp = async () => {
    if (!user.mobileNo || user.mobileNo.length !== 10) {
      setErrors({ ...errors, mobileNo: "Mobile number must be 10 digits" });
      return;
    }

    try {
      const res = await httpPost("website/getWhatsAppOtp", {
        phone: `${countryCode}${user.mobileNo}`,
      });

      if (res?.error === false) {
        message.success(res?.message);
        setOtpEnabled(true);
        setOtpData(res?.data);
      } else {
        message.error(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      message.error("Error sending OTP");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOnSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start  bg-black bg-opacity-50 overflow-auto">
      <div className="w-full md:max-w-[448px] max-w-[100%] shadow-md rounded-[4px] bg-[#666] text-white md:!my-4">
          <div className="flex justify-between bg-black p-2 px-4">
            <h5 className="text-lg font-bold">Register</h5>
            <img
              src="https://wver.sprintstaticdata.com/v78/static/front/img/close.svg"
              alt="close"
              className="rounded-full border-2 p-1 border-red-700 cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="p-1">
        <div className="space-y-2 p-3 pb-6 bg-black">
          <div className="bg-[#353434] mx-6 text-sm py-1">
            <div className="text-white text-center">Register as New User</div>
            <div className="text-white text-center">Get your instent ID From Whatsapp</div>
              {domainSetting?.whatsappNumber ? (
    <a
      passHref={true}
      href={`https://wa.me/${domainSetting?.whatsappNumber}`}
      title="Whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
<div className="flex items-center uperrcase px-1">
              <div className="p-3 bg-green-600"><FaWhatsapp /></div>
              <div className="bg-green-600 h-6 flex-1 uppercase text-center font-bold">Click Here</div>
            </div>
    </a>
  ) : (
<div className="flex items-center uperrcase px-1">
              <div className="p-3 bg-green-600"><FaWhatsapp /></div>
              <div className="bg-green-600 h-6 flex-1 uppercase text-center font-bold">Click Here</div>
            </div>
  )}
            {/* <div className="flex items-center uperrcase px-1">
              <div className="p-3 bg-green-600"><FaWhatsapp /></div>
              <div className="bg-green-600 h-6 flex-1 uppercase text-center font-bold">Click Here</div>
            </div> */}
          </div>
          <div className="flex items-center">
                <hr className="flex-grow border-t-2 border-[#767f99]" />
                <span className="text-[#767f99] text-[12px] mx-2">or</span>
                <hr className="flex-grow border-t-2 border-[#767f99]" />
              </div>
          <div className="text-[12px] font-semibold !text-white ">
                  Name
                </div>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleOnChange}
            placeholder="Enter Name"
            className="w-full p-2 focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
          />
          {errors.name && <div className="text-red-500">{errors.name}</div>}

          <div className="text-[12px] font-semibold !text-white ">
                  Username
                </div>

          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleOnChange}
            placeholder="Enter Username"
            className="w-full p-2 focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
          />
          {errors.username && <div className="text-red-500">{errors.username}</div>}

          <div className="relative flex items-center">
            
            <div className="relative w-[80px] px-1 text-white text-sm">
              <div className="text-[12px] font-semibold  text-nowrap !text-white ">
                Mobile No.
                </div>
              
  {/* Selected Code Display */}
  <div
    className="bg-[#222] border border-gray-600 p-2 rounded cursor-pointer flex justify-between items-center"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  >
    +{countryCode}
    <svg
      className={`w-4 h-4 ml-1 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  {/* Dropdown Menu */}
  {isDropdownOpen && (
    <ul className="absolute z-50 bg-[#222] border border-gray-600 mt-1 rounded w-full shadow-lg">
      {["92", "91"].map((code) => (
        <li
          key={code}
          onClick={() => handleSelectCode(code)}
          className={`p-2 cursor-pointer hover:bg-[#333] ${
            countryCode === code ? "bg-[#333]" : ""
          }`}
        >
          +{code}
        </li>
      ))}
    </ul>
  )}
</div>


            <div className="w-full mt-5">
              <input
                type="tel"
                name="mobileNo"
                value={user.mobileNo}
                onChange={handleOnChange}
                placeholder="Enter Mobile No (10 digits)"
                className="w-full p-2 text-start focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
              />
              {errors.mobileNo && <div className="text-red-500">{errors.mobileNo}</div>}
            </div>

            {isOtpEnabled && (
              <button
                type="button"
                onClick={handleGetOtp}
                className="absolute right-1 p-2 top-1 text-xs bg-button text-black font-medium rounded"
              >
                GET OTP
              </button>
            )}
          </div>

          {isOtpEnabled && (
            <div className="relative flex">
              <input
                type="text"
                name="otp"
                value={user.otp}
                onChange={handleOnChange}
                placeholder="Enter OTP"
                disabled={!otpEnabled}
                className="w-full p-2 focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
              />
              {errors.otp && <div className="text-red-500">{errors.otp}</div>}
            </div>
          )}

      <div className="flex gap-4">
  {/* Password Field */}
  <div className="relative w-1/2">
  <div className="text-[12px] font-semibold !text-white ">
                Password
                </div>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={user.password}
      disabled={isOtpEnabled && !otpEnabled}
      onChange={handleOnChange}
      placeholder="Password"
      className="w-full p-2 focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
    />
    <button
      onClick={toggleShowPassword}
      className="absolute text-white right-3 top-8 text-lg"
    >
      {showPassword ? <BsFillEyeSlashFill /> : <BsEyeFill />}
    </button>
    {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
  </div>

  {/* Confirm Password Field */}
  <div className="relative w-1/2">
  <div className="text-[12px] font-semibold !text-white ">
                Confirm Password
                </div>
    <input
      type={showPassword ? "text" : "password"}
      name="confirmPassword"
      value={user.confirmPassword}
      disabled={isOtpEnabled && !otpEnabled}
      onChange={handleOnChange}
      placeholder="Confirm Password"
      className="w-full p-2 focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
    />
    <button
      onClick={toggleShowPassword}
      className="absolute text-white right-3 top-8 text-lg"
    >
      {showPassword ? <BsFillEyeSlashFill /> : <BsEyeFill />}
    </button>
    {errors.confirmPassword && <div className="text-red-500 mt-1">{errors.confirmPassword}</div>}
  </div>
</div>

 <div className="text-[12px] font-semibold !text-white ">
                Referral Code
                </div>
          <input
            type="text"
            name="referralCode"
            value={user.referralCode}
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            disabled={isOtpEnabled && !otpEnabled}
            placeholder="Referral Code"
            className="w-full p-2 focus:border text-white focus:border-button bg-[#353434] outline-none rounded"
          />
          {errors.referralCode && <div className="text-red-500">{errors.referralCode}</div>}

          <div className="custom-control custom-checkbox d-inline-block py-1 mb-2">
              <input
                type="checkbox"
                id="customCheck"
                name="example1"
                className="custom-control-input"
                checked
              />
              &nbsp;
              <label htmlFor="customCheck" className="text-sm">
                I am at least&nbsp;
                <a href="javascript:void(0)" className="text-red-500" role="button">
                  18 years
                </a>
                &nbsp;of age and I have read, accept and agree to the&nbsp;
                <a
                  href="/term-condition"
                  className="text-blue-500 underline"
                  target="_blank"
                >
                  Terms and Conditions
                </a>
                ,&nbsp;
                <a
                  href="/responsible-gambling"
                  className="text-blue-500 underline"
                  target="_blank"
                >
                  Responsible Gaming
                </a>
              </label>
            </div>

          <button
            onClick={handleOnSubmit}
            className={`w-full py-2 bg-[--primary] text-white rounded mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
