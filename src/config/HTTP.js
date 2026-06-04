
import axios from "axios";
import { domainName } from "./Auth";
import settings from "../domainConfig";
import CryptoJS from "crypto-js";
import { message } from "antd";



export const baseUrl = {
    BACKEND_URL: settings?.apiurl,
    SOCKET_URL: settings?.SOCKET_URL,

};

export function authHeader() {
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`) || 'null');
    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export const apiCall = async (method, path, payload) => {
    // if (import.meta.env.VITE_SECRET_KEY_DECREPT_FLAG && path !="user/login") {
    //     const encryptedDataee = CryptoJS.AES.encrypt(JSON.stringify(payload), import.meta.env.VITE_SECRET_KEY_DECREPT).toString();
    //      payload = {
    //         data: encryptedDataee,
    //         isEncruption: true
    //     };
    // }
    try {
        const response = await axios({
            method,
            url: baseUrl.BACKEND_URL + path,
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
        });

        if (response && response.data && response.data.dataEncrupt && response.data.dataEncrupt == true) {
            if (response.data) {
                let encruptedData = response.data.data
                const bytes = CryptoJS.AES.decrypt(encruptedData, import.meta.env.VITE_SECRET_KEY
                );
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if (decryptedData && decryptedData != null && decryptedData != "") {
                    response.data.data = JSON.parse(decryptedData)
                }
            }
        }

        return response.data;
    } catch (error) {
        if (Number(error?.response?.data?.code) === 3 || Number(error?.response?.status) === 401) {
            localStorage.clear();
            window.location.href = '/login';
        } else if (error.response) {
            throw error.response;
        } else if (error.request) {
            throw new Error('No response received from the server');
        } else {
            console.error(error, "Error occurred during request setup");
            throw new Error(error.message);
        }
    }
};


async function decryptResponse(response) {
  if (response.data.dataEncrupt && response.data.dataEncrupt == true) {
    if (response.data) {
      let encruptedData = response.data.data
      const bytes = CryptoJS.AES.decrypt(encruptedData, import.meta.env.VITE_SECRET_KEY
      );
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedData && decryptedData != null && decryptedData != "" && decryptedData != undefined) {
        response.data.data = JSON.parse(decryptedData)
      }
    }
  }


  return response.data;
}

export const httpPost = async (url, params, isNotify) => {
  try {
    let headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: authHeader().Authorization,
    };
    const result = await axios({
      method: "POST",
      url: baseUrl.BACKEND_URL + url,
      data: { ...params },
      headers: headers,
    });

    // await invalidToken(result);
    await decryptResponse(result);
    if (result.data) {
      if (result.data.error && isNotify) {
        // error(result.message)
        //alert(result.data.message)
      } else if (isNotify && !result.data.error) {
        // toast.success(result.data.message)
        // alert(result.data.message)
      }
      return result.data;
    } else {
      
      return false;
    }
  } catch (err) {
    // message.error(err?.response?.data?.message)
    
    
    message.error(err?.response?.data?.message);
    // setTimeout(() => message.dismiss(toastId), 1000);
    if (err?.request?.status) {
      invalidHeadres(err.request.status);
    }
    return result
  }
};

export const httpPostFormData = async (url, data, isNotify) => {
  try {
    const result = await axios({
      method: "POST",
      url: baseUrl.BACKEND_URL + url,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  await decryptResponse(result);
    if (result?.data) {
      if (!result.data.error) {
        message.success(result?.data.message);
        return result.data;
      } else {
        message.error(result?.data.message || "Something went wrong.");
        return result;
      }
    } else {
      message.error("No response data received.");
      return result;
    }
  } catch (err) {
    console.error("Error:", err);
    message.error(err?.response?.data?.message || err?.message || "An error occurred");
    if (err?.request?.status) {
      invalidHeadres(err.request.status);
    }

    return null;
  }
};

export const httpPostBet = async (url, params) => {

  try {
    let headers = {
      "Content-Type": "application/json",
      Authorization: authHeader().Authorization,
    };
    const result = await axios({
      method: "POST",
      url: baseUrl.BACKEND_URL + url,
      data: { ...params },
      headers: headers,
    });

    // await invalidToken(result);
    await decryptResponse(result);
    if (result.data) {
      if (result.data.error) {
        // error(result.message)
        //alert(result.data.message)
      } else if (!result.data.error) {
        // toast.success(result.data.message)
        // alert(result.data.message)
      }
      return result.data;
    } else {
      return false;
    }
  } catch (err) {
    // message.error(err?.response?.data?.message)
    message.error(err?.response?.data?.message);
    // setTimeout(() =>  message.dismiss(toastId), 1000);
    if (err.request.status) {
      // invalidHeadres(err.request.status);
    }
  }
};


export const encrypt = (text) => {
  const str = String(text); // Ensure text is a string
  const encrypted = CryptoJS.AES.encrypt(str, import.meta.env.VITE_SECRET_KEY).toString();
  return encodeURIComponent(encrypted); // Encode to make it URL-safe
};

export const decrypt = (encryptedText) => {
  try {
    const decodedText = decodeURIComponent(encryptedText); // Decode the encrypted text
    const bytes = CryptoJS.AES.decrypt(decodedText, import.meta.env.VITE_SECRET_KEY); // Decrypt the text
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string

    if (!decryptedText) {
      throw new Error("Decryption failed or resulted in empty string");
    }

    return decryptedText; // Return the decrypted text
  } catch (error) {
    console.error("Error during decryption:", error.message); // Log the error
    return null; // Gracefully handle errors and return null
  }
};
