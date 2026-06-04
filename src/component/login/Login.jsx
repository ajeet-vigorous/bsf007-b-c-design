import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaKey, FaUserAlt, FaHandPointDown, FaSignInAlt } from "react-icons/fa";
import { login } from "../../redux/reducers/auth.reducer";
import settings from "../../domainConfig";
import { getUserBalance } from "../../redux/reducers/user_reducer";

const Login = () => {
  const dispatch = useDispatch();
  const { login_loading } = useSelector(state => state.authUser)
  const [fieldslogin, setFieldslogin] = useState({});
  const [errorslogin, setErrorslogin] = useState({});
  const [showMe, setShowMe] = useState(false);
  const [passtype, setPasstype] = useState("password");

  // Handle input change
  const inputChange = (e) => {
    const { name, value } = e.target;
    setFieldslogin((prevFields) => ({ ...prevFields, [name]: value }));
    setErrorslogin((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle login form submission
  const loginSubmit = (e) => {
    e.preventDefault();
    if (handleValidationLogin()) {
      const data = {
        username: fieldslogin.username,
        password: fieldslogin.password,
        isClient: true,
        host: window.location.origin
      };

      dispatch(login(data))
        .then((dataa) => {
          if (!dataa.error) {
            dispatch(getUserBalance())
             window.location.href = "/dashboard";
          } else {
            console.error("Login failed:", dataa.error);
          }
        })
        .catch((error) => {
          console.error("Login request failed:", error);
        });

    }
  };

  const handleDemoLogin = () => {
    const demo = settings?.demoCredentials
    dispatch(login(demo))
      .then((data) => {
        if (!data.error) {
          window.location.href = "/dashboard";
        } else {
          console.error("Demo Login failed:", data.error);
        }
      })
      .catch((error) => {
        console.error("Demo login request failed:", error);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loginSubmit(e);
    }
  };

  // Handle form reset
  const resetForm = (e) => {
    e.preventDefault();
    setFieldslogin({});
    setErrorslogin({});
  };

  // Handle form validation
  const handleValidationLogin = () => {
    let errors = {};
    let formIsValid = true;

    if (!fieldslogin["username"]) {
      formIsValid = false;
      errors["username"] = "Required";
    }
    if (!fieldslogin["password"]) {
      formIsValid = false;
      errors["password"] = "Required";
    }

    setErrorslogin(errors);
    return formIsValid;
  };

  // Show password
  const show = () => {
    setShowMe(true);
    setPasstype("text");
  };

  // Hide password
  const hide = () => {
    setShowMe(false);
    setPasstype("password");
  };

  return (
    <div className="bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] relative h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            {settings?.domainName == "ons3"  ?  <img src={settings.logo} alt='logo' className="lg:w-[228px] w-[180px]" />  : <img src={settings.logo} alt='logo' className="lg:w-[228px] w-[250px]" />}
          </div>
          <div className="justify-between items-start w-[350px] mx-auto bg-[#ffffff] rounded px-4 py-4">
            <div className="flex justify-center items-center text-[24px] pb-2 space-x-[3px]">
              <span className="text-[var(--primary)] font-[400]">LOGIN</span>
              <FaHandPointDown className="text-[var(--primary)]" />
            </div>
            <div className="w-full mb-5">
              <div className=" w-full flex  border rounded justify-between items-center border-[#CED4DA]  focus:outline outline-blue-600">

                <input
                  type="text"
                  name="username"
                  id="username"
                  value={fieldslogin.username || ""}
                  className="w-full text-[#495057] py-[5px] h-[38px] placeholder:uppercase focus:outline-none px-[15px] text-base bg-white placeholder:text-[#495057]/70"
                  placeholder="Username"
                  onChange={inputChange}
                  onKeyPress={handleKeyPress}
                />
                <div className="flex-1 w-full h-full px-3 py-[9px]">
                  <FaUserAlt className="text-black   " />
                </div>
              </div>
              {errorslogin?.username && (
                <span className={`text-[#dc3545] px-1 text-[12px] w-full lg:w-3/4 ${errorslogin?.username ? "opacity-100" : "opacity-0"}`}>
                  {errorslogin?.username || "Placeholder"}
                </span>
              )}
              {/* {errorslogin.username && (
                <div className="text-red-500  text-left text-sm">
                  {errorslogin["username"]}
                </div>
              )} */}
            </div>
            <div className="w-full mb-5">
              <div className=" w-full flex justify-between rounded  items-center border border-[#CED4DA]  ">
                <input
                  type={passtype}
                  name="password"
                  id="password"
                  value={fieldslogin.password || ""}
                  className="w-full text-[#495057] py-[5px] placeholder:uppercase h-[38px] focus:outline-none px-[15px] text-base bg-white placeholder:text-[#495057]/70"
                  placeholder="Password"
                  onChange={inputChange}
                  onKeyPress={handleKeyPress}
                />
                <div className="flex-1  w-full h-full px-3 py-[9px]">
                  <FaKey onClick={showMe ? hide : show} className="text-black" />
                </div>
              </div>
              {/* <div className="flex items-start">
                <span className={`px-1 text-[#dc3545] text-[12px] w-full lg:w-3/4 ${errorslogin?.password ? "opacity-100" : "opacity-0"}`}>
                  {errorslogin?.password || "Placeholder"}
                </span>
              </div> */}
              {errorslogin.password && (
                <div className="text-red-500 text-left text-sm">
                  {errorslogin["password"]}
                </div>
              )}
            </div>
            <div className="mb-2 space-y-8">
              <button
                type="submit"
                disabled={login_loading}
                onClick={loginSubmit}
                className={`flex justify-between items-center mt-[2px] h-[44px] rounded-[0.25rem] ${login_loading ? "bg-gray-400 text-black" : "bg-green-800"} hover:text-white text-white font-normal transition text-base w-full px-3`}
              >
                <span className="px-3 w-full"></span>
                <span className="tracking-wide w-full"> Login</span>
                <span className="flex justify-end tracking-wide w-full">
                  {login_loading ? (
                    <span className="loginloaderbetPlace"></span>
                  ) : (
                    <FaSignInAlt />
                  )}
                </span>
              </button>
              <button
                type="button"
                disabled={login_loading}
                onClick={handleDemoLogin}
                className={` items-center mt-[8px]  h-[44px]  rounded-[0.25rem] ${login_loading ? "bg-gray-400 text-black" : "bg-[var(--primary)]"}  hover:text-white text-white font-normal  text-base w-full px-3`}
              >
                <div className="grid grid-cols-[1.5fr_auto]">
                  <div className="tracking-wide flex justify-center transition items-center w-full  text-center "> Demo Login</div>
                  <div className="flex items-center justify-end tracking-wide w-full">
                    <FaSignInAlt />
                  </div>
                </div>
              </button>
            </div>
            <div className="w-full text-xs text-start pt-[8px] py-2 font-[400] leading-[14px] uppercase">
            <span className="text-red-700 font-bold">Note-</span>  This Website is not for Indian Territory
             <div className="text-center w-full text-red-700 font-bold">18+ Only</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;