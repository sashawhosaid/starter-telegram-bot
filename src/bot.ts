import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { chunk } from "lodash";
import express from "express";
import { applyTextEffect, Variant } from "./textEffects";
//const CyclicDB = require('@cyclic.sh/dynamodb');
//const db = CyclicDB(process.env.CYCLIC_DB);

//----------amazon aws db-------------
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
//------------------------------------

import type { Variant as TextEffectVariant } from "./textEffects";

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");


const admin_pass="неебивола"
var admins=new Array();
var promotions=new Array();
// Handle the /yo command to greet the user
bot.command("[:datatype]yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`,{reply_to_message_id: ctx.msg.message_id,}));


//------------amazon s3 aws db------------------------------------
var promo_param={
      Bucket: "cyclic-zany-tan-alligator-tie-us-west-1",
      Key: "promo.json",
};

//--------------getting data from the db --------------------------
async function getdb(param:any){
  var ok=0;
  var server_reply:string="Ошибка базы данных";

  await s3.getObject(param,function(err: Error,data:any){
    if(err)console.log("errorrrrrrrrrrrrrrrrrrrrrrrrr: ", err, err.stack);
    else {
      server_reply=data.Body.toString('utf-8');
      ok=1;
    }
  }).promise();

    return server_reply;


}
//--------------------------------------------------------

//async function senddb(param:any, data:string)
//----------retrieving data to the db---------------
//await s3.putObject({
//      Body: JSON.stringify(promotions),}+param,
//  }).promise();
//----------------------------------



//--------------hande admin commands----------------------------------
bot.command("admin", async (ctx) =>{ //grant admin rights
    if(ctx.match===admin_pass){
        admins.push(ctx.from?.username);
        await ctx.reply("Права админа добавлены "+ ctx.from?.username,{reply_to_message_id: ctx.msg.message_id,});
    }
});

bot.command("showadmins", async (ctx) =>{ //show admins
    if(admins.includes(ctx.from?.username)){
        await ctx.reply(admins.toString(),{reply_to_message_id: ctx.msg.message_id,});
    }
});

bot.command("add", async (ctx) =>{ //add promotion
    if(admins.includes(ctx.from?.username)){

        promotions=JSON.parse(await getdb(promo_param));
        promotions.push(ctx.match);
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(promotions),
              Bucket: "cyclic-zany-tan-alligator-tie-us-west-1",
              Key: "promo.json",
          }).promise();
        //----------------------------------

        await ctx.reply("Акция добавлена",{reply_to_message_id: ctx.msg.message_id,});
    }
});

bot.command("del", async (ctx) =>{ //add promotion
    if(admins.includes(ctx.from?.username)){
        promotions=JSON.parse(await getdb(promo_param));
        promotions.splice(+ctx.match,1);
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(promotions),
              Bucket: "cyclic-zany-tan-alligator-tie-us-west-1",
              Key: "promo.json",
          }).promise();
        //----------------------------------
        await ctx.reply("Акция удалена",{reply_to_message_id: ctx.msg.message_id,});
    }
});

//-------------------------------------------------------------

//---------------------user commands---------------------------
bot.command("promo", async (ctx) =>{ //grant admin rights

      promotions=JSON.parse(await getdb(promo_param));
      await ctx.reply("Выгодные предложения от PAR-RUS.RU: \n"+promotions.join("\n"));
});
//-------------------------------------------------------------

// Handle the /effect command to apply text effects using an inline keyboard
type Effect = { code: TextEffectVariant; label: string };
const allEffects: Effect[] = [
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

const effectCallbackCodeAccessor = (effectCode: TextEffectVariant) =>
  `effect-${effectCode}`;

const effectsKeyboardAccessor = (effectCodes: string[]) => {
  const effectsAccessor = (effectCodes: string[]) =>
    effectCodes.map((code) =>
      allEffects.find((effect) => effect.code === code)
    );
  const effects = effectsAccessor(effectCodes);

  const keyboard = new InlineKeyboard();
  const chunkedEffects = chunk(effects, 3);
  for (const effectsChunk of chunkedEffects) {
    for (const effect of effectsChunk) {
      effect &&
        keyboard.text(effect.label, effectCallbackCodeAccessor(effect.code));
    }
    keyboard.row();
  }

  return keyboard;
};

const textEffectResponseAccessor = (
  originalText: string,
  modifiedText?: string
) =>
  `Original: ${originalText}` +
  (modifiedText ? `\nModified: ${modifiedText}` : "");

const parseTextEffectResponse = (
  response: string
): {
  originalText: string;
  modifiedText?: string;
} => {
  const originalText = (response.match(/Original: (.*)/) as any)[1];
  const modifiedTextMatch = response.match(/Modified: (.*)/);

  let modifiedText;
  if (modifiedTextMatch) modifiedText = modifiedTextMatch[1];

  if (!modifiedTextMatch) return { originalText };
  else return { originalText, modifiedText };
};

bot.command("effect", (ctx) =>
  ctx.reply(textEffectResponseAccessor(ctx.match), {
    reply_markup: effectsKeyboardAccessor(
      allEffects.map((effect) => effect.code)
    ),
  })
);

// Handle inline queries
const queryRegEx = /effect (monospace|bold|italic) (.*)/;
bot.inlineQuery(queryRegEx, async (ctx) => {
  const fullQuery = ctx.inlineQuery.query;
  const fullQueryMatch = fullQuery.match(queryRegEx);
  if (!fullQueryMatch) return;

  const effectLabel = fullQueryMatch[1];
  const originalText = fullQueryMatch[2];

  const effectCode = allEffects.find(
    (effect) => effect.label.toLowerCase() === effectLabel.toLowerCase()
  )?.code;
  const modifiedText = applyTextEffect(originalText, effectCode as Variant);

  await ctx.answerInlineQuery(
    [
      {
        type: "article",
        id: "text-effect",
        title: "Text Effects",
        input_message_content: {
          message_text: `Original: ${originalText}
Modified: ${modifiedText}`,
          parse_mode: "HTML",
        },
        reply_markup: new InlineKeyboard().switchInline("Share", fullQuery),
        url: "http://t.me/EludaDevSmarterBot",
        description: "Create stylish Unicode text, all within Telegram.",
      },
    ],
    { cache_time: 30 * 24 * 3600 } // one month in seconds
  );
});

// Return empty result list for other queries.
bot.on("inline_query", (ctx) => ctx.answerInlineQuery([]));

// Handle text effects from the effect keyboard
for (const effect of allEffects) {
  const allEffectCodes = allEffects.map((effect) => effect.code);

  bot.callbackQuery(effectCallbackCodeAccessor(effect.code), async (ctx) => {
    const { originalText } = parseTextEffectResponse(ctx.msg?.text || "");
    const modifiedText = applyTextEffect(originalText, effect.code);

    await ctx.editMessageText(
      textEffectResponseAccessor(originalText, modifiedText),
      {
        reply_markup: effectsKeyboardAccessor(
          allEffectCodes.filter((code) => code !== effect.code)
        ),
      }
    );
  });
}

// Handle the /about command
const aboutUrlKeyboard = new InlineKeyboard().url(
  "Перейти на сайт PAR-RUS.RU",
  "https://par-rus.ru/"
);

// Suggest commands in the menu
bot.api.setMyCommands([
  { command: "promo", description: "выгодные предложения" },
  {
    command: "news",
    description: "Новости и посдедние поступления",
  },
  { command: "delivery", description: "Доставка" },
  { command: "adress", description: "Адреса магазинов" },
]);

// Handle all other messages and the /start command
const introductionMessage = `Привет! Я робот помощник PAR-RUS.RU.
Я знаю о выгодных предложениях и последних новостях в PAR-RUS.RU,
также погу помочь с доставкой и показать адреса магазинов.

Команды
/promo - выгодные предложения
/news - Новости и посдедние поступления
/delivery - Доставка
/adress - Адреса магазинов` ;

const replyWithIntro = (ctx: any) =>
  ctx.reply(introductionMessage, {
    reply_markup: aboutUrlKeyboard,
    parse_mode: "HTML",
  });

bot.command("start", replyWithIntro);

//--------greeting 1st new member-----------------
bot.on("msg:new_chat_members", async (ctx) =>{
  await  ctx.reply("@"+ ctx.msg.new_chat_members[0].first_name +", "+introductionMessage);
});
//------------------------------------------------

//---------------tracking key messages from users in chat-------------------------
bot.on("message", async (ctx) =>{
  const msg=ctx.message;

  if('text' in msg){
    if(ctx.message.text=="хуй")
     await  ctx.reply("иди на хуй",{reply_to_message_id: ctx.msg.message_id,});
  }
});

bot.hears("ping", async (ctx) => {
  // `reply` is an alias for `sendMessage` in the same chat (see next section).
  await ctx.reply("pong", {
    // `reply_to_message_id` specifies the actual reply feature.
    reply_to_message_id: ctx.msg.message_id,
  });
});
//----------------------------------------------------------------------------


// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
