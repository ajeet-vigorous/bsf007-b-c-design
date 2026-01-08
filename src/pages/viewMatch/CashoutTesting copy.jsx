import React, { useEffect, useState } from 'react';

const CashOutSystemTesting = () => {

  const [market, setMarket] = useState({

    teamB: { back: 1.71, lay: 1.81},
    teamA: {back: 1.25, lay: 1.44   },
  });
  const [bets, setBets] = useState([
{ id: 1, team: 'B', type: 'back', amount: 500, odds: 1.71 }, 


  ]);

  const [cashoutData, setCashoutData] = useState({
    cashoutValue: 0,
    hedgeTeam: null,
    hedgeType: null,
    hedgeAmount: 0,
    hedgeOdds: 0,
    teamAPotentialWin: 0,
    teamBPotentialWin: 0,
  });

  const calculateNetPosition = () => {
    let teamAPotentialWin = 0;
    let teamBPotentialWin = 0;

    bets.forEach((bet) => {
      const { team, type, amount, odds } = bet;

      if (team === 'A') {
        if (type === 'back') {
          teamAPotentialWin += amount * odds; 
          teamBPotentialWin -= amount;
        } else {
          teamAPotentialWin -= amount * odds - 1;
          teamBPotentialWin += amount;
        }
      } else if (team === 'B') {
        if (type === 'back') {
          teamBPotentialWin += amount * (odds); // book maker me -1 and toss ne noting
          teamAPotentialWin -= amount;
        } else {
          teamBPotentialWin -= amount * (odds - 1);
          teamAPotentialWin += amount;
        }
      }
    });
    teamAPotentialWin = parseFloat(teamAPotentialWin.toFixed(2));
    teamBPotentialWin = parseFloat(teamBPotentialWin.toFixed(2));

    return { teamAPotentialWin, teamBPotentialWin };
  };
  const calculateCashOut = () => {
    const { teamAPotentialWin: P_A, teamBPotentialWin: P_B } = calculateNetPosition();

    const backOddsA = market.teamA.back;
    const layOddsA = market.teamA.lay;
    const backOddsB = market.teamB.back;
    const layOddsB = market.teamB.lay;

    const x_back_A = (P_B - P_A) / (1 + backOddsA);
    const x_lay_A  = (P_A - P_B) / (1 + layOddsA);


    const x_back_B = (P_A - P_B) / (1 + backOddsB);
    const x_lay_B  = (P_B - P_A) / (1 + layOddsB);

    const candidates = [];
    if (x_back_A > 0) {
      candidates.push({
        team: 'A',
        type: 'back',
        amount: parseFloat(x_back_A.toFixed(2)),
        odds: backOddsA,
      });
    }
    if (x_lay_A > 0) {
      candidates.push({
        team: 'A',
        type: 'lay',
        amount: parseFloat(x_lay_A.toFixed(2)),
        odds: layOddsA,
      });
    }
    if (x_back_B > 0) {
      candidates.push({
        team: 'B',
        type: 'back',
        amount: parseFloat(x_back_B.toFixed(2)),
        odds: backOddsB,
      });
    }
    if (x_lay_B > 0) {
      candidates.push({
        team: 'B',
        type: 'lay',
        amount: parseFloat(x_lay_B.toFixed(2)),
        odds: layOddsB,
      });
    }


    let hedgeBet = null;


    const bLayCandidate = candidates.find((c) => c.team === 'B' && c.type === 'lay');
    if (bLayCandidate) {
      hedgeBet = bLayCandidate;
    } else {

      const bBackCandidate = candidates.find((c) => c.team === 'B' && c.type === 'back');
      if (bBackCandidate) {
        hedgeBet = bBackCandidate;
      } else {

        if (candidates.length > 0) {
          hedgeBet = candidates.reduce((prev, curr) =>
            curr.amount < prev.amount ? curr : prev
          );
        }
      }
    }

    let cashoutValue = 0;
    if (hedgeBet) {
      const { team: hTeam, type: hType, amount: hAmount, odds: hOdds } = hedgeBet;

      if (hType === 'back') {
        if (hTeam === 'A') {
          const newP_A = P_A + hAmount * hOdds;
          const newP_B = P_B - hAmount;
          cashoutValue = parseFloat(((newP_A + newP_B) / 2).toFixed(2));
        } else {
          const newP_A = P_A - hAmount;
          const newP_B = P_B + hAmount * hOdds;
          cashoutValue = parseFloat(((newP_A + newP_B) / 2).toFixed(2));
        }
      } else {
        if (hTeam === 'A') {
          const newP_A = P_A - hAmount * hOdds;
          const newP_B = P_B + hAmount;
          cashoutValue = parseFloat(((newP_A + newP_B) / 2).toFixed(2));
        } else {
          const newP_A = P_A + hAmount;
          const newP_B = P_B - hAmount * hOdds;
          cashoutValue = parseFloat(((newP_A + newP_B) / 2).toFixed(2));
        }
      }
    }

    return {
      cashoutValue,
      hedgeTeam: hedgeBet?.team || null,
      hedgeType: hedgeBet?.type || null,
      hedgeAmount: hedgeBet?.amount || 0,
      hedgeOdds: hedgeBet?.odds || 0,
      teamAPotentialWin: P_A,
      teamBPotentialWin: P_B,
    };
  };

  
  useEffect(() => {
    const data = calculateCashOut();
    setCashoutData(data);
  }, [bets, market]);
  const executeCashOut = () => {
    const { hedgeTeam, hedgeType, hedgeAmount, hedgeOdds } = calculateCashOut();
    if (!hedgeTeam) {
      console.log(' No valid hedge found।');
      return;
    }

    const newBets = [...bets];
    const newId = bets.length > 0 ? Math.max(...bets.map((b) => b.id)) + 1 : 1;
    newBets.push({
      id: newId,
      team: hedgeTeam,
      type: hedgeType,
      amount: parseFloat(hedgeAmount.toFixed(2)),
      odds: hedgeOdds,
    });
    setBets(newBets);
    console.log(' Cashout hedge bet added:', {
      id: newId,
      team: hedgeTeam,
      type: hedgeType,
      amount: parseFloat(hedgeAmount.toFixed(2)),
      odds: hedgeOdds,
    });
  };

  return (
    <div
      className="multi-team-cashout"
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
      }}
    >

      <button
        onClick={executeCashOut}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Cashout
      </button>

      <div
        className="market-odds"
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <h3
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            color: '#3498db',
          }}
        >
          Current Market Odds
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>Team A</h4>
            <p>Back: {market.teamA.back}</p>
            <p>Lay: {market.teamA.lay}</p>
          </div>
          <div>
            <h4>Team B</h4>
            <p>Back: {market.teamB.back}</p>
            <p>Lay: {market.teamB.lay}</p>
          </div>
        </div>
      </div>


      <div
        className="your-bets"
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <h3
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            color: '#3498db',
          }}
        >
          Your Bets
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {bets.map((bet) => (
            <li
              key={bet.id}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                <strong>{bet.type.toUpperCase()}</strong> टीम{' '}
                {bet.team === 'A' ? 'Team A' : 'Team B'}
              </span>
              <span>
                ₹{bet.amount.toLocaleString('en-IN')} @ {bet.odds}
              </span>
            </li>
          ))}
        </ul>
      </div>


      <div
        className="net-position"
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <h3
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            color: '#3498db',
          }}
        >
          Profit / Loss Status
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>Team A Wins:</h4>
            <p
              style={{
                color: cashoutData.teamAPotentialWin >= 0 ? '#27ae60' : '#e74c3c',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              ₹{cashoutData.teamAPotentialWin.toFixed(2)}
            </p>
          </div>
          <div>
            <h4>Team B Wins:</h4>
            <p
              style={{
                color: cashoutData.teamBPotentialWin >= 0 ? '#27ae60' : '#e74c3c',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              ₹{cashoutData.teamBPotentialWin.toFixed(2)}
            </p>
          </div>
        </div>


        {cashoutData.hedgeTeam && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px',
              background: '#fcf8e3',
              borderRadius: '5px',
            }}
          >
            ↻ Hedge Bet: <strong>{cashoutData.hedgeType.toUpperCase()}</strong> on Team{' '}
            {cashoutData.hedgeTeam === 'A' ? 'Team A' : 'Team B'} for ₹
            {cashoutData.hedgeAmount.toLocaleString('en-IN')} @{' '}
            {cashoutData.hedgeOdds}
            <br />
            (New Cashout Value ≈ ₹{cashoutData.cashoutValue.toFixed(2)})
          </div>
        )}
      </div>
    </div>
  );
};

export default CashOutSystemTesting;
