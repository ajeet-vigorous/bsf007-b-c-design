import moment from "moment";
// import { sportlistArray } from "../../pages/dashboard/Dashboard";


/* eslint-disable react/prop-types */
function LiveMatches({ matchList }) {

    const handleResponseGameotherDetails = (data) => {
        window.location.href = `/sport-view/${data.marketId}/${data.eventId}`
    };

    return (
        <>
            <div className="flex gap-2 mx-auto w-[100%] p-1.5 animate-[marquee_20s_linear_infinite]">
                {matchList?.filter(element => element.sportId === 4)?.map((element, index) => {
                    const inputMoment = moment(element?.matchDate, "DD-MM-YYYY HH:mm:ss A");
                    const currentMoment = moment().add(60, "minutes");
                    return currentMoment.isSameOrAfter(inputMoment) ? (
                        <div onClick={() => { handleResponseGameotherDetails(element) }} key={index} className="w-auto flex justify-center items-center font-bold bg-[#900] text-white rounded-[8px] py-1 px-2">
                            {/* <div className="blinking-text">{sportlistArray?.find((sport) => sport.sportId === element?.sportId)?.icon}</div>    */}
                            <div className="text-xs whitespace-nowrap">{element?.matchName} </div>

                        </div>
                    ) : null;
                })}
            </div>
        </>
    )
}

export default LiveMatches;