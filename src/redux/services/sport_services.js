import { apiCall } from "../../config/HTTP";

async function getSportmatchList(data) {
    try {
        const response = await apiCall("POST", "sports/matchList", data);
        if (response) {
            const matchList = response?.data && Object.keys(response?.data).length > 0 ? response?.data : [];
            localStorage.setItem("matchList", JSON.stringify(matchList));
            return response;
          }
    } catch (error) {
      console.error("Sport Match List", error);
      return Promise.reject(error);
    }
  }


  export const sportServices = {
    getSportmatchList
  }