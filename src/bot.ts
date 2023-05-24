import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { chunk } from "lodash";
import express from "express";
import { applyTextEffect, Variant } from "./textEffects";
//const CyclicDB = require('@cyclic.sh/dynamodb');
//const db = CyclicDB(process.env.CYCLIC_DB);
//var reply_to_user={reply_to_message_id: ctx.msg.message_id,};
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
var news=new Array();
var delivery=new Array();
// Handle the /yo command to greet the user
bot.command("[:datatype]yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`));


//------------amazon s3 aws db------------------------------------
var promo_param={
      Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
      Key: "promo.json",
};
var news_param={
      Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
      Key: "news.json",
};
var admins_param={
      Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
      Key: "admins.json",
};

var delivery_param={
      Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
      Key: "delivery.json",
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


//--------------handle admin commands----------------------------------
bot.command("admin", async (ctx) =>{ //grant admin rights
    if(ctx.match===admin_pass){
        admins=JSON.parse(await getdb(admins_param));
        admins.push(ctx.from?.username);
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(admins),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "admins.json",
          }).promise();
        //----------------------------------
        await ctx.reply("Права админа добавлены ");
    }
});

bot.command("showadmins", async (ctx) =>{
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){
        await ctx.reply("Админы Robovaja: \n"+admins.join("\n"));
    }
});

bot.command("deladmins", async (ctx) =>{
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){
        admins=[];
        await ctx.reply("список админов очищен");
    }
});

bot.command("deliveryadress", async (ctx) =>{
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){
      delivery=[];
      delivery.push(ctx.match);
      //------------writing to db------------
      await s3.putObject({
            Body: JSON.stringify(delivery),
            Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
            Key: "delivery.json",
        }).promise();
      //----------------------------------
    }
});

bot.command("add", async (ctx) =>{ //add promotion
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){

        promotions=JSON.parse(await getdb(promo_param));
        promotions.push(ctx.match);
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(promotions),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "promo.json",
          }).promise();
        //----------------------------------

        await ctx.reply("Акция добавлена");
    }
});

bot.command("del", async (ctx) =>{
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){
        promotions=JSON.parse(await getdb(promo_param));
        promotions.splice(+ctx.match,1);
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(promotions),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "promo.json",
          }).promise();
        //----------------------------------
        await ctx.reply("Акция удалена");
    }
});

bot.command("initdatabase", async (ctx) =>{
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){

        promotions=[];
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(promotions),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "promo.json",
          }).promise();
        //----------------------------------

        news=[];
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(news),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "news.json",
          }).promise();
        //----------------------------------

        admins=[];
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(admins),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "admins.json",
          }).promise();
        //----------------------------------

        delivery=[];
        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(delivery),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "delivery.json",
          }).promise();
        //----------------------------------
        await ctx.reply("База данных инициализирована");
    }
});


bot.command("ads", async (ctx) =>{ //add promotion
    admins=JSON.parse(await getdb(admins_param));
    if(admins.includes(ctx.from?.username)){

        news=JSON.parse(await getdb(news_param));
        var time=ctx.msg.date;
        //---convert unix time to normal time----
        //const milliseconds = time * 1000;
        const dateObject = new Date(time);

        const humanDateFormat =dateObject.toLocaleDateString("ru");

        news.unshift(humanDateFormat+":"+ctx.match);

        if(news.length>10)
          news.splice(-1);
        //-----------------------------------------

        //------------writing to db------------
        await s3.putObject({
              Body: JSON.stringify(news),
              Bucket: "cyclic-fine-puce-dhole-yoke-eu-north-1",
              Key: "news.json",
          }).promise();
        //----------------------------------
    }
});
//-------------------------------------------------------------

//---------------------user commands---------------------------
bot.command("promo", async (ctx) =>{

      promotions=JSON.parse(await getdb(promo_param));
      await ctx.reply("Выгодные предложения от PAR-RUS.RU: \n"+promotions.join("\n"));
});

bot.command("news", async (ctx) =>{

      news=JSON.parse(await getdb(news_param));
      await ctx.reply("Новости в PAR-RUS.RU: \n"+news.join("\n"));
});

bot.command("delivery", async (ctx) =>{

      delivery=JSON.parse(await getdb(delivery_param));
      await ctx.reply(delivery.join("\n"));
});

bot.command("adress", async (ctx) =>{

      await ctx.reply("Адреса par-rus.ru \n"+
                      "1. Центр: Большая Московская, 16, вход через арку налево \n"+
                      "2. Доброе: Безыменского, 26а, вход в Озон \n"+
                      "3. Тыщенка: Проспект Ленина, 62, вход в Верный, налево на цоколь \n");;
});

bot.command("menu", async (ctx) =>{
  await ctx.reply("меню включено", {
    "reply_markup": {
    "keyboard": [["/Приятная цена", "/Новости"], ["/Доставка"], ["/Адреса"]]
    }
  });
});

bot.command("hide", async (ctx) =>{
  await ctx.reply("меню выключено", {
    "reply_markup": {
      remove_keyboard: true
    }
  });
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
  "Прочитайте правила нашего чата",
  "https://t.me/parrus_ru/3285"
);

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
const introductionMessage = `Привет! Я робот помощник PAR-RUS.RU.
Я знаю о выгодных предложениях и последних новостях в PAR-RUS.RU,
также погу помочь с доставкой и показать адреса магазинов.
Чтобы показать меню напишите /menu
чтобы убрать меню напишите /hide

Команды
/promo - выгодные предложения
/news - Новости и посдедние поступления
/delivery - Доставка
/adress - Адреса магазинов
/help - Справка о боте` ;

const replyWithIntro = (ctx: any) =>
  ctx.reply(introductionMessage, {
    reply_markup: aboutUrlKeyboard,
    parse_mode: "HTML",
  });

bot.command("start", async (ctx) =>{
  ctx.reply("started");
  console.log("start command");
});
bot.command("help", replyWithIntro);

//--------greeting 1st new member-----------------
bot.on("msg:new_chat_members", async (ctx) =>{
  await  ctx.reply("@"+ ctx.msg.new_chat_members[0].first_name +", "+introductionMessage);
});
//------------------------------------------------

//---------------tracking key messages from users in chat-------------------------
bot.on("message", async (ctx) =>{
  var msg:any=ctx.message;
  const price =  "сколько стоит";
  const price1 =  "цена";
  const price2 =  "почём";
  const price3 =  "цену";

  if('text' in msg){

      if(ctx.message.text=="/Приятная цена"){
        promotions=JSON.parse(await getdb(promo_param));
        await ctx.reply("Выгодные предложения от PAR-RUS.RU: \n"+promotions.join("\n"));
        return;
      }

      if(ctx.message.text=="/Новости"){

            news=JSON.parse(await getdb(news_param));
            await ctx.reply("Новости в PAR-RUS.RU: \n"+news.join("\n"));
            return;
      };

      if(ctx.message.text=="/Доставка"){

            delivery=JSON.parse(await getdb(delivery_param));
            await ctx.reply(delivery.join("\n"));
            return;
      };

      if(ctx.message.text=="/Адреса"){

            await ctx.reply("Адреса par-rus.ru \n"+
                            "1. Центр: Большая Московская, 16, вход через арку налево \n"+
                            "2. Доброе: Безыменского, 26а, вход в Озон \n"+
                            "3. Тыщенка: Проспект Ленина, 62, вход в Верный, налево на цоколь \n");
            return;
      };


      msg=ctx.message.text;
      if (msg.toLowerCase().includes(price)||
          msg.toLowerCase().includes(price1)||
          msg.toLowerCase().includes(price2)||
          msg.toLowerCase().includes(price3)) {
      await ctx.reply("Извините, но цены на товары вы можете узнать придя в один из наших магазинов",{
        reply_markup: aboutUrlKeyboard,
        parse_mode: "HTML",
      });
      }

    if(ctx.message.text=="хуй")
     await  ctx.reply("с вами здесь и сейчас ваш бот Василий!");
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
  console.log('starting production config');
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
  console.log(` Use Long Polling for developmentsss`);
}
