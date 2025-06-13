import * as Models from '@/common/models/index';
import * as GlobalFunctions from '@/api/utill/functions';
import * as GlobalConstants from '@/api/utill/constants';
import * as PGFunctions from '@/api/game/pgsoft/pgFunctions';
import { LauncherType } from '@/api/utill/interface';

export const commonService = {
    openProviderGame: async( gameCode:string|number ) => {
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

    deleteHistoryLog: async( game: string ) => {
        const result = await Models.deleteHistoryLog( game );
        if( result>-1 ) {
            const res = {
                error: 0,
                description: `You delete ${result} datas.`
            }
            return res;
        } else {
            return GlobalFunctions.generateErrorResponse(501);
        }
    }
}

export const pgSoftService = {
    openPGVerify: ( atk: string, gid: string, env: string, l: string, sid: string, tid: string ) => {
        const verifyUrl = 'pgsoft/verify/index';
        return verifyUrl;
    },

    openPGVerifyPage: ( gid: string ) => {
        const redirectUrl = `pgsoft/redirect/${gid}`;
        return redirectUrl;
    },

    openPGRedirect: () => {
        const redirectUrl = 'pgsoft/redirect/redirect';
        return redirectUrl;
    },

    getBetHistoryVerifyHtml: ( ea:string, env:string ) => {
        const atkMatch = ea.match(/(?:^|&)atk=([^&]*)/);
        const atk = atkMatch ? atkMatch[1] : null;
        const msg = PGFunctions.encodeBase64Utf8( ea );
        const content1 = `<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>game-launcher BY PG SOFT&reg;</title><style rel=\"stylesheet\" crossorigin>html,body{background:#000;color:#fff;padding:0;margin:0;font-family:Arial,PingFang SC,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif}#b{--time: .3s;position:fixed;top:0;z-index:9;width:100%!important;background:#bebebe;transition:var(--time) linear;transition-property:background-color}#b:before{display:block;content:\"\";width:1%;height:6px;background:#787878;transition:var(--time) linear;transition-property:width,background-color}#b.t1{background:#083a46}#b.t1:before{width:10%;background:#19bee6}#b.t2{background:#33184d}#b.t2:before{width:20%;background:#a74eff}#b.t3{background:#4d4900}#b.t3:before{width:30%;background:#fff100}#b.t4{background:#3d451c}#b.t4:before{width:50%;background:#c8e35a}#b.t5{background:#4d350f}#b.t5:before{width:80%;background:#ffaf2f}#b.t6{background:#24451b}#b.t6:before{width:90%;background:#74e259}#b.rt{background:#45341b!important}#b.rt:before{background:#e3ac59!important}#b.fl{background:#451b1b!important}#b.fl:before{background:#e25959!important}#b.sc{background:#1b452c}#b.sc:before{width:100%;background:#59e390}#c{display:none}#c>.i{display:flex}#c>.i span{color:#ff4e59;font-weight:700}#l{border-color:#e25959}#desc{color:#999}#desc sup{position:relative;right:-1px;vertical-align:top}.tip{visibility:hidden;opacity:.5;position:absolute;background:#353535;border:1px solid #999;box-shadow:0 6px 6px rgba(0,0,0,.15);border-radius:4px}.tip.v{visibility:visible!important;opacity:1!important}nav{position:relative;background-color:#1b1b1b}nav,nav:after{border-radius:6px}nav label{position:relative;z-index:2;float:left;text-align:center}nav:after{content:\"\";position:absolute;top:0;left:0;box-sizing:border-box;height:100%;background:#3e3d3d;transition:.5s}nav label .tip{text-align:left;line-height:normal;transition:all .5s ease-out}[type=radio]{display:none}[type=radio]:nth-of-type(1):checked~nav:after{left:0}[type=radio]:nth-of-type(1):checked~article.i{display:grid}[type=radio]:nth-of-type(2):checked~article.l{display:block}article{display:none;background:#191919}article.l>div{font-family:monospace}article.l>div a{display:inline-block;color:#ff4e59}article.l>div span{word-break:break-all}article.i dt{color:#999}article.i>dt{grid-column:1;text-align:right}article.i>dd{grid-column:2;margin-left:.5em;color:#fff;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}article.i #cp{cursor:pointer;position:relative;grid-area:1 / 3 / 4 / 4;align-self:start;padding:0;background:transparent;border:none}article.i #cp .tip{right:0;visibility:hidden;display:flex;color:#fff;white-space:nowrap;transition:all .5s ease-out}article.i #db{display:none;grid-area:4 / 1 / 5 / 4}article.i #db>hr{border:1px solid #4F4F4F}article.i #db ul{margin:.5em 0 0;padding-left:.5em}article.i #db li{word-break:break-all}article.i.ba dd{word-break:break-all;white-space:normal}article.i.ba img *{fill:#666}@media screen and (max-width: 767px){#c{padding:44px 20px;font-size:16px}#c>.i img{width:26px;height:26px}#c>.i span{margin-left:10px;font-size:24px;line-height:28px}#l{margin:20px 0}#desc{line-height:20px}section>*{margin:20px 0}nav{width:188px}nav,nav>*{height:32px}nav label,nav:after{width:94px;line-height:32px}nav label{font-size:14px}nav label .tip{top:-75px;width:142px;padding:10px;font-size:14px}nav label .tip.v{top:-55px}[type=radio]:nth-of-type(2):checked~nav:after{left:94px}article{padding:14px 16px;border-radius:4px;line-height:20px}article.l>div{font-size:12px}article.l>div span{margin-left:5px}article.i{grid-template-columns:70px auto 22px}article.i>dd{margin-left:5px}article.i #cp{top:-4px;right:-8px}article.i #cp>img{width:18px;height:18px}article.i #cp .tip{top:-56px;padding:8px 10px;font-size:12px}article.i #cp .tip.v{top:-36px}article.i #cp div img{margin-right:5px}article.i #cp div img{width:14px;height:14px}article.i #db>hr{margin:14px 0}}@media screen and (min-width: 768px) and (max-width: 1023px){#c{padding:52px 33px}}@media screen and (min-width: 1024px) and (max-width: 1439px){#c{padding:54px 32px}}@media screen and (min-width: 768px) and (max-width: 1439px){#c{font-size:20px}#c>.i img{width:42px;height:42px}#c>.i span{margin-left:14px;font-size:34px;line-height:48px}#l{margin:30px 0}#desc{line-height:26px}section>*{margin:30px 0}nav{width:247px}nav,nav>*{height:43px}nav label,nav:after{width:123px;line-height:43px}nav label{font-size:18px}nav label .tip{top:-74px;padding:16px;font-size:18px;white-space:nowrap}nav label .tip.v{top:-54px}[type=radio]:nth-of-type(2):checked~nav:after{left:123px}article{padding:20px;border-radius:6px;line-height:26px}article.l div{font-size:18px}article.l>div span{margin-left:10px}article.i{grid-template-columns:82px auto 24px}article.i>dd{margin-left:.5em}article.i #cp>img{width:24px;height:24px}article.i #cp .tip{top:-62px;padding:8px 10px;font-size:18px}article.i #cp .tip.v{top:-42px}article.i #cp div img{margin-right:9px}article.i #cp div img{width:20px;height:20px;margin-right:8px}article.i #db>hr{margin:20px 0}}@media screen and (min-width: 1440px){#c{max-width:1360px;padding:100px 0;margin:0 auto;font-size:26px}#c>.i img{width:56px;height:56px}#c>.i span{margin-left:22px;font-size:46px;line-height:60px}#l{margin:42px 0}#desc{line-height:32px}section>*{margin:36px 0}nav{width:298px}nav,nav>*{height:51px}nav label,nav:after{width:149px;line-height:49px}nav label{font-size:24px}nav label .tip{top:-91px;padding:20px;font-size:24px;white-space:nowrap}nav label .tip.v{top:-71px}[type=radio]:nth-of-type(2):checked~nav:after{left:149px}article{padding:36px;border-radius:6px;line-height:32px}article.l div{font-size:24px}article.l>div span{margin-left:15px}article.i{grid-template-columns:106px auto 30px}article.i>dd{margin-left:.5em}article.i #cp>img{width:30px;height:30px}article.i #cp .tip{top:-82px;padding:14px 24px;font-size:24px}article.i #cp .tip.v{top:-62px}article.i #cp div img{margin-right:12px}article.i #cp div img{width:24px;height:24px}article.i #db>hr{margin:26px 0}}</style></head><body><div id=\"b\"></div><div id=\"c\"><div class=\"i\"><img src=\"data:image/svg+xml,%3csvg%20viewBox='0%200%2034%2034'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20d='M17,0%20C26.3879464,0%2034,7.61205357%2034,17%20C34,26.3879464%2026.3879464,34%2017,34%20C7.61205357,34%200,26.3879464%200,17%20C0,7.61205357%207.61205357,0%2017,0%20Z%20M21.8563839,10.4284375%20L21.8548661,10.4284375%20L21.8518304,10.4307143%20L17,15.2829241%20L12.1481696,10.4307143%20C12.1466518,10.428817%2012.1458929,10.4284375%2012.1451339,10.4284375%20C12.1442682,10.4282395%2012.1433434,10.4282395%2012.1424777,10.4284375%20C12.1413393,10.4284375%2012.1405804,10.428817%2012.1390625,10.4303348%20L10.4307143,12.138683%20C10.4297946,12.1396363%2010.4291405,12.1408138%2010.428817,12.1420982%20C10.428553,12.142964%2010.428553,12.1438887%2010.428817,12.1447545%20L10.428817,12.1455134%20C10.4294511,12.1463876%2010.4302196,12.147156%2010.4310938,12.1477902%20L15.2829241,17%20L10.4307143,21.8518304%20C10.428817,21.8533482%2010.4284375,21.8541071%2010.4284375,21.8548661%20C10.4282395,21.8557318%2010.4282395,21.8566566%2010.4284375,21.8575223%20C10.4284375,21.8586607%2010.428817,21.8594196%2010.4303348,21.8609375%20L12.138683,23.5692857%20C12.1396363,23.5702054%2012.1408138,23.5708595%2012.1420982,23.571183%20C12.142964,23.571381%2012.1438887,23.571381%2012.1447545,23.571183%20C12.1455134,23.571183%2012.1462723,23.5708036%2012.1477902,23.5692857%20L17,18.7170759%20L21.8518304,23.5692857%20C21.8533482,23.5708036%2021.8541071,23.571183%2021.8548661,23.571183%20C21.8557318,23.571381%2021.8566566,23.571381%2021.8575223,23.571183%20C21.8586607,23.571183%2021.8594196,23.5708036%2021.8609375,23.5692857%20L23.5692857,21.8609375%20C23.5702054,21.8599842%2023.5708595,21.8588068%2023.571183,21.8575223%20C23.571381,21.8566566%2023.571381,21.8557318%2023.571183,21.8548661%20L23.571183,21.8541071%20C23.5706643,21.8532603%2023.5700252,21.8524933%2023.5692857,21.8518304%20L18.7170759,17%20L23.5692857,12.1481696%20C23.5708036,12.1466518%2023.571183,12.1458929%2023.571183,12.1451339%20C23.571381,12.1442682%2023.571381,12.1433434%2023.571183,12.1424777%20C23.571183,12.1413393%2023.5708036,12.1405804%2023.5692857,12.1390625%20L21.8609375,10.4307143%20C21.8599842,10.4297946%2021.8588068,10.4291405%2021.8575223,10.428817%20C21.8566566,10.428553%2021.8557318,10.428553%2021.8548661,10.428817%20L21.8563839,10.4284375%20Z'%20id='Shape'%20fill='%23FF4D4F'%3e%3c/path%3e%3c/g%3e%3c/svg%3e\"> <span>ERROR OCCURRED...</span></div><hr id=\"l\"><div id=\"desc\">We apologize for the inconvenience. Please provide PG SOFT<sup>&reg;</sup> with the information below to resolve the issue. Thank you for your cooperation!</div><section><input type=\"radio\" id=\"t1\" name=\"t\" checked> <input type=\"radio\" id=\"t2\" name=\"t\"><nav><label id=\"tb1\" for=\"t1\">Info<div class=\"tip\">Copy and send us the information below</div></label> <label id=\"tb2\" for=\"t2\">Test<div class=\"tip\">Click the links below and send a screenshot</div></label></nav><article id=\"i\" class=\"i\"><dt>User IP:</dt><dd id=\"ui\">----:----:----:----:----:----:----:----</dd><dt>Trace ID:</dt><dd id=\"ti\">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</dd><dt>UA:</dt><dd id=\"ua\">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</dd><button id=\"cp\"><img src=\"data:image/svg+xml,%3csvg%20viewBox='0%200%2016%2016'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20d='M5.44660697,0%20C2.438529,0%200,2.42168313%200,5.40898067%20L0,12.0944808%20C0,12.4841283%200.318069,12.8%200.710426996,12.8%20C1.10278499,12.8%201.42085399,12.4841283%201.42085399,12.0944808%20L1.42085399,5.40898067%20C1.42085399,3.20097814%203.22324499,1.41103844%205.44660697,1.41103844%20L12.089573,1.41103844%20C12.481931,1.41103844%2012.8,1.09516672%2012.8,0.705519218%20C12.8,0.315871713%2012.481931,0%2012.089573,0%20L5.44660697,0%20Z'%20id='Path'%20fill='%23FF4D4F'%20fill-rule='nonzero'%3e%3c/path%3e%3cpath%20d='M14.1051305,3.44903329%20C11.1109226,3.1169889%208.08907742,3.1169889%205.09486955,3.44903329%20C4.24173291,3.54361372%203.56634391,4.21239493%203.46482643,5.0631286%20C3.11172452,8.07745679%203.11172452,11.122584%203.46482643,14.1369121%20C3.56634391,14.9876458%204.24173291,15.656427%205.09486955,15.7510075%20C8.07286828,16.0829975%2011.1271317,16.0829975%2014.1051305,15.7510075%20C14.9582671,15.656427%2015.6336561,14.9876458%2015.7351736,14.1369121%20C16.0882755,11.122584%2016.0882755,8.07745679%2015.7351736,5.0631286%20C15.6336561,4.21239493%2014.9582671,3.54361372%2014.1051305,3.44903329%20M5.2483178,4.81642881%20C8.12432398,4.49544395%2011.075676,4.49544395%2013.9516822,4.81642881%20C14.1673361,4.84025253%2014.3384039,5.00871751%2014.3651655,5.22362104%20C14.7065546,8.13127214%2014.7065546,11.0687686%2014.3651655,13.9764197%20C14.3384039,14.1913232%2014.1673361,14.3597882%2013.9516822,14.3836119%20C11.075676,14.7045968%208.12432398,14.7045968%205.2483178,14.3836119%20C5.03266388,14.3597882%204.86159613,14.1913232%204.83483449,13.9764197%20C4.49344545,11.0687686%204.49344545,8.13127214%204.83483449,5.22362104%20C4.86159613,5.00871751%205.03266388,4.84025253%205.2483178,4.81642881'%20id='Shape'%20fill='%23FF4D4F'%3e%3c/path%3e%3c/g%3e%3c/svg%3e\"><div class=\"tip s\">Link copied</div><div class=\"tip f\"><img src=\"data:image/svg+xml,%3csvg%20width='14px'%20height='14px'%20viewBox='0%200%2014%2014'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle%3eicon/copy%20failed%3c/title%3e%3cg%20id='icon/copy-failed'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20d='M2.13716422,12.0350404%20C0.317490891,10.2775411%20-0.41229207,7.67494972%200.228308002,5.2275743%20C0.868908074,2.78019889%202.78019889,0.868908074%205.2275743,0.228308002%20C7.67494972,-0.41229207%2010.2775411,0.317490891%2012.0350404,2.13716422%20C14.6878127,4.88378208%2014.6498743,9.24966871%2011.9497715,11.9497715%20C9.24966871,14.6498743%204.88378208,14.6878127%202.13716422,12.0350404%20M6.38611108,3.5861461%20L6.38611108,7.78609357%20L7.78609357,7.78609357%20L7.78609357,3.5861461%20L6.38611108,3.5861461%20Z%20M6.38611108,9.18607606%20L6.38611108,10.5860586%20L7.78609357,10.5860586%20L7.78609357,9.18607606%20L6.38611108,9.18607606%20Z'%20id='Shape'%20fill='%23999999'%20fill-rule='nonzero'%3e%3c/path%3e%3c/g%3e%3c/svg%3e\"> Copy failed. Please copy manually</div></button><div id=\"db\"><hr><dt class=\"t\">DEBUG:</dt><ul id=\"dc\" class=\"c\"></ul></div></article><article id=\"st\" class=\"l\"></article></section></div><script type=\"module\" crossorigin>!function(){\"use strict\";const t=t=>parseInt(t.toString(),10),r=(r,e)=>{e&&e%26!=0||(e=Math.floor(25*Math.random()+1));const n=[];for(let t=0;t<26;t++)n[t]=String.fromCharCode((t+e)%26+97);const i=r.replace(/[a-z\\.]/gi,(t=>{if(\".\"===t)return\"=\";const r=t.charCodeAt(0);return n[r>=97?r-97:r-65]||t}));return encodeURIComponent([t(e/10).toString(),t(e%10).toString(),i].join(\"\"))};function e(t,r){const e=4294967296;let n,i=0;if(t instanceof ArrayBuffer&&(t=new Uint8Array(t)),\"object\"!=typeof t||void 0===t.length)throw new Error(\"Invalid argument type\");if(!t.length)throw new Error(\"Invalid argument\");return t instanceof Uint8Array||(t=new Uint8Array(t)),n=o(),n;function o(){const r=t[i++];if(r>=0&&r<=127)return r;if(r>=128&&r<=143)return a(r-128);if(r>=144&&r<=159)return h(r-144);if(r>=160&&r<=191)return l(r-160);if(192===r)return null;if(193===r)throw new Error(\"Invalid byte code 0xc1 found.\");if(194===r)return!1;if(195===r)return!0;if(196===r)return u(-1,1);if(197===r)return u(-1,2);if(198===r)return u(-1,4);if(199===r)return w(-1,1);if(200===r)return w(-1,2);if(201===r)return w(-1,4);if(202===r)return f(4);if(203===r)return f(8);if(204===r)return c(1);if(205===r)return c(2);if(206===r)return c(4);if(207===r)return c(8);if(208===r)return s(1);if(209===r)return s(2);if(210===r)return s(4);if(211===r)return s(8);if(212===r)return w(1);if(213===r)return w(2);if(214===r)return w(4);if(215===r)return w(8);if(216===r)return w(16);if(217===r)return l(-1,1);if(218===r)return l(-1,2);if(219===r)return l(-1,4);if(220===r)return h(-1,2);if(221===r)return h(-1,4);if(222===r)return a(-1,2);if(223===r)return a(-1,4);if(r>=224&&r<=255)return r-256;throw new Error(\"Invalid value '\"+r+\"' at index \"+(i-1)+\" (length \"+t.length+\")\")}function s(r){let e=0,n=!0;for(;r-- >0;)if(n){let r=t[i++];e+=127&r,128&r&&(e-=128),n=!1}else e*=256,e+=t[i++];return e}function c(r){let e=0;for(;r-- >0;)e*=256,e+=t[i++];return e}function f(r){let e=new DataView(t.buffer,i+t.byteOffset,r);return i+=r,4===r?e.getFloat32(0,!1):8===r?e.getFloat64(0,!1):void 0}function u(r,e){r<0&&(r=c(e));let n=t.subarray(i,i+r);return i+=r,n}function a(t,r){t<0&&(t=c(r));let e={};for(;t-- >0;){e[o()]=o()}return e}function h(t,r){t<0&&(t=c(r));let e=[];for(;t-- >0;)e.push(o());return e}function l(r,e){r<0&&(r=c(e));let n=i;return i+=r,function(t,r,e){let n=r,i=\"\";e+=r;for(;n<e;){let r=t[n++];if(r>127)if(r>191&&r<224){if(n>=e)throw new Error(\"incomplete 2-byte\");r=(31&r)<<6|63&t[n++]}else if(r>223&&r<240){if(n+1>=e)throw new Error(\"incomplete 3-byte\");r=(15&r)<<12|(63&t[n++])<<6|63&t[n++]}else{if(!(r>239&&r<248))throw new Error(\"unknown multibyte start 0x\"+r.toString(16)+\" at index \"+(n-1));if(n+2>=e)throw new Error(\"incomplete 4-byte\");r=(7&r)<<18|(63&t[n++])<<12|(63&t[n++])<<6|63&t[n++]}if(r<=65535)i+=String.fromCharCode(r);else{if(!(r<=1114111))throw new Error(\"0x\"+r.toString(16)+\" exceeds\");r-=65536,i+=String.fromCharCode(r>>10|55296),i+=String.fromCharCode(1023&r|56320)}}return i}(t,n,r)}function w(t,r){t<0&&(t=c(r));let n=c(1),o=u(t);return 255===n?function(t){if(4===t.length){let r=(t[0]<<24>>>0)+(t[1]<<16>>>0)+(t[2]<<8>>>0)+t[3];return new Date(1e3*r)}if(8===t.length){let r=(t[0]<<22>>>0)+(t[1]<<14>>>0)+(t[2]<<6>>>0)+(t[3]>>>2),n=(3&t[3])*e+(t[4]<<24>>>0)+(t[5]<<16>>>0)+(t[6]<<8>>>0)+t[7];return new Date(1e3*n+r/1e6)}if(12===t.length){let r=(t[0]<<24>>>0)+(t[1]<<16>>>0)+(t[2]<<8>>>0)+t[3];i-=8;let e=s(8);return new Date(1e3*e+r/1e6)}throw new Error(\"Invalid length\")}(o):{type:n,data:o}}}const n=class{static t(t){var r;const e=this.i(t);let n=4294967295;for(const i of e){const t=255&(n^i),e=null==(r=this.o)?void 0:r[t];if(void 0===e)throw new Error(\"ofr\");n=n>>>8^e}return((t,r=2)=>{const e=t+\"\";return e.length>=r?e:new Array(r-e.length+1).join(\"0\")+e})(this.h(4294967295^n).toString(16),8).toUpperCase()}static i(t){return(new TextEncoder).encode(t)}static h(t){if(t>=0)return t;const r=new Uint32Array(1);return r[0]=t,r[0]}};n.o=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];let i=n;class o{constructor(t,r,e,n){const[i,o]=(t=>{const r=t.split(/^(https?):\\/\\/([a-z0-9-_]+\\.[a-z0-9-_\\.]+)[\\/?]?.*$/gi);if(!r||r.length<4)throw new Error(\"pue: \"+t);return[r[1],r[2]]})(t);this.l=t,this.p=i,this.T=o,this.I=r,this.S=e,this.D=n}}class s{constructor(t,r,e,n,i){this.S=t,this.I=r,this.A=e,this.U=n,this.k=i}}class c{constructor(t,r){this.D=t,this.I=r}}class f{constructor(t){this.P=t,this.M=[]}}class u extends f{constructor(t,r){super(t),this.d=r}}class a extends f{constructor(t,r){super(t),this.d=r}}class h extends f{constructor(t,r){super(t),this.d=r}}class l{constructor(t,r,e){if(this._=0,this.C=1e3,this.L=()=>{},this.R=()=>{},this.B=()=>{},this.F=new u(\"\".concat(t.p,\"://\").concat(t.T,\"/\").concat(r),t),t.S){let e;e=t.S.k?new a(t.S.k,t.S):new a(\"\".concat(t.p,\"://\").concat(t.S.S,\"/\").concat(r),t.S),this.S=e}if(t.D){const r=new h(\"\".concat(t.p,\"://\").concat(t.D.D,\"/\").concat(e),t.D);this.D=r}}set V(t){this.L=t}set j(t){this.R=t}set H(t){this.B=t}async N(t){return new Promise((async(r,e)=>{(null==t?void 0:t.length)||(t=[]),t.length<=0&&(this.F&&t.push(this.F),this.S&&t.push(this.S),this.D&&t.push(this.D));const n=[];for(const s of t)n.push(this.O(s).catch((t=>t)));if(n.length<=0)throw new Error(\"ei\");let i=new w(void 0,this.F,this.S,this.D);0===this._&&this.L(i);try{this._++;let t=!1;const e=[],o=await Promise.all(n);for(const r of o){const n=r.M;!1===n[n.length-1].$&&(t=!0,e.push(r))}if(i.$=!t,t)if(this._<3){const t=()=>new Promise(((t,r)=>setTimeout((()=>{this.C<<=1,this.R(this._,i),t(this.N(e))}),this.C)));i=await t()}else this.B(this._,i);return r(i)}catch(o){return i.$=!1,r(i)}}))}async O(t){return new Promise((async(r,e)=>{const n={$:void 0,q:Date.now(),G:-1,J:-1,K:0};t.M.push(n);let i=!1;const o=setTimeout((()=>{i=!0,n.G=Date.now()-n.q,n.J=0,n.K=2,e(t)}),5e3);try{const s=await fetch(t.P);if(clearTimeout(o),i)return;return n.G=Date.now()-n.q,n.J=s.status,n.K=0,s.status>=200&&s.status<400?(n.$=!0,r(t)):(n.$=!1,e(t))}catch(s){if(clearTimeout(o),i)return;return n.$=!1,n.G=Date.now()-n.q,n.J=0,n.K=1,e(t)}}))}}class w{constructor(t,r,e,n){this.W=0,this.X=0,this.$=t,this.F=r,this.S=e,this.D=n}toString(){return[]}Y(){const t=[this.F.d.T];return this.S&&t.push(this.S.d.S),this.D&&t.push(this.D.d.D),i.t(t.join(\"|\"))}Z(){const t=[];let r=[];for(const e of this.F.M)r.push(e.J);if(t.push(r.join(\",\")),this.S){r=[];for(const t of this.S.M)r.push(t.J);t.push(r.join(\",\"))}if(this.D){r=[];for(const t of this.D.M)r.push(t.J);t.push(r.join(\",\"))}return t.join(\" | \")}tt(){let t=!1;for(const r of this.F.M)r.$&&(t=!0);if(!t)return this.F.P;if(t=!1,this.S){for(const r of this.S.M)r.$&&(t=!0);if(!t)return this.S.P}if(t=!1,this.D){for(const r of this.D.M)r.$&&(t=!0);if(!t)return this.D.P}throw new Error(\"Imer\")}get et(){if(!this.$)return Number.MAX_SAFE_INTEGER;if(this.X>0)return this.X;let t=0;for(const r of this.F.M)t+=r.G;if(this.S)for(const r of this.S.M)t+=r.G;if(this.D)for(const r of this.D.M)t+=r.G;return this.X=t,t}}function d(t){try{return e((t=>{const r=t.length,e=new Uint8Array(r);for(let n=0;n<r;n++){const r=t.charCodeAt(n);e[n]=r}return e})(atob(t)))}catch(r){throw new Error(\"Inre\")}}let E,y,v,p,m,b;const T=window,I=T.document,g=I.getElementById.bind(I),S=()=>{y&&(y.style.display=\"block\")},D=(t,r=0)=>{try{if(!E)throw new Error(\"dor\");E.className=t,\"t4\"!==t&&\"t5\"!==t||(1===r?E.className+=\" rt\":2===r&&(E.className+=\" fl\"))}catch(e){e instanceof Error&&e.message}},x=(t,r)=>{const e=I.createElement(\"DIV\");e.innerHTML='<a href=\"'.concat(r.tt(),'\" target=\"_blank\">').concat(r.Y(),\"</a><span>(\").concat(r.Z(),\")</span>\"),t.appendChild(e)};(async t=>{try{if(E=g(\"b\"),!E)throw new Error(\"b\");if(D(\"t1\"),y=g(\"c\"),!y)throw new Error(\"c\");if(v=g(\"st\"),!v)throw new Error(\"st\");if(p=g(\"ui\"),!p)throw new Error(\"ui\");if(m=g(\"ti\"),!m)throw new Error(\"ti\");if(b=g(\"ua\"),!b)throw new Error(\"ua\");(()=>{let t,r,e,n,i,o;if(t=g(\"tb1\"),!t)throw new Error(\"tb1\");if(r=t.getElementsByClassName(\"tip\")[0],!r)throw new Error(\"tb1-tip\");if(e=g(\"tb2\"),!e)throw new Error(\"tb2\");if(n=e.getElementsByClassName(\"tip\")[0],!n)throw new Error(\"tb2-tip\");let s,c=!1,f=!1;t.addEventListener(\"click\",(()=>{i===e&&(n.classList.remove(\"v\"),s&&clearTimeout(s)),i=t,c||(r.classList.add(\"v\"),o&&clearTimeout(o),o=setTimeout((()=>{r.classList.remove(\"v\")}),2e3))})),r.addEventListener(\"transitionstart\",(()=>{c=!0})),r.addEventListener(\"transitionend\",(()=>{c=!1})),e.addEventListener(\"click\",(()=>{i===t&&(r.classList.remove(\"v\"),o&&clearTimeout(o)),i=e,f||(n.classList.add(\"v\"),s&&clearTimeout(s),s=setTimeout((()=>{n.classList.remove(\"v\")}),2e3))})),n.addEventListener(\"transitionstart\",(()=>{f=!0})),n.addEventListener(\"transitionend\",(()=>{f=!1}))})(),((t,r,e,n)=>{let i,o,s,c,f;if(i=g(\"cp\"),!i)throw new Error(\"cp\");if(o=i.getElementsByClassName(\"s\")[0],!o)throw new Error(\"cp-tip-s\");if(s=i.getElementsByClassName(\"f\")[0],!s)throw new Error(\"cp-tip-f\");let u=!1,a=!1,h=!1;i.addEventListener(\"click\",(()=>{if(a)return;const i=[\"  Status: \".concat(t.innerText.trim()),\" User IP: \".concat(r.innerText.trim()),\"Trace ID: \".concat(e.innerText.trim()),\"      UA: \".concat(n.innerText.trim())].join(\"\\n\");try{T.navigator.clipboard.writeText(i),c=o,u||(o.classList.add(\"v\"),f&&clearTimeout(f))}catch(l){try{const t=I.createElement(\"textarea\");t.value=i,I.body.appendChild(t),t.focus(),t.select(),t.setSelectionRange(0,i.length),I.execCommand(\"copy\"),t.remove(),c=o,u||(o.classList.add(\"v\"),f&&clearTimeout(f))}catch(w){a=!0,c=s,g(\"i\").classList.add(\"ba\"),u||(s.classList.add(\"v\"),f&&clearTimeout(f))}}h=!0,f=setTimeout((()=>{a||c.classList.remove(\"v\")}),2e3)})),o.addEventListener(\"transitionstart\",(()=>{u=!0})),o.addEventListener(\"transitionend\",(()=>{u=!1})),s.addEventListener(\"transitionstart\",(()=>{u=!0})),s.addEventListener(\"transitionend\",(()=>{u=!1}))})(v,p,m,b)}catch(h){return S(),void(h instanceof Error&&h.message)}let e,n,i;try{D(\"t2\"),e=d(t);const r=e.m;n=r.ci,i=r.tid}catch(h){return S(),void(h instanceof Error&&(\"Failed to parse response [\".concat(t,\"]: \"),h.message))}try{D(\"t3\"),p.innerText=n,m.innerText=i,b.innerText=T.navigator.userAgent}catch(h){return S(),void(h instanceof Error&&h.message)}let f=[];try{D(\"t4\");const t=t=>{const r=[\"Start speed test.\"];r.push(\" entry: \",t.F.P),t.S&&r.push(\", resource: \",t.S.P),t.D&&r.push(\", api: \",t.D.P)},r=(t,r)=>{D(\"t4\",1),\"Speed test [\".concat(r.Y(),\"] done with failure, retry \").concat(t,\" times...\")},n=(t,r)=>{D(\"t4\",2),[\"Speed test failed after \".concat(t,\" tries :( \")].concat(r.toString())},i=function(t){const r=t.m.rt,e=t.m.at,n=[];for(const i of t.f){const t=new o(i.u,i.w);if(!i.rd){n.push(new l(t,r,e));continue}let f,u;for(const o of i.rd)if(f=new s(o.v,o.w,o.hv,o.us,o.ust),t.S=f,i.ad)for(const s of i.ad)u=new c(s.v,s.w),t.D=u,n.push(new l(t,r,e));else n.push(new l(t,r,e))}return n}(e),u=[];for(const e of i)e.V=t,e.j=r,e.H=n,u.push(e.N().catch((t=>t)));f=await Promise.all(u)}catch(h){return D(\"t4\",2),S(),void(h instanceof Error&&h.message)}const u=[];try{D(\"t5\");let t=!1;for(const r of f)r.$?(t=!0,u.push(r),[\"Speed test completed :) \"].concat(r.toString())):x(v,r);if(!t)throw new Error}catch(h){return D(\"t5\",2),S(),void(h instanceof Error&&h.message&&h.message)}let a;try{D(\"t6\");const t=(t=>{let r=t;if(1!==t.length){const e=Math.max(...t.map((t=>t.et))),n=Math.min(...t.map((t=>t.et))),i=t.map((t=>{let r=1;e!==n&&(r=(e-t.et)/(e-n));let i=0;return!t.F||t.S||t.D?t.F&&t.S&&!t.D?i=.33*t.F.d.I+.33*t.S.d.I+.33*r:t.F&&t.S&&t.D&&(i=.25*t.F.d.I+.25*t.S.d.I+.25*t.D.d.I+.25*r):i=.5*t.F.d.I+.5*r,t.W=i,t}));i.sort(((t,r)=>r.W-t.W)),r=i}const e=r[0].W,n=[];for(const i of r){if(i.W!==e)break;n.push(i)}return n})(u);a=t[Math.floor(Math.random()*t.length)]}catch(h){return S(),void(h instanceof Error&&h.message)}try{D(\"sc\"),(t=>{const e=[t.F.d.l];t.D&&e.push(\"ao=\".concat(r(t.D.d.D))),t.S&&(e.push(\"or=\".concat(r(t.S.d.S))),e.push(\"__hv=\".concat(t.S.d.A)),t.S.d.U&&e.push(\"__sv=\".concat(t.S.d.U))),T.location.replace(e.join(\"&\"))})(a)}catch(h){return S(),void(h instanceof Error&&h.message)}})(\"`;
        const content2 = `\")}();</script></body></html>`;
        const content = content1 + msg + content2;
        const verifyData = {
            dt: {
                content: content,
                contentType: "text/html",
                statusCode: null
            },
            err: null
        }
        
        return verifyData;
    },

    /**
     * function for /web-api/
     */

    verifyOperatorPlayerSession: async( otk:string, gi:string, traceId:string ) => {
        const response = PGFunctions.generateVerifyOperatorPlayerSession( otk, gi, traceId );
        return response;
    },

    getGameName: async() => {
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

    getGameRule: async( gid:string ) => {
        const response = PGFunctions.generateGameRule( gid );
        return response;
    },

    getByResourcesTypeIds: async() => {
        const response = PGFunctions.generateResourcesTypeIds();
        return response;
    },

    getV1BetDetails: async( gid:string, sid: string, atk: string ) => {
        // check session is enable
        const result = await Models.getPGHistoryItem( gid, sid );
        if( result!==null ) {
            const response = PGFunctions.getV1BetDetails( sid, result.response );
            return response;
        } else {
            return PGFunctions.generatePGError( 1308, "a54365" );
        }
    },

    /**
     * function for /game-api/
     * @returns 
     */

    getGameInfo: async( atk:string, gameCode:string ) => {
        const useInfo = await Models.getUserInfo( atk, gameCode );
        await Models.updateUserInfo( gameCode, atk, useInfo );
        const response = await PGFunctions.generateGameInfo( atk, gameCode );
        return response;
    },

    handleHistory: async( gameCode:string, action:string, userCode:string ) => {
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