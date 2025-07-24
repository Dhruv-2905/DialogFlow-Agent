const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Pool } = require("pg");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

let username;

const pool = new Pool({
  host: "",
  port: ,
  user: "",
  password: "",
  database: "",
});

app.get("/health", (req, res) => {
  res.json("healthy");
});

app.post("/username", (req, res) => {
  console.log("req body: ", req.body);
  console.log("username: ", req.body.username);
  console.log("cookies: ", req.cookies);
  if (req.body.username) {
    username = req.body.username;
    console.log("name is: ", username);
    return res.json("fetched name from frontend");
  } else return res.json("unable to fetch name from frontend");
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  if (username) {
    try {
      const responseMessage = `Hi ${username}, how can I assist you today?`;
      const fulfillmentResponse = {
        fulfillmentResponse: {
          messages: [{ text: { text: [responseMessage] } }],
        },
        sessionInfo: {
          parameters: { username: username },
        },
      };
      res.json(fulfillmentResponse);
      console.log("Fulfillment response:", JSON.stringify(fulfillmentResponse));
    } catch (error) {
      console.error("Error decoding JWT:", error);
      res.json({ fulfillmentText: "There was an issue decoding the token." });
    }
  } else {
    res.json({ fulfillmentText: "No JWT token provided in the request." });
  }
});

// Endpoint to execute a query
app.get("/db/webhook", async (req, res) => {
  try {
    const query = "SELECT * FROM masters.master_user LIMIT 1";
    const result = await pool.query(query);
    const fulfillmentResponse = {
      fulfillmentResponse: {
        messages: [{ text: { text: [JSON.stringify(result.rows)] } }],
      },
      sessionInfo: {
        parameters: { query: result.rows },
      },
    };
    res.json(fulfillmentResponse);
    console.log("Fulfillment response:", JSON.stringify(fulfillmentResponse));
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// JWT Authentication Endpoint
const JWT_SECRET_KEY = "";
const JWT_ALGORITHM = "HS256";
const JWT_EXPIRATION = "30m";

app.post("/api/token", (req, res) => {
  const data = req.body;
  if (!data || !data.username) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const accessToken = jwt.sign({ identity: data.username }, JWT_SECRET_KEY, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRATION,
  });

  const response = {
    fulfillmentResponse: {
      messages: [{ text: { text: ["Authentication successful."] } }],
    },
  };

  res.json(response);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
