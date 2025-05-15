import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import * as path from 'path';

import { gameRouter, pgWebRouter, pgGameRouter } from "@/router";
import { commonService } from "./api/game/commonService";
import { connect } from "@/common/models";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";

const logger = pino({ name: "server start" });
const app: Express = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/:gameKey/index.html', async( req, res ) => {
    const gameCode = req.params.gameKey;
    const gameUrl = await commonService.openProviderGame( gameCode );
    res.render( gameUrl );

});

connect(String(process.env.DBNAME) ).then( async (loaded) => {
    if( loaded ) {
        app.set("trust proxy", true);
        app.use(cors({ origin: "*", credentials: true }));
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(requestLogger);
        app.use('/api', gameRouter);
        app.use('/web-api/', pgWebRouter);
        app.use('/game-api/', pgGameRouter);
        
        app.use(errorHandler());
    }
})

export { app, logger };
