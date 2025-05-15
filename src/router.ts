import express, { Request, Response, Router } from 'express';
import { pgGameCodes } from '@/api/utill/constants';
import { commonService } from '@/api/game/commonService';
import { LauncherType, PGActionType } from '@/api/utill/interface';
import { pgSoftService } from '@/api/game/commonService';
import { getUserInfo  } from '@/common/models';
import { pg2rabbitService } from "./api/game/pgsoft/pg2rabbit/service";

export const gameRouter: Router = (() => {
    const router = express.Router();
    router.post('/get_launcher_url', async (req: Request, res: Response) => {
        const launcher : LauncherType = req.body;
        const serviceResponse = await commonService.provideLauncher(launcher);
        res.json(serviceResponse);
    });
    return router;
})();

export const pgWebRouter: Router = (() => {
    const router = express.Router();
    router.post('/auth/session/v2/verifySession', async (req: Request, res: Response) => {
        const { traceId } = req.query;
        const { btt, vc, pf, l, gi, tk, otk } = req.body;
        const response = await pgSoftService.verifyOperatorPlayerSession( otk, gi, traceId as string );
        res.json( response );        
    });

    router.post('/auth/session/v2/verifyOperatorPlayerSession', async (req: Request, res: Response) => {
        const { traceId } = req.query;
        const { btt, vc, pf, l, gi, os, otk } = req.body;
        const response = await pgSoftService.verifyOperatorPlayerSession( otk, gi, traceId as string );
        res.json( response );
    });

    router.post('/game-proxy/v2/GameName/Get', async (req: Request, res: Response) => {
        const response = await pgSoftService.getGameName();
        res.json(response);
    });
   
    router.post('/game-proxy/v2/BetSummary/Get', async (req: Request, res: Response) => {
        const { gid, dtf, dtt, atk, pf, wk, btt } = req.body;
        const userInfo = await getUserInfo( atk, gid as string );
        const response = await pgSoftService.handleHistory( gid, "summary", userInfo.property.user );
        res.json( response );
    });

    router.post('/game-proxy/v2/BetHistory/Get', async (req: Request, res: Response) => {
        const { gid, dtf, dtt, bn, rc, atk, pf, wk, btt } = req.body;
        const userInfo = await getUserInfo( atk, gid as string );
        const response = await pgSoftService.handleHistory( gid, "history", userInfo.property.user );
        res.json( response );
    });

    router.post('/game-proxy/v2/GameRule/Get', async (req: Request, res: Response) => {
        const response = await pgSoftService.getGameRule();
        res.json( response );
    });

    router.post('/game-proxy/v2/Resources/GetByResourcesTypeIds', async (req: Request, res: Response) => {
        const response = await pgSoftService.getByResourcesTypeIds();
        res.json(response);
    });
    return router;
})();

export const pgGameRouter: Router = (() => {
    const router = express.Router();
    router.post('/fortune-rabbit/v2/Spin', async (req: Request, res: Response) => {
        const actionData : PGActionType = req.body;

        let response = await pg2rabbitService.handleSpin( actionData );
        res.json(response);
    });

    router.post('/fortune-rabbit/v2/GameInfo/Get', async (req: Request, res: Response) => {
        const gameCode = "1543462";
        const { btt, atk, pf } = req.body;

        const response = await pgSoftService.getGameInfo( atk, gameCode );

        res.json(response);
    });

    return router;
})();
