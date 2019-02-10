const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const mz = require('./müzik.js');
const komut = require('./komut.js');
const translate = require('node-google-translate-skidz');
const moment = require('moment');
const db = require("quick.db")
const Jimp = require("jimp")


const mesajlar = {
    hatalar: {
        token: chalk.redBright("Token bilginiz yanlış görünüyor. Lütfen doğru ve geçerli bir token bilgisi yazınız."),
        ayarlar: chalk.redBright("Lütfen Discord botunuzun {x} yazınız.")
    }
};

class HazirPie extends Discord.Client {
    constructor(ayarlar) {
      super(ayarlar);

        if (!ayarlar.token || ayarlar.token === "") return console.log(mesajlar.hatalar.ayarlar.replace('{x}', 'token bilgisini'));
        if (!ayarlar.prefix || ayarlar.prefix === "") return console.log(mesajlar.hatalar.ayarlar.replace('{x}', 'prefix\'ini'));
        //if (!ayarlar.log || ayarlar.log === "") return console.log(mesajlar.hatalar.ayarlar.replace('{x}', 'log kanalını'));
        //if (!ayarlar.sahiplog || ayarlar.sahiplog === "") return console.log(mesajlar.hatalar.ayarlar.replace('{x}', 'bot sahibi log kanalını'));
        if (!ayarlar.sahip || ayarlar.sahip === "" || Array.isArray(ayarlar.sahip) === true && ayarlar.sahip[0] === "" || !ayarlar.sahip[0]) return console.log(mesajlar.hatalar.ayarlar.replace('{x}', 'sahibinin/sahiplerinin ID adresini'));

        this.ayarlar = {};
        this.ayarlar.token = ayarlar.token;
        this.token = ayarlar.token;
        this.ayarlar.prefix = ayarlar.prefix;
        this.ayarlar.sahip = ayarlar.sahip;
        //this.ayarlar.log = ayarlar.log;
        //this.ayarlar.sahiplog = ayarlar.sahiplog;

      this.on("ready", () => {
        console.log(`${chalk.cyan("Bot")} ${chalk.blue(`${this.user.username}`)} ${chalk.yellow("(")}${chalk.blue(`${this.user.tag}`)}${chalk.yellow(")")} ${chalk.cyan("adıyla giriş yaptı")}${chalk.redBright("!")}`)
      });
      
this.on("message", message => {
  
  
      let etiket = message.mentions.users.first();
  const embedCevap = new Discord.RichEmbed()
  .setDescription("Dostum ben yalnızca bir botum sana cevap veremem :P Ancak komutlarımı öğrenmek istersen " + ayarlar.prefix + "yardım komutunu kullanabilirsin :3")
  .setColor("#f558c9")
  if(etiket) if(etiket.id == this.user.id) message.channel.send(embedCevap);
  
  
  this.müzik = new mz(this, message);
  this.komut = new komut(this, message);
  

  
});
      
      this.on("message", async message => {
  let prefix = ayarlar.prefix

    let afk_kullanici = message.mentions.users.first() || message.author;
    if(message.content.startsWith(prefix+"afk") ) return; //! yazan yeri kendi botunuzun prefixi ile değiştirin.
  if (message.author.bot === true) return;

     if(message.content.includes(`<@${afk_kullanici.id}>`))
         if(db.has(`afks_${afk_kullanici.id}`)) {
             const afksuan = new Discord.RichEmbed()
                     .setColor("#f558c9")
                     .setDescription(`**${this.users.get(afk_kullanici.id).tag}** şuanda AFK! \n**Sebep:** \n${db.fetch(`afks_${afk_kullanici.id}`)}`)
                     message.channel.send(afksuan)         }
   
         if(db.has(`afks_${message.author.id}`)) {
             const basarili = new Discord.RichEmbed()
                 .setColor("#f558c9")
                 .setDescription("<@"+`${message.author.id}`+">, başarıyla afk modundan çıktın!")
                message.channel.send(basarili)
             db.delete(`afks_${message.author.id}`)
         } 

       });
   
      
      
      
      this.on("message", msg => {

  
	const embedlul = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setDescription(":crown: " + msg.author + ", " + this.user.username+" reklam koruması aktif, reklam yapmayı bırak evlat!:crown:")

const embedlulz = new Discord.RichEmbed()
	.setTitle("Sunucunda " + msg.author.tag + " reklam yapıyor!")
      .setColor(0x00AE86)
	.addField("Kullanıcının mesajı:", "**" + msg.content + "**")

if (msg.content.toLowerCase().match(/(discord\.gg\/)|(discordapp\.com\/invite\/)/g) && msg.channel.type === "text" && msg.channel.permissionsFor(msg.guild.member(this.user)).has("MANAGE_MESSAGES")) {
	if(msg.member.hasPermission('BAN_MEMBERS')){
	return;
	} else {
    msg.delete(30).then(deletedMsg => {
     deletedMsg.channel.send(embedlul)
	 msg.guild.owner.send(embedlulz).catch(e => {
            console.error(e);
          });
        }).catch(e => {
          console.error(e);
        });
      };
	  };
    })
      

      
      
};

    giris() {
        if (!this.token || this.token === "") return
        super.login(this.token).catch(err => { 
            if (err.message === 'Incorrect login details were provided.') { 
                return console.log(mesajlar.hatalar.token) 
            }
        });
    };


};

module.exports = HazirPie;
