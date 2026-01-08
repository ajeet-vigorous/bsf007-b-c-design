import React, { useEffect, useState } from "react";
import gamesJson from "./component/dashboard/CasinoList.json"; // your JSON
import { apiCall } from "./config/HTTP";

const TestCasino = () => {
  const [workingGames, setWorkingGames] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to test a single game
  const testGame = async (gameId) => {
    try {
      const payload = {
        gameId: String(gameId), // convert number to string
        platformId: "mobile",
        redirectUrl: `${window.location.origin}/dashboard`,
      };

      const res = await apiCall("POST", "user/casinoLoginUrl", payload);
      return res && res.data ? true : false;
    } catch (err) {
      return false;
    }
  };

  // Filter working games
  const filterWorkingGames = async (gamesJson) => {
    const filteredJson = { tables: {}, allTables: {} };

    // Loop tables
    for (const tableName in gamesJson.tables) {
      filteredJson.tables[tableName] = {};
      for (const category in gamesJson.tables[tableName]) {
        const games = gamesJson.tables[tableName][category];
        const workingGamesArr = [];
        for (const game of games) {
          const isWorking = await testGame(game.id);
          if (isWorking) workingGamesArr.push(game);
        }
        if (workingGamesArr.length > 0) {
          filteredJson.tables[tableName][category] = workingGamesArr;
        }
      }
    }

    // Loop allTables
    for (const category in gamesJson.allTables) {
      const games = gamesJson.allTables[category];
      const workingGamesArr = [];
      for (const game of games) {
        const isWorking = await testGame(game.id);
        if (isWorking) workingGamesArr.push(game);
      }
      if (workingGamesArr.length > 0) {
        filteredJson.allTables[category] = workingGamesArr;
      }
    }

    return filteredJson;
  };

  useEffect(() => {
    const runTest = async () => {
      setLoading(true);
      const result = await filterWorkingGames(gamesJson);
      setWorkingGames(result);
      console.log("Working Games JSON:", result); // ✅ JSON output in console
      setLoading(false);
    };

    runTest();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking games...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Working Games (check console for JSON)</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(workingGames, null, 2)}
      </pre>
    </div>
  );
};

export default TestCasino;
