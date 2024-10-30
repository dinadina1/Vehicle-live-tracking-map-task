// required modules
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// get request
router.get("/vehicle/:timestamp", (req, res) => {
  // Load route data
  const route = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/route.json"), "utf8")
  );

  // Filter data by timestamp
  const filteredData = route.filter((item) => {
    const date = new Date(item.date);
    // Format the date as YYYY-MM-DD
    const formattedDate = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

    return formattedDate === req.params.timestamp;
  });

  // send response
  res.status(200).json({
    success: true,
    route: filteredData,
  });
});

// export router
module.exports = router;
