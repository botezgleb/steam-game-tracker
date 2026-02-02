import 'dotenv/config'
import express from "express";
import cors from "cors";
import { steamRouter } from "./routes/steam.routes";
import { userRouter } from "./routes/user.routes";
import sequelize from "./db";
import "./models";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/steam", steamRouter);
app.use("/api/user", userRouter);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    sequelize.sync({ force: true }).then(() => {
      console.log("DB synced");
    });

    app.listen(3001, () => {
      console.log("Server started on http://localhost:3001");
    });
  } catch (e) {
    console.log(e);
  }
}

start();
