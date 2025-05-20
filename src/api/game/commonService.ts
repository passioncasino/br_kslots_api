import * as Models from '@/common/models/index';
import * as GlobalFunctions from '@/api/utill/functions';
import * as GlobalConstants from '@/api/utill/constants';
import * as PGFunctions from '@/api/game/pgsoft/pgFunctions';
import { LauncherType } from '@/api/utill/interface';

export const commonService = {
    openProviderGame : async( gameCode:string|number ) => {
        const viewUrl = 'pgsoft/' + gameCode + "/index";
        console.log(`viewUrl=${viewUrl}`)
        return viewUrl;
    },

    provideLauncher: async (launcher : LauncherType) => {
        let responseProvider : any;
        const validateVal = GlobalFunctions.validateProviderParams( launcher );
        if( validateVal===0 ) {
            let launcherUrl = ``;
            const now = GlobalFunctions.getCurrentTime();
            const userInfo : any = {};

            userInfo.token = await GlobalFunctions.generateToken( launcher.mode );
            userInfo.balance = 10000;
            userInfo.property = {
                rtp : launcher.rtp,
                game : launcher.game,
                minBet : launcher.minBet,
                max : launcher.maxBet,
                ip : launcher.ip,
                lang : launcher.lang,
                user : launcher.user,
                userId : launcher.token,
                lobby : launcher.lobby,
                cashier : launcher.cashier,
                currency : launcher.currency,
                mode : launcher.mode==="real" ? 1 : 0,
                bonus : 0,
                lastId : "",
                created : now
            };

            const res = await Models.addUser(userInfo)
            if( res ) {
                launcherUrl = 
                    `${ process.env.OPERATOR_HOST }/${ launcher.game }/index.html?`+
                    `ot=${ userInfo.token }`+
                    `&btt=${ launcher.mode==="real" ? 1 : 2 }`+
                    `&l=${ launcher.lang }`+
                    `&or=${ process.env.ASSET_HOST }`;
                    // `&or=${ launcher.mode==="real" ? '19lmtmbv=iz-gfzt=vhf' : process.env.ASSET_HOST }`;
                    
                if( launcher.mode==="real" ) {
                    const ops = GlobalFunctions.generateRandomString( 64, 1 );
                    launcherUrl += 
                        `&ops=a7kbetbr-30248538-${ops}!!b1`+
                        `&f=https://7k.bet.br/game-error/`+
                        // `&f=${ process.env.OPERATOR_HOST }/game-error/`+
                        `&__hv=2fMEUCIQCre7ByZaQne7T0PcUp5r+rIQG9yhFTkutaZWUwi11V8QIgfPNSFXC5SBG+9KVH2EYKS4XykYEC29OPBY8T+04rfr4=`;
                } else {
                    launcherUrl += 
                        `&__refer=m.pg-redirect.net` +
                        `&from=${ process.env.OPERATOR_HOST }`;
                }
                
                responseProvider = {
                    error : 0,
                    description : GlobalConstants.ERRORDESCRIPTION[0],
                    result : {
                        url : launcherUrl
                    }
                }
            } else {
                responseProvider = GlobalFunctions.generateProviderErrorString( 4 );
            }
        } else {
            responseProvider = GlobalFunctions.generateProviderErrorString( validateVal );
        }
        return responseProvider;
    },
}

export const pgSoftService = {
    /**
     * function for /web-api/
     */

    verifyOperatorPlayerSession : async( otk:string, gi:string, traceId:string ) => {
        const response = GlobalFunctions.generateVerifyOperatorPlayerSession( otk, gi, traceId );
        return response;
    },

    getGameName : async() => {
        const dtInfo : any = {};
        for (const key in GlobalConstants.GAMENAMELIST) {
            if (GlobalConstants.GAMENAMELIST.hasOwnProperty(key)) {
                dtInfo[ key ] = decodeURIComponent(GlobalConstants.GAMENAMELIST[key]);
            }
        }
        
        const response = {
            dt : dtInfo,
            err: null
        }

        return response;
    },

    getGameRule : async() => {
        const response = GlobalFunctions.generateGameRule();
        return response;
    },

    getByResourcesTypeIds : async() => {
        const response = GlobalFunctions.generateResourcesTypeIds();
        return response;
    },

    /**
     * function for /game-api/
     * @returns 
     */

    getGameInfo : async( atk:string, gameCode:string ) => {
        const useInfo = await Models.getUserInfo( atk, gameCode );
        await Models.updateUserInfo( gameCode, atk, useInfo );
        const response = await GlobalFunctions.generateGameInfo( atk, gameCode );
        return response;
    },

    handleHistory : async( gameCode:string, action:string, userCode:string ) => {
        const historyData = await Models.getPGHistory( gameCode, userCode );
        let response : any;
        switch ( action ) {
            case "summary":
                response = PGFunctions.generateBetSummary( gameCode, historyData );
                break;
            case "history":
                response = PGFunctions.generateBetHistory( gameCode, historyData );
                break;
        }
        return response
    }
}