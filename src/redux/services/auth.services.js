import { domainName } from "../../config/Auth";
import { apiCall } from "../../config/HTTP";

async function login(data) {
  try {
    const user = await apiCall("POST", "user/login", data);
    if (user) {
      localStorage.setItem('clientspuser', JSON.stringify(user));
      localStorage.setItem(`user_info_${domainName}`, JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(user?.token))
      localStorage.setItem("clientBalance", JSON.stringify(user?.data?.balance));
      localStorage.setItem("clientbetChipsData", JSON.stringify(user?.data?.betChipsData));
      localStorage.setItem('oneBetAmount', JSON.stringify(user.data.oneClickBetAmount ? user.data.oneClickBetAmount : 0));
      localStorage.setItem('oneClickStatus', JSON.stringify(false));
      localStorage.setItem('betSlipData', JSON.stringify([100, 200, 300]));
      localStorage.setItem('dashboardModalOpen', true);
      return { userinfo: user };
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}

async function updatePassword(data) {
  try {
    const user = await apiCall("PATCH", "user/updateUserPassword", data);
    return user
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
}

function logout() {
  localStorage.clear();
  window.location.href("/login")
}


export const authServices = {
  login,
  logout,
  updatePassword,
};