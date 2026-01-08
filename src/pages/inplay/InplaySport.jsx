import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { MdHowToVote, MdOutlineSportsEsports, MdSportsCricket } from "react-icons/md";
import { IoFootballSharp, IoTennisball } from "react-icons/io5";
import { FaFootballBall, FaHorseHead } from 'react-icons/fa';
import { IoIosColorWand } from 'react-icons/io';
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import LiveMatches from "../../component/dashboard/LiveMatches";
import TopHeader from "../../component/dashboard/TopHeader";
import InplayMatches from "../../component/dashboard/InplayMatches";
import PopularGame from "../../component/dashboard/groupCasino/PopularGame";
import LiveCasino from "../../component/dashboard/groupCasino/LiveGames";
import useGroupCasinoList from "../../component/IntGroupCasinoList/IntGroupCasinoList";
import MarqueeNotification from "../../component/marquee/MarqueeNotification";
import Trending from "../../component/dashboard/groupCasino/Trending";
import Providers from "../../component/dashboard/Providers";
import DashboardInplay from "../../component/dashboard/DashboardInplay";
import DashboardUpcoming from "../../component/dashboard/DashboardUpcoming";


export const sportlistArray = [
  {
    sportId: 4,
    sportName: "Cricket",
    icon: <MdSportsCricket />
  },
  {
    sportId: 1,
    sportName: "Football",
    icon: <IoFootballSharp />
  },
  {
    sportId: 2,
    sportName: "Tennis",
    icon: <IoTennisball />
  },
  {
    sportId: 999,
    sportName: "Election",
    icon: <MdHowToVote />
  },

]

export const AllSportsArray = [
  {
    sportName: "Cricket",
    sportId: 4,
    icons: <FaFootballBall />
  },
  {
    sportName: "Football",
    sportId: 1,
    icons: <FaFootballBall />
  },
  {
    sportName: "Tennis",
    sportId: 2,
    icons: <FaTableTennisPaddleBall />
  },
  {
    sportName: "Esoccer",
    sportId: 46,
    icons: <MdOutlineSportsEsports />
  },
  {
    sportName: "Horse Racing",
    sportId: 7,
    icons: <FaHorseHead />
  },
  {
    sportName: "Greyhound Racing",
    sportId: 4339,
    icons: <FaHorseHead />
  },
  {
    sportName: "Table Tennis",
    sportId: 76544645,
    icons: <FaTableTennisPaddleBall />
  },
  {
    sportName: "Basketball",
    sportId: 6746546548,
    icons: <FaFootballBall />
  },
  {
    sportName: "Boxing",
    sportId: 974556455,
    icons: <FaFootballBall />
  },
  {
    sportName: "Mixed Martial Arts",
    sportId: 145450,
    icons: <FaFootballBall />
  },
  {
    sportName: "American Football",
    sportId: 15675651,
    icons: <FaFootballBall />
  },
  {
    sportName: "Volleyball",
    sportId: 1565672,
    icons: <IoIosColorWand />
  },
  {
    sportName: "Badminton",
    sportId: 156568453,
    icons: <FaFootballBall />
  },
  {
    sportName: "Snooker",
    sportId: 1578554,
    icons: <FaFootballBall />
  },
  {
    sportName: "Ice Hockey",
    sportId: 154585685,
    icons: <FaFootballBall />
  },
  {
    sportName: "E Games",
    sportId: 15656566,
    icons: <FaFootballBall />
  },
  {
    sportName: "Politics",
    sportId: 5656565617,
    icons: <FaFootballBall />
  },
  {
    sportName: "Futsal",
    sportId: 1565656688,
    icons: <FaFootballBall />
  },
  {
    sportName: "Handball",
    sportId: 156546559,
    icons: <FaFootballBall />
  },
  {
    sportName: "Motor Sports",
    sportId: 2055656767,
    icons: <FaFootballBall />
  },
  {
    sportName: "Kabaddi",
    sportId: 75677686721,
    icons: <FaFootballBall />
  }
];


const InplaySport = ({ }) => {

  const { sportMatchList } = useSelector((state) => state.sport);
  const [activeAllSporttab, setactiveAllSporttab] = useState(localStorage.getItem('dashboardActiveTabKey') || '1');
  const groupCasinoList = useGroupCasinoList();


  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : [];

  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;
    setMatchData(matchListData);
  }, [sportMatchList]);

  const sportsList = [
    { id: '4', name: 'Cricket' },
    { id: '1', name: 'Soccer' },
    { id: '2', name: 'Tennis' },
  ];



  return (
    <>
      <div className="h-full overflow-y-auto ">
        <div className="lg:block hidden ">
          <MarqueeNotification />
        </div>

        <div className="space-y-0">
          <DashboardInplay
            activeTab="4"
            matchlistItems={matchData}
            sportName="Cricket"
          />

          <DashboardInplay
            activeTab="1"
            matchlistItems={matchData}
            sportName="Soccer"
          />

          <DashboardInplay
            activeTab="2"
            matchlistItems={matchData}
            sportName="Tennis"
          />
        </div>
        <Providers filterSection={"providers"} name={"Casino Provider"} providersData={groupCasinoList?.providerList} />
      </div>
    </>
  )
}

export default React.memo(InplaySport);