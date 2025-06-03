import * as Models from "@/common/models";
import { PGGAMEINFO, PAYLINESBYGAME, PAYTABLESBYGAME, ERRORSTRING } from "@/api/utill/constants";
import { HistoryItemType, PGScoreProps, IPGwinning } from "@/api/utill/interface";

const currencyData = require("@/currencies.json");
let nid = 1e12, prefix = 192453;

export const checkPGScoreLine = ( params: PGScoreProps ) => {
    const payArr : any[] = [];
    let minKey = 0;
    let maxKey = 7;
    let twoSymbol = 100;
    // switch ( params.gameCode ) {
    //     case "value":
            
    //         break;
    // }

    for( let i=1; i<=Object.keys( PAYLINESBYGAME[ params.gameCode ] ).length; i++ ){
        let isWin = false;
        const payVal:any = {
            symbol: 0,
            profit: 0,
            line : 0,
            sameCount: 1
        };
        const payLine = PAYLINESBYGAME[params.gameCode][i];
        const keySymbol = params.symbols[payLine[0]];
        if( keySymbol >= minKey && keySymbol <= maxKey ) {
            payVal.symbol = keySymbol;
            payVal.line = i;
            for(let j = 1; j < payLine.length; j++) {
                if( payVal.symbol === params.wild ) {
                    for( let i=1; i<payLine.length;i++ ) {
                        if( 
                            params.symbols[payLine[i]] > 1 && 
                            params.symbols[payLine[i]] <= maxKey && 
                            params.symbols[payLine[i]] !== params.wild 
                        ){
                            payVal.symbol = params.symbols[payLine[i]];
                            break;
                        }
                    }
                }
                if( payVal.symbol === params.symbols[ payLine[j] ] 
                    || params.symbols[ payLine[j] ] === params.wild 
                ) {
                    payVal.sameCount++;
                } else {
                    break;
                }
            }
            if(payVal.sameCount === 2 && payVal.symbol === twoSymbol) {
                isWin = true;
            } else if(payVal.sameCount > 2) {
                if( payVal.symbol > 1 ) { 
                    isWin = true;
                    // payVal.profit = PAYTABLESBYGAME[ params.gameCode ][ payVal.symbol ][ 3-payVal.sameCount ] * params.stake / 10;
                }
            }

            if(isWin) payArr.push( payVal );
        }
    }
    return payArr || [] ;
}

export const generatePGWinningInfo = ( params: IPGwinning ) => {
    // console.log(`params=`, params );
    let wpInfo: any = {};
    let lwInfo: any = {};
    let rwspInfo: any = {};
    if( params.scoreInfo.length === 0 ) {
        return { wpInfo: null, lwInfo: null, rwspInfo: null };
    } else {
        params.scoreInfo.forEach( ( item:any ) => {
            wpInfo[ item.line ] = PAYLINESBYGAME[ params.gameCode ][ item.line ];
            lwInfo[ item.line ] = item.profit;
            switch (params.gameCode) {
                case "1682240":
                    rwspInfo[ item.line ] = item.profit;
                    break;
                case "1543462":
                    rwspInfo[ item.line ] = item.profit*10 / params.stake;
                    break;
            }
        })
        return { wpInfo, lwInfo, rwspInfo };
    }
}

export const generatePgNextId = () => {
    nid++;
    if( nid > 1e13-1 ) {
        prefix++;
        nid = 1e12;
    }
    return String(prefix) + String( nid );
}

export function getKeyByEndpoint(endpoint: string): number {
    return Number(
      Object.keys(PGGAMEINFO).find(
        (key) => PGGAMEINFO[Number(key)].endpoint === endpoint
      )
    );
}

export const generatePGError = ( error:number, tid:string ) => {
    const errMsg: {[key: number]: string } = {
        1105: "Internal server error.",
        1201: "GameStateNotFoundException",
        1310: "OERR: Operator return an error. Failed to verify operator player session, error code : 1200.",
    }

    const res = {
        dt: null,
        err: {
            cd: String(error),
            msg: errMsg[ error ],
            tid: tid,
            at: null
        }
    };

    return res;
}

/**
 * Make response about preload request
 */

export const generateVerifyOperatorPlayerSession = async( otk: string, gi:string, traceId:string ) => {
    const userInfo = await Models.getUserInfo( otk, gi );
    if (userInfo === null) {
        const errorResponse = generatePGError( 1310, traceId );
        return errorResponse;
    } else {
        const currencyInfo = currencyData.find((currency:any) => currency.cc === userInfo.property.currency);
        const pcd = "a7kbetbr_30248538";

        const resp: any = {
            dt: {
                oj: { 
                    jid: 11
                },
                pid: "2PP8xwNlmH",
                pcd: pcd,
                tk: otk,
                st: 1,
                geu: `game-api/${PGGAMEINFO[ gi ].endpoint}/`,
                lau: "game-api/lobby/",
                bau: "web-api/game-proxy/",
                cc: userInfo.property.currency,
                cs: currencyInfo ? currencyInfo.symbol : "Currency Symbol not found!",
                nkn: pcd,
                gm: [ 
                    {
                        gid: gi,
                        msdt: 1673431954000,
                        medt: 1673431954000,
                        st: 1,
                        amsg: "",
                        rtp: {
                            df: {
                                min: PGGAMEINFO[ gi ].rtp[ 0 ],
                                max: PGGAMEINFO[ gi ].rtp[ 1 ]
                            }
                        },
                        mxe: PGGAMEINFO[ gi ].mxe,
                        mxehr: PGGAMEINFO[ gi ].mxehr
                    }
                ],
                uiogc: {
                    bb: 0,
                    gec: 0,
                    cbu: 0,
                    cl: 0,
                    mr: 0,
                    phtr: 0,
                    vc: 0,
                    bfbsi: 0,
                    bfbli: 0,
                    il: 0,
                    rp: 0,
                    gc: 1,
                    ign: 1,
                    tsn: 0,
                    we: 0,
                    gsc: 0,
                    bu: 0,
                    pwr: 0,
                    hd: 0,
                    igv: 0,
                    ivs: 1,
                    ir: 0,
                    hn: 1,
                    swfbsi: 0,
                    swfbli: 0,
                    grtp: 1,
                    bf: 0,
                    et: 0,
                    np: 0,
                    as: 1000,
                    asc: 1,
                    std: 0,
                    hnp: 0,
                    ts: 1,
                    smpo: 0,
                    swf: 0,
                    sp: 1,
                    rcf: 0,
                    sbb: 1,
                    hwl: 1,
                },
                ec: [],
                occ: {
                    rurl: "",
                    tcm: "",
                    tsc: 0,
                    ttp: 0,
                    tlb: "",
                    trb: ""
                },
                ioph: "fc0172cbc121",
                sdn: "api",
                eatk: PGGAMEINFO[ gi ].eatk,
                jc: {
                    grtp: 1,
                    bf: 0,
                    et: 0,
                    np: 0,
                    as: 1000,
                    asc: 1,
                    std: 0,
                    hnp: 0,
                    ts: 1,
                    smpo: 0,
                    swf: 0,
                    sp: 1,
                    rcf: 0,
                    sbb: 1,
                    hwl: 1
                }
            },
            err: null
        }

        if( gi==="98" ) resp.dt.gcv = "1.1.0.9";
        if( gi==="1682240" ) resp.dt.gcv = "1.4.0.4";
        return resp;
    } 
}

export const generateGameInfo = async( atk:string, gi:string ) => {
    const userInfo = await Models.getUserInfo( atk, gi );
    if (userInfo === null) return ERRORSTRING[6];
    
    const gameInfo = PGGAMEINFO[ gi ];
    const csInfo = gameInfo.cs[userInfo.property.currency]

    const resp: any = {
        wp: null,
        lw: null,
        gwt: -1,
        ctw: 0,
        pmt: null,
        cwc: 0,
        fstc: null,
        pcwc: 0,
        rwsp: null,
        hashr: null,
        fb: null,
        ab: null,
        ml: 2,
        cs: csInfo[0],
        rl: gameInfo.orl,
        sid: "0",
        psid: "0",
        st: 1,
        nst: 1,
        pf: 1,
        aw: 0,
        wid: 0,
        wt: "C",
        wk: "0_C",
        wbn: null,
        wfg: null,
        blb: 0,
        blab: 0,
        bl: userInfo.balance,
        tb: 0,
        tbb: 0,
        tw: 0,
        np: 0,
        ocr: null,
        mr: null,
        ge: null
    };

    const gameInfoResponse: any = {
        dt: {
            fb: null,
            wt: gameInfo.wt,
            maxwm: 5000,
            gcs: {},
            abm: null,
            cs: csInfo,
            ml: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
            mxl: gameInfo.mxl,
            bl: userInfo.balance,
            inwe: false,
            iuwe: false,
            cc: userInfo.property.currency
        },
        err: null
    };

    switch ( gi ) {
        case "98":
            resp.fs = null;
            resp.rf = false;
            resp.rtf = false;
            resp.fs = false;
            resp.rc = 0;
            resp.im = false;
            resp.itw = false;
            resp.wc = 0;
            resp.gwt = 0;
            resp.pf = 0;
            gameInfoResponse.dt.maxwm = null;
            gameInfoResponse.dt.ls = { si: resp };
            break;
        case "126":
            resp.wc  = 3;
            resp.ist = false;
            resp.itw = false;
            resp.fws = 0;
            resp.orl = null;
            resp.lw  = null;
            resp.irs = false;
            resp.gwt = 0;
            resp.pf  = 0;
            resp.ge  = null;
            gameInfoResponse.dt.maxwm = null;
            gameInfoResponse.dt.ls = { si: resp };
            break;
        case "1543462":
            resp.orl = gameInfo.orl;
            resp.ift = false;
            resp.iff = false;
            resp.cpf = {};
            resp.cptw = 0;
            resp.crtw = 0;
            resp.imw = false;
            resp.fs = null;
            resp.ge = [ 1, 11 ];
            gameInfoResponse.dt.ls = { si: resp };
            break;
        case "1682240":
            resp.twbm = 0;
            resp.fs   = null;
            resp.imw  = false;
            resp.orl  = null;
            resp.rv   = [ 0.6, 60, 3, 1, 0, 100, 60, 6, 30 ];
            resp.orv  = null;
            resp.rsrl = null;
            resp.rsrv = null;
            resp.nfp  = null;
            resp.ml   = 2;
            resp.gwt  = 0;
            resp.pf   = 0;
            resp.ge   = null;
            gameInfoResponse.dt.ls = { si: resp };
            break;
        case "1695365":
            resp.orl = gameInfo.orl;
            resp.gm = 1;
            resp.it = false;
            resp.fs = null;
            resp.mf = {
                mt: [ 2 ],
                ms: [ true ],
                mi: [ 0 ]
            };
            resp.ssaw = 0;
            resp.crtw = 0;
            resp.imw  = 0;
            resp.gwt  = 0;
            resp.pf   = 0;
            resp.ge   = null;
            gameInfoResponse.dt.fb = {
                is: true,
                bm: 5,
                t: 500
            };
            gameInfoResponse.dt.maxwm = 2500;
            gameInfoResponse.dt.gcs.bf = {
                is: true,
                bm: 5,
                t: 500
            };
            gameInfoResponse.dt.ls = { si: resp };
            break;
    }

    return gameInfoResponse;
}

export const generateGameRule = async( gid:string ) => {
    const gameInfo = PGGAMEINFO[ gid ];
    const response = {
        dt: {
            rtp: {
                Default: {
                    min: gameInfo.rtp[0],
                    max: gameInfo.rtp[1]
                }
            },
            grtpi: [
                {
                    gt: "Default",
                    grtps: [
                        {
                            t: "min",
                            tphr: null,
                            rtp: gameInfo.rtp[0]
                        },
                        {
                            t: "max",
                            tphr: null,
                            rtp: gameInfo.rtp[1]
                        }
                    ]
                }
            ],
            ows: {
                itare: true,
                tart: 1,
                igare: true,
                gart: 2160
            },
            jws: null
        },
        err: null
    };
    return response;
}

export const generateResourcesTypeIds = async() => {
    const icons = [ "default_icon", "HoneyTrap_of_DiaoChan_168x168", "GemSaviour_168x168", "FortuneGods_168x168" ];
    const dts: any[] = [];
    icons.forEach(( icon, idx ) => {
        const dtItem = {
            rid: idx,
            rtid: 14,
            url: `https://public.pg-nmga.com/pages/static/image/en/SocialGameSmall/${idx}/${icon}.png`,
            l:"en-US",
            ut: "2019-10-01T02:33:24"
        };
        dts.push( dtItem );
    });
    const response = {
        dt: dts,
        err: null
    };
    return response;    
}

/**
 * Bet History Request
 */

export const generateBetSummary = ( gameCode:string, historyData:HistoryItemType[] ) => {
    let btba = 0;
    let btwla = 0;
    let lut = 0;
    let lbid = 0;
    if (historyData.length > 0) {
        historyData.forEach((item: HistoryItemType) => {
            item.response.forEach((subItem:any) => {
                btba = Math.round( subItem.dt.si.tb*100 + btba*100 )/100;
                for( const key in subItem.dt.si.lw ) {
                    btwla = Math.round( btwla*100 + subItem.dt.si.lw[key]*100 )/100;
                }
            })
        })
        lut = Number(historyData[0].created);
        lbid = Number(historyData[0]._id);
    }

    const bsInfo = historyData.length === 0 ? null : {
        gid: Number(gameCode),
        bc: historyData.length,
        btba: btba,
        btwla: btwla-btba,
        lbid: lbid
    };

    const summary = {
        dt: {
            lut: lut,
            bs: bsInfo
        },
        err: null
    };

    return summary;
}

export const generateBetHistory = ( gameCode:string, historyData:HistoryItemType[] ) => {
    const bhInfo : any[] = [];
    if( historyData.length>0 ) {
        historyData.forEach( ( historyItem: HistoryItemType ) => {
            let totalProfit = 0;
            const bdInfo : any[] = [];
            const resData = historyItem.response[0].dt.si;

            historyItem.response.forEach((subItem:any) => {
                const subResData = subItem.dt.si;
                const bdItem = {
                    tid: subResData.sid,
                    tba: subResData.tb,
                    twla: subResData.np,
                    bl: subResData.bl,
                    bt: Number(historyItem.created),
                    gd: subResData
                };

                for( const key in subItem.dt.si.lw ) {
                    totalProfit = Math.round( totalProfit*100 + subItem.dt.si.lw[key]*100 )/100;
                }

                bdInfo.push( bdItem );
            })

            const bhItem = {
                tid: resData.sid,
                gid: Number(gameCode),
                cc: historyItem.currency,
                gtba: resData.tb,
                gtwla: Math.round( totalProfit*100-resData.tb*100 )/100,
                bt: Number(historyItem.created),
                ge: resData.ge,
                bd: bdInfo,
                mgcc: 0,
                fscc: 0
            };
            bhInfo.push( bhItem );
        })
    }

    const response = {
        dt: {
            bh: bhInfo
        },
        err: null
    }
    return response;
}