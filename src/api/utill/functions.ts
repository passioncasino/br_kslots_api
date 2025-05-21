import isaac from 'isaac';
import * as Models from "@/common/models";
import { LauncherType } from "@/api/utill/interface";
import * as GlobalConstants from "@/api/utill/constants";
const currencyData = require("@/currencies.json");

let nid = 1e12, round = 0, prefix = 192453;

export const validateProviderParams = ( params : LauncherType ) => {
    if(params.ip === "") return 7;
    if(params.mode === "") return 7;
    if(params.lang === "") return 7;
    if(params.game === "") return 8;
    if(params.currency === "") return 7;
    else {
        if( params.rtp===1 || params.rtp===2 || params.rtp===3 ) return 0;
        else return 7;
    }
}

export const getCurrentTime = () => {
    return new Date().getTime();
}

export const generateRandomString = ( length:number, type:number ) => {
    const chars = type === 1 ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const generateToken = async( mode:string ) => {
    const part1 = generateRandomString( 8, 0 );
    const part2 = mode==="real" ? "R" : "F" + generateRandomString( 3, 0 );
    const part3 = generateRandomString( 4, 0 );
    const part4 = generateRandomString( 4, 0 );
    const part5 = generateRandomString( 12, 0 );
    const token = `${part1}-${part2}-${part3}-${part4}-${part5}`;
    return token;
}

export const getIdxByRand = ( gameCode:string, flag: string ) => {
    const multipliers = GlobalConstants.MULTIPLIER_RULE_BY_GAME[ gameCode ][ flag ].multipliers;
    const rules = GlobalConstants.MULTIPLIER_RULE_BY_GAME[ gameCode ][ flag ].rules;
    const mulRand = isaac.random();
    let mul = multipliers[ 0 ];
    for( let i=0; i<rules.length; i++ ) {
        if( rules[i]>=mulRand ) {
            mul = multipliers[ i ];
            return mul;
        }
    }
    return mul;
}

export const generateProviderErrorString = ( errorCode : number ) => {
    let errorString : any;
    errorString = {
        error : errorCode,
        description : GlobalConstants.ERRORDESCRIPTION[ errorCode ]
    }
    return errorString;
}

export const generateRoundNo = ( now : number, symbolName : string ) => {
    round++;
    if( round>100000 ) round = 0;
    return "" + String(symbolName) + "_" + now + round.toString().padStart(8, '0');
}

export const generateErrorResponse = ( errorCode:number ) => {
    const response = {
        error : errorCode,
        description : GlobalConstants.ERRORMSG[errorCode]
    };
    return response;
}
/**
 * Common functions
 */
export const checkScoreLine = ( symbolArr : number[], gameCode : string, wild : number ) => {
    let minKey = 0;
    let twoSymbol = 0;
    let maxKey = 10;
    const payArr : any[] = [];

    for( let i=1; i<=Object.keys( GlobalConstants.PAYLINESBYGAME[gameCode] ).length; i++ ) {
        let isWin = false;
        const payVal:any = {
            symbol: 0,
            line : 0,
            sameCount: 1
        };
        const payLine = GlobalConstants.PAYLINESBYGAME[gameCode][i];
        const keySymbol = symbolArr[payLine[0]];
        if( keySymbol >= minKey && keySymbol <= maxKey ) {
            payVal.symbol = keySymbol;
            payVal.line = i;
            for(let j = 1; j < payLine.length; j++) {
                // insert for pg
                if( payVal.symbol === wild ) {
                    for( let i=1; i<payLine.length;i++ ) {
                        if( symbolArr[payLine[i]]>1 && symbolArr[payLine[i]] !== wild ){
                            payVal.symbol = symbolArr[payLine[i]];
                            break;
                        }
                    }
                }
                // insert for pg
                if( payVal.symbol === symbolArr[ payLine[j] ] || symbolArr[ payLine[j] ] === wild ) {
                    payVal.sameCount++;
                } else {
                    break;
                }
            }
            if(payVal.sameCount === 2 && payVal.symbol === twoSymbol) isWin = true;
            else if(payVal.sameCount > 2) isWin = true;

            if(isWin) payArr.push( payVal );
        }
    }
    return payArr;
}

export const calcScoreLineBenefit = ( payArr : any[], betMoney : number, gameCode: string, reelWidth : number ) => {
    const benefits : number[] = [];
    payArr.forEach(item => {
        if( item.symbol !== -1 ) {
            benefits.push( Math.round((GlobalConstants.PAYTABLESBYGAME[gameCode][ item.symbol ][ reelWidth - item.sameCount ] || 0)*betMoney*100)/100 );
        }
    })
    return benefits;    
}

export const compareArray = ( arr1:number[], arr2:number[] ) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
/**
 * PG SOFT
 */
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
      Object.keys(GlobalConstants.PGGAMEINFO).find(
        (key) => GlobalConstants.PGGAMEINFO[Number(key)].endpoint === endpoint
      )
    );
  }

export const generateVerifyOperatorPlayerSession = async( otk: string, gi:string, traceId:string ) => {
    if( gi==="126" || gi==="1695365" || gi==="1682240" ) gi="98";
    const userInfo = await Models.getUserInfo( otk, gi );
    if (userInfo === null) {
        const errorResponse = {
            dt: null,
            err: {
                cd: "1310",
                msg: "OERR: Operator return an error. Failed to verify operator player session, error code : 1200.",
                tid: traceId
            }
        };
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
                geu: `game-api/${GlobalConstants.PGGAMEINFO[ gi ].endpoint}/`,
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
                                min: GlobalConstants.PGGAMEINFO[ gi ].rtp[ 0 ],
                                max: GlobalConstants.PGGAMEINFO[ gi ].rtp[ 1 ]
                            }
                        },
                        mxe: GlobalConstants.PGGAMEINFO[ gi ].mxe,
                        mxehr: GlobalConstants.PGGAMEINFO[ gi ].mxehr
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
                eatk: GlobalConstants.PGGAMEINFO[ gi ].eatk,
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

export const generateGameRule = async( gid:string ) => {
    const gameInfo = GlobalConstants.PGGAMEINFO[ gid ];
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

export const generateGameInfo = async( atk:string, gi:string ) => {
    const userInfo = await Models.getUserInfo( atk, gi );
    if (userInfo === null) return GlobalConstants.ERRORSTRING[6];
    
    const gameInfo = GlobalConstants.PGGAMEINFO[ gi ];
    const csInfo = gameInfo.cs[userInfo.property.currency]

    const rabbitResp = {
        wp: null,
        lw: null,
        orl: gameInfo.orl,
        ift: false,
        iff: false,
        cpf: {},
        cptw: 0,
        crtw: 0,
        imw: false,
        fs: null,
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
        ml: gameInfo.ml[0],
        cs: csInfo[0],
        rl: gameInfo.orl,
        sid: "1922078743963241984",
        psid: "1922078743963241984",
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
        ge: [ 1, 11 ]
    };

    const oxResp = {
        wp: null,
        lw: null,
        rf: false,
        rtf: false,
        fs: false,
        rc: 0,
        im: false,
        itw: false,
        wc: 0,
        gwt: 0,
        ctw: 0,
        pmt: null,
        cwc: 0,
        fstc: null,
        pcwc: 0,
        rwsp: null,
        hashr: null,
        fb: null,
        ab: null,
        ml: 10,
        cs: 0.05,
        rl: [
            2,2,2,99,0,0,0,0,3,3,3,99
        ],
        sid: "0",
        psid: "0",
        st: 1,
        nst: 1,
        pf: 0,
        aw: 0,
        wid: 0,
        wt: "C",
        wk: "0_C",
        wbn: null,
        wfg: null,
        blb: 0,
        blab: 0,
        bl: 22.77,
        tb: 0,
        tbb: 0,
        tw: 0,
        np: 0,
        ocr: null,
        mr: null,
        ge: null
    }

    const gameInfoResponse: any = {
        dt: {
            fb: null,
            wt: gameInfo.wt,
            maxwm: 5000,
            gcs: {},
            abm: null,
            cs: csInfo,
            ml: gameInfo.ml,
            mxl: gameInfo.mxl,
            bl: userInfo.balance,
            inwe: false,
            iuwe: false,
            ls: {
                si: rabbitResp
            },
            cc: userInfo.property.currency
        },
        err: null
    };

    switch ( gi ) {
        case "98":
            gameInfoResponse.ls.si = oxResp;
            break;
        case "1543462":
            gameInfoResponse.ls.si = rabbitResp;
            break;
    }

    return gameInfoResponse;
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