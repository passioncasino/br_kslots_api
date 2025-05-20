import { MongoClient } from 'mongodb';
import { generateErrorResponse } from '@/api/utill/functions';
const daily = 86340;
const _SERVERERROR = 501;
let Users : any;
let PG2RabbitHistories  : any;
let PG1OxHistories  : any;

export const connect = async (dbName : string) => {
    try {
        const mongoURL = process.env.CONNECTION_STRING as string;
        const client = new MongoClient( mongoURL );
        await client.connect();
        console.log(`Connected to ${ dbName }` );
        const db = client.db(dbName);
        Users = db.collection('Users');

        PG2RabbitHistories  = db.collection('PG2RabbitHistories');
        PG1OxHistories  = db.collection('PG1OxHistories');

        return true;
    } catch ( error ) {
        console.log(`db connect error, `, error);
    }
};

const selectCollection = ( gameCode:string ) => {
        switch ( gameCode ) {
            case "98":
                return PG1OxHistories;
            case "1543462":
                return PG2RabbitHistories;
        }
}

/**
 * user management
 */

const initUserInfo = ( userInfo:any ) => {
    switch (userInfo.property.game) {
        case "1543462":
            userInfo["gameStatus"] = {
                coin : 0.03,
                sid : "0",
                isFs : false,
                fsCnt : 0,
                fsProfit : 0
            };            
            break;
        case "98":
            userInfo["gameStatus"] = {
                coin : 0.03,
                sid : "0",
                cwc : 0,
                twMoney : 0,
                isFs : false,
                fws : 0,
                fsCnt : 0,
                fsProfit : 0,
                fwsSymbols : [] as number[],
            };
            break;
    }
    return userInfo;
}

const createUserInfo = async ( userInfo:any, oldUser:any, state: number ) => {
    try {
        /**
         * state=0 same user is not existing
         * state=1 user and game exist
         * state=2 same user but no game
         */
        let oldFrStatus: any = {};
        let oldGameStatus: any = {};
        if( state>0 ) {
            if( userInfo.property.mode===0 ) userInfo.balance = oldUser.balance;
            if( state===1 ) {
                oldGameStatus = oldUser.gameStatus;
                oldFrStatus = oldUser.frStatus;
                const isDelete = await Users.deleteOne({ 
                    token:oldUser.token
                });
            }
        }
        userInfo = initUserInfo( userInfo );
        if( state===1 ) {
            userInfo.gameStatus = oldGameStatus
        }
        const res = await Users.insertOne( userInfo );
        if( res.insertedId ) return 1;
        else return 0;
    } catch ( err ) {
        console.log("====> createUserInfo ::", err );
        return _SERVERERROR;
    }
}

export const addUser = async ( newUser:any ) => {
    try {
        let addVal = 0;
        let status = 0;
        const oldUserArr = await Users.find({ 
            "property.user": newUser.property.user
        }).toArray();
        let oldUser = oldUserArr[0];
        console.log(`> -------------- > oldUserLen=${oldUserArr.length}`);

        if( oldUserArr.length>0 ) {
            const sameGame = oldUserArr.findIndex( (item:any) => item.property.game===newUser.property.game );
            console.log(`sameGame=${sameGame}`);
            if( sameGame>-1 ) {
                status = 1;
                oldUser = oldUserArr[sameGame];
            } else {
                status = 2;
            }
        }
       
        console.log(`status=${status}`);
        addVal = await createUserInfo( newUser, oldUser, status );
        return addVal;
    } catch (error) {
        console.log('addUser', error);
        return _SERVERERROR;
    }
}

export const getUserInfo = async( token:string, gi:string ) => {
    try {
        return await Users.findOne({
            token : token, 
            "property.game": gi
        }, { 
            sort : {_id : -1}
        });
    } catch (error) {
        console.log('getUserInfo', error);
        return false;
    }
}

export const getUserInfoByUser = async( gameCode: string, user: string ) => {
    try {
        const userInfo = await Users.findOne({
            "property.user": user,
            "property.game": gameCode,
        }, {
            sort: {_id: -1}
        });
        return userInfo;
    } catch (error) {
        console.log(`getUserInfoByUser ::`, error);
    }
}

export const getUserBalance = async( token:string ) => {
    try {
        const user = await Users.findOne( { token:token }, { sort:{_id:-1 }} );
        if( user===null ) return -100;
        else return user.balance;
    } catch (error) {
        console.log('getUserInfo', error);
        return -100;
    }
}

export const updateUserBalance = async( user : string, newBalance : number ) => {
    try {
        const filter = { "property.user":user };
        const updateInfo = { 
            $set : { balance : newBalance }
         };
        await Users.updateMany( filter, updateInfo );
    } catch (error) {
        console.log('updateUserBalance', error);
        return generateErrorResponse(501);
    }
}

export const updateUserInfo = async ( gameCode: string, mgckey: string, userInfo: any ) => {
    try {
        switch (gameCode) {
            case "1543462" :
                const pg2 = await Users.updateOne(
                    { token: mgckey, "property.game" : gameCode },
                    {
                        $set : {
                            "property.lastId" : userInfo.property.lastId,
                            gameStatus : {
                                coin : userInfo.gameStatus.coin,
                                sid: userInfo.gameStatus.sid,
                                isFs : userInfo.gameStatus.isFs,
                                fsCnt : userInfo.gameStatus.fsCnt,
                                fsProfit : userInfo.gameStatus.fsProfit,
                            }
                        }
                    }
                );
                return (pg2.modifiedCount>0 && pg2.matchedCount===1) ? 1 : 0;
            case "98" :
                const pg98 = await Users.updateOne(
                    { token: mgckey, "property.game" : gameCode },
                    {
                        $set : {
                            "property.lastId" : userInfo.property.lastId,
                            gameStatus : {
                                twMoney : userInfo.gameStatus.twMoney,
                                coin : userInfo.gameStatus.coin,
                                cwc : userInfo.gameStatus.cwc,
                                isFWS : userInfo.gameStatus.isFWS,
                                fws : userInfo.gameStatus.fws,
                                fwsCnt : userInfo.gameStatus.fwsCnt,
                                fwsSymbols : userInfo.gameStatus.fwsSymbols,
                                fsWinMoney : userInfo.gameStatus.fsProfit,
                            }
                        }
                    }
                )
                return (pg98.modifiedCount>0 && pg98.matchedCount===1) ? 1 : 0;
        }

    } catch (error) {
        console.log('updateUserInfo', error);
        return -1;
    }
}

/**
 * ResponseManage
 */

export const getGameLogByRoundID = async ( gameCode:string, roundID:number ) => {
    const collection = selectCollection( gameCode );
    if( collection===false ) {
        return generateErrorResponse( 502 )
    } else {
        const result = collection.findOne(
            { roundid : roundID }, 
            { sort : {_id : -1} }
        );
        return result;
    }
}

export const saveHistory = async ( historyInfo: any ) => {
    try {
        const collection = selectCollection( historyInfo.gameCode );
        if( collection===false ) {
            return generateErrorResponse( 502 )
        } else {
            const now = new Date().getTime();
            const historyItem = {
                roundid : historyInfo.roundid,
                user : historyInfo.user,
                currency : historyInfo.currency,
                stake : historyInfo.stake,
                profit : historyInfo.profit,
                balance : historyInfo.balance,
                response : [ historyInfo.response ],
                isSequence : historyInfo.isSequence,
                rid : 0,
                created: now,
            }
            await collection.insertOne( historyItem );
        }
    } catch (error) {
        console.log(`saveHistory error`, error);
        return generateErrorResponse( 501 );
    }
}

export const updateSequenceHistory = async( historyInfo: any ) => {
    try {
        const collection = selectCollection( historyInfo.gameCode );
        if( collection===false ) {
            return generateErrorResponse( 502 )
        } else {
            const res = await collection.updateOne(
                { roundid : historyInfo.lastId },
                { 
                    $set : {
                        profit : historyInfo.profit,
                        isSequence : true
                    },
                    $push : {
                        response : historyInfo.response
                    }
                }
            )
            return ( res.modifiedCount>0 && res.matchedCount===1 ) ? 1 : 0;
        }
    } catch (error) {
        console.log(`updateSequenceHistory error`, error);
        return generateErrorResponse( 501 );
    }
}

/**
 * PG SOFT
 */
export const getPGHistory = async( gameCode: string, userCode: string ) => {
    try {
        const collection = selectCollection( gameCode );
        const filter = { user:userCode };
        const sortParam = { created: -1 };
        const histories = await collection.find( filter ).sort( sortParam );
        const result = histories.toArray();
        return result;
    } catch (error) {
        console.log("getPGHistory", error);
        return -1;
    }
}