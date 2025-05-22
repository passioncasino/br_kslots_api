import express, { Request, Response, Router } from 'express';
import { getUserInfo  } from '@/common/models';
import { getKeyByEndpoint } from '@/api/utill/functions';
import { commonService, pgSoftService } from '@/api/game/commonService';
import { LauncherType, PGActionType } from '@/api/utill/interface';
import { fortuneRabbitService } from "@/api/game/pgsoft/1543462/service";
import { fortuneOxService } from "@/api/game/pgsoft/98/service";
import { fortuneTigerService } from "@/api/game/pgsoft/126/service";
import { fortuneDragonService } from "@/api/game/pgsoft/1695365/service";
import { cashManiaService } from "@/api/game/pgsoft/1682240/service";

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
        const { btt, gid, atk, pf } = req.body;
        const response = await pgSoftService.getGameRule( gid );
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
    router.post('/:endpoint/v2/Spin', async (req: Request, res: Response) => {
        const endpoint = req.params.endpoint;
        // console.log(`spin endpoint=${endpoint}`);
        let response: any = {};
        const actionData : PGActionType = req.body;
        switch (endpoint) {
            case "fortune-tiger":
                response = await fortuneTigerService.handleSpin( actionData );
                break;
            case "fortune-rabbit":
                response = await fortuneRabbitService.handleSpin( actionData );
                break;
            case "fortune-ox":
                response = await fortuneOxService.handleSpin( actionData );
                break;
            case "fortune-dragon":
                response = await fortuneDragonService.handleSpin( actionData );
            case "cash-mania":
                response = await cashManiaService.handleSpin( actionData );
                break;
        }
        res.json(response);
    });

    router.post('/:endpoint/v2/GameInfo/Get', async (req: Request, res: Response) => {
        const endpoint = req.params.endpoint;
        console.log(`info endpoint=${endpoint}`);
        const gameCode = getKeyByEndpoint(endpoint);
        const { btt, atk, pf } = req.body;
        const response = await pgSoftService.getGameInfo( atk, String(gameCode) );

        res.json(response);
    });

    return router;
})();
