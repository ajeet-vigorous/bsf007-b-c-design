import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import InplayMatches from '../../component/dashboard/InplayMatches';

const InPlayMatch = () => {
  const { gameId } = useParams();
  const { sportMatchList } = useSelector((state) => state.sport);
  const [matchData, setMatchData] = useState([]);

  const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : null;


  // useEffect(() => {
  //   let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;
  //   setMatchData(matchListData);
  // }, [sportMatchList]);
  useEffect(() => {
  // Choose source data
  let matchListData = matchlistLocal ? matchlistLocal : sportMatchList;

  // Filter for sportId 4
  const filteredData = matchListData?.filter(match => match.sportId === 4);

  // Set the filtered data
  setMatchData(filteredData);
}, [sportMatchList]); // include matchlistLocal if it can change


  const sportOptions = [
    { id: 4, label: "Cricket" },
    { id: 1, label: "Football" },
    { id: 2, label: "Tennis" },
    { id: 7, label: "Horse Racing" },
    { id: 999, label: "Politics" },
    { id: 4339, label: "Greyhound Racing" }
  ];
const sportName = sportOptions.find((sport) => sport.id == gameId)?.label || "Sport";


  return (
    <div>
      <InplayMatches activeTab={gameId} matchlistItems={matchData} sportName={sportName} />
    </div>
  )
}

export default InPlayMatch;