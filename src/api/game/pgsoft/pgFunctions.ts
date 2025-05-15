import { HistoryItemType } from "@/api/utill/interface";

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