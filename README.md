# HAZIRBOT MODÜLÜ
​
- Bu modül sayesinde en kompleksi komutları bile yalnızca bir satır kod ile kullanabileceksiniz!
​
- Yapmanız gereken yalnızca `const hazirbot = require('hazirbot')` kodu ile modülümüzü tanıtıp, `npm install github:barbarbar338/hazirbot` komutu ile modülü indirmek!
​
- Modülün kullanıldığı örnek bir bot olarak [Pinkie Pie](https://discordapp.com/oauth2/authorize?client_id=442380790542630912&scope=bot&permissions=2146958591) botunu sunucunuza davet edebilirsiniz!
​
- Modülün çalışma mantığını anlamanız için [Glitch üzerinden remix](https://glitch.com/edit/#!/remix/hazirbot-modul-taslak)'leyerek bu test botunu da kullanabilirsiniz!
# KURULUM
​
- `npm init` komutu ile `package.json` dosyasını oluşturun.
- [Discord Developer](https://discordapp.com/developers/applications/) sayfasından botunuzu oluşturun, `token` ve `client id` değerlerini bir yere kaydedin.
- Bot klasörünüzün ana dizinine `bot.js | app.js | index.js | server.js` adlı bot dosyanızı oluşturun ve içerisine verdiğimiz örnek taslağı atın.
- Bot klasörünüzin ana dizinine `komutlar` klasörü oluşturun. içerisine komutlarımızı atacağız.
- Komutlar klasörünün içerisine `komut_adı.js` adlı dosya oluşturup içerisine verdiğimiz komut taslağını atın.
- Bot dosyanızın içerisindeki bilgileri doldurduğunuzda botunuz otomatik olarak çevrimiçi hale gelir!
​
# KOMUTLAR VE KULLANIMI
​

| KOMUTLAR  | KULLANIM |
| ------------- | ------------- |
| **ascii**  | client.komut.ascii(mesaj) |
| **radyo**  | client.müzik.radyo(kanal) |
| **hesapla**  | client.komut.hesapla(işlem) |
| **oynat**  | client.müzik.oynat(link/isim)  |
| **eightBall**  | client.komut.eightBall(soru)  |
| **fakemesaj**  | client.komut.fakemesaj(kişi, mesaj)  |
| **temizle**  | client.komut.temzile(miktar)  |
| **emojiyazı**  | client.komut.emojiyazı(mesaj)  |
| **çeviri**  | client.komut.çeviri(dil, mesaj)  |
| **bitcoin**  | client.komut.bitcoin()  |
| **atasözü**  |  client.komut.atasözü()  |
| **banner**  | client.komut.banner(mesaj)  |
| **yaz**  | client.komut.yaz(mesaj)  |
| **afk**  | client.komut.afk(sebep)  |

​
# TASLAKLAR
​
- `bot.js | app.js | index.js | server.js` taslağı =>
```js
const hazirbot = require("hazirbot");
const client = new hazirbot.HazirPie({
    token: "  ", //bot tokeniniz
    prefix: "  ", //tercih ettiğiniz prefiz
    sahip: ["  "] //kendi id'niz ( "," ile ayırarak birden çok ekleyebilirsiniz)
});
​
client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(client.ayarlar.prefix) !== 0) return;
​
  const args = message.content.slice(client.ayarlar.prefix.length).trim().split(/ +/g);
  const komut = args.shift().toLowerCase();
​
  try {
    let komutDosyası = require(`./komutlar/${komut}.js`);
    komutDosyası.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});
​
client.giris();
```
​
- `komutlar/komut_adı.js` taslağı =>
```js
const Discord = require('discord.js')
const hazirbot = require("hazirbot")

module.exports.run = async (bot, message, args) => {
  bot.komut.komut_adı(<argüman>)
  //veya
  bot.müzik.komut_adı(<argüman>)
}

module.exports.help = {
    name: " ", //komut adı
    description: "  ", //açıklaması
    usage: "    " //kullanımı
}
```
