import React, { useState } from 'react';
import { updatePassword } from '../../redux/reducers/auth.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import MobileFooter from '../mobileFooter/MobileFooter';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { updatePassword_loading } = useSelector((state) => state.authUser);

    const [fieldslogin, setFieldsLogin] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    const [errorslogin, setErrorsLogin] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFieldsLogin((prev) => ({ ...prev, [name]: value }));
        if (!touched[name]) {
            setTouched((prev) => ({ ...prev, [name]: true }));
        }
        handleValidation({ ...fieldslogin, [name]: value });
    };

    const handleValidation = (values = fieldslogin) => {
        const password = values.password || '';
        const confirmPassword = values.confirmPassword || '';
        const errors = {};

        const hasMinLength = password.length >= 6 && password.length <= 18;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const passwordsMatch = password === confirmPassword;

        if (!values.oldPassword) {
            errors.oldPassword = 'Old password is required';
        }

        // if (!hasMinLength || !hasSpecialChar || !hasUppercase) {
        //     if (touched.password) {
        //         errors.password = 'Password must meet all rules';
        //     }
        // }

        if (touched.confirmPassword && !passwordsMatch) {
            errors.confirmPassword = 'Confirm Password and New Password should be same';
        }

        setErrorsLogin(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (handleValidation()) {
            const data = {
                oldPassword: fieldslogin.oldPassword,
                password: fieldslogin.password,
                confirmPassword: fieldslogin.confirmPassword,
            };

            dispatch(updatePassword(data)).then((req) => {
                if (req.meta.requestStatus === 'fulfilled') {
                    message.success(req?.payload?.message);
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    message.error(req?.payload?.message || 'Password update failed.');
                }
            });
        }
    };

    const { password, confirmPassword } = fieldslogin;
    const hasMinLength = password.length >= 6 && password.length <= 18;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const passwordsMatch = password === confirmPassword;

    const isFormValid =
        fieldslogin.oldPassword &&
        hasMinLength &&
        hasSpecialChar &&
        hasUppercase &&
        passwordsMatch;

    const getInputType = (field) => (showPassword[field] ? 'text' : 'password');

    const getIcon = (field) =>
        showPassword[field] ? (
            <AiFillEyeInvisible
                className=" right-[15px]  text-xl cursor-pointer"
                onClick={() => toggleVisibility(field)}
            />
        ) : (
            <AiFillEye
                className=" right-[15px] text-xl cursor-pointer"
                onClick={() => toggleVisibility(field)}
            />
        );

    return (
        <div className='bg-white'>
            <div className="bg-[--secondary] h-[31px] px-3 flex rounded-t-[5px] items-center justify-start font-semibold">
                Change Password
            </div>

            <div className="w-full h-screen">
                <div className="w-full lg:px-3 bg-white border-black">
                    <div className="w-full py-4 md:w-[450px] mx-auto">
                        <div className="flex justify-center my-8">
                            <img className="w-[51px] h-[51px]" src="/images/zetto/key.png" alt="key" />
                        </div>

                        {/* Old Password */}
                        <div className="mb-3 relative">
                                                        <div className='flex h-[41px] w-full items-center  rounded-[5px] text-[14px] border'>
                            <input
                                type={getInputType('old')}
                                name="oldPassword"
                                placeholder="Old Password"
                                value={fieldslogin.oldPassword}
                                onChange={handleChange}
                                className={`w-full py-1.5 px-3  ${
                                    errorslogin.oldPassword ? 'border-red-500' : 'border-black'
                                } bg-white text-gray-700 focus:outline-none`}
                            />
                            <div className='px-2'>{getIcon('old')}</div>

                            </div>
                            <div className="mt-1 text-red-500 text-xs">{errorslogin.oldPassword}</div>
                        </div>

                        {/* New Password */}
                        <div className="mb-3 relative">
                            <div className='flex h-[41px] w-full items-center  rounded-[5px] text-[14px] border'>
                            <input
                                type={getInputType('new')}
                                name="password"
                                placeholder="New Password"
                                value={fieldslogin.password}
                                onChange={handleChange}
                                className={`w-full py-1.5 px-3  ${
                                    errorslogin.password ? 'border-red-500' : 'border-black'
                                } bg-white text-gray-700 focus:outline-none`}
                            />
                            <div className='px-2'>{getIcon('new')}</div>
                            </div>
                            <div className="mt-1 text-red-500 text-xs">{errorslogin.password}</div>

                            {/* Password Rules */}
                            {touched.password && (
                                <div className="mt-2 ml-1 text-sm">
                                    <p className={`${hasMinLength ? 'text-green-600' : 'text-red-500'}`}>
                                        • 6–18 characters (a-z, 0–9)
                                    </p>
                                    <p className={`${hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                                        • Add one special character
                                    </p>
                                    <p className={`${hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                                        • One Uppercase
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3 relative">
                            
                            <div className='flex h-[41px] w-full items-center  rounded-[5px] text-[14px] border'>
                            <input
                                type={getInputType('confirm')}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={fieldslogin.confirmPassword}
                                onChange={handleChange}
                                className={`w-full py-1.5 px-3  ${
                                    errorslogin.confirmPassword ? 'border-red-500' : 'border-black'
                                } bg-white text-gray-700 focus:outline-none`}
                            />
                             <div className='px-2'>{getIcon('confirm')}</div>
                             </div>
                            <div className="mt-1 text-red-500 text-xs">{errorslogin.confirmPassword}</div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                disabled={!isFormValid || updatePassword_loading}
                                onClick={handleSubmit}
                                className={`px-3 py-1.5 font-bold text-base border uppercase rounded-md h-[41px] w-full mt-1 flex items-center justify-center gap-2 transition-colors duration-150 ${
                                    isFormValid
                                        ? 'bg-[var(--secondary)] text-[var(--primary)] font-bold   hover:bg-white hover:text-black hover:border-[var(--secondary)]'
                                        : 'border text-gray-400 font-black text-base cursor-not-allowed'
                                }`}
                            >
                                {updatePassword_loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             <MobileFooter />
                    <div className='w-full max-lg:pb-16'>
                    
                        </div>
        </div>
    );
};

export default ChangePassword;
