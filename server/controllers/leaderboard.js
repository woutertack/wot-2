// controllers/leaderboard.js
import fs from "fs";
import path from "path";


const filePath = "./leaderboard.json";

// let leaderboardData = [];

export const getLeaderBoard = (req, res) => {
  // get the leaderbord json file

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, leaderboard: [] });
    } else {
      console.log("Received data from file:", data);
      res.json({ success: true, leaderboard: JSON.parse(data) });
    }
  }
  );
};

export const addScoreToLeaderBoard = (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, leaderboard: [] });
    } else {
      console.log("Received data from file:", data);
      const leaderboardData = JSON.parse(data);

      const { groupname, time } = req.body; // Verander hier van params naar body

      console.log("Received request with data:", { groupname, time });

      const newScore = {
        groupId: Date.now(), // Voeg een unieke ID toe
        groupname: groupname,
        time: parseInt(time),
      };

      leaderboardData.push(newScore);
      leaderboardData.sort((a, b) => b.time - a.time); // Sorteer op tijd in aflopende volgorde

      fs.writeFile(filePath, JSON.stringify(leaderboardData), (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false, leaderboard: [] });
        } else {
          console.log("Successfully wrote data to file");
          res.json({ success: true, leaderboard: leaderboardData });
        }
      });
    }
  }
  );
};

// ... (your existing code)

export const updateGroupName = (req, res) => {
  const { groupId } = req.params;
  const { groupname } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, leaderboard: [] });
    } else {
      const leaderboardData = JSON.parse(data);

      const updatedLeaderboard = leaderboardData.map((item) => {
        if (item.groupId === parseInt(groupId)) {
          return { ...item, groupname };
        }
        return item;
      });

      fs.writeFile(filePath, JSON.stringify(updatedLeaderboard), (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false, leaderboard: [] });
        } else {
          console.log("Successfully updated group name");
          res.json({ success: true, leaderboard: updatedLeaderboard });
        }
      });
    }
  });
};


export const updateTime = (req, res) => {
  const { groupId } = req.params;
  const { time } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, leaderboard: [] });
    } else {
      const leaderboardData = JSON.parse(data);

      const updatedLeaderboard = leaderboardData.map((item) => {
        if (item.groupId === parseInt(groupId)) {
          return { ...item, time: parseInt(time) };
        }
        return item;
      });

      fs.writeFile(filePath, JSON.stringify(updatedLeaderboard), (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false, leaderboard: [] });
        } else {
          console.log("Successfully updated time");
          res.json({ success: true, leaderboard: updatedLeaderboard });
        }
      });
    }
  });
};

// ... (your existing code)

export const deleteEntry = (req, res) => {
  const { groupId } = req.params;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, leaderboard: [] });
    } else {
      const leaderboardData = JSON.parse(data);

      const updatedLeaderboard = leaderboardData.filter(item => item.groupId !== parseInt(groupId));

      fs.writeFile(filePath, JSON.stringify(updatedLeaderboard), (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false, leaderboard: [] });
        } else {
          console.log("Successfully deleted entry");
          res.json({ success: true, leaderboard: updatedLeaderboard });
        }
      });
    }
  });
};
