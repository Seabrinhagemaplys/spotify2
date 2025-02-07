import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import UserRouter from "../src/domains/user/controllers/index";
import ArtistRouter from "../src/domains/artists/controllers/index";
import MusicRouter from "../src/domains/music/controllers/index"

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
	credentials: true,
	origin: process.env.APP_URL
};

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use("/api/users", UserRouter);
app.use("/api/artists", ArtistRouter);
app.use("/api/artists", MusicRouter);
