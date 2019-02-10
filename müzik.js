const Discord = require('discord.js');
const { RichEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyDSiyHBWZI9dDZBWXloNVhrHbpzTTfa0L8');
const ffmpeg = require("ffmpeg");
const queue = new Map();

var alem    = "http://scturkmedya.radyotvonline.com/stream/80/";
var fenomen = "http://fenomen.listenfenomen.com/fenomen/128/icecast.audio";
var joy     = "http://17753.live.streamtheworld.com/JOY_FM128AAC_SC";
var kral    = "http://46.20.3.204/";
var line    = "http://radioline.fm:8000/";
var metro   = "http://17773.live.streamtheworld.com/METRO_FM_SC";
var radyod  = "http://radyo.dogannet.tv/radyod";
var number1 = "http://nr1digitalsc.radyotvonline.com/stream/264/";
var cnnturk = "https://radyo.dogannet.tv/cnnturk";
var superfm = "http://17733.live.streamtheworld.com/SUPER_FM_SC";
var virginr = "http://17753.live.streamtheworld.com/VIRGIN_RADIO2_SC";
var joyturk = "http://17733.live.streamtheworld.com/JOY_TURK_SC";
var kralpop = "http://46.20.3.201/;"
var power   = "http://powerfm.listenpowerapp.com/powerfm/mpeg/icecast.audio";
var palstat = "http://shoutcast.radyogrup.com:1020/stream/1/";
var ntv     = "http://ntvrdsc.radyotvonline.com/;";
var mydono  = "http://17733.live.streamtheworld.com/RADIO_MYDONOSE_SC";
var rekin   = "http://yayin.turkhosted.com:6006/;";
var slowtr  = "https://radyo.dogannet.tv/slowturk";
var fg      = "http://37.1.144.106:9001/stream/1/";
var parkfm  = "http://yayin.netradyom.com:8050/stream/1/";
var voyage  = "http://voyagewmp.radyotvonline.com/;";
var yon     = "http://yonradyo.radyolarburada.com:8020/;";
var imbat   = "http://allergo.serverroom.us:8127/;";
var nr1tr   = "http://46.20.4.61/;";
var eksen   = "http://eksenwmp.radyotvonline.com/;stream.mp3";

class Müzik {
    constructor(client, msg) {
        this.client = client;
        this.message = msg;

        this.oynat = this.constructor.oynat;
        this.durdur = this.constructor.durdur;
        this.geç = this.constructor.geç;
        this.kuyruk = this.constructor.kuyruk;
        this.duraklat = this.constructor.duraklat;
        this.devamet = this.constructor.devamet;
        this.tekrar = this.constructor.tekrar;
        this.ses = this.constructor.ses;
      this.radyo = this.constructor.radyo;
    };

static async oynat(şarkı) {
    var aramaYazisi = şarkı;
    var url = şarkı ? şarkı.replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(this.message.guild.id);

    var voiceChannel = this.message.member.voiceChannel;

    const embed = new RichEmbed()
    .setColor("RANDOM")
    .setDescription("Bir şarkı linki veya adı belirtir misin?")
    if (!şarkı) return this.message.channel.send(embed);
        
    const err1 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Sesli bir kanala katıl >:3`)  
    if (!this.message.member.voiceChannel) return this.message.channel.send(err1);

    var permissions = voiceChannel.permissionsFor(this.client.user);
    if (!permissions.has('CONNECT')) {
      const warningErr = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bu kanala katılmak için gerekli izniim yok`)
      return this.message.channel.send(warningErr);
    }
    if (!permissions.has('SPEAK')) {
      const musicErr = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bu kanalda konuşma yetkim yok`)
      return this.message.channel.send(musicErr);
    }
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      var playlist = await youtube.getPlaylist(url);
      var videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        var video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, this.message, voiceChannel, true);
      }
      const PlayingListAdd = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Şarkı eklendi: [${playlist.title}](https://www.youtube.com/watch?v=${playlist.id}) `)
      return this.message.channel.send(PlayingListAdd);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
      try {
          var videos = await youtube.searchVideos(aramaYazisi, 10);
          
          var r = 1
        
          var video = await youtube.getVideoByID(videos[r - 1].id);
        } catch (err) {
          console.error(err);
          const songNope = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Aradığınız isimde bir şarkı bulunamadı!`) 
          return this.message.channel.send(songNope);
        }
      }
      return handleVideo(video, this.message, voiceChannel);
    }

    async function handleVideo(video, message, voiceChannel, playlist = false) {
        var serverQueue = queue.get(message.guild.id);
        
        var song = {
          id: video.id,
          title: video.title,
          durationh: video.duration.hours,
          durationm: video.duration.minutes,
          durations: video.duration.seconds,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
          requester: message.author.tag,
        };
        if (!serverQueue) {
          var queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 3,
            playing: true
          };
          queue.set(message.guild.id, queueConstruct);
      
          queueConstruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
          } catch (error) {
            console.error(`HATA: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`HATA: ${error}`);
          }
        } else {
          serverQueue.songs.push(song);
          
          if (playlist) return undefined;
      
          const songListBed = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Şarkı eklendi: [${song.title}](https://www.youtube.com/watch?v=${song.id})`)
          return message.channel.send(songListBed);
        }
        return undefined;
      }
        function play(guild, song) {
        var serverQueue = queue.get(guild.id);
      
        if (!song) {
          serverQueue.voiceChannel.leave();
          voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }
      
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
          .on('end', reason => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
          })
          .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        
        let y = ''
        if (song.durationh === 0) {
            y = `${song.durationm || 0}:${song.durations || 0}`
        } else {
            y = `${song.durationh || 0}:${song.durationm || 0}:${song.durations || 0}`
        }

        const playingBed = new RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Şimdi Oynatılıyor`, song.thumbnail)
        .setDescription(`[${song.title}](${song.url})`)
        .addField("Şarkı Süresi", `${y}`, true)
        .addField("İsteyen kullanıcı", `${song.requester}`, true)
        .setThumbnail(song.thumbnail)
        serverQueue.textChannel.send(playingBed);
      } 
};

static async durdur() {
  var serverQueue = queue.get(this.message.guild.id);

  var voiceChannel = this.message.member.voiceChannel;
      
  const err1 = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Sesli bir kanala katıl`)  
  if (!this.message.member.voiceChannel) return this.message.channel.send(err1);
  const err2 = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
  if (!serverQueue) return this.message.channel.send(err2);
  serverQueue.songs = [];
  const songEnd = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Şarkı durduruldu`)
  serverQueue.connection.dispatcher.end('');
  this.message.channel.send(songEnd);
};

static async geç() {
  var serverQueue = queue.get(this.message.guild.id);

    var voiceChannel = this.message.member.voiceChannel;
        
    const err0 = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Sesli bir kanala katıl`) 
    if (!this.message.member.voiceChannel) return this.message.channel.send(err0);
    const err05 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return this.message.channel.send(err05);
    const songSkip = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı geçildi`)
    serverQueue.connection.dispatcher.end('');
    this.message.channel.send(songSkip)
};

static async kuyruk() {
  var serverQueue = queue.get(this.message.guild.id);

    var voiceChannel = this.message.member.voiceChannel;
        
    var siralama = 0;
    const a = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Sesli bir kanala katıl`)  
if (!this.message.member.voiceChannel) return this.message.channel.send(a);
const b = new RichEmbed()
.setColor("RANDOM")
.setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
if (!serverQueue) return this.message.channel.send(b);
    
var k = serverQueue.songs.map(song => `${++siralama} - [${song.title}](https://www.youtube.com/watch?v=${song.id})`).join('\n').replace(serverQueue.songs[0].title, `**${serverQueue.songs[0].title}**`)
    
const kuyruk = new Discord.RichEmbed()
.setColor("RANDOM")
.addField("Şarkı Kuyruğu", k)
return this.message.channel.send(kuyruk)
};

static async duraklat() {
  var serverQueue = queue.get(this.message.guild.id);

    var voiceChannel = this.message.member.voiceChannel;
        
    const a = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Sesli bir kanala katıl`)  
  if (!this.message.member.voiceChannel) return this.message.channel.send(a)

  if (serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
        const asjdhsaasjdhaadssad = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı duraklatıldı`)
      return this.message.channel.send(asjdhsaasjdhaadssad);
    }
    const b = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return this.message.channel.send(b);
};

static async devamet() {
  var serverQueue = queue.get(this.message.guild.id);

  var voiceChannel = this.message.member.voiceChannel;
      
  const a = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Sesli bir kanala katıl`)  
if (!this.message.member.voiceChannel) return this.message.channel.send(a)

  if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      const asjdhsaasjdhaadssad = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Şarkı devam ediyor`)
    return this.message.channel.send(asjdhsaasjdhaadssad);
  }
  const b = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
  if (!serverQueue) return this.message.channel.send(b);
};

static async tekrar() {
  var serverQueue = queue.get(this.message.guild.id);

    var voiceChannel = this.message.member.voiceChannel;
        
    const e = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`sesli bir kanala katıl`) 
  if (!this.message.member.voiceChannel) return this.message.channel.send(e);
  const p = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
  if (!serverQueue) return this.message.channel.send(p);
      
  var u = serverQueue.songs[0]
      
    var vi2 = await youtube.getVideoByID(u.id);
    await handleVideo(vi2, this.message, voiceChannel, true);
  const PlayingListAdd = new RichEmbed()
  .setColor("RANDOM")
  .setDescription(`[${u.title}](https://www.youtube.com/watch?v=${u.id}) adlı şarkı bitince tekrar oynatılacak!`)
  return this.message.channel.send(PlayingListAdd);

  async function handleVideo(video, message, voiceChannel, playlist = false) {
    var serverQueue = queue.get(message.guild.id);
    
    var song = {
      id: video.id,
      title: video.title,
      durationh: video.duration.hours,
      durationm: video.duration.minutes,
      durations: video.duration.seconds,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
      requester: message.author.tag,
    };
    if (!serverQueue) {
      var queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 3,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);
  
      queueConstruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`Ses kanalına giremedim HATA: ${error}`);
        queue.delete(message.guild.id);
        return message.channel.send(`Ses kanalına giremedim HATA: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      
     if(playlist) return undefined;
  
      const songListBed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Şarkı Eklendi: [${song.title}](https://www.youtube.com/watch?v=${song.id})`)
      return message.channel.send(songListBed);
    }
    return undefined;
  }
    function play(guild, song) {
    var serverQueue = queue.get(guild.id);
  
    if (!song) {
      serverQueue.voiceChannel.leave();
      voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
      .on('end', reason => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
    let y = ''
    if (song.durationh === 0) {
        y = `${song.durationm || 0}:${song.durations || 0}`
    } else {
        y = `${song.durationh || 0}:${song.durationm || 0}:${song.durations || 0}`
    }

    const playingBed = new RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`Şimdi Oynatılıyor`, song.thumbnail)
    .setDescription(`[${song.title}](${song.url})`)
    .addField("Şarkı Süresi", `${y}`, true)
    .addField("İsteyen kullanıcı", `${song.requester}`, true)
    .setThumbnail(song.thumbnail)
    serverQueue.textChannel.send(playingBed);
  }
};

static async ses(ses) {
  var serverQueue = queue.get(this.message.guild.id);

    var voiceChannel = this.message.member.voiceChannel;
        
    const asd1 = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!this.message.member.voiceChannel) return this.message.channel.send(asd1);
    const asd2 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return this.message.channel.send(asd2);

    if (!ses) return this.message.reply("Ses seviyesi ayarlamak için bir sayı yazmalısın!");
    if (isNaN(ses)) return this.message.reply("Ses seviyesi ayarlamak için bir sayı yazmalısın!");
    serverQueue.volume = ses;
    if (ses > 10) return this.message.channel.send("Ses seviyesi en fazla `10` olabilir")
    serverQueue.connection.dispatcher.setVolumeLogarithmic(ses / 5);
    const volumeLevelEdit = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Ayarlanan Ses Seviyesi: **${ses}**`)
    return this.message.channel.send(volumeLevelEdit);  
};
  
  
  static async radyo(mesaj) {
  
   	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("Sesli bir odaya gir ki radyo yayınına başlayabileyim >:3")

    if (!this.message.member.voiceChannel) return this.message.channel.send(embed);



    // 1 Alem
    if(mesaj === "alem") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(alem);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Alem** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 2 Fenomen
    if (mesaj === "fenomen") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(fenomen);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Fenomen** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 3 Joy
    if(mesaj === "joy") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(joy);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Joy** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 4 Kral
    if(mesaj === "kral") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(kral);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Kral** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 5 Line
    if(mesaj === "radioline") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(line);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**RadioLine** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 6 Metro
    if(mesaj === "metro") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(metro);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Metro** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 7 RadyoD
    if (mesaj === "radyod") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(radyod);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**RadyoD 104** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 8 Number1
    if(mesaj === "number1") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(number1);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Number1** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };    
    // 9 CNNTR
    if(mesaj === "cnntürk") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(cnnturk);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**CNN Türk** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 10 Super
    if(mesaj === "super") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(superfm);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Super** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 11 Virgin
    if(mesaj === "virgin") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(virginr);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Virgin** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 12 JoyTR
    if(mesaj === "joytürk") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(joyturk);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Joy Türk** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 13 Kral Pop
    if(mesaj === "kralpop") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(kralpop);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Kral Pop** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    };
    // 14
    if(mesaj === "power") {
        if (this.message.member.voiceChannel.join()
        .then(connection => {
            const dispatcher = connection.playStream(power);
          	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("**Power** FM Oynatılıyor")
            return this.message.channel.send(embed);
        }));
        return;
    } 
	
	if (mesaj === "bitir") {
							const voiceChannel = this.message.member.voiceChannel;

			voiceChannel.leave()
    	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("Radyo yayını bitirildi!")
      this.message.channel.send(embed)
	}else {
    	var embed = new Discord.RichEmbed()
	.setColor("#f558c9")
	.setDescription("Canlı olarak yayınlamam istediğin rady kanalı hangisi? Aşağıdan seçebilirsin")
	.addField("Radyo Listem: ", `•Alem FM : alem
•Fenomen FM : fenomen
•Joy FM : joy
•Kral FM : kral
•RadioLine FM : radioline
•Metro FM : metro
•RadyoD 104 FM : radyod
•Number1 FM : number1
•CNN Türk FM : cnntürk
•Super FM : super
•Virgin FM : virgin
•Joy Türk FM : oytürk
•Kral Pop FM : kralpop
•Power FM : power
•Yayını bitimek için : bitir`)
    this.message.channel.send(embed)
    }
    
  }

};

module.exports = Müzik;
