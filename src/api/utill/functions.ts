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
        let geu = "";
        switch (gi) {
            case "1543462":
                geu = "rabbit"
                break;
            case "98":
                geu = "ox"
                break;
        
            default:
                break;
        }
        const resp = {
            dt: {
                oj: { 
                    jid: 11
                },
                pid: "2qrzu401OJ",
                pcd: "a7kbetbr_30248538",
                tk: otk,
                st: 1,
                geu: `game-api/fortune-${geu}/`,
                lau: "game-api/lobby/",
                bau: "web-api/game-proxy/",
                cc: userInfo.property.currency,
                cs: currencyInfo ? currencyInfo.symbol : "Currency Symbol not found!",
                nkn: "a7kbetbr_30248538",
                gm: [ 
                    {
                        gid: 1543462,
                        msdt: 1673431954000,
                        medt: 1673431954000,
                        st: 1,
                        amsg: "",
                        rtp: {
                            df: {
                                min: 96.75,
                                max: 96.75
                            }
                        },
                        mxe: 5000,
                        mxehr: 1000000000
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
                eatk: "bVAQ+3eFrfmDLlPJDem0FmXMn9h+34hG/Nosx/cImGVh7s+1HehvbXGUVNMElhOtwgy5cTHc3qI/jj9RFjVeuKSi4JyTG22tJ6WkFiU6Zj24CCzbPQt9f/MVtcK5cFyi/DSwS9e74oouJKo/+oIwUdpM/yseACt6AUJblj1BkRRRWXhm7K6cCRoBJGCcPPOzIg/T0BV7Gg6njlJgc8FXi8dMhDGay+/u2TLnhmL5rAgxs86S83dXClp0Nvh2/1rX",
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
        return resp;
    } 
}

export const generateBetSummary = async() => {
    const now = getCurrentTime();
    const response = {
        dt: {
            bs: {
                bc: 1,
                btba: 4, // total bet amount for 10 times
                btwla: -4, // total profit for 10 times
                gid: 126, // 126 
                lbid: now // 1725192145878978800
            },
            lut: 1725192145879
        },
        err: null
    };
    return response;
}

export const generateBetHistory = async() => {
    const now = getCurrentTime();
    const response = {
        dt: {
            bh: [
                {
                    cc: "BRL",
                    bt: 1725192145879,
                    fscc: 0,
                    ge: [ 1, 11 ],
                    gid: 126,
                    gtba: 4,
                    gtwla: -4,
                    mgcc: 0,
                    tid: String(now), // "1725192145878978800",
                    bd: [
                        {
                            bl: 715682.95,
                            bt: 1725192145879,
                            tba: 4,
                            twla: -4,
                            tid: String(now), // "1725192145878978800",
                            gd: {
                                wc: 31,
                                ist: false,
                                itw: true,
                                fws: 0,
                                wp: null,
                                orl: [ 4, 2, 2, 7, 2, 6, 6, 7, 3 ],
                                lw: null,
                                irs: false,
                                gwt: -1,
                                fb: null,
                                ctw: 0,
                                pmt: null,
                                cwc: 0,
                                fstc: null,
                                pcwc: 0,
                                rwsp: null,
                                ml: 10,
                                cs: 0.08,
                                rl: [ 4, 2, 2, 7, 2, 6, 6, 7, 3 ],
                                st: 1,
                                nst: 1,
                                pf: 1,
                                aw: 0,
                                wid: 0,
                                wt: "C",
                                wk: "0_C",
                                wbn: null,
                                wfg: null,
                                tb: 4,
                                tbb: 4,
                                tw: 0,
                                np: -4,
                                ocr: null,
                                mr: null,
                                ge: [ 1, 11 ],
                                psid: String(now), // "1725192145878978800",
                                sid: String(now), // "1725192145878978800",
                                blb: 715686.95,
                                blab: 715682.95,
                                bl: 715682.95
                            }
                        }
                    ]
                }
            ]
        },
        err: null
    };
    return response;
}

export const generateGameRule = async() => {
    const gameInfo = GlobalConstants.PGGAMEINFO[1543462];
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
    
    const gameInfo = GlobalConstants.PGGAMEINFO[ 1543462 ];
    const csInfo = gameInfo.cs[userInfo.property.currency]

    let gameInfoResponse = {};

    const rabbitResponse = {
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
                si: {
                    wp: null,
                    lw: null,
                    orl: gameInfo.orl,
                    ift: false,
                    iff: false,
                    cpf: gameInfo.cpf,
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
                }
            },
            cc: userInfo.property.currency
        },
        err: null
    };
        
    gameInfoResponse = rabbitResponse;

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