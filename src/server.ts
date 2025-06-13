import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import * as path from 'path';

import { gameRouter, pgWebRouter, pgGameRouter, pgAuthRouter } from "@/router";
import { commonService, pgSoftService } from "./api/game/commonService";
import { connect } from "@/common/models";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";

const logger = pino({ name: "server start" });
const app: Express = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

connect(String(process.env.DBNAME) ).then( async (loaded) => {
    if( loaded ) {

        app.set("trust proxy", true);
        app.use(cors({ origin: "https://verify.2pgsoft.com", credentials: true }));        
        app.use(
            helmet({
                contentSecurityPolicy: false, // Desactiva CSP de Helmet
            })
        );    
              
        app.get('/', (req, res) => {
            const { atk, gid, env, l, sid, tid } = req.query;
            const verifyUrl = pgSoftService.openPGVerify( atk as string, gid as string, env as string, l as string, sid as string, tid as string );
            res.render( verifyUrl );
        })

        app.get('/history/redirect', async( req, res ) => {
            const redirectUrl = pgSoftService.openPGRedirect();
            res.render( redirectUrl );
        })

        app.get('/history/:gid.html', async( req, res ) => {
            const gid = req.params.gid;
            const redirectUrl = pgSoftService.openPGVerifyPage( gid );
            res.render( redirectUrl );
        })

        app.get('/:gameKey/index.html', async( req, res ) => {
            const gameCode = req.params.gameKey;
            const gameUrl = await commonService.openProviderGame( gameCode );
            res.render( gameUrl );
        });

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(requestLogger);
                
        app.use('/api', gameRouter);
        app.use('/web-api/', pgWebRouter);
        app.use('/game-api/', pgGameRouter);
        app.use('/AuthenticationVerify/', pgAuthRouter);
        
        app.use(errorHandler());
    }
})

export { app, logger };
