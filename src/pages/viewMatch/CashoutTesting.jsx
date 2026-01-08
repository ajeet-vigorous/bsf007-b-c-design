// import React, { useEffect, useState } from 'react';

// const CashOutSystem = (props) => {
//   const {
//     marketList,
//     positionObj,
//     handleBackOpen,
//     toggleRowVisibility,
//     marketId,
//     betFor,
//     oddsType,
//   } = props;

//   const [cashoutData, setCashoutData] = useState(null);

//   const calculateCashOut = () => {
//     if (!marketList || marketList.length < 2 || !positionObj) return null;

//     const candidates = [];
//     for (let i = 0; i < marketList.length; i++) {
//       for (let j = 0; j < marketList.length; j++) {
//         if (i === j) continue;

//         const teamI = marketList[i];
//         const teamJ = marketList[j];

//         const P1 = parseFloat(positionObj[teamI.selectionid]) || 0;
//         const P2 = parseFloat(positionObj[teamJ.selectionid]) || 0;

//         const backOdds = parseFloat(teamI.lgaai) || 0;
//         const layOdds = parseFloat(teamI.khaai) || 0;

//         const x_back = backOdds > 0 ? (P2 - P1) / (1 + backOdds) : 0;
//         const x_lay = layOdds > 0 ? (P1 - P2) / (1 + layOdds) : 0;

//         if (x_back > 0) {
//           candidates.push({
//             team: teamI.team_name,
//             type: "back",
//             amount: parseFloat(x_back.toFixed(2)),
//             odds: backOdds,
//             baseTeam: teamI,
//             oppTeam: teamJ,
//           });
//         }

//         if (x_lay > 0) {
//           candidates.push({
//             team: teamI.team_name,
//             type: "lay",
//             amount: parseFloat(x_lay.toFixed(2)),
//             odds: layOdds,
//             baseTeam: teamI,
//             oppTeam: teamJ,
//           });
//         }
//       }
//     }

//     const hedgeBet =
//       candidates.find(c => c.type === "lay") ||
//       candidates.find(c => c.type === "back") ||
//       (candidates.length > 0
//         ? candidates.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev))
//         : null);

//     if (!hedgeBet) return null;

//     const { baseTeam, oppTeam, type, amount, odds } = hedgeBet;

//     const P1 = parseFloat(positionObj[baseTeam.selectionid]) || 0;
//     const P2 = parseFloat(positionObj[oppTeam.selectionid]) || 0;

//     let newP1 = P1;
//     let newP2 = P2;

//     if (type === "back") {
//       newP1 += amount * odds;
//       newP2 -= amount;
//     } else {
//       newP1 -= amount * odds;
//       newP2 += amount;
//     }

//     const cashoutValue = parseFloat(((newP1 + newP2) / 2).toFixed(2));

//     return {
//       cashoutValue,
//       hedgeTeam: baseTeam.team_name,
//       hedgeType: type,
//       hedgeAmount: amount,
//       hedgeOdds: odds,
//       team1Name: baseTeam.team_name,
//       team2Name: oppTeam.team_name,
//       team1PotentialWin: P1,
//       team2PotentialWin: P2,
//       selectionId: baseTeam.selectionid,
//     };
//   };

//   useEffect(() => {
//     const data = calculateCashOut();
//     setCashoutData(data);
//   }, [marketList, positionObj]);

//   if (!cashoutData) return null;

//   return (
//     <button
//       onClick={() => {
//         toggleRowVisibility(cashoutData.selectionId);
//         handleBackOpen({
//           data: marketList.find(t => t.selectionid === cashoutData.selectionId),
//           nameOther: marketList,
//           type: cashoutData.hedgeType === "back" ? "Yes" : "No",
//           odds: cashoutData.hedgeOdds,
//           name: cashoutData.hedgeTeam,
//           betFor: betFor,
//           oddsType: oddsType,
//           betType: cashoutData.hedgeType === "back" ? "L" : "K",
//           selectionId: cashoutData.selectionId,
//           betfairMarketId: marketId,
//           price: cashoutData.hedgeOdds,
//           position: 0, // dynamic karna hai
//           size: 0,
//           newPosition: 0, // dynamic karna hai
//           stake: parseFloat(cashoutData.hedgeAmount.toFixed(2)),
//         });
//       }}
//       className="bg-[var(--success-color)] text-sm text-white px-3 py-1 rounded shadow"
//     >
//       Cashout
//     </button>
//   );
// };

// export default CashOutSystem;


import React, { useEffect, useState, useMemo } from 'react';
import settings from '../../domainConfig';

const CashOutSystem = (props) => {

  if (!settings?.isCashout) return null;


  const {
    marketList,
    positionObj,
    handleBackOpen,
    toggleRowVisibility,
    marketId,
    betFor,
    oddsType,
    marketType,
    updatePosition
  } = props;

  // Memoized cashout calculation with tied match special handling
  const cashoutData = useMemo(() => {
    if (!marketList || !positionObj) return null;

    // Special handling for Tied Match market
    if (marketType === "Tied Match") {
      const selection = marketList[0]; // Tied match typically has one selection
      if (!selection) return null;

      const position = parseFloat(positionObj[selection.selectionid]) || 0;
      if (position === 0) return null;

      const odds = position > 0
        ? parseFloat(selection.khaai) || 0 // Need to lay to cashout a back position
        : parseFloat(selection.lgaai) || 0; // Need to back to cashout a lay position

      if (odds <= 1) return null; // Invalid odds

      const cashoutValue = Math.abs(position) * odds;
      return {
        cashoutValue: parseFloat(cashoutValue.toFixed(2)),
        hedgeTeam: selection.team_name,
        hedgeType: position > 0 ? "lay" : "back",
        hedgeAmount: Math.abs(position),
        hedgeOdds: odds,
        selectionId: selection.selectionid,
        isTiedMarket: true
      };
    }

    // Original cashout logic for other market types
    if (marketList.length < 2) return null;

    const candidates = [];
    for (let i = 0; i < marketList.length; i++) {
      for (let j = 0; j < marketList.length; j++) {
        if (i === j) continue;

        const teamI = marketList[i];
        const teamJ = marketList[j];

        const P1 = parseFloat(positionObj[teamI.selectionid]) || 0;
        const P2 = parseFloat(positionObj[teamJ.selectionid]) || 0;

        const backOdds = parseFloat(teamI.lgaai) || 0;
        const layOdds = parseFloat(teamI.khaai) || 0;

        const x_back = backOdds > 0 ? (P2 - P1) / (1 + backOdds) : 0;
        const x_lay = layOdds > 0 ? (P1 - P2) / (1 + layOdds) : 0;

        if (x_back > 0) {
          candidates.push({
            team: teamI.team_name,
            type: "back",
            amount: parseFloat(x_back.toFixed(2)),
            odds: backOdds,
            baseTeam: teamI,
            oppTeam: teamJ,
          });
        }

        if (x_lay > 0) {
          candidates.push({
            team: teamI.team_name,
            type: "lay",
            amount: parseFloat(x_lay.toFixed(2)),
            odds: layOdds,
            baseTeam: teamI,
            oppTeam: teamJ,
          });
        }
      }
    }

    const hedgeBet =
      candidates.find(c => c.type === "lay") ||
      candidates.find(c => c.type === "back") ||
      (candidates.length > 0
        ? candidates.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev))
        : null);

    if (!hedgeBet) return null;

    const { baseTeam, oppTeam, type, amount, odds } = hedgeBet;

    const P1 = parseFloat(positionObj[baseTeam.selectionid]) || 0;
    const P2 = parseFloat(positionObj[oppTeam.selectionid]) || 0;

    let newP1 = P1;
    let newP2 = P2;

    if (type === "back") {
      newP1 += amount * odds;
      newP2 -= amount;
    } else {
      newP1 -= amount * odds;
      newP2 += amount;
    }

    const cashoutValue = parseFloat(((newP1 + newP2) / 2).toFixed(2));

    return {
      cashoutValue,
      hedgeTeam: baseTeam.team_name,
      hedgeType: type,
      hedgeAmount: amount,
      hedgeOdds: odds,
      team1Name: baseTeam.team_name,
      team2Name: oppTeam.team_name,
      team1PotentialWin: P1,
      team2PotentialWin: P2,
      selectionId: baseTeam.selectionid,
      isTiedMarket: false
    };
  }, [marketList, positionObj, marketType]);

  const [cashoutPerformed, setCashoutPerformed] = useState(false);

  // Reset cashout state when market data changes
  useEffect(() => {
    setCashoutPerformed(false);
  }, [marketList, positionObj]);

  const handleCashout = () => {
    if (!cashoutData || cashoutPerformed) return;

    // Execute cashout logic
    toggleRowVisibility(cashoutData.selectionId);
    handleBackOpen({
      data: marketList.find(t => t.selectionid === cashoutData.selectionId),
      nameOther: marketList,
      type: cashoutData.hedgeType === "back" ? "Yes" : "No",
      odds: cashoutData.hedgeOdds,
      name: cashoutData.hedgeTeam,
      betFor: betFor,
      oddsType: oddsType,
      betType: cashoutData.hedgeType === "back" ? "L" : "K",
      selectionId: cashoutData.selectionId,
      betfairMarketId: marketId,
      price: cashoutData.hedgeOdds,
      position: 0,
      size: 0,
      newPosition: 0,
      stake: parseFloat(cashoutData.hedgeAmount.toFixed(2)),
    });

    // Immediately disable further cashouts
    setCashoutPerformed(true);

    // For tied matches, update position to reflect cashed out position
    if (cashoutData.isTiedMarket && updatePosition) {
      updatePosition(cashoutData.selectionId, 0);
    }
  };

  const isCashoutAvailable = cashoutData && !cashoutPerformed;

  return (
    <button
      onClick={handleCashout}
      disabled={!isCashoutAvailable}
      className={`text-[10px] flex items-center text-black font-bold uppercase px-1 py-0.5 rounded ${isCashoutAvailable
          ? 'bg-gray-100 hover:bg-green-600 cursor-pointer'
          : 'bg-gray-300 opacity-35 cursor-not-allowed'
        }`}
      title={!isCashoutAvailable ?
        (cashoutPerformed ? "Already cashed out" : "Cashout not available") : ""}
    >
      Cashout
    </button>
  );
};

export default CashOutSystem;