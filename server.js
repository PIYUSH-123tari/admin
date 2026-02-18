const express = require("express");
const connectDB = require("./config/db");
const cors=require("cors");

const corsOptions=require("./config/corsOptions");

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Serve static files from the 'view' directory
// app.use(express.static(__dirname + '/view'));



app.use("/managers", require("./router/managerRoutes"));
app.use("/api/agents", require("./router/agentRoutes"));
// Serve uploads folder as static
app.use("/uploads", express.static("uploads"));



app.listen(3500, () => {
  console.log("Server running on port 3500");
});

// reward_points: { type: Number, default: 0 },
// created_at: { type: Date, default: Date.now }