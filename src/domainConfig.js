const designData = JSON.parse(localStorage.getItem("designData"))?.designType || { designType: "" };


const bsf007Settings = {
  title: "BSF007 | India’s Most Trusted Online Cricket Betting Id Provider",
  favicon: "/logo/BSF007.png",
  logo: "/logo/BSF007.png",
  footerHome: "/images/zetto/home_icon1.png",
  logo1: "/logo/silver-reddyBook.png",
  SOCKET_URL: "https://api.bsf007.in",
  Lagai: designData?.back,
  Khaai: designData?.lay,
  isCashout: false,
  apiurl: 'https://api.bsf007.in/v1/',
  domainName: "bsf007",
  colors: {
    "--primary": "#001F3F",
    "--secondary": "#fff",
    "--white": "#fff",
    "--black": "#000",
    "--darkcolor": "#343435",
    "--darkred": "#8b0000",
    "--backgroundmain": "#dfe8e9",
    "--matchLagai": "#8DD9FF",
    "--matchKhai": "#FF94BC",
    "--result-color": "#355e3b",
    "--rule-bg": '#CCCCCC',
    "--sports-tab": '#266894',
    "--suspended-color": 'rgba(0,0,0,0.7)',
    "--blink-color": "#fdcf13",
    "--success-color": "#086f3f"
  },
  demoCredentials: {
    username: "demo",
    password: "1122",
    isClient: true,
    isDemoClient: true,
    host: window.location.host,
  }


};

const domainSettings = {
  "bsf007.in": bsf007Settings,
  "localhost:3000": bsf007Settings,

};


const currentDomain = window.location.host;
const settings = domainSettings[currentDomain] || domainSettings["localhost:3000"];
export default settings;


