/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { getSportMatchList } from "../../redux/reducers/sport_reducer";
import { AllSportsArray } from "../../pages/dashboard/Dashboard";

function AllSports({ activeAllSporttab, setactiveAllSporttab }) {

    const tabRefs = useRef([]);
    const dispatch = useDispatch();
    const handleTabClick = (element, index) => {
        // dispatch(getSportMatchList({_id:element?.sportId}))
        localStorage.setItem('dashboardActiveTabKey',element?.sportId)
        setactiveAllSporttab(element?.sportId);
        tabRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest", 
        });
    };

    return (
        <>
            <div className="hidden xl:flex divide-x bg-sidebar-menu-link-border divide-[var(--secondary)] overflow-auto">
                {AllSportsArray?.map((element, index) => (
                    <div
                        key={index}
                        onClick={() => handleTabClick(element, index)}
                        className={`cursor-pointer ${activeAllSporttab == element?.sportId ? "bg-[var(--secondary)] text-white" : "bg-[#CCCCCC]"} px-4 py-1 mb-1 text-nowrap`}
                        ref={(el) => (tabRefs.current[index] = el)} // Assign ref to the tab
                    >
                        {element.sportName}
                    </div>
                ))}
            </div>
            <div className="xl:hidden flex text-sm font-bold bg-[var(--secondary)] overflow-auto">
                {AllSportsArray?.map((element, index) => (
                    <div
                        key={index}
                        onClick={() => handleTabClick(element, index)}
                        className={`${activeAllSporttab == element?.sportId ? "bg-[var(--primary)] " : ""} text-white flex flex-col py-2 justify-center items-center px-5 text-nowrap`}
                        ref={(el) => (tabRefs.current[index] = el)} 
                    >
                        {element.icons}
                        {element.sportName}
                    </div>
                ))}
            </div>
        </>

    );
}

export default AllSports;
