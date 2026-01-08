import { apiCall } from "../../config/HTTP";

async function getUserStatement(data) {
  try {
    const response = await apiCall("POST", "user/userStatement", data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error("user Statement List", error);
    return Promise.reject(error);
  }
}

async function getUserBalance(data) {
  try {
    const user = await apiCall("POST", "user/userBalance", data);

    if (user) {
      localStorage.setItem('clientBalance', JSON.stringify(user.data.coins));
      localStorage.setItem('clientExposure', JSON.stringify(user.data.exposure));
      localStorage.setItem('clientProfitLoss', JSON.stringify(user.data.profitLoss));
      return user;
    }
  } catch (error) {
    console.error("Domain setting error:", error);
    return Promise.reject(error);
  }
}

async function userUpdate(data) {
  try {
    const user = await apiCall("PATCH", "user/userUpdate", data);

    if (user) {
      return user;
    }
  } catch (error) {
    console.error("user Update error:", error);
    return Promise.reject(error);
  }
}
async function getBetList(data) {
  try {
    const casinoListByCateogeory = await apiCall("POST", "sports/betsList", data);
    if (casinoListByCateogeory) {
      return casinoListByCateogeory;
    }
  } catch (error) {
    console.error("user Update error:", error);
    return Promise.reject(error);
  }
}

async function getCasinoListByCateogeory(data) {
  try {
    const casinoListByCateogeory = await apiCall("POST", "website/getCasinoListByCateogeory", data);
    if (casinoListByCateogeory) {
      return casinoListByCateogeory;
    }
  } catch (error) {
    console.error("user Update error:", error);
    return Promise.reject(error);
  }
}

async function getMatchList(data) {
  try {
    const user = await apiCall("POST", "sports/matchList", data);
    if (user) {
      const matchList = user?.data && Object.keys(user?.data).length > 0 ? user?.data : [];
      localStorage.setItem("matchList", JSON.stringify(matchList));
      return user;
    }
  } catch (error) {
    console.error("MatchList error:", error);
    return Promise.reject(error);
  }
}

async function getDomainSettingData(data) {
  try {
    const user = await apiCall("POST", "website/domainSettingByDomainName", data);

    if (user) {
      // localStorage.setItem('clientdomainSetting', JSON.stringify(user.data));
      return user;
    }
  } catch (error) {
    console.error("Domain setting error:", error);
    return Promise.reject(error);
  }
}

async function getCasinoListByProviderName(data) {
  try {
    const casinoGroupData = await apiCall("POST", "website/getCasinoListByProviderName", data);
    if (casinoGroupData) {
      return casinoGroupData;
    }
  } catch (error) {
    console.error("user Update error:", error);
    return Promise.reject(error);
  }
}

async function getInternationalGroupCasinoList(data) {
  try {
    const cosinoGroupList = await apiCall("POST", "website/getInternationalGroupCasinoList", data);
    if (cosinoGroupList) {
      localStorage.setItem("cosinoGroupList", JSON.stringify(cosinoGroupList.data));
      return cosinoGroupList;
    }
  } catch (error) {
    console.error("user Update error:", error);
    return Promise.reject(error);
  }
}

async function getUserLedger(data) {
  try {
    const user = await apiCall("POST", "reports/profitLossForAllExch", data);

    if (user) {

      localStorage.setItem('clientBalance', JSON.stringify(user.data.coins));
      localStorage.setItem('clientExposure', JSON.stringify(user.data.exposure));
      localStorage.setItem('clientProfitLoss', JSON.stringify(user.data.profitLoss));
      return user;
    }
  } catch (error) {
    console.error("Domain setting error:", error);
    return Promise.reject(error);
  }
}

async function getCateogeory(data) {
  try {
    const user = await apiCall("POST", "website/getCateogeory", data);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getUserLedger1(data) {
  try {
    const response = await apiCall("POST", "user/userLedger", data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getCompleteLedgerDetails(data) {
  try {
    const response = await apiCall("POST", "user/completeLedgerDetails", data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}


async function getCasinoDiamondCasinoReportByUser(data) {
  try {
    const response = await apiCall("POST", "casino/diamondCasinoReportByUser", data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}


async function getDiamondBetsListSaga(data) {
  try {
    const response = await apiCall("POST", "casino/diamondBetsList", data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}


async function getCasinoTransactionReportSaga(data) {
  try {
    const response = await apiCall("POST", "reports/casinoTransactionReport", data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}






export const userServices = {
  getUserStatement,
  userUpdate,
  getBetList,
  getUserBalance,
  getMatchList,
  getDomainSettingData,
  getCasinoListByCateogeory,
  getInternationalGroupCasinoList,
  getCasinoListByProviderName,
  getUserLedger,
  getCateogeory,
  getUserLedger1,
  getCompleteLedgerDetails,
  getCasinoDiamondCasinoReportByUser,
  getDiamondBetsListSaga,
  getCasinoTransactionReportSaga
}