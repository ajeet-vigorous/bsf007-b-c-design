import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CasinoList from "../../component/dashboard/CasinoList.json";
import { FaSearch } from "react-icons/fa";

const AllGamesCasino = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name") || "all";
  const gameName = searchParams.get("gameName") || "all";


  const [searchText, setSearchText] = useState("");

const normalizeKey = (key) => {
  return key
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
};

 

  const handleLabel1 = (tableKey) => {
    const resolvedGame =
      tableKey === "all"
        ? Object.keys(CasinoList.allTables)[0]
        : "all";
    navigate(`/casino/?name=${tableKey}&gameName=${resolvedGame}`);
  };

  const handleLabel2 = (tableKey) => {
    navigate(`/casino/?name=${name}&gameName=${tableKey}`);
  };

  const resolvedNameKey = Object.keys(CasinoList.tables).find(
  (key) => normalizeKey(key) === normalizeKey(name)
);


  /* ---------------- LEVEL 2 KEYS ---------------- */

  const level2Keys =
  name === "all"
    ? Object.keys(CasinoList.allTables)
    : ["all", ...Object.keys(CasinoList.tables?.[resolvedNameKey] || {})];


  /* ---------------- GAMES DATA ---------------- */

  const allCategoryGames =
  name !== "all" && gameName === "all"
    ? Object.values(CasinoList.tables?.[resolvedNameKey] || {}).flat()
    : [];


const gamesToShow =
  name === "all"
    ? CasinoList.allTables?.[gameName] || []
    : gameName === "all"
    ? allCategoryGames
    : CasinoList.tables?.[resolvedNameKey]?.[gameName] || [];

const searchedGames = gamesToShow.filter((game) =>
  normalizeKey(game?.name).includes(normalizeKey(searchText))
);
  const finalGamesToShow = searchText ? searchedGames : gamesToShow;
 const matchlistLocal = localStorage.getItem("matchList")
    ? JSON.parse(localStorage.getItem("matchList"))
    : nul

  return (
    <div className="w-full h-full">
      
      <div className="md:p-2 p-1 bg-[var(--primary)] my-1 text-white flex justify-between">
        <div className="flex gap-1 items-center">
          <img src="/images/zetto/slotscolor.png" className="w-5 h-5" />
          <p>CASINO</p>
        </div>
        <div className="flex">
          <input
  placeholder="Search Game..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  className="p-1 text-black"
/>

          <div className="bg-[#BB1919] p-2 px-3 flex items-center">
            <FaSearch />
          </div>
        </div>
      </div>

      <div className="flex my-1 overflow-x-auto ">
                {["all", ...Object.keys(CasinoList.tables)].map((key) => (
  <button
    key={key}
    onClick={() => handleLabel1(key)}
    className={`px-4 py-1  text-nowrap uppercase border-r
      ${normalizeKey(name) === normalizeKey(key)
        ? "bg-[var(--primary)] text-white"
        : "bg-[#cccccc] text-black"}`}
  >
    {key}
  </button>
))}

            </div>

       <div className="flex overflow-x-auto ">
                      {level2Keys.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleLabel2(key)}
                            className={`gap-2 px-2 py-0.5 text-nowrap border-r border-[var(--primary)] 
                            ${normalizeKey(gameName) === normalizeKey(key)
                                    ? "bg-[var(--primary)] text-white"
                                    : " text-black bg-[#cccccc]"}`}
                        >
                            <img
                                src={`/int_tab_icons/${normalizeKey(key)}.png`}
                                alt={key}
                                loading="lazy"     
                                className={`w-[25px] flex mx-auto 
          ${normalizeKey(gameName) === normalizeKey(key) ? "filter brightness-0 invert" : ""}`}
                            />
                            <span className="uppercase px-2 text-xs">
                                {key} 
                            </span>
                        </button>
                    ))}
                </div>
         <div className="grid grid-cols-3 md:grid-cols-6 py-2 gap-1">
        {finalGamesToShow?.map((game, idx) => (
          <div key={idx} className="cursor-pointer">
            <img
              src={game?.url_thumb}
              alt={game?.name}
              className="w-full md:h-[150px] h-[90px]"
              onClick={() => window.location.href = `/iframe-casino/${game.id}`}
            />
            <p className="text-white bg-gradient-to-b from-[var(--primary)] to-[#00FFE6] text-center md:text-xs text-[9px] font-bold py-2 md:py-0.5 truncate">
              {game?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGamesCasino;
