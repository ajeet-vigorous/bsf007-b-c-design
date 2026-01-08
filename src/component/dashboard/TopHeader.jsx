/* eslint-disable react/prop-types */
import AllSports from "./AllSports"
import LiveMatches from "./LiveMatches"
import Slots from "./Slots"

function TopHeader({matchList , activeAllSporttab , setactiveAllSporttab}) {
  
    return (
        <div className="bg-[var(--primary)] xl:bg-transparent">
          {/* <LiveMatches matchList={matchList} /> */}
          {/* <Slots /> */}
          <AllSports activeAllSporttab={activeAllSporttab} setactiveAllSporttab={setactiveAllSporttab} />
        </div>
    )
}

export default TopHeader
