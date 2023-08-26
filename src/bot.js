"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var lodash_1 = require("lodash");
var express_1 = require("express");
var textEffects_1 = require("./textEffects");
//const CyclicDB = require('@cyclic.sh/dynamodb');
//const db = CyclicDB(process.env.CYCLIC_DB);
//var reply_to_user={reply_to_message_id: ctx.msg.message_id,};
//----------amazon aws db-------------
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
// Create a bot using the Telegram token
var bot = new grammy_1.Bot(process.env.TELEGRAM_TOKEN || "");
var admin_pass = "неебивола";
var admins = new Array();
var promotions = new Array();
var news = new Array();
var delivery = new Array();
//------------amazon s3  db------------------------------------
var promo_param = {
    Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
    Key: "promo.json",
};
var news_param = {
    Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
    Key: "news.json",
};
var admins_param = {
    Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
    Key: "admins.json",
};
var delivery_param = {
    Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
    Key: "delivery.json",
};
//--------------getting data from the db --------------------------
function getdb(param) {
    return __awaiter(this, void 0, void 0, function () {
        var ok, server_reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ok = 0;
                    server_reply = "Ошибка базы данных";
                    return [4 /*yield*/, s3.getObject(param, function (err, data) {
                            if (err)
                                console.log("errorrrrrrrrrrrrrrrrrrrrrrrrr: ", err, err.stack);
                            else {
                                server_reply = data.Body.toString('utf-8');
                                ok = 1;
                            }
                        }).promise()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, server_reply];
            }
        });
    });
}
//--------------------------------------------------------
//--------------handle admin commands----------------------------------
bot.command("admin", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(ctx.match === admin_pass)) return [3 /*break*/, 4];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                admins.push((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username);
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(admins),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "admins.json",
                    }).promise()];
            case 2:
                //------------writing to db------------
                _d.sent();
                //----------------------------------
                return [4 /*yield*/, ctx.reply("Права админа добавлены ")];
            case 3:
                //----------------------------------
                _d.sent();
                _d.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
bot.command("showadmins", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                if (!admins.includes((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)) return [3 /*break*/, 3];
                return [4 /*yield*/, ctx.reply("Админы Robovaja: \n" + admins.join("\n"))];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command("deladmins", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                if (!admins.includes((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)) return [3 /*break*/, 3];
                admins = [];
                return [4 /*yield*/, ctx.reply("список админов очищен")];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command("deliveryadress", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                if (!admins.includes((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)) return [3 /*break*/, 3];
                delivery = [];
                delivery.push(ctx.match);
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(delivery),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "delivery.json",
                    }).promise()];
            case 2:
                //------------writing to db------------
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command("add", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_f.sent()]);
                if (!admins.includes((_e = ctx.from) === null || _e === void 0 ? void 0 : _e.username)) return [3 /*break*/, 5];
                _d = (_c = JSON).parse;
                return [4 /*yield*/, getdb(promo_param)];
            case 2:
                promotions = _d.apply(_c, [_f.sent()]);
                promotions.push(ctx.match);
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(promotions),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "promo.json",
                    }).promise()];
            case 3:
                //------------writing to db------------
                _f.sent();
                //----------------------------------
                return [4 /*yield*/, ctx.reply("Акция добавлена")];
            case 4:
                //----------------------------------
                _f.sent();
                _f.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
bot.command("del", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_f.sent()]);
                if (!admins.includes((_e = ctx.from) === null || _e === void 0 ? void 0 : _e.username)) return [3 /*break*/, 5];
                _d = (_c = JSON).parse;
                return [4 /*yield*/, getdb(promo_param)];
            case 2:
                promotions = _d.apply(_c, [_f.sent()]);
                promotions.splice(+ctx.match, 1);
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(promotions),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "promo.json",
                    }).promise()];
            case 3:
                //------------writing to db------------
                _f.sent();
                //----------------------------------
                return [4 /*yield*/, ctx.reply("Акция удалена")];
            case 4:
                //----------------------------------
                _f.sent();
                _f.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
bot.command("initdatabase773829", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promotions = [];
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(promotions),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "promo.json",
                    }).promise()];
            case 1:
                //------------writing to db------------
                _a.sent();
                //----------------------------------
                news = [];
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(news),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "news.json",
                    }).promise()];
            case 2:
                //------------writing to db------------
                _a.sent();
                //----------------------------------
                admins = [];
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(admins),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "admins.json",
                    }).promise()];
            case 3:
                //------------writing to db------------
                _a.sent();
                //----------------------------------
                delivery = [];
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(delivery),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "delivery.json",
                    }).promise()];
            case 4:
                //------------writing to db------------
                _a.sent();
                //----------------------------------
                return [4 /*yield*/, ctx.reply("База данных инициализирована")];
            case 5:
                //----------------------------------
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.command("ads", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, time, milliseconds, dateObject, humanDateFormat;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_f.sent()]);
                if (!admins.includes((_e = ctx.from) === null || _e === void 0 ? void 0 : _e.username)) return [3 /*break*/, 4];
                _d = (_c = JSON).parse;
                return [4 /*yield*/, getdb(news_param)];
            case 2:
                news = _d.apply(_c, [_f.sent()]);
                time = ctx.msg.date;
                milliseconds = time * 1000;
                dateObject = new Date(milliseconds);
                humanDateFormat = dateObject.toLocaleDateString("ru");
                news.unshift(humanDateFormat + ":" + ctx.match);
                if (news.length > 10)
                    news.splice(-1);
                //-----------------------------------------
                //------------writing to db------------
                return [4 /*yield*/, s3.putObject({
                        Body: JSON.stringify(news),
                        Bucket: "cyclic-tan-nervous-sheep-eu-north-1",
                        Key: "news.json",
                    }).promise()];
            case 3:
                //-----------------------------------------
                //------------writing to db------------
                _f.sent();
                _f.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
bot.command("adminhelp", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, helphint;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                if (!admins.includes((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)) return [3 /*break*/, 3];
                helphint = "\n      \u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!!!\n      *\u0412\u0441\u0435 \u0430\u0434\u043C\u0438\u043D\u0441\u043A\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043B\u0441 \u0431\u043E\u0442\u0430 \u0438\u043B\u0438 \u0430\u0434\u043C\u0438\u043D\u0441\u043A\u0438\u0445 \u0447\u0430\u0442\u0430\u0445*\n\n      \u0410\u0434\u043C\u0438\u043D\u044B \u0431\u043E\u0442\u0430 \u043C\u043E\u0433\u0443\u0442:\n      1. \u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u044B \u0432 \u0441\u043F\u0438\u0441\u043E\u043A \u0430\u043A\u0438\u043E\u043D\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u043E\u0432\n      2. \u0423\u0434\u0430\u043B\u044F\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0441\u043F\u0438\u043A\u0430 \u0430\u043A\u0446\u0438\u043E\u043D\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u043E\u0432\n      3. \u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0432 \u043B\u0435\u043D\u0442\u0443 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439, \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043E\u0431\u043B\u0430\u0434\u0430\u044F \u043F\u0440\u0430\u0432\u0430\u043C\u0438 \u0430\u0434\u043C\u0438\u043D\u0430\n      \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435, \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0432 \u043F\u0435\u0440\u0435\u0434 \u043D\u0438\u043C \u043A\u043E\u043C\u0430\u043D\u0434\u0443 /ads\n      4. \u0423\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435\n\n      \u041A\u043E\u043C\u0430\u043D\u0434\u044B \u0432\u0432\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435: /\u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0434\u0430\u043D\u043D\u044B\u0435\n\n      \u041E\u0431\u0449\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B:\n      /admin \u043D\u0435\u0435\u0431\u0438\u0432\u043E\u043B\u0430 - \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0430\u0434\u043C\u0438\u043D\u0430\n      /add \u0442\u0435\u043A\u0441\u0442 - \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u044B\u0433\u043E\u0434\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\n      /del \u0447\u0438\u0441\u043B\u043E - \u0443\u0431\u0440\u0430\u0442\u044C \u0432\u044B\u0433\u043E\u0434\u043D\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435, \u0447\u0438\u0441\u043B\u043E-\u043F\u043E\u0440\u044F\u0434\u043A\u043E\u0432\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 \u043D\u0430\u0447\u0438\u043D\u0430\u044F \u0441 \u043D\u0443\u043B\u044F\n      /ads \u0442\u0435\u043A\u0441\u0442 - \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442 \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0432 \u043B\u0435\u043D\u0442\u0443 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439\n      /deliveryadress \u0442\u0435\u043A\u0441\u0442 - \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435\n\n      \u0421\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B:\n      /showadmins - \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0430\u0434\u043C\u0438\u043D\u043E\u0432\n      /deladmins - \u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0430\u0434\u043C\u0438\u043D\u043E\u0432\n      /initdatabase773829 - \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0431\u0430\u0437\u0443 \u0434\u0430\u043D\u043D\u044B\u0445 (\u0432\u0441\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0434\u0430\u043B\u044F\u0442\u0441\u044F), \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0431\u0435\u0437 \u0430\u0434\u043C\u0438\u043D\u0441\u043A\u0438\u0445 \u043F\u0440\u0430\u0432\n      ";
                return [4 /*yield*/, ctx.reply(helphint)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command("menu", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                if (!admins.includes((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)) return [3 /*break*/, 3];
                return [4 /*yield*/, ctx.reply("меню включено", {
                        "reply_markup": {
                            "keyboard": [["/Приятная цена", "/Новости"], ["/Доставка"], ["/Адреса", "/Скрыть меню"]]
                        }
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command("hide", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(admins_param)];
            case 1:
                admins = _b.apply(_a, [_d.sent()]);
                if (!admins.includes((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)) return [3 /*break*/, 3];
                return [4 /*yield*/, ctx.reply("меню скрыто", {
                        "reply_markup": {
                            remove_keyboard: true
                        }
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
//-------------------------------------------------------------
//---------------------user commands---------------------------
bot.command("promo", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(promo_param)];
            case 1:
                promotions = _b.apply(_a, [_c.sent()]);
                return [4 /*yield*/, ctx.reply("Выгодные предложения от PAR-RUS.RU: \n\n" + promotions.join("\n\n"))];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.command("news", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(news_param)];
            case 1:
                news = _b.apply(_a, [_c.sent()]);
                return [4 /*yield*/, ctx.reply("Новости в PAR-RUS.RU: \n\n" + news.join("\n\n"))];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.command("delivery", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(delivery_param)];
            case 1:
                delivery = _b.apply(_a, [_c.sent()]);
                return [4 /*yield*/, ctx.reply(delivery.join("\n"))];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.command("adress", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.reply("Адреса par-rus.ru \n" +
                    "1. Центр: Большая Московская, 16, вход через арку налево \n" +
                    "2. Доброе: Безыменского, 26а, вход в Озон \n" +
                    "3. Тыщенка: Проспект Ленина, 62, вход в Верный, налево на цоколь \n")];
            case 1:
                _a.sent();
                ;
                return [2 /*return*/];
        }
    });
}); });
var allEffects = [
    {
        code: "w",
        label: "Monospace",
    },
    {
        code: "b",
        label: "Bold",
    },
    {
        code: "i",
        label: "Italic",
    },
    {
        code: "d",
        label: "Doublestruck",
    },
    {
        code: "o",
        label: "Circled",
    },
    {
        code: "q",
        label: "Squared",
    },
];
var effectCallbackCodeAccessor = function (effectCode) {
    return "effect-".concat(effectCode);
};
var effectsKeyboardAccessor = function (effectCodes) {
    var effectsAccessor = function (effectCodes) {
        return effectCodes.map(function (code) {
            return allEffects.find(function (effect) { return effect.code === code; });
        });
    };
    var effects = effectsAccessor(effectCodes);
    var keyboard = new grammy_1.InlineKeyboard();
    var chunkedEffects = (0, lodash_1.chunk)(effects, 3);
    for (var _i = 0, chunkedEffects_1 = chunkedEffects; _i < chunkedEffects_1.length; _i++) {
        var effectsChunk = chunkedEffects_1[_i];
        for (var _a = 0, effectsChunk_1 = effectsChunk; _a < effectsChunk_1.length; _a++) {
            var effect = effectsChunk_1[_a];
            effect &&
                keyboard.text(effect.label, effectCallbackCodeAccessor(effect.code));
        }
        keyboard.row();
    }
    return keyboard;
};
var textEffectResponseAccessor = function (originalText, modifiedText) {
    return "Original: ".concat(originalText) +
        (modifiedText ? "\nModified: ".concat(modifiedText) : "");
};
var parseTextEffectResponse = function (response) {
    var originalText = response.match(/Original: (.*)/)[1];
    var modifiedTextMatch = response.match(/Modified: (.*)/);
    var modifiedText;
    if (modifiedTextMatch)
        modifiedText = modifiedTextMatch[1];
    if (!modifiedTextMatch)
        return { originalText: originalText };
    else
        return { originalText: originalText, modifiedText: modifiedText };
};
bot.command("effect", function (ctx) {
    return ctx.reply(textEffectResponseAccessor(ctx.match), {
        reply_markup: effectsKeyboardAccessor(allEffects.map(function (effect) { return effect.code; })),
    });
});
// Handle inline queries
var queryRegEx = /effect (monospace|bold|italic) (.*)/;
bot.inlineQuery(queryRegEx, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var fullQuery, fullQueryMatch, effectLabel, originalText, effectCode, modifiedText;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fullQuery = ctx.inlineQuery.query;
                fullQueryMatch = fullQuery.match(queryRegEx);
                if (!fullQueryMatch)
                    return [2 /*return*/];
                effectLabel = fullQueryMatch[1];
                originalText = fullQueryMatch[2];
                effectCode = (_a = allEffects.find(function (effect) { return effect.label.toLowerCase() === effectLabel.toLowerCase(); })) === null || _a === void 0 ? void 0 : _a.code;
                modifiedText = (0, textEffects_1.applyTextEffect)(originalText, effectCode);
                return [4 /*yield*/, ctx.answerInlineQuery([
                        {
                            type: "article",
                            id: "text-effect",
                            title: "Text Effects",
                            input_message_content: {
                                message_text: "Original: ".concat(originalText, "\nModified: ").concat(modifiedText),
                                parse_mode: "HTML",
                            },
                            reply_markup: new grammy_1.InlineKeyboard().switchInline("Share", fullQuery),
                            url: "http://t.me/EludaDevSmarterBot",
                            description: "Create stylish Unicode text, all within Telegram.",
                        },
                    ], { cache_time: 30 * 24 * 3600 } // one month in seconds
                    )];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// Return empty result list for other queries.
bot.on("inline_query", function (ctx) { return ctx.answerInlineQuery([]); });
var _loop_1 = function (effect) {
    var allEffectCodes = allEffects.map(function (effect) { return effect.code; });
    bot.callbackQuery(effectCallbackCodeAccessor(effect.code), function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var originalText, modifiedText;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    originalText = parseTextEffectResponse(((_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) || "").originalText;
                    modifiedText = (0, textEffects_1.applyTextEffect)(originalText, effect.code);
                    return [4 /*yield*/, ctx.editMessageText(textEffectResponseAccessor(originalText, modifiedText), {
                            reply_markup: effectsKeyboardAccessor(allEffectCodes.filter(function (code) { return code !== effect.code; })),
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
// Handle text effects from the effect keyboard
for (var _i = 0, allEffects_1 = allEffects; _i < allEffects_1.length; _i++) {
    var effect = allEffects_1[_i];
    _loop_1(effect);
}
// Handle the /about command
var aboutUrlKeyboard = new grammy_1.InlineKeyboard().url("Прочитайте правила нашего чата", "https://t.me/parrus_ru/3285");
// Suggest commands in the menu
bot.api.setMyCommands([
    { command: "promo", description: "Выгодные предложения" },
    {
        command: "news",
        description: "Новости и последние поступления",
    },
    { command: "delivery", description: "Доставка" },
    { command: "adress", description: "Адреса магазинов" },
    { command: "help", description: "Справка о боте" },
]);
// Handle all other messages and the /start command
var introductionMessage = "\u041F\u0440\u0438\u0432\u0435\u0442! \u042F \u0440\u043E\u0431\u043E\u0442 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A PAR-RUS.RU.\n\u0427\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \"/\"";
var replyWithIntro = function (ctx) {
    return ctx.reply(introductionMessage, {
        reply_markup: aboutUrlKeyboard,
        parse_mode: "HTML",
    });
};
bot.command("start", replyWithIntro);
bot.command("help", replyWithIntro);
//--------greeting 1st new member-----------------
bot.on("msg:new_chat_members", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.reply("@" + ctx.msg.new_chat_members[0].first_name + ", " + introductionMessage, {
                    reply_markup: aboutUrlKeyboard,
                    parse_mode: "HTML",
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//------------------------------------------------
//---------------tracking key messages from users in chat-------------------------
bot.on("message", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, price, price1, price2, price3, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                msg = ctx.message;
                price = "сколько стоит";
                price1 = "цена";
                price2 = "почём";
                price3 = "цену";
                if (!('text' in msg)) return [3 /*break*/, 15];
                if (!(ctx.message.text == "/Приятная цена")) return [3 /*break*/, 3];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, getdb(promo_param)];
            case 1:
                promotions = _b.apply(_a, [_g.sent()]);
                return [4 /*yield*/, ctx.reply("Выгодные предложения от PAR-RUS.RU: \n\n" + promotions.join("\n\n"))];
            case 2:
                _g.sent();
                return [2 /*return*/];
            case 3:
                if (!(ctx.message.text == "/Новости")) return [3 /*break*/, 6];
                _d = (_c = JSON).parse;
                return [4 /*yield*/, getdb(news_param)];
            case 4:
                news = _d.apply(_c, [_g.sent()]);
                return [4 /*yield*/, ctx.reply("Новости в PAR-RUS.RU: \n\n" + news.join("\n\n"))];
            case 5:
                _g.sent();
                return [2 /*return*/];
            case 6:
                ;
                if (!(ctx.message.text == "/Доставка")) return [3 /*break*/, 9];
                _f = (_e = JSON).parse;
                return [4 /*yield*/, getdb(delivery_param)];
            case 7:
                delivery = _f.apply(_e, [_g.sent()]);
                return [4 /*yield*/, ctx.reply("Доставка:" + delivery.join("\n"))];
            case 8:
                _g.sent();
                return [2 /*return*/];
            case 9:
                ;
                if (!(ctx.message.text == "/Адреса")) return [3 /*break*/, 11];
                return [4 /*yield*/, ctx.reply("Адреса par-rus.ru \n" +
                        "1. Центр: Большая Московская, 16, вход через арку налево \n" +
                        "2. Доброе: Безыменского, 26а, вход в Озон \n" +
                        "3. Тыщенка: Проспект Ленина, 62, вход в Верный, налево на цоколь \n")];
            case 10:
                _g.sent();
                return [2 /*return*/];
            case 11:
                ;
                if (ctx.message.text == "/Скрыть меню") {
                    //  await ctx.reply("меню скрыто", {
                    //    "reply_markup": {
                    //      remove_keyboard: true
                    //    }
                    //  });
                    return [2 /*return*/];
                }
                ;
                msg = ctx.message.text;
                if (!(msg.toLowerCase().includes(price) ||
                    msg.toLowerCase().includes(price1) ||
                    msg.toLowerCase().includes(price2) ||
                    msg.toLowerCase().includes(price3))) return [3 /*break*/, 13];
                return [4 /*yield*/, ctx.reply("Извините, но цены на товары вы можете узнать придя в один из наших магазинов", {
                        reply_markup: aboutUrlKeyboard,
                        parse_mode: "HTML",
                    })];
            case 12:
                _g.sent();
                _g.label = 13;
            case 13:
                if (!(ctx.message.text == "хуй")) return [3 /*break*/, 15];
                return [4 /*yield*/, ctx.reply("с вами здесь и сейчас ваш бот Василий!")];
            case 14:
                _g.sent();
                _g.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); });
bot.hears("ping", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // `reply` is an alias for `sendMessage` in the same chat (see next section).
            return [4 /*yield*/, ctx.reply("pong", {
                    // `reply_to_message_id` specifies the actual reply feature.
                    reply_to_message_id: ctx.msg.message_id,
                })];
            case 1:
                // `reply` is an alias for `sendMessage` in the same chat (see next section).
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//----------------------------------------------------------------------------
// Start the server
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    var app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    var PORT_1 = process.env.PORT || 3000;
    app.listen(PORT_1, function () {
        console.log("Bot listening on port ".concat(PORT_1));
    });
}
else {
    // Use Long Polling for development
    bot.start();
    console.log(" Use Long Polling for developmentsss");
}
