const Discord = require('discord.js');
const { RichEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
var axios = require('axios');
const math = require('math-expression-evaluator');
const stripIndents = require('common-tags').stripIndents;
const youtube = new YouTube('AIzaSyDSiyHBWZI9dDZBWXloNVhrHbpzTTfa0L8');
const translate = require('@k3rn31p4nic/google-translate-api');
const db = require("quick.db")
const snekfetch = require("snekfetch");
const shorten = require('isgd');
const randomizeCase = word => word.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
const queue = new Map();

const mapping = {
    ' ': '   ',
    '0': ':zero:',
    '1': ':one:',
    '2': ':two:',
    '3': ':three:',
    '4': ':four:',
    '5': ':five:',
    '6': ':six:',
    '7': ':seven:',
    '8': ':eight:',
    '9': ':nine:',
    '!': ':grey_exclamation:',
    '?': ':grey_question:',
    '#': ':hash:',
    '*': ':asterisk:'
};

'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
    mapping[c] = mapping[c.toUpperCase()] = ` :regional_indicator_${c}:`;
});


class Komut {
    constructor(client, msg, args) {
        this.client = client;
        this.message = msg;
        this.args = args;
        this.ascii = this.constructor.ascii;
        this.hesapla = this.constructor.hesapla;
        this.eightBall = this.constructor.eightBall;      
        this.temizle = this.constructor.temizle;
        this.çeviri = this.constructor.çeviri;
        this.atasözü = this.constructor.atasözü;
        this.yaz = this.constructor.yaz;
        this.afk = this.constructor.afk;
        this.banner = this.constructor.banner;
        this.bitcoin = this.constructor.bitcoin;
        this.emojiyazı = this.constructor.emojiyazı;
        this.fakemesaj = this.constructor.fakemesaj;


    };

static async ascii(yazı) {
  if(!yazı) return this.message.channel.send("ascii komutu için kodlarında args kullanmalısın")
		axios.get(`http://artii.herokuapp.com/make?text=${yazı}`)
			.then(ascii => {
				if (ascii.data.length > 1999) {
					return this.message.channel.send('Ascii formatındaki mesaj biraz daha kısa bir metin dene').then(msg => msg.delete({ timeout: 2000 }));
				}
				return this.message.channel.send(`\`\`\`${ascii.data}\`\`\``);
			})
};
  
  static async temizle(miktar) {  
    if(!miktar) return this.message.reply("Temizle komutu için kodlarında args kullanmalısın")    
this.message.channel.bulkDelete(miktar).then(() => {
    const botunmesajyonet = new Discord.RichEmbed()
    let messagecount = parseInt(miktar);
  this.message.channel.fetchMessages({
    limit: messagecount
  }).then(messages => this.message.channel.bulkDelete(messages));
    const sohbetsilindi = new Discord.RichEmbed()
    .setColor('#f558c9')
    .setDescription(messagecount+ " adet mesaj sildim.")
    this.message.channel.send(sohbetsilindi)
})
    
  }

static async hesapla(işlem) {
  if(!işlem) return this.message.channel.send("hesapla komutu için kodlarında args kullanmalısın")
  let answer;
    try {
        answer = math.eval(işlem);
    } catch (err) {
            var embedHa= new Discord.RichEmbed()
      .setColor("#f558c9")
      .setDescription("Bir matematik işlemi belirtir misin? :3")
        return this.message.channel.send(embedHa);
    }
	const embed = new Discord.RichEmbed()
  .setAuthor(this.message.author.tag)
	.addField("**İşlem**: ",`**${işlem}**`, true)
	.addField("**Sonuç**: ",`**${answer}**`, true)
  .setColor("#f558c9")
    this.message.channel.send(embed)
};
  
  static async eightBall(soru) { 
    if(!soru) return this.message.channel.send("8ball komutu için kodlarında args kullanmalısın")
    var fortunes = [
  "eveeet :3",
  "hayır :(",
  "belki :P",
  "olabilir :)",
  "olmayabilir :(",
  "kafam karıştı daha sonra tekrar sor :/"
];    
    var cevap = fortunes[Math.floor(Math.random() * fortunes.length)]
    var embed2 = new Discord.RichEmbed()
    .setColor("#f558c9")
    .setDescription("Sihirli top bu sorun için **" + cevap + "** diyor!")
   this.message.channel.sendMessage(embed2);   
};
  
  static async çeviri(dil, mesaj) {
  if(!dil || !mesaj) this.message.channel.send("çeviri komutu için kodlarında args kullanmalısın")
    let result = await translate(mesaj, { to: dil });
	const embed = new Discord.RichEmbed()
	  .setColor(0x00AE86)
      .setDescription(result.text)
      .setFooter(`Ana Dil:${result.from.language.iso.toUpperCase()}  Çevrilen Dil:${dil.toUpperCase()}`)  
    this.message.channel.send(embed).catch(e => {
      console.log.err(e);
    }); 
  }
  
  static async atasözü() { 
    var Random = [
'**Acele ile menzil alınmaz.**',
'**Acı söz insanı dininden çıkarır, tatlı söz yılanı deliğinden çıkarır.**',
'**Akıllı sır saklar; aptal sır verir.**', '**Baba oğluna bir bağ bağışlamış, oğul babaya bir salkım üzüm vermemiş.**',
'**Bağ dua değil, çapa dua ister.**',
'**Aleme cellat lazım; senin olman ne lazım?**',
'**At ölür meydan kalır, yiğit ölür şan kalır..**',
'**Ateş olmayan yerden duman çıkmaz..**',
'**Az kazanan çok kazanır, çok kazanan hiç kazanır..**',
'**Aç koyma hırsız olur, çok söyleme yüzsüz olur, çok değme arsız olur.**',
'**Bebeler birbirinden huy kapar, ayranlarına su katar.**',
'**Bu dünya iki kapılı handır, gelen bilmez giden bilmez.**',
'**Darlıkta dirlik olmaz.**',
'**Dağ dumansız insan hatasız olmaz.**',
];
var atasozuver = Math.floor(Math.random()*Random.length);
const atasozu= new Discord.RichEmbed()
.setDescription(`${Random[atasozuver]}`)
.setColor(0xe2ff00)
.setTimestamp()
this.message.channel.send(atasozu)   
  }

  static async yaz(mesaj) {
  if(!mesaj) this.message.channel.send("yaz komutu için kodlarında args kullanmalısın")
  this.message.delete();
  this.message.channel.send(mesaj);
    
  }
  
  static async afk(sebep) { 
    if(!sebep) this.message.channel.send("afk komutu için kodlarında args kullanmalısın")
  var embed = new Discord.RichEmbed()
    .setDescription("AFK olma nedenini bilmezsem insanlara ne diyeceğim!")
  .setColor("#f558c9")
      if (!sebep) return this.message.channel.send(embed);
      db.set(`afks_${this.message.author.id}`, sebep)
  var embed = new Discord.RichEmbed()
        .setDescription(`Artık birileri seni etiketleyince onlara **${sebep}** diyeceğim.`)
  .setColor("#f558c9")
        this.message.channel.send(embed)
  }
  
  static async banner(txt) {
      if(!txt) this.message.channel.send("banner komutu için kodlarında args kullanmalısın")
  let embed = new Discord.RichEmbed()
  .setColor("GREEN")
  .setAuthor(txt)
  .setImage("https://dummyimage.com/2000x500/ff33ff/ffffff&text=" + txt)
  .setFooter("Banner Oluşturuldu!");
  this.message.channel.send(embed);
  }
  
  static async bitcoin() {
        snekfetch.get("https://blockchain.info/ticker").then((body) => {
        this.message.channel.send({
            embed: {
                title: "Bitcoin Değer",
                description: "Değerlerin her biri, farklı ülkelerde değişecek olan bir Bitcoin'in değeridir.",
                color: 3066993,
                fields: Object.keys(body.body).map((c) => {
                    return {
                        name: c,
                        value: "**Fiyat**: " + body.body[c].symbol + body.body[c].buy + "\n**Satış Değeri**: " + body.body[c].symbol + body.body[c].sell,
                        inline: true
                    }
                })
            }
        })
    }).catch((error) => {
        this.message.channel.send({
            embed: {
                title: "HATA!",
                color: 0xE50000,
                description: "Bitcoin fiyatlarını alırken beklenmeyen bir hata oluştu."
            }
        })
        console.error("Bitcoin Bilgisi alınamad", error.message)
        
    })   
  }
  
  
  static async emojiyazı(args) {  
 if(!args) this.message.channel.send("emojiyazı komutu için kodlarında args kullanmalısın")
    this.message.channel.send(
        args.split('')
            .map(c => mapping[c] || c)
            .join('')
    );  
  }
  
  
  static async fakemesaj(kişi, mesaj) {
    if(!kişi || !mesaj) this.message.channel.send("fakemesaj komutu için kodlarında args kullanmalısın")

    this.message.delete()
    this.message.channel.createWebhook(kişi.username, kişi.avatarURL)
    .then(webhook => webhook.edit(kişi.username, kişi.avatarURL)
        .then(wb => {
            const hook = new Discord.WebhookClient(wb.id, wb.token);
            hook.send(mesaj)
            hook.delete()
        })
        .catch(console.error))
        .catch(console.error);
    
    
  }
  

};

module.exports = Komut;
