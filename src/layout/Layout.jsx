
import AppSidebar from '../component/layout/AppSidebar'
import AppHeader from '../component/layout/AppHeader'
import AppContent from '../component/layout/AppContent'
import { useEffect, useState } from 'react'
import MarqueeNotification from '../component/marquee/MarqueeNotification'
import AppRightSIdebar from '../component/layout/AppRightSidebar'
import AppFooter from '../component/layout/AppFooter'
import { useLocation } from 'react-router-dom';
import AppSidebarMobile from '../component/layout/AppSidebarMobile'
import ChatPopUp from '../component/ChatPopUp/ChatPopUp'




const Layout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;

  // ✨ Add routes where you don't want the condition to apply
  const excludedRoutes = ["/login", "/register"]; // add your 2 routes here

  // Check if the current route is excluded
const isExcluded = excludedRoutes.includes(location.pathname);


    const handleToggle = () => {
        document.body.classList.toggle("StakeModalOpen");
    };
    useEffect(() => {
        const checkSidebarStatus = () => {
            // setIsStakeModalOpen(document.body.classList.contains("StakeModalOpen"));
        };
        checkSidebarStatus();
        const observer = new MutationObserver(checkSidebarStatus);
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);
    const hideSidebarRoutes = ['/responsible-gambling','/sport-view', "/login", "/sport-view-racing", '/deposit', "/wallet", "/all-casino", "/term-condition", "/promotions", "/casino-list-by-providername", "/privacy-policy", "/rules", "/about-us", "/contact-us", "/why-choose-us", '/iframe-', '/casino'];
    const shouldHideSidebars = hideSidebarRoutes.some(route => currentPath.startsWith(route));


    const hideLeftSidebarRoutes = ['/responsible-gambling','/deposit', "/login", "/wallet", "/all-casino", "/term-condition", "/promotions", "/casino-list-by-providername", "/privacy-policy", "/rules", "/about-us", "/contact-us","/why-choose-us", '/iframe-', '/casino'];
    const shouldHideLeftSidebars = hideLeftSidebarRoutes.some(route => currentPath.startsWith(route));

const hideFooterRoutes = ["/login", '/iframe-'];
    const shouldHideFooter = hideFooterRoutes.some(route => currentPath.startsWith(route));


    return (
        <>
        
            {/* <ChatPopUp/> */}
           
            <section className="w-full flex flex-col overflowhidden relative bg-gray-200">
                <div className="shrink-0 z-10 lg:bg-white bg-black fixed top-0 w-full left-0">
                    <div className="">
                        <AppHeader setSidebarOpen={setIsSidebarOpen} />
                    </div>
                    <div><MarqueeNotification /></div>
                </div>

                <div className="md:flex flex-1  max-md:overflow-auto relative">
                    {!shouldHideLeftSidebars && (<div className={`bg-gray-100 ${isSidebarOpen ? 'fixed' : 'hidden'} 
                lg:sticky lg:block hidden max-lg:inset-0 lg:top-[94px]  lg:w-[290px] w-[55%] h-screen lg:h-[calc(100dvh_-_94px)] z-20 lg:z-auto bg-[var(--backgroundmain)] overflow-y-auto scrollbar-hide`}>
                        <AppSidebar
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                    </div>)}

                    <div className={`${isSidebarOpen ? 'fixed' : 'hidden'} 
                lg:relative lg:hidden block inset-0 lg:inset-auto  lg:w-[290px] w-[65%] h-screen lg:h-auto z-20 lg:z-auto bg-[var(--backgroundmain)] overflow-y-auto scrollbar-hide`}>
                        <AppSidebarMobile
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                    </div>

                    <div className={`flex-1 h-full lg:h-auto w-full  
  ${
    (currentPath.startsWith("/sport-view") || currentPath.startsWith("/sport-view-racing"))
      ? "w-full"
      : shouldHideSidebars && shouldHideLeftSidebars
      ? "w-full"
      : "lg:max-w-[calc(100dvw_-_658px)]"
  }
  ${isSidebarOpen ? 'lg:ml-[0px] fixed inset-0 lg:static' : ''}`}>

                        <div className="p-1 h-full overflow-auto">
                            <AppContent />
                        </div>
                    </div>
                    {!shouldHideSidebars && (
                        <div className={`lg:sticky lg:top-[94px] lg:block inset-0 lg:inset-auto pb-1 lg:w-[350px] w-[55%] h-screen lg:lg:h-[calc(100dvh_-_94px)] z-20 lg:z-auto overflow-y-auto hidden  scrollbar-hide`}>
                            <AppRightSIdebar />
                        </div>)}

                    {/* {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )} */}
                </div>

            </section>

            {!shouldHideFooter && <div className='w-full max-lg:pb-16'>
                <AppFooter />
            </div>}
            {/* <div className='fixed bottom-[50px] right-[25px] cursor-pointer w-[71px] h-[71px] bg-white rounded-full flex items-center justify-center'>
                <img className='!w-[40px] !h-[40px]' src="/images/zetto/chat.png" alt="" srcset="" />
            </div> */}
        </>
    )
}

export default Layout;