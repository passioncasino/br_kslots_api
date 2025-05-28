import isaac from 'isaac';
import { IPayVal, IPGwinning } from "@/api/utill/interface";
import { generatePGWinningInfo } from "../pgFunctions";

const ngWin=5, ngLost=4, rsWin=3, rsLost=2, normalWin=1, lost = 0, emptySym = 0;

const getSymbols = ( params:any ) => {
    const mul: {[ key:number ]: number } = {
        1: 0.1, 2: 0.5, 3: 1, 4: 5, 5: 10
    };
    const bankMul: {[ key:number ]: number } = {
        2: 2,  3: 3,  4:  5,  5: 10,  6: 15, 
        7: 20, 8: 30, 9: 40, 10: 50, 11:100
    }
    const REELS: {[key: string]: Array<number[]>} = {
        NORMAL: [
            [
                5,0,3,5,2,0,2,4,1,2,3,0,2,3,2,0,4,5,1,3,0,3,4,1,2,1,4,0,1,2,5,1,0,1,4,2,3,0,1,5,3,1,0,2,4,2,5,1,0,1,2,3,4,1,2,4,4,0,3,1,4,0,2,1,2,3,0,4,3,1,1,3,0,5,1,2,5,4,1,2,0,2,3,5,2,0,4,2,3,3,0,1,2,2,0,1,4,5,1,4,0,4,1,2,0,3,3,1,4,0,2,1,4,5,0,4,1,1,0,1,3,5,2,0,1,4,2,3,1,0,3,4,4,2,0,3,3,4,2,5,2,4,0,5,1,3,4,4,3,4,5,2,3,3,0,3,2,2,1,1,3,1,4,3,2,0,4,3,1,3,3,4,2,5,1,0,3,4,0,3,4,2,4,3,1,2,3,0,3,5,2,0,3,1,4,2,0,3,4,1,3,1,0,1,3,2,3,2,4,0,4,3,2,2,0,3,5,4,3,1,2,3,1,3,1,0,1,3,5,3,4,5,0,1,4,2,1,5,1,0,3,5,1,0,5,4,2,1,5,3,2,3,0,3,2,1,4,5,3,0,4,5,5,3,0,1,4,5,0,3,2,4,0,3,1,0,1,3,1,2,2,2,3,4,1,0,3,1,1,3,4,4,3,4,1,1,5,0,4,5,2,1,2,0,1,1,4,2,0,1,1,0,3,2,5,0,4,5,3,3,5,4,4,2,3,0,4,3,5,2,0,3,4,1,3,1,0,3,3,4,2,1,4,1,2,0,3,2,4,2,3,3,3,2,2,5,1,3,0,4,1,2,2,3,0,4,1,3,2,3,0,2,3,1,4,5,0,2,1,1,1,3,0,5,4,3,3,1,0,2,5,3,0,3,1,4,4,0,3,2,0,1,4,3,0,3,4,4,3,2,5,3,4,2,3,4,0,2,1,2,0,5,4,3,5,0,2,4,1,0,2,2,1,5,0,3,4,1,0,3,3,5,3,1,2,0,2,3,2,1,4,2,0,5,3,2,2,4,5,0,5,4,1,2,1,0,3,3,2,1,4,1,5,1,4,5,2,1,0,2,1,5,1,0,4,3,3,1,2,3,3,0,3,3,2,3,4,4,2,0,3,1,0,1,5,3,4,0,1,2,4,3,3,1,0,5,1,2,3,4,0,2,1,2,4,4,0,2,1,4,3,1,5,4,0,3,4,2,0,1,4,5,3,4,3,3,2,0,5,1,4,2,1,0,3,5,0,1,4,0,3,1,5,5,0,2,2,5,3,4,2,1,3,1,1,0,1,2,4,2,3,2,0,4,1,2,4,0,3,4,1,2 
            ],[ 
                0,1,14,4,2,1,0,2,2,2,1,0,3,1,0,1,9,2,1,5,4,4,0,8,8,1,1,4,1,2,5,1,0,4,1,12,0,1,6,1,0,9,4,0,1,6,10,5,7,6,6,1,3,3,0,7,2,4,1,3,2,5,0,1,3,1,4,0,5,7,2,6,9,4,0,7,1,0,2,14,0,1,5,5,8,0,1,2,1,6,7,7,3,1,2,3,0,2,5,6,10,1,0,3,6,3,1,0,5,4,2,1,4,1,9,4,3,2,1,2,0,3,7,4,2,6,6,0,1,4,1,2,0,7,2,1,7,4,0,3,8,2,1,0,1,6,6,0,3,2,1,6,9,1,5,5,3,1,0,1,2,0,1,2,1,7,2,0,5,3,6,0,2,5,0,3,4,0,2,3,2,3,0,1,2,4,0,1,3,0,2,5,4,1,0,8,3,2,1,2,1,2,4,0,3,1,3,3,1,0,2,1,9,1,5,2,0,3,4,1,12,8,0,6,1,2,5,13,1,7,0,2,6,0,3,3,2,0,5,6,0,5,6,1,3,1,0,1,8,2,3,12,1,0,1,3,7,8,3,3,1,0,2,3,3,1,4,7,2,1,8,3,1,2,2,2,8,0,1,1,4,1,11,0,4,3,9,1,0,1,8,2,0,6,8,1,6,0,2,4,1,2,1,0,3,2,2,0,1,13,1,8,10,0,7,1,6,1,2,1,1,3,7,0,4,3,4,1,5,1,8,0,8,2,0,14,0,1,3,2,3,2,9,0,7,1,3,4,1,0,2,5,4,3,3,6,1,2,1,0,2,4,4,2,3,1,3,0,4,1,5,0,8,1,0,7,6,8,4,0,2,5,0,3,1,1,0,4,2,0,1,1,8,1,8,0,1,4,1,1,2,3,11,0,1,1,4,0,2,3,5,10,1,9,4,0,1,6,1,3,5,2,1,13,8,1,0,2,2,7,0,1,2,0,1,3,1,8,0,2,6,3,0,9,6,1,0,1,2,4,0,6,2,1,5,1,0,1,2,8,1,1,2,4,1,0,5,2,1,7,1,1,2,8,4,0,1,2,3,3,0,4,4,1,2,2,1,0,5,0,9,1,3,8,3,1,4,6,0,2,4,1,5,4,0,1,2,2,2,1,0,4,6,2,1,0,4,8,4,7,0,2,1,3,14,2,2,6,2,0,2,9,1,5,0,5,4,2,8,1,1,0,1,7,1,0,5,7,4,1,3,8,0,6,5,1,4,9,2,0,1,3,1,5,1,8,0,1,3,0,7,1,2,0,3,6,12,1,2 
            ],[ 
                3,5,1,0,4,3,1,3,2,4,0,3,2,1,4,1,5,0,4,1,2,2,0,3,3,1,3,0,4,3,5,2,3,1,3,0,2,3,1,0,4,1,3,0,4,1,3,4,3,1,2,0,3,4,5,1,0,3,3,4,1,0,5,1,3,4,1,4,0,3,3,2,5,0,2,1,0,3,2,5,3,5,0,4,2,1,2,3,2,0,1,4,4,0,3,1,5,5,2,4,1,3,0,4,2,1,2,4,3,3,3,0,3,1,4,0,3,3,2,5,3,2,4,0,5,1,0,4,2,1,2,4,0,5,5,1,2,2,3,3,0,4,1,1,5,0,3,1,2,1,4,3,3,2,0,3,1,0,1,1,5,3,2,5,0,1,5,3,2,1,4,2,0,5,3,1,3,0,4,1,0,3,0,4,3,1,0,3,5,1,1,0,5,1,4,3,1,0,2,3,2,1,3,3,0,3,1,4,3,0,4,3,3,0,2,5,3,3,2,2,0,5,2,1,5,4,0,3,2,4,2,0,1,2,0,5,3,1,4,3,0,4,2,3,1,2,0,2,4,1,0,3,3,4,0,1,3,5,5,1,4,3,0,2,3,0,1,4,2,0,5,1,1,4,0,1,2,4,1,0,3,1,4,3,4,5,3,0,2,4,3,1,2,2,4,3,5,0,2,1,4,1,0,1,2,4,2,5,5,0,2,4,5,4,5,2,4,0,1,5,5,0,4,3,2,3,2,3,0,5,4,1,4,3,0,3,2,5,0,2,3,2,4,1,2,0,1,2,1,0,2,3,3,4,0,3,2,4,3,2,0,3,3,5,5,1,0,3,1,2,4,2,1,2,0,1,5,3,0,2,3,4,4,1,4,0,1,2,2,0,3,1,1,0,2,4,0,5,2,1,1,0,4,5,1,1,5,2,0,1,2,4,1,0,5,3,2,2,0,1,4,3,4,2,5,1,0,3,1,0,4,4,0,1,2,3,0,2,2,1,3,0,2,3,3,4,5,2,2,2,0,3,5,4,3,1,0,2,1,2,2,4,0,4,3,2,5,0,4,4,2,3,3,4,2,0,3,3,3,2,3,2,5,1,1,0,4,2,1,3,1,0,3,3,0,2,1,4,4,5,1,4,2,0,2,1,4,0,2,3,0,3,5,3,0,4,1,5,4,2,1,0,5,3,1,2,4,2,0,3,5,4,4,3,3,0,5,5,3,2,0,3,4,4,5,0,4,2,3,3,0,1,3,1,2,0,1,4,4,0,1,3,3,2,3,0,1,4,5,3,4,0,2,1,3,2,0,2,5,4,1,1,0,2,5,1,3,0,1
            ]
        ],
        FREESPIN: [
            [ 
                3,5,0,1,2,1,4,0,3,2,1,2,3,2,2,0,3,1,5,4,5,0,3,4,2,4,3,1,0,1,1,4,5,4,5,1,0,5,2,1,1,0,1,1,2,3,5,0,4,1,3,4,1,2,0,2,3,4,2,1,4,4,0,3,4,5,2,4,0,1,1,5,1,3,0,2,5,3,3,3,0,3,4,5,3,1,0,4,3,3,1,1,1,0,3,5,1,4,1,3,3,4,5,3,0,1,4,2,2,2,0,1,3,2,5,2,2,4,3,1,0,2,2,1,5,2,0,4,3,1,2,3,0,1,4,4,0,3,3,2,3,0,5,2,3,0,2,1,1,2,0,1,3,3,4,4,2,0,3,2,4,2,0,3,4,4,3,1,3,4,0,5,3,5,5,0,4,4,5,2,1,3,3,0,1,3,4,5,4,3,5,0,1,2,2,1,3,3,5,3,0,2,1,1,1,3,0,1,3,2,5,2,0,2,3,3,1,2,5,1,3,0,4,5,3,2,4,5,5,0,1,2,3,2,4,4,4,5,0,5,2,3,4,2,1,5,0,3,3,3,2,5,5,0,4,5,1,2,4,2,1,0,3,5,1,3,4,1,0,3,2,2,1,2 
            ],[ 
                4,0,3,3,1,2,3,0,1,7,3,6,1,10,0,1,1,2,4,1,2,2,2,0,1,1,2,9,2,2,1,4,2,3,0,1,1,1,2,4,7,2,7,0,4,1,2,13,5,1,2,3,1,2,6,0,9,2,4,3,8,0,3,9,8,1,0,4,2,7,1,1,0,14,1,2,2,3,3,0,4,2,7,1,6,8,11,5,1,0,6,9,7,1,7,4,3,5,0,1,7,3,2,1,4,2,2,0,4,1,7,2,2,1,3,0,12,6,1,2,10,0,3,1,2,2,1,2,6,1,0,2,4,1,1,2,8,3,9,2,1,1,0,1,1,3,0,1,1,1,8,3,0,2,2,1,5,5,0,6,7,1,13,2,5,5,8,0,11,1,3,1,0,3,1,1,5,2,6,2,3,1,9,0,1,8,3,6,5,8,0,1,2,7,0,1,1,4,5,1,6,8,0,7,3,1,1,1,0,3,1,2,8,1,0,2,8,8,5,0,1,1,2,5,6,0,6,2,1,2,0,4,4,10,2,2,1,4,0,2,1,5,5,1,0,9,1,6,4,1,1,0,4,1,1,1,0,1,7,3,1,8,7,0,3,3,6,9,1,0,4,4,5,1,12,1,2
            ],[ 
                1,5,0,3,5,3,2,2,2,0,4,5,3,4,3,2,4,4,0,5,5,1,4,4,1,5,3,0,1,2,3,3,3,1,2,4,0,5,4,5,2,1,2,3,3,0,2,4,2,4,2,3,0,1,3,4,5,3,0,2,3,4,3,1,1,4,0,4,1,2,2,0,1,2,1,4,4,0,2,3,1,4,5,2,0,2,1,3,3,3,0,2,4,3,1,0,2,3,3,5,0,3,4,4,1,3,1,0,2,4,1,1,1,5,0,4,2,2,3,2,5,3,4,0,3,5,2,3,5,1,2,1,0,2,3,3,4,3,1,0,2,4,2,5,0,3,1,4,2,0,1,3,2,3,3,0,1,4,2,3,0,1,1,4,3,1,3,0,1,1,3,4,2,1,5,1,1,0,3,5,4,3,5,3,3,4,5,0,5,4,3,1,4,2,0,1,5,3,2,1,5,2,2,0,4,5,3,4,1,3,2,2,0,1,4,2,3,1,4,2,1,0,2,5,1,4,0,3,3,5,5,0,1,4,1,5,3,4,2,0,1,1,1,3,2,2,3,0,5,3,3,1,0,1,5,3,4,1,5,0,2,3,1,0,5,2
            ]
        ]
    };
    const SYMBOLS = params.isFs ? REELS.FREESPIN : REELS.NORMAL;

    let symbols: number[] = [];
    let rv: number[] = [];

    for (let ind = 0; ind < 3; ind++) {
        const reelRnd = Math.floor( isaac.random()*SYMBOLS[ind].length );
        for( let j=0; j<3; j++ ) {
            const symbol = SYMBOLS[ind][ (reelRnd+j)%SYMBOLS[ind].length ];
            symbols.push( symbol );
        }
    }

    if( symbols.includes( emptySym )) {
        const emptyPoss = symbols.reduce(( acc:number[], val:number, idx:number) => {
            if( val===emptySym ) acc.push( idx );
            return acc;
        }, []);
        emptyPoss.forEach((pos) => {
            if( pos%3 !== 1 ) {
                if( pos%3 === 0 ) {
                    const a = symbols[pos+1];
                    symbols[pos] = a;
                    symbols[pos+1] = emptySym;
                } else {
                    const a = symbols[pos-1];
                    symbols[pos] = a;
                    symbols[pos-1] = emptySym;
                }                
            }
        })
    }

    symbols.forEach( (symbol, index) => {
        if( symbol===emptySym ) {
            rv.push( emptySym );
        } else {
            if( index<3 || index>5 ) {
                const rvVal = Math.round( 100*params.stake*mul[symbol] ) / 100;
                rv.push( rvVal );
            } else {
                if( symbol===1 || symbol>=12 ) rv.push( 1 );
                else rv.push( bankMul[symbol] );
            }
        }
    });

    return { symbols, rv };
}

export const getGameInfo = ( params: any ) => {
    const symbolInfo = getSymbols( params );
    const scoreInfo: IPayVal[] = [];

    let symbols: number[] = symbolInfo.symbols;
    let rv: number[] = symbolInfo.rv;
    let rsSymbols: number[] = [];
    let rsrv: number[] = [];
    let flag = lost;

    if( symbols[1]!==emptySym && symbols[1]===symbols[7] ) {
        if( !symbols.includes( emptySym ) ) {
            flag = normalWin;
        } else {
            if( symbols[4]===emptySym || symbols[5]===emptySym || symbols[6]===emptySym ) {
                const ngRnd = isaac.random();
                flag = ngRnd<0.921 ? ngWin : ngLost;
                if( flag===ngWin ) {
                    rsSymbols = symbols;
                    rsrv = rv;
                    const dirRand = isaac.random();
                    rsSymbols[4] = dirRand<0.5 ? rsSymbols[3] : rsSymbols[5];
                    rsrv[4] = dirRand<0.5 ? rsrv[3] : rsrv[5];
                }
            }
        }
    } else {
        if( !symbols.includes( emptySym ) ) {
            const symbolDict = [ 1,2,3,4,5 ];
            if( symbolDict.includes(symbols[ 4 ]) || 
                symbolDict.includes(symbols[ 5 ]) || 
                symbolDict.includes(symbols[ 6 ])
            ) {
                flag = rsLost;
                const rsSymbolInfo = getSymbols( params );
                rsSymbols = rsSymbolInfo.symbols;
                rsrv = rsSymbolInfo.rv;
                for( let i=3; i<6; i++ ) {
                    rsSymbols[ i ] = symbols[ i ];
                    rsrv[ i ] = rv[ i ];
                }
                if( rsSymbols[1]!==0 && rsSymbols[1]===rsSymbols[7] ) flag = rsWin;
            }
        }
    }

    if( flag===normalWin || flag===rsWin || flag===ngWin ) {
        const mul   = flag===normalWin ? rv[ 4 ] : rsrv[ 4 ];
        const keyRv = flag===normalWin ? rv[ 1 ] : rsrv[ 1 ];
        const keySymbol = flag===normalWin ? symbols[ 1 ] : rsSymbols[ 1 ];
        const profit = Math.round( keyRv*mul*100 ) / 100;

        const payVal: IPayVal = {
            symbol: keySymbol,
            profit: profit,
            line : 1,
            sameCount: 3
        };
        scoreInfo.push( payVal );
    }
    return { symbols, rv, rsSymbols, rsrv, scoreInfo, flag };
}

export const generateSpinResponse = ( params:any ) => {
    const GAMECODE = "1682240";

    const wpParams : IPGwinning = {
        scoreInfo: params.scoreInfo,
        stake: params.stake,
        gameCode: GAMECODE
    }
    const { wpInfo, lwInfo, rwspInfo } = generatePGWinningInfo( wpParams );

    let ge = params.flag === rsWin ? 2 : 1;
    let rl = params.flag === rsWin || params.flag===rsLost || params.flag===ngWin ? params.rsSymbols : params.symbols;
    let rv = params.flag === rsWin || params.flag===rsLost || params.flag===ngWin ? params.rsrv  : params.rv;
    let rsrl = params.flag === rsWin || params.flag===rsLost ? params.symbols : null;
    let rsrv = params.flag === rsWin || params.flag===rsLost ? params.rv : null;
    let bl=params.balance, st=1, nst=1, tb=params.stake, pcwc = params.spinProfit>0 ? 1 : 0;
    let blb = params.balance;
    let blab = params.balance;
    let twbm = params.spinProfit>0 ? params.rv[1] : 0;
    let cwc = params.spinProfit > 0 ? 1 : 0;
    let profit = params.spinProfit;
    let fs = null, fstc = null, orl = null, orv = null, nfp = null;
    if( params.isFs ) {
        ge = nst = 2;
        fs = {
            s: params.fsMaxCnt-params.fsCnt,
            ts: params.fsMaxCnt,
            as: params.isFsMore ? params.fsMoreCnt : 0,
            aw: 0,
            gt: params.fsType
        };
        profit = params.fsProfit;
        if( params.fsCnt>0 ) {
            st=2;
            fstc = {
                2 : params.fsCnt
            }
            if( params.fsCnt === params.fsMaxCnt ) {
                fs.aw = params.fsProfit;
                pcwc = 0, nst = 1, ge = 1;
                bl = Math.round( bl*100+params.fsProfit*100 ) / 100;
            } else {
                bl = blab = Math.round( bl*100+params.stake*100 ) / 100;
            }
        } else {
            blb = Math.round( params.balance*100 + params.stake*100 ) / 100;
            bl = Math.round( params.balance*100 + params.spinProfit*100 ) / 100;
        }
    } else {
        bl = Math.round( params.balance*100 + params.spinProfit*100 ) / 100;
    }
    if( params.flag===ngWin || params.flag===ngLost ) {
        ge = 3;
        nfp = {
            1 : params.flag===ngLost ? -1 : 1+params.symbols.indexOf( emptySym )
        }
        if( params.flag===ngWin ) {
            orl = params.symbols;
            orv = params.rv;
        }
    } 

    const resp = {
        wp: wpInfo,
        lw: lwInfo,
        twbm: twbm,
        fs: fs,
        imw: false,
        rv: rv,
        orl: orl,
        orv: orv,
        rsrl: rsrl,
        rsrv: rsrv,
        nfp: nfp,
        gwt: -1,
        pmt: null,
        ab: null,
        ml: Number(params.actionData.ml),
        cs: Number(params.actionData.cs),
        rl: rl,
        ctw: params.spinProfit,
        cwc: cwc,
        fstc: fstc,
        pcwc: pcwc,
        rwsp: rwspInfo,
        hashr: null,
        fb: null,
        sid: params.nextId,
        psid: params.nextId,
        st: st,
        nst: nst,
        pf: Number(params.actionData.pf),
        aw: profit,
        wid: 0,
        wt: "C",
        wk: "0_C",
        wbn: null,
        wfg: null,
        blb: blb,
        blab: blab,
        bl: bl,
        tb: tb,
        tbb: params.stake,
        tw: params.spinProfit,
        np: Math.round( params.spinProfit*100-tb*100 )/100,
        ocr: null,
        mr: null,
        ge: [ ge, 11 ]
    }
    return resp;
}
