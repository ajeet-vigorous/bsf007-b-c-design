
import { apiCall } from "../../config/HTTP";

async function casinoBetPlaceFunc(data) {
  try {
    const user = await apiCall("POST", "casino/casinoBetPlace", data);

  return user
  } catch (error) {
    console.error("Casino Bet Place error:", error);
    return Promise.reject(error);
  }
}


async function intCasinoCateogeoryWiseList(data) {
  try {
    const response = await apiCall("POST", "website/getCateogeory", data);
    if(response){
      localStorage.setItem("intCasinoList", JSON.stringify(response?.data));
    }
  return response
  } catch (error) {
    console.error("Casino Bet Place error:", error);
    return Promise.reject(error);
  }
}



async function intGrupCsnoList(data) {
  try {
    const response = await apiCall("POST", "website/getInternationalGroupCasinoList", data);

  return response
  } catch (error) {
    console.error("Casino Bet Place error:", error);
    return Promise.reject(error);
  }
}

async function getCasinoLoginUrl(data) {
  try {
    const response = await apiCall("POST", "user/casinoLoginUrl", data);
    return response;
  } catch (error) {
    console.error("Casino Login error:", error);
    return Promise.reject(error);
  }
}



export const casinoServices = {
  casinoBetPlaceFunc,
  intCasinoCateogeoryWiseList,
  intGrupCsnoList,
  getCasinoLoginUrl

};