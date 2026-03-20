var useState = React.useState;
var useEffect = React.useEffect;

var FB_URL = "https://littleportionfarm-default-rtdb.firebaseio.com/lpf_9Rx4kW2mT7vQ";

window.storage = {
  get: async function(key) {
    var v = localStorage.getItem(key);
    return v ? { value: v } : undefined;
  },
  set: async function(key, val) {
    try { localStorage.setItem(key, val); } catch(e) {}
    try {
      fetch(FB_URL + "/" + key + ".json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: val
      });
    } catch(e) {}
  }
};

async function fbPull() {
  try {
    var res = await fetch(FB_URL + ".json");
    if (!res.ok) return false;
    var data = await res.json();
    if (!data) return false;
    Object.keys(data).forEach(function(k) {
      try { localStorage.setItem(k, JSON.stringify(data[k])); } catch(e) {}
    });
    return true;
  } catch(e) { return false; }
}

window._fbReady = true;


var DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var TODAY=(function(){var m={1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"};return m[new Date().getDay()]||"Saturday";})();
var CATS=["Important","Harvesting","Watering","Cleanup","Animal Care","General"];
var NOTE_CATS=["Communication","Tools & Equipment","Harvesting","Volunteers","General"];
var HV_CROPS=["Kale","Spinach","Arugula","Strawberries","Tomatoes","Lettuce","Herbs","Peppers","Squash","Beans","Carrots","Radishes","Other"];
var HV_UNITS=["lbs","oz","bunches","bags","bins","heads","pints","quarts","count"];
var HV_QUAL=["Great","Good","Fair","Poor"];
var DOW=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var SKILLS=["Harvesting","Watering","Planting","Packing","Cleanup","Animal Care","Tool Use","Leading Groups"];
var EXP_LVL=["New","Learning","Experienced","Can Lead"];
var MW_CONDS=["Clear","Mostly Clear","Partly Cloudy","Overcast","Foggy","Light Rain","Rain","Heavy Rain","Light Snow","Snow","Heavy Snow","Thunderstorm"];
var MW_CODES={"Clear":0,"Mostly Clear":1,"Partly Cloudy":2,"Overcast":3,"Foggy":45,"Light Rain":61,"Rain":63,"Heavy Rain":65,"Light Snow":71,"Snow":73,"Heavy Snow":75,"Thunderstorm":95};
var BR_CATS=["General","Harvesting","Watering","Packing","Cleanup","Tools","Animal Care","Safety"];
var TECH_CROPS=["None","Kale","Spinach","Arugula","Strawberries","Tomatoes","Lettuce","Herbs","Other"];
var TECH_TASKS=["None","Harvesting","Watering","Packing","Planting","Cleanup","Other"];
var DEF_SESS=[{id:"s1",date:"03/17/2026",dow:"Tuesday",time:"10am-1pm",signup:9},{id:"s2",date:"03/18/2026",dow:"Wednesday",time:"1pm-4pm",signup:6},{id:"s3",date:"03/19/2026",dow:"Thursday",time:"1pm-4pm",signup:2},{id:"s4",date:"03/19/2026",dow:"Thursday",time:"4pm-7pm",signup:8},{id:"s5",date:"03/20/2026",dow:"Friday",time:"1pm-4pm",signup:4},{id:"s6",date:"03/21/2026",dow:"Saturday",time:"8:30am-2pm",signup:22},{id:"s7",date:"03/26/2026",dow:"Thursday",time:"1pm-4pm",signup:1},{id:"s8",date:"03/26/2026",dow:"Thursday",time:"4pm-7pm",signup:9},{id:"s9",date:"03/27/2026",dow:"Friday",time:"1pm-4pm",signup:3},{id:"s10",date:"03/28/2026",dow:"Saturday",time:"8:30am-2pm",signup:13},{id:"s11",date:"03/31/2026",dow:"Tuesday",time:"10am-1pm",signup:1}];
var SIG_MAP={s1:9,s2:6,s3:2,s4:8,s5:4,s6:22,s7:1,s8:9,s9:3,s10:13,s11:1};
var MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var FARM_LAT=39.2673;
var FARM_LON=-76.7985;

function wmoToCondition(code){
  if(code===0)return{condition:"Clear",weatherCode:0};
  if(code===1)return{condition:"Mostly Clear",weatherCode:1};
  if(code===2)return{condition:"Partly Cloudy",weatherCode:2};
  if(code===3)return{condition:"Overcast",weatherCode:3};
  if(code===45||code===48)return{condition:"Foggy",weatherCode:45};
  if(code>=51&&code<=57)return{condition:"Light Rain",weatherCode:61};
  if(code===61||code===80)return{condition:"Light Rain",weatherCode:61};
  if(code===63||code===81)return{condition:"Rain",weatherCode:63};
  if(code===65||code===82)return{condition:"Heavy Rain",weatherCode:65};
  if(code===71||code===85)return{condition:"Light Snow",weatherCode:71};
  if(code===73)return{condition:"Snow",weatherCode:73};
  if(code===75||code===77||code===86)return{condition:"Heavy Snow",weatherCode:75};
  if(code>=95)return{condition:"Thunderstorm",weatherCode:95};
  return{condition:"Partly Cloudy",weatherCode:2};
}

var VOL_MILESTONES=[{hours:1,label:"First Hour",icon:"🌱",desc:"Showed up and got their hands dirty"},{hours:5,label:"Getting Started",icon:"🌿",desc:"5 volunteer hours logged"},{hours:10,label:"Farm Friend",icon:"🌾",desc:"10 hours contributed to the farm"},{hours:25,label:"Dedicated Farmer",icon:"⭐",desc:"25 hours — truly committed"},{hours:50,label:"Farm Champion",icon:"🏆",desc:"50 hours — an extraordinary volunteer"},{hours:100,label:"Farm Legend",icon:"🌟",desc:"100 hours — part of the farm's soul"},{hours:200,label:"Pillar of the Farm",icon:"🏛️",desc:"200 hours — a cornerstone of this community"},{hours:300,label:"Harvest Master",icon:"🌻",desc:"300 hours — an enduring force on the farm"},{hours:500,label:"Farm Guardian",icon:"🦅",desc:"500 hours — a guardian of Little Portion Farm"}];
var SESSION_MILESTONES=[{sessions:1,label:"First Session",icon:"👣",desc:"Attended their first session"},{sessions:5,label:"Regular",icon:"📅",desc:"5 sessions attended"},{sessions:10,label:"Committed",icon:"💪",desc:"10 sessions — a true regular"},{sessions:25,label:"Veteran",icon:"🎖️",desc:"25 sessions attended"}];
var PERSONAL_MILESTONES=[{hours:10,label:"Ten Hours In",icon:"🌱"},{hours:25,label:"Committed",icon:"🌿"},{hours:50,label:"Dedicated",icon:"🌾"},{hours:100,label:"Century",icon:"⭐"},{hours:200,label:"Farm Soul",icon:"🏆"},{hours:500,label:"Legend",icon:"🌟"},{hours:750,label:"Guardian",icon:"🦅"},{hours:1000,label:"Thousand Hours",icon:"🏛️"},{hours:1500,label:"Living Legacy",icon:"🌻"},{hours:2000,label:"Farm Eternal",icon:"💫"}];

var SECRET_QUOTES=[
  {t:"The greatness of a man is not measured from his feet to his head, but from his head to the sky.",a:"Napoleon Bonaparte"},
  {t:"Impossible is a word to be found only in the dictionary of fools.",a:"Napoleon Bonaparte"},
  {t:"Victory belongs to the most persevering.",a:"Napoleon Bonaparte"},
  {t:"A man is not finished when he is defeated. He is finished when he quits.",a:"Napoleon Bonaparte"},
  {t:"Know thyself.",a:"Socrates"},
  {t:"The unexamined life is not worth living.",a:"Socrates"},
  {t:"Wisdom begins in wonder.",a:"Socrates"},
  {t:"We are what we repeatedly do. Excellence, then, is not an act, but a habit.",a:"Aristotle"},
  {t:"Patience is bitter, but its fruit is sweet.",a:"Aristotle"},
  {t:"It is during our darkest moments that we must focus to see the light.",a:"Aristotle"},
  {t:"One must imagine Sisyphus happy.",a:"Albert Camus"},
  {t:"The soul is healed by being with children.",a:"Fyodor Dostoevsky"},
  {t:"The mystery of human existence lies not in just staying alive, but in finding something to live for.",a:"Fyodor Dostoevsky"},
  {t:"There is only one thing that I dread: not to be worthy of my sufferings.",a:"Fyodor Dostoevsky"},
  {t:"Man only likes to count his troubles; he doesn't calculate his happiness.",a:"Fyodor Dostoevsky"},
  {t:"To love someone means to see them as God intended them.",a:"Fyodor Dostoevsky"},
  {t:"Everyone thinks of changing the world, but no one thinks of changing himself.",a:"Leo Tolstoy"},
  {t:"The two most powerful warriors are patience and time.",a:"Leo Tolstoy"},
  {t:"If you look for perfection, you'll never be content.",a:"Leo Tolstoy"},
  {t:"God sees the truth but waits.",a:"Leo Tolstoy"},
  {t:"Wrong does not cease to be wrong because the majority share in it.",a:"Leo Tolstoy"},
  {t:"It is not death that a man should fear, but he should fear never beginning to live.",a:"Marcus Aurelius"},
  {t:"Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",a:"Marcus Aurelius"},
  {t:"You have power over your mind, not outside events. Realize this, and you will find strength.",a:"Marcus Aurelius"},
  {t:"The impediment to action advances action. What stands in the way becomes the way.",a:"Marcus Aurelius"},
  {t:"Waste no more time arguing about what a good man should be. Be one.",a:"Marcus Aurelius"},
  {t:"Begin at once to live, and count each separate day as a separate life.",a:"Seneca"},
  {t:"One must still have chaos in oneself to be able to give birth to a dancing star.",a:"Friedrich Nietzsche"},
  {t:"He who has a why to live can bear almost any how.",a:"Friedrich Nietzsche"},
  {t:"That which does not kill us makes us stronger.",a:"Friedrich Nietzsche"},
  {t:"Without music, life would be a mistake.",a:"Friedrich Nietzsche"},
  {t:"The more I know, the more I realize how much I don't know.",a:"Socrates"},
  {t:"Courage is knowing what not to fear.",a:"Plato"},
  {t:"Wise men speak because they have something to say; fools because they have to say something.",a:"Plato"},
  {t:"The measure of a man is what he does with power.",a:"Plato"},
  {t:"Good people do not need laws to tell them to act responsibly.",a:"Plato"},
  {t:"It does not matter how slowly you go as long as you do not stop.",a:"Confucius"},
  {t:"The man who moves a mountain begins by carrying away small stones.",a:"Confucius"},
  {t:"He who learns but does not think is lost. He who thinks but does not learn is in great danger.",a:"Confucius"},
  {t:"Silence is a true friend who never betrays.",a:"Confucius"},
  {t:"Life is really simple, but we insist on making it complicated.",a:"Confucius"},
  {t:"There is no charm equal to tenderness of heart.",a:"Jane Austen"},
  {t:"I declare after all there is no enjoyment like reading.",a:"Jane Austen"},
  {t:"The person who has not pleasure in a good novel must be intolerably stupid.",a:"Jane Austen"},
  {t:"To live is the rarest thing in the world. Most people exist, that is all.",a:"Oscar Wilde"},
  {t:"Be yourself; everyone else is already taken.",a:"Oscar Wilde"},
  {t:"We are all in the gutter, but some of us are looking at the stars.",a:"Oscar Wilde"},
  {t:"A room without books is like a body without a soul.",a:"Marcus Tullius Cicero"},
  {t:"If you have a garden and a library, you have everything you need.",a:"Marcus Tullius Cicero"},
  {t:"Not to know what happened before you were born is to remain forever a child.",a:"Marcus Tullius Cicero"},
  {t:"Cowards die many times before their deaths; the valiant never taste of death but once.",a:"William Shakespeare"},
  {t:"All the world's a stage, and all the men and women merely players.",a:"William Shakespeare"},
  {t:"This above all: to thine own self be true.",a:"William Shakespeare"},
  {t:"The fault, dear Brutus, is not in our stars, but in ourselves.",a:"William Shakespeare"},
  {t:"I think, therefore I am.",a:"Rene Descartes"},
  {t:"Not all those who wander are lost.",a:"J.R.R. Tolkien"},
  {t:"All we have to decide is what to do with the time that is given us.",a:"J.R.R. Tolkien"},
  {t:"Even the smallest person can change the course of the future.",a:"J.R.R. Tolkien"},
  {t:"Do not pray for an easy life; pray for the strength to endure a difficult one.",a:"Bruce Lee"},
  {t:"Absorb what is useful, discard what is useless, and add what is specifically your own.",a:"Bruce Lee"},
  {t:"The key to immortality is first living a life worth remembering.",a:"Bruce Lee"},
  {t:"I hated every minute of training, but I said, don't quit. Suffer now and live the rest of your life as a champion.",a:"Muhammad Ali"},
  {t:"Service to others is the rent you pay for your room here on earth.",a:"Muhammad Ali"},
  {t:"Float like a butterfly, sting like a bee.",a:"Muhammad Ali"},
  {t:"Darkness cannot drive out darkness; only light can do that.",a:"Martin Luther King Jr."},
  {t:"The time is always right to do what is right.",a:"Martin Luther King Jr."},
  {t:"Nature does not hurry, yet everything is accomplished.",a:"Lao Tzu"},
  {t:"A journey of a thousand miles begins with a single step.",a:"Lao Tzu"},
  {t:"When I let go of what I am, I become what I might be.",a:"Lao Tzu"},
  {t:"Do not go where the path may lead; go instead where there is no path and leave a trail.",a:"Ralph Waldo Emerson"},
  {t:"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",a:"Ralph Waldo Emerson"},
  {t:"Nothing is worth more than this day.",a:"Johann Wolfgang von Goethe"},
  {t:"Knowing is not enough; we must apply. Willing is not enough; we must do.",a:"Johann Wolfgang von Goethe"},
  {t:"It is not the mountain we conquer, but ourselves.",a:"Edmund Hillary"},
];

var T={bg:"#faf5ee",bg2:"#f5ede0",bg3:"#fff8ef",border:"#ecddc8",gold:"#c89530",goldBg:"rgba(200,149,48,0.08)",teal:"#4a9a88",tealBg:"rgba(74,154,136,0.08)",rose:"#d47070",roseBg:"rgba(212,112,112,0.08)",peach:"#e8956a",peachBg:"rgba(232,149,106,0.1)",peachBg2:"rgba(232,149,106,0.15)",lavender:"#9080b8",lavBg:"rgba(144,128,184,0.08)",green:"#5a9a58",greenBg:"rgba(90,154,88,0.08)",butter:"#f0d868",butterBg:"rgba(240,216,104,0.15)",text:"#3a3028",textDim:"#9a9088",textMid:"#6a6058",white:"#ffffff",shadow:"0 2px 12px rgba(120,100,70,0.08)",shadowLg:"0 4px 20px rgba(120,100,70,0.12)"};

var _n=Date.now();
function mkid(){return String(++_n);}
async function sv(k,v){try{await window.storage.set(k,JSON.stringify(v));}catch(e){}}
async function ld(k,d){try{var r=await window.storage.get(k);if(!r)return d;var v=JSON.parse(r.value);if(typeof v==="string"){try{v=JSON.parse(v);}catch(e){}}return(v!==null&&v!==undefined)?v:d;}catch(e){return d;}}
async function aiCall(p){for(var a=0;a<2;a++){try{var r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":localStorage.getItem("claudeApiKey")||"","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,messages:[{role:"user",content:p}]})});if(!r.ok)throw new Error();var d=await r.json();var t=(d.content||[]).map(function(b){return b.text||"";}).join("");if(!t)throw new Error();return t;}catch(e){if(a<1)await new Promise(function(res){setTimeout(res,800);});else throw e;}}}

function ft12(t){var p=t.split(":");var h=parseInt(p[0]);return(h===0?12:h>12?h-12:h)+":"+p[1]+(h>=12?"pm":"am");}
function sLbl(s){var p=s.date.split("/");var d=new Date(p[2]+"-"+p[0]+"-"+p[1]+"T12:00:00");return s.dow.slice(0,3)+" "+d.toLocaleDateString("en-US",{month:"short"})+" "+d.getDate()+" - "+s.time;}
function dLbl(id,ss){var s=ss.find(function(x){return x.id===id;});return s?sLbl(s):id;}
function wIc(c){if(c===0)return"☀️";if(c<=3)return"⛅";if(c<=9)return"🌫️";if(c<=59)return"🌦️";if(c<=69)return"🌧️";if(c<=79)return"❄️";return"⛈️";}
function inMonth(ds,m,y){try{var p=ds.split("/");return parseInt(p[0])-1===m&&parseInt(p[2])===y;}catch(e){return false;}}

var CCS={"Important":{ac:T.rose,bg:T.roseBg},"Harvesting":{ac:T.peach,bg:T.peachBg},"Watering":{ac:T.teal,bg:T.tealBg},"Cleanup":{ac:"#b89860",bg:"rgba(184,152,96,0.08)"},"Animal Care":{ac:"#c88060",bg:"rgba(200,128,96,0.08)"},"General":{ac:T.textDim,bg:"rgba(154,144,136,0.06)"},"Communication":{ac:T.lavender,bg:T.lavBg},"Tools & Equipment":{ac:T.green,bg:T.greenBg},"Volunteers":{ac:T.gold,bg:T.goldBg},"Tools":{ac:T.green,bg:T.greenBg},"Safety":{ac:T.rose,bg:T.roseBg},"Packing":{ac:"#b89860",bg:"rgba(184,152,96,0.08)"}};
function gc(c){return CCS[c]||CCS["General"];}
var EXP_C={"New":{bg:"#fce8e4",tx:T.rose,bd:"#f0c8c0"},"Learning":{bg:"#fef0d0",tx:T.gold,bd:"#e8d8a0"},"Experienced":{bg:"#ddf0dd",tx:T.green,bd:"#b0d8b0"},"Can Lead":{bg:"#d8eee8",tx:T.teal,bd:"#a0d0c0"}};
var CCR={};
["Kale","Spinach","Arugula","Lettuce","Beans","Herbs"].forEach(function(c){CCR[c]={ac:T.green,bg:T.greenBg};});
["Strawberries","Tomatoes","Peppers","Radishes"].forEach(function(c){CCR[c]={ac:T.rose,bg:T.roseBg};});
["Squash","Carrots"].forEach(function(c){CCR[c]={ac:T.gold,bg:T.goldBg};});
CCR["Other"]={ac:T.textDim,bg:"rgba(154,144,136,0.06)"};
function gcc(c){return CCR[c]||CCR["Other"];}

var inp_s={padding:"11px 15px",borderRadius:14,border:"1.5px solid "+T.border,fontSize:14,fontFamily:"Georgia,serif",background:T.white,color:T.text,outline:"none",boxSizing:"border-box"};
var ta_s=Object.assign({},inp_s,{width:"100%",resize:"vertical",lineHeight:1.6});
function btn(bg,fg){return{background:bg||"linear-gradient(135deg,"+T.peach+","+T.gold+")",color:fg||"#fff",border:"none",borderRadius:14,padding:"12px 22px",fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,boxShadow:"0 2px 8px rgba(200,140,80,0.2)"};}
function btn2(cl){return{background:T.white,color:cl||T.textMid,border:"1.5px solid "+T.border,borderRadius:14,padding:"10px 18px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:T.shadow};}
function crd(extra){return Object.assign({background:T.white,borderRadius:20,marginBottom:16,overflow:"hidden",boxShadow:T.shadow},extra||{});}
function Pill(p){return <span style={{display:"inline-block",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",borderRadius:10,padding:"4px 10px",background:p.bg||T.peachBg2,color:p.color||T.peach}}>{p.children}</span>;}
function Stat(p){return <div style={{textAlign:"center",flex:1,background:T.bg2,borderRadius:14,padding:"12px 8px"}}><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{p.label}</div><div style={{fontSize:22,fontWeight:700,color:p.color||T.peach,lineHeight:1}}>{p.value}</div></div>;}
function Sec(p){return <div style={{fontSize:11,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:12,marginTop:p.mt||0}}>{p.children}</div>;}
function Lbl(p){return <div style={{fontSize:10,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>{p.children}</div>;}
function PhotoPicker(p){var ref=React.useRef();function handle(e){var file=e.target.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(ev){var img=new Image();img.onload=function(){var MAX=900,w=img.width,h=img.height;if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}var c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);p.onChange(c.toDataURL("image/jpeg",0.75));};img.src=ev.target.result;};reader.readAsDataURL(file);}return <div style={{marginBottom:10}}>{p.value?<div style={{position:"relative"}}><img src={p.value} style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:14,display:"block"}}/><button onClick={function(){p.onChange(null);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,lineHeight:"26px",textAlign:"center",padding:0}}>✕</button></div>:<button onClick={function(){ref.current&&ref.current.click();}} style={{width:"100%",background:"transparent",border:"1.5px dashed "+T.border,borderRadius:14,padding:"12px",fontSize:12,color:T.textDim,cursor:"pointer",fontFamily:"Georgia,serif"}}>📷 Add Photo</button>}<input ref={ref} type="file" accept="image/*" capture="environment" onChange={handle} style={{display:"none"}}/></div>;}
function SeSel(p){var sorted=p.ss.slice().sort(function(a,b){var pa=a.date.split("/"),pb=b.date.split("/");return new Date(pa[2],pa[0]-1,pa[1])-new Date(pb[2],pb[0]-1,pb[1]);});return <select value={p.val} onChange={p.onChange} style={Object.assign({},inp_s,p.style||{})}><optgroup label="Sessions">{sorted.map(function(s){return <option key={s.id} value={s.id}>{sLbl(s)}</option>;})}</optgroup><optgroup label="Days">{DAYS.map(function(d){return <option key={d} value={d}>{d}</option>;})}</optgroup></select>;}

var MENU=[{k:"myday",l:"My Day",ic:"☀️"},{k:"checklist",l:"Tasks",ic:"✓"},{k:"add",l:"Add",ic:"+"},{k:"harvest",l:"Harvest",ic:"🌾"},{k:"analytics",l:"Analytics",ic:"📊"},{k:"weather",l:"Weather",ic:"🌤"},{k:"volunteers",l:"Team",ic:"👥"},{k:"briefing",l:"Briefing",ic:"⚠️"},{k:"techniques",l:"Guides",ic:"📖"},{k:"notes",l:"Notes",ic:"📋"},{k:"observations",l:"Observe",ic:"👀"},{k:"calendar",l:"Calendar",ic:"📅"},{k:"settings",l:"Settings",ic:"⚙️"},{k:"about",l:"About",ic:"ℹ️"}];
var QUOTES=[{text:"The best time to plant a tree was 20 years ago. The second best time is now.",author:"Chinese Proverb"},{text:"He who plants a garden plants happiness.",author:"Chinese Proverb"},{text:"To forget how to dig the earth and to tend the soil is to forget ourselves.",author:"Mahatma Gandhi"},{text:"Nature does not hurry, yet everything is accomplished.",author:"Lao Tzu"},{text:"The glory of gardening: hands in the dirt, head in the sun, heart with nature.",author:"Alfred Austin"},{text:"In every walk with nature one receives far more than he seeks.",author:"John Muir"},{text:"Patience is bitter, but its fruit is sweet.",author:"Aristotle"},{text:"Small deeds done are better than great deeds planned.",author:"Peter Marshall"},{text:"The farmer has to be an optimist or he wouldn't still be a farmer.",author:"Will Rogers"},{text:"If you have a garden and a library, you have everything you need.",author:"Marcus Tullius Cicero"}];
var HOME_QUOTES=[
  {text:"The land is the great teacher — if we humble ourselves enough to listen.",author:"St. Isidore the Farmer"},
  {text:"Cultivate the earth and cultivate yourself; the soil teaches what no book can.",author:"St. Isidore the Farmer"},
  {text:"Let us never tire of doing little things for the love of God, who considers not the magnitude of the work but the love.",author:"St. Thérèse of Lisieux"},
  {text:"It is not the magnitude of our actions but the amount of love that is put into them that matters.",author:"St. Teresa of Calcutta"},
  {text:"The best remedy for those who are afraid, lonely, or unhappy is to go outside, somewhere they can be quiet, alone with the heavens, nature, and God.",author:"Anne Frank"},
  {text:"God writes the Gospel not in the Bible alone, but also on trees, and in the flowers and clouds and stars.",author:"Martin Luther"},
  {text:"Look at the trees, look at the birds, look at the clouds, look at the stars... and if you have eyes, you will see God.",author:"Osho"},
  {text:"The love of gardening is a seed once sown that never dies.",author:"Gertrude Jekyll"},
  {text:"A garden is a grand teacher. It teaches patience and careful watchfulness; it teaches industry and thrift; above all it teaches entire trust.",author:"Gertrude Jekyll"},
  {text:"The earth is at the same time mother; she is mother of all that is natural, mother of all that is human. She is the mother of all, for contained in her are the seeds of all.",author:"St. Hildegard of Bingen"},
  {text:"Glance at the sun. See the moon and the stars. Gaze at the beauty of earth's greenings. Now, think. What delight God gives to humankind.",author:"St. Hildegard of Bingen"},
  {text:"There is no small act of kindness. Every compassionate act makes large the world.",author:"Mary Anne Radmacher"},
  {text:"To labor is to pray.",author:"St. Benedict of Nursia"},
  {text:"Ora et Labora — Pray and Work.",author:"Benedictine Motto"},
  {text:"The fruit of silence is prayer; the fruit of prayer is faith; the fruit of faith is love; the fruit of love is service; the fruit of service is peace.",author:"St. Teresa of Calcutta"},
  {text:"We must be willing to let go of the life we have planned, so as to have the life that is waiting for us.",author:"Joseph Campbell"},
  {text:"He who sows sparingly will also reap sparingly, and he who sows bountifully will also reap bountifully.",author:"2 Corinthians 9:6"},
  {text:"Consider the lilies of the field, how they grow; they neither toil nor spin, yet I tell you, even Solomon in all his glory was not arrayed like one of these.",author:"Matthew 6:28-29"},
  {text:"The earth produces of itself, first the blade, then the ear, then the full grain in the ear.",author:"Mark 4:28"},
  {text:"For everything there is a season, and a time for every matter under heaven; a time to plant, and a time to pluck up what is planted.",author:"Ecclesiastes 3:1-2"}
];

var APP_PW="littleportion";
var SECRET_PW="AloysiusSolPax";

// dark palette for secret page (plain strings, no object)
var SPbg="#0f0f1a";
var SPbg2="#1a1a2e";
var SPcard="#1e1e32";
var SPbdr="#2a2a4a";
var SPgold="#c89530";
var SPpeach="#e8956a";
var SPteal="#4a9a88";
var SPlav="#9080b8";
var SPtext="#e8e0f0";
var SPdim="#6a6080";
var SPmid="#a09ab0";

function SyncButton(){
  var[st,setSt]=useState("idle");
  async function pull(){
    setSt("loading");
    var ok=await fbPull();
    if(ok){setSt("done");setTimeout(function(){window.location.reload();},1200);}
    else{setSt("error");setTimeout(function(){setSt("idle");},3000);}
  }
  var label=st==="loading"?"Pulling data...":(st==="done"?"Done! Reloading...":(st==="error"?"Could not reach cloud":"Pull from Cloud"));
  var bg=st==="done"?"#7ab87a":(st==="error"?T.rose:T.teal);
  return <button onClick={pull} disabled={st==="loading"||st==="done"} style={{width:"100%",background:bg,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",opacity:(st==="loading"||st==="done")?0.7:1}}>{label}</button>;
}

function ApiKeyInput(){
  var hasSaved=!!(localStorage.getItem("claudeApiKey"));
  var[hasKey,setHasKey]=useState(hasSaved);
  var[editing,setEditing]=useState(!hasSaved);
  var[key,setKey]=useState("");
  var[saved,setSaved]=useState(false);
  function save(){if(!key.trim())return;localStorage.setItem("claudeApiKey",key.trim());setHasKey(true);setEditing(false);setKey("");setSaved(true);setTimeout(function(){setSaved(false);},2500);}
  function remove(){localStorage.removeItem("claudeApiKey");setHasKey(false);setEditing(true);setKey("");setSaved(false);}
  if(hasKey&&!editing){
    return(
      <div style={{background:"rgba(255,255,255,0.6)",borderRadius:16,padding:"16px 20px",boxShadow:"0 2px 12px rgba(180,120,60,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:"#7ab87a",flexShrink:0}}/>
          <div style={{fontSize:13,color:T.textMid,flex:1}}>API key saved</div>
          {saved&&<div style={{fontSize:11,color:"#7ab87a",fontStyle:"italic"}}>Saved!</div>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={function(){setEditing(true);setKey("");}} style={{flex:1,background:T.teal,color:"#fff",border:"none",borderRadius:12,padding:"10px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>Replace Key</button>
          <button onClick={remove} style={{flex:1,background:"#f5e8e8",color:T.rose,border:"1.5px solid "+T.rose+"44",borderRadius:12,padding:"10px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>Remove</button>
        </div>
      </div>
    );
  }
  return(
    <div style={{background:"rgba(255,255,255,0.6)",borderRadius:16,padding:"16px 20px",boxShadow:"0 2px 12px rgba(180,120,60,0.1)"}}>
      <div style={{fontSize:11,color:T.textMid,marginBottom:10,textAlign:"center",letterSpacing:"0.05em"}}>Paste your Claude API key</div>
      <input type="password" value={key} onChange={function(e){setKey(e.target.value);}} placeholder="sk-ant-..." style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"1.5px solid "+T.border,fontSize:13,fontFamily:"Georgia,serif",background:"rgba(255,255,255,0.9)",color:T.text,outline:"none",boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <button onClick={save} disabled={!key.trim()} style={{flex:1,background:T.teal,color:"#fff",border:"none",borderRadius:12,padding:"10px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif",opacity:key.trim()?1:0.4}}>Save</button>
        {hasKey&&<button onClick={function(){setEditing(false);setKey("");}} style={{background:"rgba(0,0,0,0.06)",color:T.textMid,border:"none",borderRadius:12,padding:"10px 14px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>Cancel</button>}
      </div>
    </div>
  );
}

function LockScreen(props){
  var onUnlock=props.onUnlock, onSecret=props.onSecret;
  var[pw,setPw]=useState("");
  var[err,setErr]=useState(false);
  var[shake,setShake]=useState(false);
  function attempt(){
    if(pw===APP_PW){onUnlock();}
    else if(pw===SECRET_PW){onSecret();}
    else{setErr(true);setShake(true);setPw("");setTimeout(function(){setShake(false);},500);setTimeout(function(){setErr(false);},2500);}
  }
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fce8d0,#f5ddc0,#fce0c8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:24}}>
      <style>{".lpfshake{animation:lpfshake 0.4s ease}@keyframes lpfshake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}"}</style>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:52,marginBottom:12}}>🌾</div>
          <div style={{fontSize:9,letterSpacing:"0.55em",color:T.peach,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Little Portion Farm</div>
          <div style={{fontSize:26,fontWeight:400,color:T.text}}>Farm Manager</div>
          <div style={{width:40,height:2,background:"linear-gradient(90deg,"+T.peach+","+T.gold+")",borderRadius:1,margin:"14px auto 0"}}/>
        </div>
        <div style={{background:"rgba(255,255,255,0.7)",borderRadius:24,padding:32,boxShadow:"0 8px 40px rgba(180,120,60,0.15)"}}>
          <div style={{fontSize:12,color:T.textMid,textAlign:"center",marginBottom:20}}>Enter your password to continue</div>
          <div className={shake?"lpfshake":""}>
            <input type="password" value={pw} onChange={function(e){setPw(e.target.value);setErr(false);}} onKeyDown={function(e){if(e.key==="Enter")attempt();}} placeholder="Password" autoFocus style={{width:"100%",padding:"14px 18px",borderRadius:16,border:"1.5px solid "+(err?T.rose:T.border),fontSize:16,fontFamily:"Georgia,serif",background:"rgba(255,255,255,0.8)",color:T.text,outline:"none",boxSizing:"border-box",textAlign:"center",letterSpacing:"0.15em"}}/>
          </div>
          {err&&<div style={{textAlign:"center",fontSize:12,color:T.rose,marginTop:8,fontStyle:"italic"}}>Incorrect password — try again</div>}
          <button onClick={attempt} style={{width:"100%",marginTop:16,background:"linear-gradient(135deg,"+T.peach+","+T.gold+")",color:"#fff",border:"none",borderRadius:16,padding:"14px",fontSize:14,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:700}}>Enter</button>
        </div>
        <div style={{textAlign:"center",marginTop:24,fontSize:10,color:T.textDim,letterSpacing:"0.1em"}}>ELLICOTT CITY, MD</div>
      </div>
    </div>
  );
}

function SecretPage(props){
  var onLock=props.onLock;
  var[loaded,setLoaded]=useState(false);
  var[view,setView]=useState("home");
  var[myHours,setMyHours]=useState(0);
  var[reflections,setReflections]=useState([]);
  var[favVols,setFavVols]=useState([]);
  var[thoughts,setThoughts]=useState([]);
  var[achievements,setAchievements]=useState([]);
  var[refInp,setRefInp]=useState("");
  var[refLd,setRefLd]=useState(false);
  var[thoughtInp,setThoughtInp]=useState("");
  var[favInp,setFavInp]=useState("");
  var[achInp,setAchInp]=useState("");
  var[hoursInp,setHoursInp]=useState("");
  var[qIdx,setQIdx]=useState(function(){return Math.floor(Math.random()*SECRET_QUOTES.length);});
  var todayStr=new Date().toLocaleDateString();

  useEffect(function(){
    async function init(){
      setMyHours(await ld("sp_hours",0));
      setReflections(await ld("sp_ref",[]));
      setFavVols(await ld("sp_fav",[]));
      setThoughts(await ld("sp_tho",[]));
      setAchievements(await ld("sp_ach",[]));
      setLoaded(true);
    }
    init();
  },[]);
  useEffect(function(){if(loaded)sv("sp_hours",myHours);},[myHours,loaded]);
  useEffect(function(){if(loaded)sv("sp_ref",reflections);},[reflections,loaded]);
  useEffect(function(){if(loaded)sv("sp_fav",favVols);},[favVols,loaded]);
  useEffect(function(){if(loaded)sv("sp_tho",thoughts);},[thoughts,loaded]);
  useEffect(function(){if(loaded)sv("sp_ach",achievements);},[achievements,loaded]);

  if(!loaded)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:SPbg,fontFamily:"Georgia,serif",color:SPdim,fontSize:14}}>Loading...</div>;

  var earnedM=PERSONAL_MILESTONES.filter(function(m){return myHours>=m.hours;});
  var nextM=PERSONAL_MILESTONES.find(function(m){return myHours<m.hours;});
  var curQ=SECRET_QUOTES[qIdx];

  function nextQuote(){
    var n;
    do{n=Math.floor(Math.random()*SECRET_QUOTES.length);}while(n===qIdx&&SECRET_QUOTES.length>1);
    setQIdx(n);
  }
  async function addReflection(){
    if(!refInp.trim())return;setRefLd(true);
    try{var raw=await aiCall("Write a warm 2-3 sentence personal reflection expanding on: \""+refInp+"\". First person, contemplative.");
      setReflections(function(pv){return[{id:mkid(),raw:refInp.trim(),text:raw.trim(),date:todayStr}].concat(pv);});}
    catch(e){setReflections(function(pv){return[{id:mkid(),raw:refInp.trim(),text:refInp.trim(),date:todayStr}].concat(pv);});}
    setRefInp("");setRefLd(false);
  }
  function addThought(){if(!thoughtInp.trim())return;setThoughts(function(pv){return[{id:mkid(),text:thoughtInp.trim(),date:todayStr}].concat(pv);});setThoughtInp("");}
  function addFav(){if(!favInp.trim())return;setFavVols(function(pv){return pv.concat([{id:mkid(),name:favInp.trim(),date:todayStr}]);});setFavInp("");}
  function addAch(){if(!achInp.trim())return;setAchievements(function(pv){return[{id:mkid(),text:achInp.trim(),date:todayStr}].concat(pv);});setAchInp("");}
  function logHours(){var h=parseFloat(hoursInp);if(!h)return;setMyHours(function(pv){return Math.round((pv+h)*10)/10;});setHoursInp("");}

  var darkInp={padding:"12px 16px",borderRadius:14,border:"1px solid "+SPbdr,background:SPbg2,color:SPtext,fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box"};
  var darkBtn={background:"linear-gradient(135deg,"+SPlav+","+SPpeach+")",color:"#fff",border:"none",borderRadius:14,padding:"12px 20px",fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600};

  return(
    <div style={{minHeight:"100vh",fontFamily:"Georgia,serif",background:SPbg,color:SPtext}}>
      <div style={{background:"linear-gradient(135deg,#1a1a3e,#0f0f2a)",borderBottom:"1px solid "+SPbdr,padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1}}>
          <div style={{fontSize:8,letterSpacing:"0.5em",color:SPlav,textTransform:"uppercase",fontWeight:700}}>Private Page</div>
          <div style={{fontSize:18,fontWeight:400,color:SPtext,marginTop:2}}>My Farm Journey</div>
        </div>
        <button onClick={onLock} style={{background:"rgba(255,255,255,0.06)",border:"1px solid "+SPbdr,borderRadius:10,padding:"6px 14px",color:SPdim,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>Lock</button>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid "+SPbdr,overflowX:"auto"}}>
        {[["home","Home"],["hours","Hours"],["reflections","Reflections"],["thoughts","Thoughts"],["favorites","Favorites"],["achievements","Achievements"]].map(function(arr){
          var k=arr[0],l=arr[1],act=view===k;
          return <button key={k} onClick={function(){setView(k);}} style={{background:"transparent",color:act?SPlav:SPdim,border:"none",borderBottom:act?"2px solid "+SPlav:"2px solid transparent",padding:"12px 16px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:act?700:400,whiteSpace:"nowrap"}}>{l}</button>;
        })}
      </div>
      <div style={{maxWidth:580,margin:"0 auto",padding:"20px 16px 60px"}}>

        {view==="home"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#1a1a3e,#14142a)",borderRadius:24,padding:28,marginBottom:16,border:"1px solid "+SPbdr,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+SPlav+","+SPteal+","+SPpeach+")"}}/>
              <div style={{fontSize:9,letterSpacing:"0.4em",color:SPlav,textTransform:"uppercase",fontWeight:700,marginBottom:16}}>Today's Thought</div>
              <p style={{margin:"0 0 16px",fontSize:16,color:SPtext,lineHeight:1.9,fontStyle:"italic"}}>"{curQ.t}"</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontSize:12,color:SPlav,fontWeight:700}}>— {curQ.a}</div>
                <button onClick={nextQuote} style={{background:"rgba(144,128,184,0.15)",border:"1px solid "+SPbdr,borderRadius:20,padding:"6px 16px",color:SPlav,fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600}}>New Quote ↻</button>
              </div>
            </div>
            <div style={{background:"linear-gradient(135deg,#14142a,#0f0f1a)",borderRadius:20,padding:20,marginBottom:16,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:9,letterSpacing:"0.4em",color:SPgold,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Your Journey</div>
              <div style={{display:"flex",gap:20,alignItems:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:48,fontWeight:300,color:SPgold,lineHeight:1}}>{myHours}</div>
                  <div style={{fontSize:10,color:SPdim,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>Total Hours</div>
                </div>
                <div style={{flex:1,borderLeft:"1px solid "+SPbdr,paddingLeft:20}}>
                  {nextM?<div>
                    <div style={{fontSize:11,color:SPdim,marginBottom:6}}>Next: <span style={{color:SPlav,fontWeight:700}}>{nextM.label} {nextM.icon}</span></div>
                    <div style={{height:6,background:SPbg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:Math.min(100,Math.round((myHours/nextM.hours)*100))+"%",background:"linear-gradient(90deg,"+SPlav+","+SPpeach+")",borderRadius:3}}/></div>
                    <div style={{fontSize:10,color:SPdim,marginTop:4}}>{myHours}/{nextM.hours} hrs</div>
                  </div>:<div style={{fontSize:13,color:SPgold,fontWeight:700}}>All milestones earned!</div>}
                </div>
              </div>
              {earnedM.length>0&&<div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>{earnedM.map(function(m){return <span key={m.hours} style={{fontSize:22}} title={m.label}>{m.icon}</span>;})}</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {[{v:reflections.length,l:"Reflections",ic:"✍️"},{v:thoughts.length,l:"Thoughts",ic:"💭"},{v:achievements.length,l:"Achievements",ic:"🏅"}].map(function(item){
                return <div key={item.l} style={{background:SPcard,borderRadius:18,padding:"16px 8px",textAlign:"center",border:"1px solid "+SPbdr}}>
                  <div style={{fontSize:22}}>{item.ic}</div>
                  <div style={{fontSize:20,fontWeight:300,color:SPlav,marginTop:4}}>{item.v}</div>
                  <div style={{fontSize:10,color:SPdim,textTransform:"uppercase",marginTop:2}}>{item.l}</div>
                </div>;
              })}
            </div>
            {reflections.length>0&&<div style={{background:SPcard,borderRadius:20,padding:18,marginBottom:14,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPlav,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Latest Reflection</div>
              <p style={{margin:0,fontSize:14,color:SPmid,lineHeight:1.8,fontStyle:"italic"}}>"{reflections[0].text}"</p>
              <div style={{fontSize:11,color:SPdim,marginTop:8}}>{reflections[0].date}</div>
            </div>}
            {favVols.length>0&&<div style={{background:SPcard,borderRadius:20,padding:18,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPteal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Favorite Volunteers</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{favVols.map(function(v){return <span key={v.id} style={{background:SPbg2,color:SPteal,borderRadius:20,padding:"6px 14px",fontSize:13,border:"1px solid "+SPbdr}}>❤️ {v.name}</span>;})}</div>
            </div>}
          </div>
        )}

        {view==="hours"&&(
          <div>
            <div style={{background:SPcard,borderRadius:20,padding:18,marginBottom:16,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPlav,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Log Hours</div>
              <div style={{display:"flex",gap:8}}>
                <input type="number" value={hoursInp} onChange={function(e){setHoursInp(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")logHours();}} placeholder="Hours" style={Object.assign({},darkInp,{flex:1,fontSize:18,textAlign:"center"})}/>
                <button onClick={logHours} disabled={!hoursInp} style={Object.assign({},darkBtn,{opacity:!hoursInp?0.4:1})}>Add</button>
              </div>
              <div style={{textAlign:"center",marginTop:16}}>
                <div style={{fontSize:56,fontWeight:300,color:SPgold,lineHeight:1}}>{myHours}</div>
                <div style={{fontSize:11,color:SPdim,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>Total Hours Volunteered</div>
              </div>
              {myHours>0&&<button onClick={function(){setMyHours(0);}} style={{marginTop:12,background:"transparent",color:SPdim,border:"1px solid "+SPbdr,borderRadius:10,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",display:"block",marginLeft:"auto"}}>Reset</button>}
            </div>
            <div style={{background:SPcard,borderRadius:20,padding:18,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPlav,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Milestones</div>
              {PERSONAL_MILESTONES.map(function(m){
                var earned=myHours>=m.hours;
                var pct=Math.min(100,Math.round((myHours/m.hours)*100));
                return <div key={m.hours} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid "+SPbdr,opacity:earned?1:0.5}}>
                  <div style={{fontSize:24}}>{m.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:earned?SPtext:SPmid}}>{m.label}</div>
                    <div style={{fontSize:11,color:SPdim}}>{m.hours} hours</div>
                    {!earned&&<div style={{marginTop:4,height:4,background:SPbg2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+SPlav+","+SPpeach+")",borderRadius:2}}/></div>}
                  </div>
                  {earned&&<span style={{fontSize:11,color:SPteal,fontWeight:700}}>Earned</span>}
                </div>;
              })}
            </div>
          </div>
        )}

        {view==="reflections"&&(
          <div>
            <div style={{background:SPcard,borderRadius:20,padding:18,marginBottom:16,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPlav,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>New Reflection</div>
              <textarea value={refInp} onChange={function(e){setRefInp(e.target.value);}} placeholder="What's on your heart today? What did you notice, feel, or learn..." rows={4} style={Object.assign({},darkInp,{width:"100%",resize:"vertical",lineHeight:1.7})}/>
              <button onClick={addReflection} disabled={refLd||!refInp.trim()} style={Object.assign({},darkBtn,{marginTop:10,width:"100%",opacity:(refLd||!refInp.trim())?0.4:1})}>{refLd?"Writing...":"Save Reflection"}</button>
            </div>
            {reflections.length===0&&<div style={{textAlign:"center",color:SPdim,fontStyle:"italic",padding:20}}>No reflections yet.</div>}
            {reflections.map(function(r){
              return <div key={r.id} style={{background:SPcard,borderRadius:20,marginBottom:12,overflow:"hidden",border:"1px solid "+SPbdr}}>
                <div style={{height:3,background:"linear-gradient(90deg,"+SPlav+","+SPpeach+",transparent)"}}/>
                <div style={{padding:"16px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:11,color:SPdim}}>{r.date}</span>
                    <button onClick={function(){setReflections(function(pv){return pv.filter(function(x){return x.id!==r.id;});});}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:SPdim,fontSize:16}}>✕</button>
                  </div>
                  <p style={{margin:0,fontSize:14,color:SPmid,lineHeight:1.8,fontStyle:"italic"}}>{r.text}</p>
                  {r.raw!==r.text&&<div style={{marginTop:8,fontSize:11,color:SPdim}}>From: "{r.raw}"</div>}
                </div>
              </div>;
            })}
          </div>
        )}

        {view==="thoughts"&&(
          <div>
            <div style={{background:SPcard,borderRadius:20,padding:18,marginBottom:16,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPteal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Quick Thought</div>
              <div style={{display:"flex",gap:8}}>
                <input value={thoughtInp} onChange={function(e){setThoughtInp(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")addThought();}} placeholder="A quick thought, idea, or observation..." style={Object.assign({},darkInp,{flex:1})}/>
                <button onClick={addThought} disabled={!thoughtInp.trim()} style={Object.assign({},darkBtn,{background:"linear-gradient(135deg,"+SPteal+","+SPlav+")",opacity:!thoughtInp.trim()?0.4:1})}>Add</button>
              </div>
            </div>
            {thoughts.length===0&&<div style={{textAlign:"center",color:SPdim,fontStyle:"italic",padding:20}}>No thoughts yet.</div>}
            {thoughts.map(function(t){
              return <div key={t.id} style={{background:SPcard,borderRadius:16,padding:"14px 18px",marginBottom:10,border:"1px solid "+SPbdr,display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:SPteal,marginTop:6,flexShrink:0}}/>
                <div style={{flex:1}}><p style={{margin:0,fontSize:14,color:SPtext,lineHeight:1.6}}>{t.text}</p><div style={{fontSize:11,color:SPdim,marginTop:4}}>{t.date}</div></div>
                <button onClick={function(){setThoughts(function(pv){return pv.filter(function(x){return x.id!==t.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:SPdim,fontSize:16}}>✕</button>
              </div>;
            })}
          </div>
        )}

        {view==="favorites"&&(
          <div>
            <div style={{background:SPcard,borderRadius:20,padding:18,marginBottom:16,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPteal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Add Favorite Volunteer</div>
              <div style={{display:"flex",gap:8}}>
                <input value={favInp} onChange={function(e){setFavInp(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")addFav();}} placeholder="Volunteer name..." style={Object.assign({},darkInp,{flex:1})}/>
                <button onClick={addFav} disabled={!favInp.trim()} style={Object.assign({},darkBtn,{background:"linear-gradient(135deg,"+SPteal+","+SPlav+")",opacity:!favInp.trim()?0.4:1})}>Add</button>
              </div>
            </div>
            {favVols.length===0&&<div style={{textAlign:"center",color:SPdim,fontStyle:"italic",padding:20}}>No favorites yet.</div>}
            {favVols.map(function(v){
              return <div key={v.id} style={{background:SPcard,borderRadius:18,padding:"16px 18px",marginBottom:10,border:"1px solid "+SPbdr,display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,"+SPlav+","+SPteal+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",fontWeight:700,flexShrink:0}}>{v.name.charAt(0)}</div>
                <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:SPtext}}>{v.name}</div><div style={{fontSize:11,color:SPdim}}>Added {v.date}</div></div>
                <span style={{fontSize:20}}>❤️</span>
                <button onClick={function(){setFavVols(function(pv){return pv.filter(function(x){return x.id!==v.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:SPdim,fontSize:16}}>✕</button>
              </div>;
            })}
          </div>
        )}

        {view==="achievements"&&(
          <div>
            <div style={{background:SPcard,borderRadius:20,padding:18,marginBottom:16,border:"1px solid "+SPbdr}}>
              <div style={{fontSize:11,color:SPgold,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Log Achievement</div>
              <div style={{display:"flex",gap:8}}>
                <input value={achInp} onChange={function(e){setAchInp(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")addAch();}} placeholder="Something you accomplished, learned, or overcame..." style={Object.assign({},darkInp,{flex:1})}/>
                <button onClick={addAch} disabled={!achInp.trim()} style={Object.assign({},darkBtn,{background:"linear-gradient(135deg,"+SPgold+","+SPpeach+")",opacity:!achInp.trim()?0.4:1})}>Add</button>
              </div>
            </div>
            {achievements.length===0&&<div style={{textAlign:"center",color:SPdim,fontStyle:"italic",padding:20}}>No achievements yet.</div>}
            {achievements.map(function(a){
              return <div key={a.id} style={{background:SPcard,borderRadius:18,padding:"16px 18px",marginBottom:10,border:"1px solid "+SPbdr,display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{fontSize:20,flexShrink:0}}>🏅</div>
                <div style={{flex:1}}><p style={{margin:0,fontSize:14,color:SPtext,lineHeight:1.6}}>{a.text}</p><div style={{fontSize:11,color:SPdim,marginTop:4}}>{a.date}</div></div>
                <button onClick={function(){setAchievements(function(pv){return pv.filter(function(x){return x.id!==a.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:SPdim,fontSize:16}}>✕</button>
              </div>;
            })}
          </div>
        )}

      </div>
    </div>
  );
}

function App(){
  var[unlocked,setUnlocked]=useState(false);
  var[secret,setSecret]=useState(false);
  if(!unlocked&&!secret)return <LockScreen onUnlock={function(){setUnlocked(true);}} onSecret={function(){setSecret(true);}}/>;
  if(secret)return <SecretPage onLock={function(){setSecret(false);}}/>;
  return <Main onLock={function(){setUnlocked(false);}}/>;
}

function Main(props){
  var onLock=props.onLock;
  var[ss,setSs]=useState([]);
  var[loaded,setLoaded]=useState(false);
  var[tasks,setTasks]=useState([]);
  var[notes,setNotes]=useState([]);
  var[obs,setObs]=useState([]);
  var[techs,setTechs]=useState([]);
  var[att,setAtt]=useState({});
  var[wLog,setWLog]=useState([]);
  var[hvs,setHvs]=useState([]);
  var[vols,setVols]=useState([]);
  var[briefs,setBriefs]=useState([]);
  var[myJournal,setMyJournal]=useState([]);
  var[myChecks,setMyChecks]=useState([]);
  var[mySess,setMySess]=useState([]);
  var[shownMilestones,setShownMilestones]=useState([]);
  var[tab,setTab]=useState("home");
  var[menuOpen,setMenuOpen]=useState(false);
  var[hqIdx,setHqIdx]=useState(function(){return Math.floor(Math.random()*HOME_QUOTES.length);});
  var[viewDay,setViewDay]=useState(TODAY);
  var[addDay,setAddDay]=useState(TODAY);
  var[inp,setInp]=useState(""); var[aiLd,setAiLd]=useState(false); var[aiSt,setAiSt]=useState("");
  var[addRepeat,setAddRepeat]=useState(false);
  var[addBrainInp,setAddBrainInp]=useState(""); var[addBrainLd,setAddBrainLd]=useState(false); var[addBrainResult,setAddBrainResult]=useState(null);
  var[resortLd,setResortLd]=useState(false); var[resortResult,setResortResult]=useState(null);
  var[nInp,setNInp]=useState(""); var[nLd,setNLd]=useState(false);
  var[oInp,setOInp]=useState(""); var[oLd,setOLd]=useState(false);
  var[nPhoto,setNPhoto]=useState(null); var[oPhoto,setOPhoto]=useState(null); var[hPhoto,setHPhoto]=useState(null); var[brPhoto,setBrPhoto]=useState(null); var[tPhoto,setTPhoto]=useState(null);
  var[tR,setTR]=useState(""); var[tCr,setTCr]=useState("None"); var[tTk,setTTk]=useState("None"); var[tLd,setTLd]=useState(false); var[tSt,setTSt]=useState("");
  var[wD,setWD]=useState(null); var[wN,setWN]=useState(""); var[wDy,setWDy]=useState(TODAY);
  var[hSe,setHSe]=useState("s6"); var[hCr,setHCr]=useState("Kale"); var[hAm,setHAm]=useState(""); var[hUn,setHUn]=useState("lbs"); var[hQu,setHQu]=useState("Good");
  var[vT,setVT]=useState("attendance");
  var[aSe,setASe]=useState("s6"); var[aCn,setACn]=useState(""); var[aNm,setANm]=useState(""); var[aSg,setASg]=useState("22"); var[aWh,setAWh]=useState([]);
  var[vNm,setVNm]=useState(""); var[vEx,setVEx]=useState("New"); var[vSk,setVSk]=useState([]); var[vNo,setVNo]=useState("");
  var[mjInp,setMjInp]=useState(""); var[mjLd,setMjLd]=useState(false);
  var[mcInp,setMcInp]=useState("");
  var[msDt2,setMsDt2]=useState("");
  var[myWD,setMyWD]=useState(null); var[myWLd,setMyWLd]=useState(false);
  var[shMyAddS,setShMyAddS]=useState(false);
  var[myView,setMyView]=useState("today");
  var[mwTemp,setMwTemp]=useState(""); var[mwCond,setMwCond]=useState("Clear"); var[mwEdit,setMwEdit]=useState(false);
  var[weekRpt,setWeekRpt]=useState(""); var[weekRptLd,setWeekRptLd]=useState(false);
  var[brInp,setBrInp]=useState(""); var[brLd,setBrLd]=useState(false); var[brCat,setBrCat]=useState("General"); var[brUseAi,setBrUseAi]=useState(true);
  var[brainInp,setBrainInp]=useState(""); var[brainLd,setBrainLd]=useState(false); var[brainResult,setBrainResult]=useState(null);
  var[printSess,setPrintSess]=useState("s6");
  var[analyticsView,setAnalyticsView]=useState("harvest");
  var[debrief,setDebrief]=useState(""); var[debriefLd,setDebriefLd]=useState(false);
  var[milestoneAlerts,setMilestoneAlerts]=useState([]);
  var[certVol,setCertVol]=useState(null);
  var[calShow,setCalShow]=useState(false); var[calDate,setCalDate]=useState(""); var[calTime,setCalTime]=useState(""); var[calSig,setCalSig]=useState(""); var[calExpanded,setCalExpanded]=useState({});
  var[calAiInp,setCalAiInp]=useState(""); var[calAiLd,setCalAiLd]=useState(false); var[calAiResult,setCalAiResult]=useState(null);
  var[calMonth,setCalMonth]=useState(function(){var d=new Date();return d.getFullYear()*100+(d.getMonth()+1);});
  var[calSelDay,setCalSelDay]=useState(null);
  var[sessBrief,setSessBrief]=useState(null); var[sessBriefLd,setSessBriefLd]=useState(false); var[sessBriefId,setSessBriefId]=useState(null);
  var[volDetail,setVolDetail]=useState(null);
  var[commLogs,setCommLogs]=useState([]);
  var[commVol,setCommVol]=useState(""); var[commNote,setCommNote]=useState(""); var[commType,setCommType]=useState("Conversation"); var[commFU,setCommFU]=useState(false);
  var[rptSess,setRptSess]=useState("s6");

  var dayOfYear=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/86400000);
  var todayQuote=QUOTES[dayOfYear%QUOTES.length];
  var upcomingSs=(function(){var now=new Date();now.setHours(0,0,0,0);return ss.filter(function(s){var p=s.date.split("/");return new Date(p[2],p[0]-1,p[1])>=now;});})();

  useEffect(function(){
    async function loadAll(){
      await fbPull();
      var rt=["Make sure all doors are closed","Have everyone sign in","New volunteers sign waiver"];
      var defT=[];DAYS.forEach(function(day){rt.forEach(function(text,i){defT.push({id:"r"+i+day+mkid(),text:text,done:false,category:"Important",recurring:true,day:day});});});
      var t=await ld("lpf_tasks",defT);
      var hasRec=function(day,text){return t.some(function(x){return x.day===day&&x.text===text&&x.recurring;});};
      var add=[];DAYS.forEach(function(day){rt.forEach(function(text,i){if(!hasRec(day,text))add.push({id:"r"+i+day+mkid(),text:text,done:false,category:"Important",recurring:true,day:day});});});
      setTasks(t.concat(add));
      setNotes(await ld("lpf_notes",[])); setObs(await ld("lpf_obs",[])); setTechs(await ld("lpf_techs",[]));
      setAtt(await ld("lpf_att",{})); setWLog(await ld("lpf_wlog",[])); setHvs(await ld("lpf_hvs",[]));
      setVols(await ld("lpf_vols",[])); setBriefs(await ld("lpf_briefs",[])); setMyJournal(await ld("lpf_journal",[]));
      setMyChecks(await ld("lpf_checks",[])); setMySess(await ld("lpf_mysess",[])); setShownMilestones(await ld("lpf_milestones",[]));
      setCommLogs(await ld("lpf_commlog",[]));
      setSs(await ld("lpf_sessions",DEF_SESS));
      setLoaded(true);
    }
    loadAll();
  },[]);

  useEffect(function(){if(loaded)sv("lpf_tasks",tasks);},[tasks,loaded]);
  useEffect(function(){if(loaded)sv("lpf_notes",notes);},[notes,loaded]);
  useEffect(function(){if(loaded)sv("lpf_obs",obs);},[obs,loaded]);
  useEffect(function(){if(loaded)sv("lpf_techs",techs);},[techs,loaded]);
  useEffect(function(){if(loaded)sv("lpf_att",att);},[att,loaded]);
  useEffect(function(){if(loaded)sv("lpf_wlog",wLog);},[wLog,loaded]);
  useEffect(function(){if(loaded)sv("lpf_hvs",hvs);},[hvs,loaded]);
  useEffect(function(){if(loaded)sv("lpf_vols",vols);},[vols,loaded]);
  useEffect(function(){if(loaded)sv("lpf_briefs",briefs);},[briefs,loaded]);
  useEffect(function(){if(loaded)sv("lpf_journal",myJournal);},[myJournal,loaded]);
  useEffect(function(){if(loaded)sv("lpf_checks",myChecks);},[myChecks,loaded]);
  useEffect(function(){if(loaded)sv("lpf_mysess",mySess);},[mySess,loaded]);
  useEffect(function(){if(loaded)sv("lpf_milestones",shownMilestones);},[shownMilestones,loaded]);
  useEffect(function(){if(loaded)sv("lpf_sessions",ss);},[ss,loaded]);
  useEffect(function(){if(loaded)sv("lpf_commlog",commLogs);},[commLogs,loaded]);
  useEffect(function(){if((tab==="myday"||tab==="home"||tab==="weather")&&!myWD&&!myWLd)loadMyW();},[tab]);
  useEffect(function(){if(aWh.length>0)setACn(String(aWh.length));},[aWh]);

  if(!loaded)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:"Georgia,serif",color:T.textDim,fontSize:14}}>Loading farm data...</div>;

  var dn=tasks.filter(function(t){return t.done;}).length;
  var tot=tasks.length;
  var pct=tot?Math.round((dn/tot)*100):0;
  var todayStr=new Date().toLocaleDateString();
  var todayAtt=Object.values(att).flat().filter(function(e){return e.date===todayStr;});
  var todayHvs=hvs.filter(function(h){return h.date===todayStr;});
  var todayObs=obs.filter(function(o){return o.date===todayStr;});
  var urgentBriefs=briefs.filter(function(b){return b.severity==="critical"||b.severity==="important";});
  var todayTotal=todayAtt.reduce(function(a,e){return a+e.count;},0);
  var todaySU=todayAtt.reduce(function(a,e){return a+e.signup;},0);
  var todayNames=todayAtt.map(function(e){return e.names;}).filter(Boolean).join(", ");

  function goTab(k){setTab(k);setMenuOpen(false);}
  function getNext(){var now=new Date();now.setHours(0,0,0,0);return ss.concat(mySess).map(function(s){var p=s.date.split("/");return Object.assign({},s,{dt:new Date(p[2],p[0]-1,p[1])});}).filter(function(s){return s.dt>=now;}).sort(function(a,b){return a.dt-b.dt;})[0]||null;}
  function daysUntil(ds){var p=ds.split("/");var d=new Date(p[2],p[0]-1,p[1]);d.setHours(0,0,0,0);var now=new Date();now.setHours(0,0,0,0);return Math.round((d-now)/86400000);}
  function gVol(id){return vols.find(function(v){return v.id===id;});}
  function vSC(vid){return Object.values(att).flat().filter(function(e){return e.volIds&&e.volIds.includes(vid);}).length;}
  function dT(day){return tasks.filter(function(t){return t.day===day;});}
  function getVolSessions(vid){return Object.values(att).flat().filter(function(e){return e.volIds&&e.volIds.includes(vid);}).length;}
  function getVolHours(vid){return getVolSessions(vid)*3;}
  var next=getNext();
  var du=next?daysUntil(next.date):null;

  function checkMilestones(newAtt,curVols){
    var alerts=[];var seen=shownMilestones.slice();
    curVols.forEach(function(v){
      var sessions=Object.values(newAtt).flat().filter(function(e){return e.volIds&&e.volIds.includes(v.id);}).length;
      var hours=sessions*3;
      VOL_MILESTONES.forEach(function(m){var key=v.id+"-h-"+m.hours;if(hours>=m.hours&&!seen.includes(key)){alerts.push({key:key,vol:v,milestone:m,type:"hours",value:hours});seen.push(key);}});
      SESSION_MILESTONES.forEach(function(m){var key=v.id+"-s-"+m.sessions;if(sessions>=m.sessions&&!seen.includes(key)){alerts.push({key:key,vol:v,milestone:m,type:"sessions",value:sessions});seen.push(key);}});
    });
    if(alerts.length){setMilestoneAlerts(function(pv){return pv.concat(alerts);});setShownMilestones(seen);}
  }

  function getBadges(){
    var th=hvs.reduce(function(a,h){return a+h.amount;},0);
    var ts=Object.values(att).flat().length;
    var ct={};hvs.forEach(function(h){ct[h.crop]=(ct[h.crop]||0)+1;});
    var uc=Object.keys(ct).length;
    var badges=[];
    if(th>=1)badges.push({name:"First Harvest",icon:"🌱",earned:true,desc:"Logged first harvest"});
    if(th>=10)badges.push({name:"Green Thumb",icon:"👍",earned:true,desc:"10+ lbs"});
    if(th>=50)badges.push({name:"Bountiful",icon:"🧺",earned:true,desc:"50+ lbs"});
    if(th<1)badges.push({name:"First Harvest",icon:"🌱",earned:false,progress:0,goal:1,desc:"Log first harvest"});
    if(th>=1&&th<10)badges.push({name:"Green Thumb",icon:"👍",earned:false,progress:th,goal:10,desc:"Harvest 10 lbs"});
    if(uc>=3)badges.push({name:"Diverse Farmer",icon:"🌈",earned:true,desc:"3+ crop types"});
    if(uc<3)badges.push({name:"Diverse Farmer",icon:"🌈",earned:false,progress:uc,goal:3,desc:"3 crop types"});
    if(ts>=1)badges.push({name:"First Session",icon:"📋",earned:true,desc:"First attendance"});
    if(ts<1)badges.push({name:"First Session",icon:"📋",earned:false,progress:0,goal:1,desc:"Log attendance"});
    if(ts>=1&&ts<5)badges.push({name:"Regular",icon:"⭐",earned:false,progress:ts,goal:5,desc:"5 sessions"});
    if(ts>=5)badges.push({name:"Regular",icon:"⭐",earned:true,desc:"5+ sessions"});
    if(myJournal.length>=1)badges.push({name:"Storyteller",icon:"📝",earned:true,desc:"First journal"});
    if(myJournal.length<1)badges.push({name:"Storyteller",icon:"📝",earned:false,progress:0,goal:1,desc:"Write journal"});
    if(obs.length>=5)badges.push({name:"Sharp Eye",icon:"🔍",earned:true,desc:"5+ observations"});
    if(obs.length<5)badges.push({name:"Sharp Eye",icon:"🔍",earned:false,progress:obs.length,goal:5,desc:"5 observations"});
    if(vols.length>=5)badges.push({name:"Team Builder",icon:"👥",earned:true,desc:"5+ volunteers"});
    if(vols.length<5)badges.push({name:"Team Builder",icon:"👥",earned:false,progress:vols.length,goal:5,desc:"5 volunteers"});
    return badges;
  }

  function saveManualW(){var t2=parseInt(mwTemp);if(!t2&&t2!==0)return;var w={tempF:t2,condition:mwCond,weatherCode:MW_CODES[mwCond]||0};setMyWD(w);setWD(w);setMwEdit(false);}
  async function loadMyW(){setMyWLd(true);try{var url="https://api.open-meteo.com/v1/forecast?latitude="+FARM_LAT+"&longitude="+FARM_LON+"&current=temperature_2m,weather_code,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York";var res=await fetch(url);var data=await res.json();var cur=data.current;var mapped=wmoToCondition(cur.weather_code);var fc=(data.daily&&data.daily.time||[]).map(function(dateStr,i){var m=wmoToCondition(data.daily.weather_code[i]);return{date:dateStr,hi:Math.round(data.daily.temperature_2m_max[i]),lo:Math.round(data.daily.temperature_2m_min[i]),condition:m.condition,weatherCode:m.weatherCode,precipIn:data.daily.precipitation_sum[i]||0};});var wd={tempF:Math.round(cur.temperature_2m),condition:mapped.condition,weatherCode:mapped.weatherCode,windMph:Math.round(cur.wind_speed_10m||0),precipIn:cur.precipitation||0,live:true,forecast:fc};setMyWD(wd);setWD(wd);}catch(e){}setMyWLd(false);}
  async function addJournal(){if(!mjInp.trim())return;setMjLd(true);try{var raw=await aiCall("Warm 2-4 sentence first-person farm journal from: \""+mjInp+"\". Just the text.");setMyJournal(function(pv){return[{id:mkid(),raw:mjInp.trim(),text:raw.trim(),date:todayStr,dow:DOW[new Date().getDay()]}].concat(pv);});}catch(e){setMyJournal(function(pv){return[{id:mkid(),raw:mjInp.trim(),text:mjInp.trim(),date:todayStr,dow:DOW[new Date().getDay()]}].concat(pv);});}setMjInp("");setMjLd(false);}
  function addMyCheck(){if(!mcInp.trim())return;setMyChecks(function(pv){return pv.concat([{id:mkid(),text:mcInp.trim(),done:false}]);});setMcInp("");}
  function addMySess(){if(!msDt2)return;var d=new Date(msDt2+"T12:00:00");setMySess(function(pv){return pv.concat([{id:mkid(),date:String(d.getMonth()+1).padStart(2,"0")+"/"+String(d.getDate()).padStart(2,"0")+"/"+d.getFullYear(),dow:DOW[d.getDay()],time:"custom"}]);});setMsDt2("");setShMyAddS(false);}
  async function quickAdd(){if(!inp.trim())return;setAiLd(true);try{var raw=await aiCall("Categorize farm task. Categories:"+CATS.join(",")+". Task:\""+inp+"\". ONLY JSON:{\"text\":\"t\",\"category\":\"c\"}");var p=JSON.parse(raw.replace(/```json|```/g,"").trim());if(addRepeat){var batch=DAYS.concat(ss.map(function(s){return s.id;})).map(function(d){return{id:mkid(),text:p.text||inp.trim(),category:p.category||"General",done:false,recurring:true,day:d};});setTasks(function(pr){return pr.concat(batch);});setAiSt("Added to all days & sessions!");}else{setTasks(function(pr){return pr.concat([{id:mkid(),text:p.text||inp.trim(),category:p.category||"General",done:false,recurring:false,day:addDay}]);});setAiSt("Added!");}}catch(e){if(addRepeat){var batch2=DAYS.concat(ss.map(function(s){return s.id;})).map(function(d){return{id:mkid(),text:inp.trim(),category:"General",done:false,recurring:true,day:d};});setTasks(function(pr){return pr.concat(batch2);});setAiSt("Added to all days & sessions");}else{setTasks(function(pr){return pr.concat([{id:mkid(),text:inp.trim(),category:"General",done:false,recurring:false,day:addDay}]);});setAiSt("Added");}}setInp("");setAddRepeat(false);setAiLd(false);setTimeout(function(){setAiSt("");},2000);}
  async function processAddBrain(){
    if(!addBrainInp.trim())return;setAddBrainLd(true);setAddBrainResult(null);
    try{
      var raw=await aiCall("Parse rough farm notes into clean tasks. Categories:"+CATS.join(",")+". ONLY JSON:\n{\"tasks\":[{\"text\":\"clean polished task\",\"category\":\"c\",\"recurring\":false}]}\nrecurring must be boolean true or false. Mark recurring:true if the note says repeat, repeated, repeating, every day, each day, daily, always, or similar repeating language.\nUse category 'Important' if the task is marked as important, urgent, or priority.\nMatch categories exactly to one of: "+CATS.join(",")+". Default to General only if no better match.\nInput:\""+addBrainInp.replace(/"/g,"'")+"\"");
      var mt=raw.match(/\{[\s\S]*\}/);if(!mt)throw new Error();
      var parsed=(JSON.parse(mt[0]).tasks||[]);var added=0;var batch=[];
      parsed.forEach(function(item){
        if(!item.text)return;
        var isRec=item.recurring===true||item.recurring==="true";
        if(isRec){
          DAYS.concat(ss.map(function(s){return s.id;})).forEach(function(d){batch.push({id:mkid(),text:item.text,category:item.category||"General",done:false,recurring:true,day:d});});
        }else{
          batch.push({id:mkid(),text:item.text,category:item.category||"General",done:false,recurring:false,day:addDay});
        }
        added++;
      });
      if(batch.length)setTasks(function(pr){return pr.concat(batch);});
      setAddBrainResult(added>0?"Sorted "+added+" task"+(added>1?"s":"")+"!":"No tasks found — try being more specific.");
    }catch(e){setAddBrainResult("Could not sort — try again.");}
    setAddBrainInp("");setAddBrainLd(false);setTimeout(function(){setAddBrainResult(null);},5000);
  }
  async function resortGeneralTasks(){
    var generals=tasks.filter(function(t){return t.category==="General";});
    if(!generals.length){setResortResult("No General tasks to sort!");setTimeout(function(){setResortResult(null);},3000);return;}
    setResortLd(true);setResortResult(null);
    var updates={};
    for(var i=0;i<generals.length;i++){
      var t=generals[i];
      try{
        var raw=await aiCall("Categorize farm task. Categories:"+CATS.join(",")+". Task:\""+t.text+"\". ONLY JSON:{\"category\":\"c\"}");
        var cleaned=raw.replace(/```json|```/g,"").trim();
        var p=JSON.parse(cleaned);
        if(p.category&&CATS.indexOf(p.category)>=0)updates[t.id]=p.category;
      }catch(e){}
    }
    var count=Object.keys(updates).length;
    if(count>0){
      setTasks(function(prev){return prev.map(function(t){return updates[t.id]?Object.assign({},t,{category:updates[t.id]}):t;});});
      setResortResult("Re-sorted "+count+" task"+(count!==1?"s":"")+"!");
    }else{
      setResortResult("Could not re-sort — check your API key in Settings.");
    }
    setResortLd(false);setTimeout(function(){setResortResult(null);},6000);
  }
  function togT(id){setTasks(function(t){return t.map(function(x){return x.id===id?Object.assign({},x,{done:!x.done}):x;});});}
  function delT(id){setTasks(function(t){return t.filter(function(x){return x.id!==id;});});}
  async function addNote(){if(!nInp.trim())return;setNLd(true);try{var raw=await aiCall("Categorize farm note. Categories:"+NOTE_CATS.join(",")+". Note:\""+nInp+"\". ONLY JSON:{\"text\":\"t\",\"category\":\"c\"}");var p=JSON.parse(raw.replace(/```json|```/g,"").trim());setNotes(function(pv){return pv.concat([{id:mkid(),text:p.text||nInp.trim(),category:p.category||"General",date:todayStr,photo:nPhoto}]);});}catch(e){setNotes(function(pv){return pv.concat([{id:mkid(),text:nInp.trim(),category:"General",date:todayStr,photo:nPhoto}]);});}setNPhoto(null);setNInp("");setNLd(false);}
  async function addOb(){if(!oInp.trim())return;setOLd(true);try{var raw=await aiCall("Farm observation. ONLY JSON:{\"text\":\"t\",\"category\":\"Crops|Weather|Equipment|Volunteers|Animals|General\",\"suggestedTask\":\"task or null\"}. Obs:\""+oInp+"\"");var p=JSON.parse(raw.replace(/```json|```/g,"").trim());setObs(function(pv){return pv.concat([{id:mkid(),text:p.text||oInp.trim(),category:p.category||"General",date:todayStr,suggestedTask:p.suggestedTask||null,photo:oPhoto}]);});}catch(e){setObs(function(pv){return pv.concat([{id:mkid(),text:oInp.trim(),category:"General",date:todayStr,photo:oPhoto}]);});}setOPhoto(null);setOInp("");setOLd(false);}
  async function buildTech(){if(!tR.trim())return;setTLd(true);try{var raw=await aiCall("Farm technique card. Crop:"+tCr+" Task:"+tTk+" Notes:\""+tR+"\". ONLY JSON:{\"title\":\"t\",\"steps\":[\"s\"],\"tips\":\"tip\"}");var p=JSON.parse(raw.replace(/```json|```/g,"").trim());setTechs(function(pv){return pv.concat([{id:mkid(),title:p.title,steps:p.steps,tips:p.tips,photo:tPhoto}]);});setTPhoto(null);setTR("");setTSt("Created!");}catch(e){setTSt("Error");}setTLd(false);setTimeout(function(){setTSt("");},3000);}
  function saveHv(){var am=parseFloat(hAm);if(!am)return;setHvs(function(pv){return pv.concat([{id:mkid(),session:hSe,label:dLbl(hSe,ss),crop:hCr,amount:am,unit:hUn,quality:hQu,date:todayStr,photo:hPhoto}]);});setHPhoto(null);setHAm("");}
  function saveAtt(){
    var cn=parseInt(aCn)||0;if(!cn)return;
    var sg=parseInt(aSg)||(SIG_MAP[aSe]||0);
    var allN=aWh.map(function(id){var v=gVol(id);return v?v.name:"";}).filter(Boolean).concat(aNm.trim()?[aNm.trim()]:[]).join(", ");
    setAtt(function(pv){var u=Object.assign({},pv);u[aSe]=(u[aSe]||[]).concat([{id:mkid(),session:aSe,label:dLbl(aSe,ss),count:cn,names:allN,signup:sg,date:todayStr,volIds:aWh}]);checkMilestones(u,vols);return u;});
    setACn("");setANm("");setAWh([]);
  }
  function addVol(){if(!vNm.trim())return;setVols(function(pv){return pv.concat([{id:mkid(),name:vNm.trim(),experience:vEx,skills:vSk,note:vNo.trim()}]);});setVNm("");setVEx("New");setVSk([]);setVNo("");}
  function togSk(sk){setVSk(function(pv){return pv.includes(sk)?pv.filter(function(s){return s!==sk;}):pv.concat([sk]);});}
  async function addBrief(){if(!brInp.trim())return;setBrLd(true);if(brUseAi){try{var raw=await aiCall("Farm briefing 2-3 sentences. Severity:heads-up|important|critical. Category from:"+BR_CATS.join(",")+". ONLY JSON:{\"text\":\"t\",\"severity\":\"s\",\"category\":\"c\"}. Issue:\""+brInp+"\"");var p=JSON.parse(raw.replace(/```json|```/g,"").trim());setBriefs(function(pv){return[{id:mkid(),raw:brInp.trim(),text:p.text||brInp.trim(),severity:p.severity||"heads-up",category:p.category||brCat,date:todayStr,photo:brPhoto}].concat(pv);});}catch(e){setBriefs(function(pv){return[{id:mkid(),raw:brInp.trim(),text:brInp.trim(),severity:"heads-up",category:brCat,date:todayStr,photo:brPhoto}].concat(pv);});}}else{setBriefs(function(pv){return[{id:mkid(),raw:brInp.trim(),text:brInp.trim(),severity:"heads-up",category:brCat,date:todayStr,photo:brPhoto}].concat(pv);});}setBrPhoto(null);setBrInp("");setBrLd(false);}
  async function genWeekReport(){setWeekRptLd(true);try{var prompt="Warm end-of-week farm report ~150 words for Little Portion Farm.\nJournal:\n";myJournal.slice(0,5).forEach(function(j){prompt+="- "+j.text+"\n";});prompt+="\nVolunteers:"+todayTotal+"\nHarvests:\n";hvs.slice(0,10).forEach(function(h){prompt+="- "+h.crop+":"+h.amount+" "+h.unit+"\n";});prompt+="Tasks:"+dn+"/"+tot;var raw=await aiCall(prompt);setWeekRpt(raw.trim());}catch(e){setWeekRpt("Could not generate.");}setWeekRptLd(false);}
  async function genDebrief(){setDebriefLd(true);setDebrief("");try{var showed=todayTotal,signedUp=todaySU;var names=todayAtt.map(function(e){return e.names;}).filter(Boolean).join(", ");var prompt="Warm friendly 3-sentence end-of-session debrief for Little Portion Farm.\nSigned up:"+signedUp+", Showed:"+showed+(names?", Volunteers:"+names:"")+"\nHarvests:"+todayHvs.map(function(h){return h.amount+" "+h.unit+" of "+h.crop;}).join(", ")+(todayObs.length?"\nObs:"+todayObs.map(function(o){return o.text;}).join("; "):"")+"\nCelebratory, end with gratitude. No subject line.";var raw=await aiCall(prompt);setDebrief(raw.trim());}catch(e){setDebrief("Could not generate.");}setDebriefLd(false);}
  async function genSessionBrief(s){
    setSessBriefId(s.id);setSessBriefLd(true);setSessBrief(null);
    try{
      var prompt="Create a concise volunteer session briefing sheet for Little Portion Farm.\n";
      prompt+="Date: "+s.dow+", "+s.date+"\nTime: "+(s.time||"TBD")+"\nExpected Volunteers: "+(s.signup||"TBD")+"\n";
      if(myWD&&myWD.forecast){var sp=s.date.split("/");var sessDateStr=sp[2]+"-"+sp[0].padStart(2,"0")+"-"+sp[1].padStart(2,"0");var fc=myWD.forecast.find(function(f){return f.date===sessDateStr;});if(fc)prompt+="Weather: "+fc.condition+", High "+fc.hi+"F, Low "+fc.lo+"F"+(fc.precipIn>0?", Rain expected":"")+"\n";}
      else if(myWD)prompt+="Current Weather: "+myWD.tempF+"F, "+myWD.condition+"\n";
      var urgB=briefs.filter(function(b){return b.severity==="critical"||b.severity==="important";}).slice(0,5);
      if(urgB.length){prompt+="Important Reminders:\n";urgB.forEach(function(b){prompt+="- ["+b.severity.toUpperCase()+"] "+b.text+"\n";});}
      var dayTasks=tasks.filter(function(t){return !t.done;}).slice(0,8);
      if(dayTasks.length){prompt+="Open Tasks:\n";dayTasks.forEach(function(t){prompt+="- ["+t.category+"] "+t.text+"\n";});}
      prompt+="\nFormat as a clean briefing sheet with sections: OVERVIEW, WEATHER, KEY REMINDERS, TASKS FOR TODAY. Keep it concise and actionable. Use plain text, no markdown.";
      var raw=await aiCall(prompt);
      setSessBrief(raw.trim());
    }catch(e){setSessBrief("Could not generate briefing.");}
    setSessBriefLd(false);
  }
  async function processBrain(){
    if(!brainInp.trim())return;setBrainLd(true);setBrainResult(null);
    try{
      var raw=await aiCall("Parse farm input. Today:"+todayStr+". ONLY JSON:\n{\"items\":[{\"type\":\"task|note|observation|harvest|briefing|journal|session\",\"text\":\"t\",\"category\":\"c\",\"recurring\":false,\"crop\":\"if harvest\",\"amount\":\"number if harvest\",\"unit\":\"if harvest\",\"date\":\"MM/DD/YYYY if session\",\"dow\":\"full day name if session\",\"time\":\"time range e.g. 1pm-4pm if session\",\"signup\":\"expected volunteer count if mentioned\"}]}\nFor tasks: recurring must be boolean true or false. Set recurring:true ONLY if user says repeat, repeated, repeating, every day, each day, daily, always, each session, or similar repeating language. Otherwise recurring:false.\nFor task categories use exactly one of: "+CATS.join(",")+". Use Important if task is marked urgent/important/priority. Use Watering if task involves watering. Use Harvesting if task involves harvesting or removing crops. Default to General only if no better match.\nFor sessions: parse any date+time mention as a session. Convert natural language dates to MM/DD/YYYY using today's year unless another year is specified.\nInput:\""+brainInp.replace(/"/g,"'")+"\"");
      var mt=raw.match(/\{[\s\S]*\}/);if(!mt)throw new Error();
      var items=(JSON.parse(mt[0]).items||[]);var added={t:0,n:0,o:0,h:0,b:0,j:0,s:0};
      var newTasks=[];var newNotes=[];var newObs=[];var newHvs=[];var newBriefs=[];var newJournal=[];var newSessions=[];
      items.forEach(function(item){
        if(item.type==="task"){
          var isRec=item.recurring===true||item.recurring==="true";
          if(isRec){
            DAYS.concat(ss.map(function(s){return s.id;})).forEach(function(d){newTasks.push({id:mkid(),text:item.text,category:item.category||"General",done:false,recurring:true,day:d});});
          }else{
            newTasks.push({id:mkid(),text:item.text,category:item.category||"General",done:false,recurring:false,day:TODAY});
          }
          added.t++;
        }
        else if(item.type==="note"){newNotes.push({id:mkid(),text:item.text,category:item.category||"General",date:todayStr});added.n++;}
        else if(item.type==="observation"){newObs.push({id:mkid(),text:item.text,category:item.category||"General",date:todayStr});added.o++;}
        else if(item.type==="harvest"&&parseFloat(item.amount)>0){newHvs.push({id:mkid(),session:hSe,label:"",crop:item.crop||"Other",amount:parseFloat(item.amount),unit:item.unit||"lbs",quality:"Good",date:todayStr});added.h++;}
        else if(item.type==="briefing"){newBriefs.push({id:mkid(),raw:item.text,text:item.text,severity:"heads-up",category:item.category||"General",date:todayStr});added.b++;}
        else if(item.type==="journal"){newJournal.push({id:mkid(),raw:brainInp.trim(),text:item.text,date:todayStr,dow:DOW[new Date().getDay()]});added.j++;}
        else if(item.type==="session"&&item.date){var dowFb=(function(){var p=item.date.split("/");var d=new Date(p[2],p[0]-1,p[1]);return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];}());newSessions.push({id:mkid(),date:item.date,dow:item.dow||dowFb,time:item.time||"",signup:parseInt(item.signup)||0});added.s++;}
      });
      if(newTasks.length)setTasks(function(pv){return pv.concat(newTasks);});
      if(newNotes.length)setNotes(function(pv){return pv.concat(newNotes);});
      if(newObs.length)setObs(function(pv){return pv.concat(newObs);});
      if(newHvs.length)setHvs(function(pv){return pv.concat(newHvs);});
      if(newBriefs.length)setBriefs(function(pv){return newBriefs.concat(pv);});
      if(newJournal.length)setMyJournal(function(pv){return newJournal.concat(pv);});
      if(newSessions.length)setSs(function(pv){return pv.concat(newSessions);});
      var parts=[];if(added.t)parts.push(added.t+" task"+(added.t>1?"s":""));if(added.n)parts.push(added.n+" note"+(added.n>1?"s":""));if(added.o)parts.push(added.o+" obs");if(added.h)parts.push(added.h+" harvest"+(added.h>1?"s":""));if(added.b)parts.push(added.b+" briefing"+(added.b>1?"s":""));if(added.j)parts.push(added.j+" journal");if(added.s)parts.push(added.s+" session"+(added.s>1?"s":""));
      setBrainResult(parts.length?"Sorted: "+parts.join(", "):"Nothing parsed — try being more specific.");
    }catch(e){setBrainResult("Could not sort — add manually.");}
    setBrainInp("");setBrainLd(false);setTimeout(function(){setBrainResult(null);},5000);
  }

  function escHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
  function printCert(v,milestone,type,value){
    var html="<html><head><title>Certificate</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#faf5ee}.cert{background:linear-gradient(135deg,#fce8d0,#f8dcc0);border:3px solid #c89530;border-radius:20px;padding:50px 60px;text-align:center;max-width:600px;width:100%}.divider{width:60px;height:2px;background:#c89530;margin:16px auto}.sig{margin-top:24px;border-top:1px solid #c89530;padding-top:12px;font-size:11px;color:#9a9088}</style></head><body><div class='cert'><div style='font-size:10px;letter-spacing:0.4em;color:#e8956a;text-transform:uppercase;font-weight:700'>Little Portion Farm</div><div class='divider'></div><div style='font-size:12px;color:#9a9088;margin-bottom:10px'>Certificate of Recognition</div><div style='font-size:60px;margin:14px 0'>"+escHtml(milestone.icon)+"</div><div style='font-size:13px;color:#9a9088;margin-bottom:6px'>This certificate is awarded to</div><div style='font-size:28px;color:#3a3028;margin:12px 0 6px'>"+escHtml(v.name)+"</div><div style='font-size:18px;color:#e8956a;font-weight:700;margin-bottom:10px'>"+escHtml(milestone.label)+"</div><div style='font-size:14px;color:#6a6058;line-height:1.7'>"+escHtml(milestone.desc)+"</div><div style='font-size:12px;color:#9a9088;margin-top:16px'>"+(type==="hours"?escHtml(value)+" volunteer hours":escHtml(value)+" sessions")+" &bull; "+new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})+"</div><div class='sig'>Little Portion Farm &bull; Ellicott City, MD</div></div></body></html>";
    var w=window.open("","_blank");if(w){w.document.write(html);w.document.close();setTimeout(function(){w.print();},500);}
  }

  return(
    <div style={{minHeight:"100vh",fontFamily:"Georgia,serif",background:T.bg,color:T.text}}>

      {milestoneAlerts.length>0&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.white,borderRadius:28,padding:32,maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{fontSize:56,marginBottom:8}}>{milestoneAlerts[0].milestone.icon}</div>
            <div style={{fontSize:9,letterSpacing:"0.4em",color:T.peach,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Milestone Reached!</div>
            <div style={{fontSize:24,fontWeight:600,color:T.text,marginBottom:6}}>{milestoneAlerts[0].vol.name}</div>
            <div style={{fontSize:18,color:T.peach,fontWeight:700,marginBottom:8}}>{milestoneAlerts[0].milestone.label}</div>
            <div style={{fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:4}}>{milestoneAlerts[0].milestone.desc}</div>
            <div style={{fontSize:12,color:T.textDim,marginBottom:20}}>{milestoneAlerts[0].type==="hours"?milestoneAlerts[0].value+" hours":milestoneAlerts[0].value+" sessions"}</div>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <button onClick={function(){var a=milestoneAlerts[0];printCert(a.vol,a.milestone,a.type,a.value);setMilestoneAlerts(function(pv){return pv.slice(1);});}} style={btn()}>Print Certificate</button>
              <button onClick={function(){setMilestoneAlerts(function(pv){return pv.slice(1);});}} style={btn2()}>Dismiss</button>
            </div>
            {milestoneAlerts.length>1&&<div style={{marginTop:12,fontSize:11,color:T.textDim}}>{milestoneAlerts.length-1} more to show</div>}
          </div>
        </div>
      )}

      {certVol&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.white,borderRadius:28,padding:28,maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:9,letterSpacing:"0.4em",color:T.peach,textTransform:"uppercase",fontWeight:700}}>Certificate Preview</div><div style={{fontSize:15,color:T.text,marginTop:4,fontWeight:600}}>{certVol.vol.name} — {certVol.milestone.label}</div></div>
            <div style={{background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",borderRadius:20,padding:24,textAlign:"center",border:"2px solid "+T.gold,marginBottom:16}}>
              <div style={{fontSize:9,letterSpacing:"0.4em",color:T.peach,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>Little Portion Farm</div>
              <div style={{fontSize:36}}>{certVol.milestone.icon}</div>
              <div style={{fontSize:20,fontWeight:700,color:T.text,margin:"8px 0 4px"}}>{certVol.vol.name}</div>
              <div style={{fontSize:14,color:T.peach,fontWeight:700,marginBottom:6}}>{certVol.milestone.label}</div>
              <div style={{fontSize:12,color:T.textMid,lineHeight:1.6}}>{certVol.milestone.desc}</div>
              <div style={{marginTop:10,fontSize:11,color:T.textDim}}>{certVol.type==="hours"?certVol.value+" hrs":certVol.value+" sessions"} • {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={function(){printCert(certVol.vol,certVol.milestone,certVol.type,certVol.value);}} style={Object.assign({},btn(),{flex:1})}>Print</button>
              <button onClick={function(){setCertVol(null);}} style={Object.assign({},btn2(),{flex:1})}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"linear-gradient(135deg,#fce8d0,#f8dcc0,#fce0c8)",boxShadow:T.shadowLg,position:"relative",zIndex:20}}>
        <div style={{padding:"6px 16px 0",display:"flex",justifyContent:"flex-end"}}>
          <button onClick={onLock} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:11,color:T.textDim,padding:"4px 8px",borderRadius:8}}>🔒 Lock</button>
        </div>
        <div style={{padding:"4px 20px 16px",display:"flex",alignItems:"center"}}>
          <div style={{flex:1,cursor:"pointer"}} onClick={function(){goTab("home");}}>
            <div style={{fontSize:8,letterSpacing:"0.5em",color:T.peach,textTransform:"uppercase",fontWeight:700}}>Little Portion Farm</div>
            <div style={{fontSize:20,fontWeight:400,color:T.text,marginTop:2}}>Farm Manager</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:T.textDim}}>{dn}/{tot}</div>
              <div style={{width:50,height:4,background:"rgba(255,255,255,0.5)",borderRadius:2,overflow:"hidden",marginTop:2}}><div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+T.peach+","+T.gold+")",borderRadius:2}}/></div>
            </div>
            <button onClick={function(){setMenuOpen(!menuOpen);}} style={{background:menuOpen?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)",border:"none",borderRadius:12,width:42,height:42,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
              {menuOpen?<span style={{fontSize:18,color:T.peach,lineHeight:1}}>✕</span>:<div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center"}}><div style={{width:18,height:2,background:T.peach,borderRadius:1}}/><div style={{width:18,height:2,background:T.peach,borderRadius:1}}/><div style={{width:18,height:2,background:T.peach,borderRadius:1}}/></div>}
            </button>
          </div>
        </div>
        {menuOpen&&(
          <div style={{position:"absolute",top:"100%",left:0,right:0,background:T.white,boxShadow:"0 8px 32px rgba(100,80,50,0.15)",borderRadius:"0 0 20px 20px",padding:"8px 12px 14px",zIndex:100}}>
            {MENU.map(function(item){var active=tab===item.k;return <button key={item.k} onClick={function(){goTab(item.k);}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"13px 14px",background:active?T.peachBg:"transparent",border:"none",borderRadius:14,cursor:"pointer",fontFamily:"Georgia,serif",textAlign:"left",marginBottom:2}}><span style={{fontSize:16,width:24,textAlign:"center"}}>{item.ic}</span><span style={{fontSize:14,color:active?T.peach:T.text,fontWeight:active?700:400}}>{item.l}</span>{active&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:T.peach}}/>}</button>;})}
          </div>
        )}
      </div>
      {menuOpen&&<div onClick={function(){setMenuOpen(false);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.08)",zIndex:15}}/>}

      <div style={{maxWidth:580,margin:"0 auto",padding:"20px 16px 60px"}}>

        {tab==="home"&&(
          <div>
            <div style={{background:"rgba(255,255,255,0.7)",borderRadius:16,padding:"12px 16px",marginBottom:14,border:"1px solid rgba(200,160,100,0.25)",position:"relative"}}>
              <div style={{fontSize:9,letterSpacing:"0.3em",color:T.peach,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Today's Reflection</div>
              <div style={{fontSize:13,color:T.text,lineHeight:1.6,fontStyle:"italic",marginBottom:4}}>"{HOME_QUOTES[hqIdx].text}"</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontSize:11,color:T.peach,fontWeight:600}}>— {HOME_QUOTES[hqIdx].author}</div>
                <button onClick={function(){var n;do{n=Math.floor(Math.random()*HOME_QUOTES.length);}while(n===hqIdx&&HOME_QUOTES.length>1);setHqIdx(n);}} style={{background:"transparent",border:"1px solid rgba(200,140,80,0.3)",borderRadius:12,padding:"3px 10px",fontSize:10,color:T.textDim,cursor:"pointer",fontFamily:"Georgia,serif"}}>New ↻</button>
              </div>
            </div>
            <div style={{background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",borderRadius:24,padding:26,marginBottom:18,position:"relative",overflow:"hidden",boxShadow:T.shadowLg}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.butter+","+T.peach+","+T.lavender+","+T.teal+")"}}/>
              <div style={{textAlign:"center",marginBottom:14}}>
                <div style={{fontSize:9,letterSpacing:"0.4em",color:T.peach,textTransform:"uppercase",fontWeight:700}}>Welcome Back</div>
                <div style={{fontSize:22,fontWeight:400,color:T.text,marginTop:4}}>{DOW[new Date().getDay()]}</div>
                <div style={{fontSize:12,color:T.textDim}}>{new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
              </div>
              <div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center"}}>
                {myWD&&<div style={{textAlign:"center"}}><div style={{fontSize:38}}>{wIc(myWD.weatherCode||0)}</div><div style={{fontSize:30,fontWeight:300,color:T.text,lineHeight:1}}>{myWD.tempF}°</div><div style={{fontSize:12,color:T.textMid,marginTop:2}}>{myWD.condition}</div>{myWD.forecast&&myWD.forecast.length>1&&<div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>{myWD.forecast.slice(1,4).map(function(day){var d=new Date(day.date+"T12:00:00");var dows=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];return <div key={day.date} style={{textAlign:"center",padding:"4px 6px",background:"rgba(255,255,255,0.4)",borderRadius:10}}><div style={{fontSize:9,color:T.textDim,marginBottom:1}}>{dows[d.getDay()]}</div><div style={{fontSize:16}}>{wIc(day.weatherCode)}</div><div style={{fontSize:10,color:T.text,fontWeight:700}}>{day.hi}°</div></div>;})}</div>}</div>}
                {!myWD&&!myWLd&&<button onClick={function(){goTab("weather");setMwEdit(true);}} style={{background:"rgba(255,255,255,0.5)",color:T.textMid,border:"none",borderRadius:14,padding:"10px 18px",fontSize:12,cursor:"pointer"}}>Set Weather</button>}
                {myWLd&&<span style={{color:T.textDim,fontSize:12}}>Loading weather...</span>}
                {next&&<div style={{borderLeft:"2px solid rgba(200,140,80,0.2)",paddingLeft:20,textAlign:"center"}}><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Next Session</div><div style={{fontSize:30,fontWeight:300,color:du===0?T.green:T.peach,lineHeight:1}}>{du===0?"Today":du===1?"Tmrw":du+"d"}</div><div style={{fontSize:12,color:T.textMid,marginTop:4}}>{next.dow.slice(0,3)} - {next.time}</div></div>}
              </div>
            </div>
            <div style={crd({padding:18,position:"relative"})}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.peach+","+T.teal+","+T.lavender+","+T.gold+")",borderRadius:"20px 20px 0 0"}}/>
              <Sec>Quick Input</Sec>
              <div style={{fontSize:12,color:T.textDim,marginBottom:10,lineHeight:1.5}}>Type anything — tasks, harvests, notes, observations — sorted automatically.</div>
              <textarea value={brainInp} onChange={function(e){setBrainInp(e.target.value);}} placeholder="e.g. Thursday April 10 1pm-4pm signup 12, harvested 5 lbs kale, remind about gate" rows={3} style={ta_s}/>
              <button onClick={processBrain} disabled={brainLd||!brainInp.trim()} style={Object.assign({},btn(),{width:"100%",marginTop:10,opacity:(brainLd||!brainInp.trim())?0.4:1})}>{brainLd?"Sorting...":"Sort & Save"}</button>
              {brainResult&&<div style={{marginTop:10,padding:"10px 14px",background:brainResult.startsWith("Sorted")?T.greenBg:T.roseBg,borderRadius:12,fontSize:13,color:brainResult.startsWith("Sorted")?T.green:T.rose,fontWeight:600,textAlign:"center"}}>{brainResult}</div>}
            </div>
            <div style={crd({padding:18})}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1}}><Sec>Tasks</Sec><div style={{fontSize:14,color:T.textMid}}>{dn} of {tot} done</div></div>
                <div style={{width:54,height:54,borderRadius:"50%",background:"conic-gradient("+T.peach+" "+(pct*3.6)+"deg, "+T.bg2+" 0deg)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.shadow}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:T.peach}}>{pct}%</div>
                </div>
              </div>
              <button onClick={function(){goTab("checklist");}} style={Object.assign({},btn2(T.peach),{width:"100%",marginTop:12,fontSize:12})}>View Tasks</button>
            </div>
            <div style={crd({padding:18})}>
              <Sec>Who Came Today</Sec>
              {todayAtt.length>0?<div><div style={{display:"flex",gap:8}}><Stat label="Signup" value={todaySU} color={T.textMid}/><Stat label="Showed" value={todayTotal} color={todayTotal>=todaySU?T.green:T.rose}/><Stat label="Rate" value={(todaySU?Math.round(todayTotal/todaySU*100):100)+"%"} color={T.peach}/></div>{todayNames&&<div style={{fontSize:13,color:T.textMid,fontStyle:"italic",marginTop:8}}>{todayNames}</div>}</div>:<div style={{display:"flex",alignItems:"center",gap:10}}><span style={{flex:1,fontSize:13,color:T.textDim}}>Not logged yet</span><button onClick={function(){goTab("volunteers");}} style={Object.assign({},btn2(T.teal),{fontSize:11,padding:"8px 14px"})}>Log</button></div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
              {[{l:"My Day",ic:"☀️",c:T.teal,t:"myday"},{l:"Harvest",ic:"🌾",c:T.gold,t:"harvest"},{l:"Briefing",ic:"⚠️",c:T.rose,t:"briefing"},{l:"Observe",ic:"👀",c:T.lavender,t:"observations"}].map(function(item){
                return <button key={item.t} onClick={function(){goTab(item.t);}} style={{background:T.white,border:"none",borderRadius:18,padding:"16px 14px",cursor:"pointer",boxShadow:T.shadow,display:"flex",alignItems:"center",gap:10,fontFamily:"Georgia,serif"}}><span style={{fontSize:20}}>{item.ic}</span><span style={{fontSize:13,fontWeight:600,color:item.c}}>{item.l}</span></button>;
              })}
            </div>
            {todayHvs.length>0&&<div style={crd({padding:18})}><Sec>Harvested Today</Sec><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{todayHvs.map(function(h){var cc=gcc(h.crop);return <span key={h.id} style={{background:cc.bg,color:cc.ac,borderRadius:10,padding:"5px 12px",fontSize:12,fontWeight:600}}>{h.crop} — {h.amount} {h.unit}</span>;})}</div></div>}
            <div style={crd({padding:18})}>
              <Sec>Print Day Sheet</Sec>
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}><Lbl>Session</Lbl><SeSel val={printSess} onChange={function(e){setPrintSess(e.target.value);}} ss={upcomingSs} style={{width:"100%"}}/></div>
                <button onClick={function(){
                  var dt=dT(printSess);var si=ss.find(function(s){return s.id===printSess;});var sl2=si?sLbl(si):printSess;
                  var grp=CATS.reduce(function(a,cat){var its=dt.filter(function(t){return t.category===cat;});if(its.length)a[cat]=its;return a;},{});
                  var html="<html><head><title>Day Sheet</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:24px;max-width:700px;margin:0 auto}h1{font-size:20px;text-align:center}h2{font-size:13px;border-bottom:2px solid #e8956a;padding-bottom:4px;margin:14px 0 6px;color:#e8956a;text-transform:uppercase}h3{font-size:11px;background:#f5ede0;padding:5px 8px;margin:8px 0 4px;text-transform:uppercase}.sub{text-align:center;color:#888;font-size:11px;margin-bottom:12px}.task{display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f0e8d8;font-size:12px}.box{width:14px;height:14px;border:1.5px solid #ccc;border-radius:2px;flex-shrink:0;margin-top:1px}.alert{background:#fff0e8;border-left:3px solid #e8956a;padding:6px 10px;margin:3px 0;font-size:11px}.notes{border:1px solid #ddd;border-radius:4px;height:60px;margin-top:6px}.foot{margin-top:16px;border-top:1px solid #ddd;padding-top:6px;font-size:9px;color:#aaa;text-align:center}</style></head><body>";
                  html+="<h1>Little Portion Farm</h1><div class='sub'>"+sl2+" | "+new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})+"</div>";
                  if(urgentBriefs.length){html+="<h2>Brief Your Team</h2>";urgentBriefs.forEach(function(b){html+="<div class='alert'><b>"+b.category+":</b> "+b.text+"</div>";});}
                  html+="<h2>Tasks</h2>";Object.entries(grp).sort(function(a,b){return a[0]==="Important"?-1:1;}).forEach(function(arr){html+="<h3>"+arr[0]+"</h3>";arr[1].forEach(function(t){html+="<div class='task'><div class='box'></div>"+t.text+"</div>";});});
                  html+="<h2>Notes</h2><div class='notes'></div><div class='foot'>Little Portion Farm Manager</div></body></html>";
                  var w=window.open("","_blank");if(w){w.document.write(html);w.document.close();setTimeout(function(){w.print();},500);}
                }} style={btn()}>Print</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[{l:"Team",ic:"👥",t:"volunteers"},{l:"Guides",ic:"📖",t:"techniques"},{l:"Notes",ic:"📋",t:"notes"},{l:"Add",ic:"+",t:"add"}].map(function(item){
                return <button key={item.t} onClick={function(){goTab(item.t);}} style={{background:T.white,border:"none",borderRadius:16,padding:"14px 6px",cursor:"pointer",boxShadow:T.shadow,textAlign:"center",fontFamily:"Georgia,serif"}}><div style={{fontSize:16,marginBottom:4}}>{item.ic}</div><div style={{fontSize:10,color:T.textMid,fontWeight:600}}>{item.l}</div></button>;
              })}
            </div>
          </div>
        )}

        {tab==="myday"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              {[["today","Today"],["history","Journal"],["report","Weekly"]].map(function(arr){var k=arr[0],l=arr[1],act=myView===k;return <button key={k} onClick={function(){setMyView(k);}} style={{flex:1,background:act?T.white:"transparent",color:act?T.peach:T.textDim,border:act?"none":"1.5px solid "+T.border,borderRadius:16,padding:"11px 8px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:act?700:400,boxShadow:act?T.shadow:"none"}}>{l}</button>;})}
            </div>
            {myView==="today"&&(
              <div>
                <div style={{background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",borderRadius:24,padding:24,marginBottom:18,boxShadow:T.shadowLg,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.butter+","+T.peach+","+T.lavender+")"}}/>
                  <div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center"}}>
                    {myWD&&!mwEdit&&<div style={{textAlign:"center"}}><div style={{fontSize:38}}>{wIc(myWD.weatherCode||0)}</div><div style={{fontSize:30,fontWeight:300,color:T.text,lineHeight:1}}>{myWD.tempF}°</div><div style={{fontSize:12,color:T.textMid,marginTop:2}}>{myWD.condition}</div><button onClick={function(){setMwTemp(String(myWD.tempF));setMwCond(myWD.condition||"Clear");setMwEdit(true);}} style={{background:"rgba(255,255,255,0.5)",color:T.textDim,border:"none",borderRadius:8,padding:"3px 10px",fontSize:9,cursor:"pointer",marginTop:6}}>edit</button></div>}
                    {mwEdit&&<div style={{textAlign:"center"}}><div style={{display:"flex",gap:6,marginBottom:6}}><input type="number" value={mwTemp} onChange={function(e){setMwTemp(e.target.value);}} placeholder="F" style={{width:55,padding:6,borderRadius:12,border:"1.5px solid "+T.border,background:"rgba(255,255,255,0.6)",color:T.text,fontSize:18,textAlign:"center",outline:"none"}}/><select value={mwCond} onChange={function(e){setMwCond(e.target.value);}} style={{padding:6,borderRadius:12,border:"1.5px solid "+T.border,background:"rgba(255,255,255,0.6)",color:T.text,fontSize:11,outline:"none"}}>{MW_CONDS.map(function(c){return <option key={c}>{c}</option>;})}</select></div><div style={{display:"flex",gap:4,justifyContent:"center"}}><button onClick={saveManualW} style={{background:T.peach,color:"#fff",border:"none",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer"}}>Save</button><button onClick={function(){setMwEdit(false);}} style={{background:"rgba(255,255,255,0.5)",color:T.textDim,border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer"}}>X</button></div></div>}
                    {!myWD&&!myWLd&&!mwEdit&&<button onClick={function(){setMwEdit(true);}} style={{background:"rgba(255,255,255,0.5)",color:T.textMid,border:"none",borderRadius:14,padding:"10px 18px",fontSize:12,cursor:"pointer"}}>Enter Weather</button>}
                    {myWLd&&<span style={{color:T.textDim,fontSize:12}}>Loading...</span>}
                    {next&&<div style={{borderLeft:"2px solid rgba(200,140,80,0.2)",paddingLeft:20,textAlign:"center"}}><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Next</div><div style={{fontSize:30,fontWeight:300,color:du===0?T.green:T.peach,lineHeight:1}}>{du===0?"Today":du===1?"Tmrw":du+"d"}</div><div style={{fontSize:12,color:T.textMid,marginTop:4}}>{next.dow.slice(0,3)}</div></div>}
                  </div>
                </div>
                <div style={crd({padding:16})}><Sec>What We Did Today</Sec><textarea value={mjInp} onChange={function(e){setMjInp(e.target.value);}} placeholder="e.g. harvested kale, packed bags..." rows={3} style={ta_s}/><button onClick={addJournal} disabled={mjLd||!mjInp.trim()} style={Object.assign({},btn(T.teal,"#fff"),{marginTop:10,width:"100%",opacity:(mjLd||!mjInp.trim())?0.4:1})}>{mjLd?"Writing...":"Save to Journal"}</button></div>
                <div style={crd({padding:16})}>
                  <Sec>My Checklist</Sec>
                  <div style={{display:"flex",gap:8,marginBottom:10}}><input value={mcInp} onChange={function(e){setMcInp(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")addMyCheck();}} placeholder="e.g. bring gloves" style={Object.assign({},inp_s,{flex:1})}/><button onClick={addMyCheck} disabled={!mcInp.trim()} style={Object.assign({},btn(),{opacity:!mcInp.trim()?0.4:1})}>Add</button></div>
                  {myChecks.length===0&&<div style={{fontSize:13,color:T.textDim,fontStyle:"italic",textAlign:"center",padding:"8px 0"}}>No items yet</div>}
                  {myChecks.map(function(c,i){return <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<myChecks.length-1?"1px solid "+T.border:"none"}}><input type="checkbox" checked={c.done} onChange={function(){setMyChecks(function(pv){return pv.map(function(x){return x.id===c.id?Object.assign({},x,{done:!x.done}):x;});});}} style={{width:18,height:18,accentColor:T.teal,cursor:"pointer"}}/><span style={{flex:1,fontSize:14,color:c.done?T.textDim:T.text,textDecoration:c.done?"line-through":"none"}}>{c.text}</span><button onClick={function(){setMyChecks(function(pv){return pv.filter(function(x){return x.id!==c.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div>;})}
                </div>
                <div style={crd({padding:16})}>
                  <Sec>Who Came Today</Sec>
                  {todayAtt.length>0?<div><div style={{display:"flex",gap:8}}><Stat label="Signup" value={todaySU} color={T.textMid}/><Stat label="Showed" value={todayTotal} color={todayTotal>=todaySU?T.green:T.rose}/><Stat label="Rate" value={(todaySU?Math.round(todayTotal/todaySU*100):100)+"%"} color={T.peach}/></div>{todayNames&&<div style={{fontSize:13,color:T.textMid,fontStyle:"italic",marginTop:8}}>{todayNames}</div>}</div>:<div style={{display:"flex",alignItems:"center",gap:10}}><span style={{flex:1,fontSize:13,color:T.textDim}}>Not logged yet</span><button onClick={function(){goTab("volunteers");}} style={Object.assign({},btn2(T.teal),{fontSize:11,padding:"8px 14px"})}>Log</button></div>}
                </div>
                <div style={crd({padding:16})}>
                  <div style={{display:"flex",alignItems:"center",marginBottom:10}}><Sec>Upcoming Sessions</Sec><button onClick={function(){setShMyAddS(!shMyAddS);}} style={Object.assign({},btn2(),{marginLeft:"auto",padding:"6px 12px",fontSize:11})}>{shMyAddS?"Cancel":"+ Add"}</button></div>
                  {shMyAddS&&<div style={{background:T.bg3,borderRadius:10,padding:12,marginBottom:10,border:"1px dashed "+T.border}}><input type="date" value={msDt2} onChange={function(e){setMsDt2(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:8})}/><button onClick={addMySess} disabled={!msDt2} style={Object.assign({},btn(T.teal,"#fff"),{width:"100%",opacity:!msDt2?0.4:1})}>+ Add Session</button></div>}
                  {ss.concat(mySess).map(function(s){var p=s.date.split("/");return Object.assign({},s,{dt:new Date(p[2],p[0]-1,p[1])});}).filter(function(s){var now=new Date();now.setHours(0,0,0,0);return s.dt>=now;}).sort(function(a,b){return a.dt-b.dt;}).slice(0,5).map(function(s,i){
                    var d2=daysUntil(s.date);
                    return <div key={s.id+"_"+i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<4?"1px solid "+T.border:"none"}}>
                      <div style={{width:40,height:40,borderRadius:14,background:i===0?"linear-gradient(135deg,"+T.peach+","+T.gold+")":T.bg2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:15,fontWeight:700,color:i===0?"#fff":T.textDim}}>{s.date.split("/")[1]}</span></div>
                      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{s.dow}</div><div style={{fontSize:12,color:T.textDim}}>{s.time}</div></div>
                      <Pill bg={d2===0?T.greenBg:d2<=2?T.goldBg:T.bg2} color={d2===0?T.green:d2<=2?T.gold:T.textDim}>{d2===0?"Today":d2===1?"Tmrw":d2+"d"}</Pill>
                    </div>;
                  })}
                </div>
                {(todayHvs.length>0||todayObs.length>0)&&<div>
                  {todayHvs.length>0&&<div style={crd({padding:14})}><div style={{fontSize:11,color:T.green,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Harvested Today</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{todayHvs.map(function(h){var cc=gcc(h.crop);return <span key={h.id} style={{background:cc.bg,color:cc.ac,borderRadius:10,padding:"5px 10px",fontSize:12,fontWeight:600}}>{h.crop} — {h.amount} {h.unit}</span>;})}</div></div>}
                  {todayObs.length>0&&<div style={crd({padding:14})}><div style={{fontSize:11,color:T.lavender,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Observations</div>{todayObs.map(function(o){var oc=gc(o.category||"General");return <div key={o.id} style={{fontSize:12,color:T.textMid,padding:"4px 0",lineHeight:1.5}}><Pill bg={oc.bg} color={oc.ac}>{o.category||"General"}</Pill><span style={{marginLeft:6}}>{o.text}</span></div>;})}</div>}
                </div>}
                {myJournal.length>0&&<div><Sec mt={8}>Recent Journal</Sec>{myJournal.slice(0,3).map(function(j){return <div key={j.id} style={crd()}><div style={{height:3,background:"linear-gradient(90deg,"+T.peach+","+T.butter+",transparent)"}}/><div style={{padding:"14px 16px"}}><div style={{display:"flex",gap:8,marginBottom:6}}><Pill>{j.dow?j.dow.slice(0,3):""}</Pill><span style={{fontSize:12,color:T.textDim}}>{j.date}</span></div><p style={{margin:0,fontSize:14,color:T.textMid,lineHeight:1.7,fontStyle:"italic"}}>{j.text}</p></div></div>;})}</div>}
              </div>
            )}
            {myView==="history"&&<div><Sec>All Journal Entries</Sec>{myJournal.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>No entries yet.</div>}{myJournal.map(function(j){return <div key={j.id} style={crd()}><div style={{height:3,background:"linear-gradient(90deg,"+T.peach+","+T.butter+",transparent)"}}/><div style={{padding:"14px 16px"}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><Pill>{j.dow?j.dow.slice(0,3):""}</Pill><span style={{fontSize:12,color:T.textDim}}>{j.date}</span><button onClick={function(){setMyJournal(function(pv){return pv.filter(function(x){return x.id!==j.id;});});}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div><p style={{margin:0,fontSize:14,color:T.textMid,lineHeight:1.7,fontStyle:"italic"}}>{j.text}</p></div></div>;})}</div>}
            {myView==="report"&&(
              <div>
                <div style={crd({padding:16})}><Sec>This Week at a Glance</Sec><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}><div style={{textAlign:"center",background:T.bg2,borderRadius:14,padding:"14px 6px"}}><div style={{fontSize:26,fontWeight:300,color:T.teal}}>{myJournal.length}</div><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",marginTop:4}}>Journal</div></div><div style={{textAlign:"center",background:T.bg2,borderRadius:14,padding:"14px 6px"}}><div style={{fontSize:26,fontWeight:300,color:T.lavender}}>{todayTotal}</div><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",marginTop:4}}>Volunteers</div></div><div style={{textAlign:"center",background:T.bg2,borderRadius:14,padding:"14px 6px"}}><div style={{fontSize:26,fontWeight:300,color:T.green}}>{Math.round(hvs.reduce(function(a,h){return a+h.amount;},0)*10)/10}</div><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",marginTop:4}}>Lbs</div></div></div></div>
                <div style={{background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",borderRadius:24,padding:22,boxShadow:T.shadowLg,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.butter+","+T.peach+","+T.lavender+")"}}/>
                  <Sec>Weekly Report</Sec>
                  {!weekRpt&&!weekRptLd&&<div style={{textAlign:"center"}}><div style={{fontSize:13,color:T.textDim,marginBottom:12}}>Generates from your journal, attendance, and harvest data.</div><button onClick={genWeekReport} style={btn()}>Generate Report</button></div>}
                  {weekRptLd&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:12}}>Writing...</div>}
                  {weekRpt&&<div><div style={{background:"rgba(255,255,255,0.5)",borderRadius:16,padding:16,marginBottom:12}}><p style={{margin:0,fontSize:14,color:T.textMid,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{weekRpt}</p></div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button onClick={function(){try{navigator.clipboard.writeText(weekRpt);}catch(e){}}} style={btn2(T.teal)}>Copy</button><button onClick={genWeekReport} style={btn2(T.lavender)}>Redo</button><button onClick={function(){setWeekRpt("");}} style={btn2()}>Clear</button></div></div>}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="checklist"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:14}}><SeSel val={viewDay} onChange={function(e){setViewDay(e.target.value);}} ss={upcomingSs} style={{flex:1}}/><button onClick={function(){setTasks(function(t){return t.filter(function(x){return!(x.day===viewDay&&!x.recurring);}).map(function(x){return x.day===viewDay&&x.recurring?Object.assign({},x,{done:false}):x;});});}} style={btn2()}>Reset</button></div>
            {urgentBriefs.length>0&&<div style={crd({padding:14,background:T.bg3})}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:14}}>⚠️</span><span style={{fontSize:11,color:T.rose,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Brief Your Team</span></div>{urgentBriefs.slice(0,3).map(function(b){return <div key={b.id} style={{fontSize:12,color:T.textMid,lineHeight:1.5,padding:"6px 0",borderBottom:"1px solid "+T.border}}><Pill bg={b.severity==="critical"?T.roseBg:T.peachBg} color={b.severity==="critical"?T.rose:T.peach}>{b.severity}</Pill><span style={{marginLeft:6}}>{b.text}</span></div>;})}</div>}
            {myWD&&myWD.weatherCode>=61&&myWD.weatherCode<=69&&<div style={crd({padding:14,background:"#e8f4f0"})}><div style={{fontSize:12,color:T.teal}}><strong>Rain detected</strong> — consider skipping outdoor watering</div></div>}
            {myWD&&myWD.tempF<=32&&<div style={crd({padding:14,background:"#e8e8f4"})}><div style={{fontSize:12,color:T.lavender}}><strong>Freezing temps</strong> — check frost covers</div></div>}
            {(function(){
              var todayIdx=DAYS.indexOf(TODAY);
              var overdueTasks=tasks.filter(function(t){if(t.done||t.recurring)return false;var di=DAYS.indexOf(t.day);return di>=0&&di<todayIdx;});
              if(overdueTasks.length>0)return <div style={crd({padding:14,background:T.roseBg,border:"1px solid "+T.rose+"33"})}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:8,height:8,borderRadius:"50%",background:T.rose}}/><span style={{fontSize:11,color:T.rose,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Overdue ({overdueTasks.length})</span></div>
                {overdueTasks.slice(0,5).map(function(t){var c=gc(t.category);return <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid "+T.rose+"22"}}>
                  <input type="checkbox" checked={false} onChange={function(){togT(t.id);}} style={{width:16,height:16,accentColor:T.rose,cursor:"pointer"}}/>
                  <span style={{flex:1,fontSize:12,color:T.textMid}}>{t.text}</span>
                  <Pill bg={c.bg} color={c.ac}>{t.day.slice(0,3)}</Pill>
                </div>;})}
                {overdueTasks.length>5&&<div style={{fontSize:11,color:T.rose,marginTop:6}}>+{overdueTasks.length-5} more</div>}
              </div>;
              return null;
            })()}
            {(function(){
              var dt=dT(viewDay);var grp=CATS.reduce(function(a,cat){var its=dt.filter(function(t){return t.category===cat;});if(its.length)a[cat]=its;return a;},{});
              var viewDayIdx=DAYS.indexOf(viewDay);var todayIdx2=DAYS.indexOf(TODAY);var isPastDay=viewDayIdx>=0&&todayIdx2>=0&&viewDayIdx<todayIdx2;
              if(!Object.keys(grp).length)return <div style={{textAlign:"center",color:T.textDim,padding:24,fontStyle:"italic"}}>No tasks yet.</div>;
              return Object.entries(grp).sort(function(a,b){return a[0]==="Important"?-1:1;}).map(function(arr){
                var cat=arr[0],its=arr[1],c=gc(cat);
                var undone=isPastDay?its.filter(function(i){return!i.done&&!i.recurring;}).length:0;
                return <div key={cat} style={crd()}><div style={{padding:"10px 16px",display:"flex",alignItems:"center",borderBottom:"1px solid "+T.border}}><div style={{width:8,height:8,borderRadius:"50%",background:c.ac,marginRight:10}}/><span style={{fontWeight:700,fontSize:11,color:c.ac,letterSpacing:"0.1em",textTransform:"uppercase"}}>{cat}</span>{undone>0&&<span style={{marginLeft:6,fontSize:9,color:T.rose,fontWeight:700}}>({undone} overdue)</span>}<span style={{marginLeft:"auto",fontSize:11,color:T.textDim}}>{its.filter(function(i){return i.done;}).length}/{its.length}</span></div><div style={{padding:"4px 16px 8px"}}>{its.map(function(t,idx){var isOverdue=isPastDay&&!t.done&&!t.recurring;return <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:idx<its.length-1?"1px solid "+T.border:"none",background:isOverdue?T.roseBg:"transparent",marginLeft:isOverdue?-16:0,marginRight:isOverdue?-16:0,paddingLeft:isOverdue?16:0,paddingRight:isOverdue?16:0,borderRadius:isOverdue?8:0}}><input type="checkbox" checked={t.done} onChange={function(){togT(t.id);}} style={{width:18,height:18,accentColor:isOverdue?T.rose:c.ac,cursor:"pointer"}}/><span style={{flex:1,fontSize:14,color:t.done?T.textDim:isOverdue?T.rose:T.text,textDecoration:t.done?"line-through":"none",lineHeight:1.5}}>{t.text}</span><button onClick={function(){delT(t.id);}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div>;})}</div></div>;
              });
            })()}
          </div>
        )}

        {tab==="add"&&<div>
          <div style={crd({padding:16})}><Lbl>Adding to</Lbl><SeSel val={addDay} onChange={function(e){setAddDay(e.target.value);}} ss={upcomingSs} style={{width:"100%"}}/></div>
          <div style={crd({padding:16})}>
            <Sec>Quick Add Task</Sec>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input value={inp} onChange={function(e){setInp(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")quickAdd();}} placeholder="e.g. harvest kale rows 3-5" style={Object.assign({},inp_s,{flex:1})}/>
              <button onClick={quickAdd} disabled={aiLd||!inp.trim()} style={Object.assign({},btn(),{opacity:(aiLd||!inp.trim())?0.4:1})}>{aiLd?"...":"Add"}</button>
            </div>
            <button onClick={function(){setAddRepeat(function(v){return!v;});}} style={{background:addRepeat?T.teal+"22":"transparent",color:addRepeat?T.teal:T.textDim,border:"1.5px solid "+(addRepeat?T.teal:T.border),borderRadius:20,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:addRepeat?700:400,width:"100%"}}>{addRepeat?"Repeat Every Day: ON — all days + all sessions":"Repeat Every Day: OFF — adding to selected day only"}</button>
            {aiSt&&<div style={{textAlign:"center",fontSize:12,color:T.green,marginTop:8}}>{aiSt}</div>}
          </div>
          <div style={crd({padding:16})}>
            <Sec>AI Task Sorter</Sec>
            <div style={{fontSize:12,color:T.textDim,marginBottom:10,lineHeight:1.6}}>Paste rough notes — AI will clean them up, categorize, and add as tasks. Mention "every day" or "daily" and it will auto-repeat.</div>
            <textarea value={addBrainInp} onChange={function(e){setAddBrainInp(e.target.value);}} placeholder={"e.g. close bins at end of every session, remember to check the gate latch, harvest row 3 kale if ready, water hoop house daily..."} rows={4} style={Object.assign({},ta_s,{marginBottom:10})}/>
            <button onClick={processAddBrain} disabled={addBrainLd||!addBrainInp.trim()} style={Object.assign({},btn(),{width:"100%",opacity:(addBrainLd||!addBrainInp.trim())?0.4:1})}>{addBrainLd?"Sorting...":"Sort & Add Tasks"}</button>
            {addBrainResult&&<div style={{marginTop:10,padding:"10px 14px",background:addBrainResult.startsWith("Sorted")?T.greenBg:T.roseBg,borderRadius:12,fontSize:13,color:addBrainResult.startsWith("Sorted")?T.green:T.rose,fontWeight:600,textAlign:"center"}}>{addBrainResult}</div>}
          </div>
        </div>}

        {tab==="checklist"&&tasks.filter(function(t){return t.category==="General";}).length>0&&(
          <div style={crd({padding:16,marginTop:8})}>
            <Sec>Fix Existing Tasks</Sec>
            <div style={{fontSize:12,color:T.textDim,marginBottom:10,lineHeight:1.6}}>Re-sort all tasks in General into the correct categories.</div>
            <button onClick={resortGeneralTasks} disabled={resortLd} style={Object.assign({},btn(T.peach,"#fff"),{width:"100%",opacity:resortLd?0.4:1})}>{resortLd?"Re-sorting...":"Re-sort General Tasks"}</button>
            {resortResult&&<div style={{marginTop:10,padding:"10px 14px",background:resortResult.startsWith("Re-sorted")||resortResult.startsWith("No")?T.greenBg:T.roseBg,borderRadius:12,fontSize:13,color:resortResult.startsWith("Re-sorted")||resortResult.startsWith("No")?T.green:T.rose,fontWeight:600,textAlign:"center"}}>{resortResult}</div>}
          </div>
        )}

        {tab==="harvest"&&(
          <div>
            <div style={crd({padding:16})}>
              <Sec>Log Harvest</Sec>
              <Lbl>Session</Lbl><SeSel val={hSe} onChange={function(e){setHSe(e.target.value);}} ss={upcomingSs} style={{width:"100%",marginBottom:10}}/>
              <div style={{display:"flex",gap:8,marginBottom:10}}><div style={{flex:1}}><Lbl>Crop</Lbl><select value={hCr} onChange={function(e){setHCr(e.target.value);}} style={Object.assign({},inp_s,{width:"100%"})}>{HV_CROPS.map(function(c){return <option key={c}>{c}</option>;})}</select></div><div style={{flex:1}}><Lbl>Quality</Lbl><select value={hQu} onChange={function(e){setHQu(e.target.value);}} style={Object.assign({},inp_s,{width:"100%"})}>{HV_QUAL.map(function(q){return <option key={q}>{q}</option>;})}</select></div></div>
              <div style={{display:"flex",gap:8,marginBottom:10}}><div style={{flex:1}}><Lbl>Amount</Lbl><input type="number" value={hAm} onChange={function(e){setHAm(e.target.value);}} placeholder="0" style={Object.assign({},inp_s,{width:"100%",textAlign:"center",fontSize:18})}/></div><div style={{flex:1}}><Lbl>Unit</Lbl><select value={hUn} onChange={function(e){setHUn(e.target.value);}} style={Object.assign({},inp_s,{width:"100%"})}>{HV_UNITS.map(function(u){return <option key={u}>{u}</option>;})}</select></div></div>
              <PhotoPicker value={hPhoto} onChange={setHPhoto}/>
              <button onClick={saveHv} disabled={!hAm} style={Object.assign({},btn(),{width:"100%",opacity:!hAm?0.4:1})}>Log Harvest</button>
            </div>
            {hvs.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>No harvests logged yet.</div>}
            {hvs.slice().reverse().map(function(h){var cc=gcc(h.crop);return <div key={h.id} style={crd()}><div style={{height:2,background:cc.ac}}/><div style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700,fontSize:15,color:cc.ac,flex:1}}>{h.crop}</span><span style={{fontSize:20,fontWeight:300,color:T.text}}>{h.amount} <span style={{fontSize:12,color:T.textDim}}>{h.unit}</span></span><button onClick={function(){setHvs(function(pv){return pv.filter(function(x){return x.id!==h.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div><div style={{display:"flex",gap:6,marginTop:6}}><Pill bg={cc.bg} color={cc.ac}>{h.quality}</Pill><span style={{fontSize:11,color:T.textDim}}>{h.date}</span></div>{h.photo&&<div style={{position:"relative",marginTop:8}}><img src={h.photo} style={{width:"100%",borderRadius:10,maxHeight:150,objectFit:"cover",display:"block"}}/><button onClick={function(){setHvs(function(pv){return pv.map(function(x){return x.id===h.id?Object.assign({},x,{photo:null}):x;});});}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13,lineHeight:"24px",textAlign:"center",padding:0}}>✕</button></div>}</div></div>;})}
          </div>
        )}

        {tab==="analytics"&&(function(){
          var badges=getBadges();
          var earnedBadges=badges.filter(function(b){return b.earned;});
          var nextBadges=badges.filter(function(b){return !b.earned;});
          var days14=[];for(var i=13;i>=0;i--){var dd=new Date();dd.setDate(dd.getDate()-i);dd.setHours(0,0,0,0);days14.push(dd);}
          var dayLabels=days14.map(function(d){return(d.getMonth()+1)+"/"+d.getDate();});
          var harvestByDay=days14.map(function(d){var ds=d.toLocaleDateString();return hvs.filter(function(h){return h.date===ds;}).reduce(function(a,h){return a+h.amount;},0);});
          var maxH=Math.max.apply(null,harvestByDay.concat([1]));
          var attByDay=days14.map(function(d){var ds=d.toLocaleDateString();return Object.values(att).flat().filter(function(e){return e.date===ds;}).reduce(function(a,e){return a+e.count;},0);});
          var maxA=Math.max.apply(null,attByDay.concat([1]));
          var cropTotals={};hvs.forEach(function(h){cropTotals[h.crop]=(cropTotals[h.crop]||0)+h.amount;});
          var cropEntries=Object.entries(cropTotals).sort(function(a,b){return b[1]-a[1];});
          var maxCrop=cropEntries.length?cropEntries[0][1]:1;
          var obsCats={};obs.forEach(function(o){obsCats[o.category||"General"]=(obsCats[o.category||"General"]||0)+1;});
          var allAtt=Object.values(att).flat();
          var now2=new Date();var thisM=now2.getMonth();var thisY=now2.getFullYear();
          var lastM=thisM===0?11:thisM-1;var lastY=thisM===0?thisY-1:thisY;
          var thisMHvs=hvs.filter(function(h){return inMonth(h.date,thisM,thisY);});
          var lastMHvs=hvs.filter(function(h){return inMonth(h.date,lastM,lastY);});
          var thisMHlbs=Math.round(thisMHvs.reduce(function(a,h){return a+h.amount;},0)*10)/10;
          var lastMHlbs=Math.round(lastMHvs.reduce(function(a,h){return a+h.amount;},0)*10)/10;
          var thisMV=allAtt.filter(function(e){return inMonth(e.date,thisM,thisY);}).reduce(function(a,e){return a+e.count;},0);
          var lastMV=allAtt.filter(function(e){return inMonth(e.date,lastM,lastY);}).reduce(function(a,e){return a+e.count;},0);
          var thisMSU=allAtt.filter(function(e){return inMonth(e.date,thisM,thisY);}).reduce(function(a,e){return a+e.signup;},0);
          var lastMSU=allAtt.filter(function(e){return inMonth(e.date,lastM,lastY);}).reduce(function(a,e){return a+e.signup;},0);
          var thisMRate=thisMSU?Math.round(thisMV/thisMSU*100):0;
          var lastMRate=lastMSU?Math.round(lastMV/lastMSU*100):0;
          var thisMSess=allAtt.filter(function(e){return inMonth(e.date,thisM,thisY);}).length;
          var lastMSess=allAtt.filter(function(e){return inMonth(e.date,lastM,lastY);}).length;
          var thisMObs=obs.filter(function(o){return inMonth(o.date,thisM,thisY);}).length;
          var lastMObs=obs.filter(function(o){return inMonth(o.date,lastM,lastY);}).length;
          var thisMNotes=notes.filter(function(n){return inMonth(n.date,thisM,thisY);}).length;
          var lastMNotes=notes.filter(function(n){return inMonth(n.date,lastM,lastY);}).length;
          var thisMCrops=Object.keys(thisMHvs.reduce(function(a,h){a[h.crop]=1;return a;},{})).length;
          var lastMCrops=Object.keys(lastMHvs.reduce(function(a,h){a[h.crop]=1;return a;},{})).length;
          function trend(a,b){if(a===b)return{ic:"→",c:T.textDim};return a>b?{ic:"↑",c:T.green}:{ic:"↓",c:T.rose};}
          function sRow(icon,label,tv,lv,unit){
            var tr=trend(tv,lv);
            return <div style={{display:"flex",alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+T.border}}>
              <div style={{fontSize:16,width:28}}>{icon}</div>
              <div style={{flex:1,fontSize:13,color:T.text,fontWeight:600}}>{label}</div>
              <div style={{textAlign:"right",minWidth:60}}><div style={{fontSize:16,fontWeight:700,color:T.text}}>{tv}{unit||""}</div><div style={{fontSize:10,color:T.textDim}}>{MN[thisM]}</div></div>
              <div style={{textAlign:"center",minWidth:36,fontSize:18,fontWeight:700,color:tr.c,padding:"0 8px"}}>{tr.ic}</div>
              <div style={{textAlign:"right",minWidth:60}}><div style={{fontSize:16,fontWeight:700,color:T.textDim}}>{lv}{unit||""}</div><div style={{fontSize:10,color:T.textDim}}>{MN[lastM]}</div></div>
            </div>;
          }
          return(
            <div>
              <div style={crd({padding:18,background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",position:"relative",overflow:"hidden"})}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.butter+","+T.peach+","+T.lavender+")"}}/>
                <div style={{fontSize:15,color:T.text,lineHeight:1.7,fontStyle:"italic",marginBottom:8}}>"{todayQuote.text}"</div>
                <div style={{fontSize:12,color:T.peach,fontWeight:700}}>— {todayQuote.author}</div>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
                {[["harvest","Harvest"],["attendance","Attendance"],["tasks","Tasks"],["crops","By Crop"],["season","Season"],["badges","Badges"],["report","Report"]].map(function(arr){
                  var k=arr[0],l=arr[1],act=analyticsView===k;
                  return <button key={k} onClick={function(){setAnalyticsView(k);}} style={{background:act?T.white:"transparent",color:act?T.peach:T.textDim,border:act?"none":"1.5px solid "+T.border,borderRadius:14,padding:"9px 14px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:act?700:400,boxShadow:act?T.shadow:"none"}}>{l}</button>;
                })}
              </div>
              {analyticsView==="harvest"&&<div>{(function(){
                var sessTotals={};hvs.forEach(function(h){sessTotals[h.session]=(sessTotals[h.session]||0)+h.amount;});
                var bestSid=null;var bestAmt=0;Object.entries(sessTotals).forEach(function(e){if(e[1]>bestAmt){bestAmt=e[1];bestSid=e[0];}});
                var bestS=bestSid?ss.find(function(s){return s.id===bestSid;}):null;
                var seasonTotal=Math.round(hvs.reduce(function(a,h){return a+h.amount;},0)*10)/10;
                return <div>
                  {bestS&&<div style={crd({padding:16,background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",position:"relative",overflow:"hidden"})}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.butter+","+T.peach+","+T.gold+")"}}/>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{fontSize:28}}>🏆</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Best Session</div>
                        <div style={{fontSize:14,fontWeight:700,color:T.text}}>{bestS.dow}, {bestS.date}</div>
                        <div style={{fontSize:12,color:T.textDim}}>{Math.round(bestAmt*10)/10} lbs harvested</div>
                      </div>
                    </div>
                  </div>}
                  <div style={{display:"flex",gap:10,marginBottom:16}}>
                    <div style={{flex:1,background:T.white,borderRadius:18,padding:"14px 10px",textAlign:"center",boxShadow:T.shadow}}><div style={{fontSize:26,fontWeight:300,color:T.peach}}>{seasonTotal}</div><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",marginTop:3}}>Season Total lbs</div></div>
                    <div style={{flex:1,background:T.white,borderRadius:18,padding:"14px 10px",textAlign:"center",boxShadow:T.shadow}}><div style={{fontSize:26,fontWeight:300,color:T.gold}}>{Object.keys(sessTotals).length}</div><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",marginTop:3}}>Sessions Logged</div></div>
                    <div style={{flex:1,background:T.white,borderRadius:18,padding:"14px 10px",textAlign:"center",boxShadow:T.shadow}}><div style={{fontSize:26,fontWeight:300,color:T.green}}>{Object.keys(cropTotals).length}</div><div style={{fontSize:9,color:T.textDim,textTransform:"uppercase",marginTop:3}}>Crop Types</div></div>
                  </div>
                </div>;
              })()}<div style={crd({padding:18})}><Sec>Harvest - Last 14 Days</Sec><div style={{display:"flex",alignItems:"flex-end",gap:4,height:140,marginBottom:8}}>{harvestByDay.map(function(val,i){var hh=maxH>0?Math.max((val/maxH)*120,val>0?4:0):0;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>{val>0&&<div style={{fontSize:8,color:T.peach,marginBottom:2}}>{Math.round(val*10)/10}</div>}<div style={{width:"100%",height:hh,background:val>0?"linear-gradient(180deg,"+T.peach+","+T.gold+")":T.bg2,borderRadius:"4px 4px 0 0"}}/></div>;})}</div><div style={{display:"flex",gap:4,marginBottom:14}}>{dayLabels.map(function(l,i){return <div key={i} style={{flex:1,textAlign:"center",fontSize:7,color:T.textDim}}>{i%2===0?l:""}</div>;})}</div><div style={{display:"flex",gap:12}}><Stat label="Total lbs" value={Math.round(hvs.reduce(function(a,h){return a+h.amount;},0)*10)/10} color={T.peach}/><Stat label="Entries" value={hvs.length} color={T.gold}/><Stat label="Crops" value={Object.keys(cropTotals).length} color={T.green}/></div></div></div>}
              {analyticsView==="attendance"&&<div style={crd({padding:18})}><Sec>Attendance - Last 14 Days</Sec><div style={{display:"flex",alignItems:"flex-end",gap:4,height:140,marginBottom:8}}>{attByDay.map(function(val,i){var hh=maxA>0?Math.max((val/maxA)*120,val>0?4:0):0;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>{val>0&&<div style={{fontSize:8,color:T.teal,marginBottom:2}}>{val}</div>}<div style={{width:"100%",height:hh,background:val>0?"linear-gradient(180deg,"+T.teal+","+T.green+")":T.bg2,borderRadius:"4px 4px 0 0"}}/></div>;})}</div><div style={{display:"flex",gap:4,marginBottom:14}}>{dayLabels.map(function(l,i){return <div key={i} style={{flex:1,textAlign:"center",fontSize:7,color:T.textDim}}>{i%2===0?l:""}</div>;})}</div><div style={{display:"flex",gap:12}}><Stat label="Total Showed" value={allAtt.reduce(function(a,e){return a+e.count;},0)} color={T.teal}/><Stat label="Sessions" value={allAtt.length} color={T.lavender}/><Stat label="Roster" value={vols.length} color={T.gold}/></div></div>}
              {analyticsView==="tasks"&&<div><div style={crd({padding:18})}><Sec>Task Completion</Sec><div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><div style={{width:120,height:120,borderRadius:"50%",background:"conic-gradient("+T.green+" "+(pct*3.6)+"deg, "+T.bg2+" 0deg)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.shadowLg}}><div style={{width:90,height:90,borderRadius:"50%",background:T.white,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}><div style={{fontSize:28,fontWeight:700,color:T.green}}>{pct}%</div><div style={{fontSize:10,color:T.textDim}}>{dn}/{tot}</div></div></div></div>{CATS.map(function(cat){var ct=tasks.filter(function(t){return t.category===cat;});if(!ct.length)return null;var cd=ct.filter(function(t){return t.done;}).length;var cp=Math.round((cd/ct.length)*100);var c=gc(cat);return <div key={cat} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid "+T.border}}><div style={{width:8,height:8,borderRadius:"50%",background:c.ac}}/><span style={{flex:1,fontSize:13,color:T.text}}>{cat}</span><span style={{fontSize:12,color:T.textDim}}>{cd}/{ct.length}</span><div style={{width:60,height:6,background:T.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:cp+"%",background:c.ac,borderRadius:3}}/></div><span style={{fontSize:12,fontWeight:700,color:c.ac,width:35,textAlign:"right"}}>{cp}%</span></div>;})}</div><div style={crd({padding:18})}><Sec>Activity</Sec><div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>{[{v:notes.length,l:"Notes",c:T.peach},{v:obs.length,l:"Observations",c:T.lavender},{v:myJournal.length,l:"Journal",c:T.teal},{v:briefs.length,l:"Briefings",c:T.rose}].map(function(item){return <div key={item.l} style={{background:T.bg2,borderRadius:14,padding:14,textAlign:"center"}}><div style={{fontSize:28,fontWeight:300,color:item.c}}>{item.v}</div><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase",marginTop:4}}>{item.l}</div></div>;})}</div></div></div>}
              {analyticsView==="crops"&&<div><div style={crd({padding:18})}><Sec>Harvest by Crop</Sec>{cropEntries.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic"}}>No harvests yet.</div>}{cropEntries.map(function(arr){var crop=arr[0],amount=arr[1];var cc=gcc(crop);var pb=Math.round((amount/maxCrop)*100);return <div key={crop} style={{marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:14,fontWeight:600,color:cc.ac,flex:1}}>{crop}</span><span style={{fontSize:14,fontWeight:700,color:T.text}}>{Math.round(amount*10)/10}</span></div><div style={{height:10,background:T.bg2,borderRadius:6,overflow:"hidden"}}><div style={{height:"100%",width:pb+"%",background:cc.ac,borderRadius:6}}/></div></div>;})}</div>{Object.keys(obsCats).length>0&&<div style={crd({padding:18})}><Sec>Observations by Type</Sec>{Object.entries(obsCats).sort(function(a,b){return b[1]-a[1];}).map(function(arr){var cat=arr[0],count=arr[1];var c=gc(cat);return <div key={cat} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid "+T.border}}><div style={{width:8,height:8,borderRadius:"50%",background:c.ac}}/><span style={{flex:1,fontSize:13,color:T.text}}>{cat}</span><span style={{fontSize:16,fontWeight:700,color:c.ac}}>{count}</span></div>;})}</div>}</div>}
              {analyticsView==="season"&&(
                <div>
                  <div style={crd({padding:18})}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div><Sec>Season Comparison</Sec><div style={{fontSize:12,color:T.textDim,marginTop:-8}}>This month vs last month</div></div><div style={{display:"flex",gap:16,fontSize:11}}><div style={{textAlign:"center"}}><div style={{fontWeight:700,color:T.peach}}>{MN[thisM]}</div><div style={{color:T.textDim}}>This</div></div><div style={{textAlign:"center"}}><div style={{fontWeight:700,color:T.textDim}}>{MN[lastM]}</div><div style={{color:T.textDim}}>Last</div></div></div></div>
                    {sRow("🌾","Harvest (lbs)",thisMHlbs,lastMHlbs)}
                    {sRow("👥","Volunteers",thisMV,lastMV)}
                    {sRow("📊","Show-up Rate",thisMRate,lastMRate,"%")}
                    {sRow("📅","Sessions",thisMSess,lastMSess)}
                    {sRow("🌿","Crop Varieties",thisMCrops,lastMCrops)}
                    {sRow("👀","Observations",thisMObs,lastMObs)}
                    {sRow("📋","Notes",thisMNotes,lastMNotes)}
                  </div>
                  <div style={crd({padding:18,background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",position:"relative",overflow:"hidden"})}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.butter+","+T.peach+","+T.lavender+")"}}/>
                    <Sec>Top Crops This Month</Sec>
                    {thisMHvs.length===0&&<div style={{fontSize:13,color:T.textDim,fontStyle:"italic"}}>No harvests this month yet.</div>}
                    {Object.entries(thisMHvs.reduce(function(a,h){a[h.crop]=(a[h.crop]||0)+h.amount;return a;},{})).sort(function(a,b){return b[1]-a[1];}).slice(0,5).map(function(arr){var crop=arr[0],amt=arr[1];var cc=gcc(crop);return <div key={crop} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(200,140,80,0.15)"}}><div style={{width:8,height:8,borderRadius:"50%",background:cc.ac,flexShrink:0}}/><span style={{flex:1,fontSize:14,color:T.text,fontWeight:600}}>{crop}</span><span style={{fontSize:14,fontWeight:700,color:cc.ac}}>{Math.round(amt*10)/10} lbs</span></div>;})}
                  </div>
                </div>
              )}
              {analyticsView==="badges"&&(
                <div>
                  {earnedBadges.length>0&&<div style={crd({padding:18})}><Sec>Earned Badges ({earnedBadges.length})</Sec><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{earnedBadges.map(function(b){return <div key={b.name} style={{textAlign:"center",background:"linear-gradient(135deg,#fce8d0,#f8dcc0)",borderRadius:16,padding:"14px 8px",boxShadow:T.shadow}}><div style={{fontSize:28}}>{b.icon}</div><div style={{fontSize:11,fontWeight:700,color:T.text,marginTop:4}}>{b.name}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>{b.desc}</div></div>;})}</div></div>}
                  {nextBadges.length>0&&<div style={crd({padding:18})}><Sec>Next Goals</Sec>{nextBadges.map(function(b){var pb=b.goal?Math.round((b.progress/b.goal)*100):0;return <div key={b.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid "+T.border}}><div style={{fontSize:24,opacity:0.4}}>{b.icon}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.textMid}}>{b.name}</div><div style={{fontSize:11,color:T.textDim}}>{b.desc}</div>{b.goal&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:T.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:pb+"%",background:T.peach,borderRadius:3}}/></div><span style={{fontSize:10,color:T.peach,fontWeight:700}}>{pb}%</span></div>}</div></div>;})}</div>}
                </div>
              )}
              {analyticsView==="report"&&(
                <div>
                  <div style={crd({padding:16})}>
                    <Sec>Session Report</Sec>
                    <div style={{fontSize:12,color:T.textDim,marginBottom:12}}>Generate a printable recap of a session — who came, what was harvested, tasks done.</div>
                    <SeSel val={rptSess} onChange={function(e){setRptSess(e.target.value);}} ss={ss} style={{width:"100%",marginBottom:14}}/>
                    {(function(){
                      var si=ss.find(function(s){return s.id===rptSess;});
                      var attRecs=att[rptSess]||[];
                      var totalSU=attRecs.reduce(function(a,e){return a+(e.signup||0);},0);
                      var totalSH=attRecs.reduce(function(a,e){return a+(e.count||0);},0);
                      var volNames=[];
                      attRecs.forEach(function(e){(e.volIds||[]).forEach(function(id){var v=gVol(id);if(v&&!volNames.includes(v.name))volNames.push(v.name);});(e.names||"").split(",").forEach(function(n){var t=n.trim();if(t&&!volNames.includes(t))volNames.push(t);});});
                      var sessHvs=hvs.filter(function(h){return h.session===rptSess;});
                      var sessTasks=tasks.filter(function(t){return t.day===rptSess;});
                      var doneTasks=sessTasks.filter(function(t){return t.done;});
                      var totalLbs=sessHvs.filter(function(h){return h.unit==="lbs";}).reduce(function(a,h){return a+h.amount;},0);
                      var sessLabel=si?sLbl(si):rptSess;
                      return <div>
                        <div style={{display:"flex",gap:10,marginBottom:16}}>
                          <div style={{flex:1,background:T.bg2,borderRadius:14,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,color:T.peach}}>{totalSH}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>Showed Up</div></div>
                          <div style={{flex:1,background:T.bg2,borderRadius:14,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,color:T.teal}}>{sessHvs.length}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>Harvests</div></div>
                          <div style={{flex:1,background:T.bg2,borderRadius:14,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,color:T.green}}>{Math.round(totalLbs*10)/10}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>lbs</div></div>
                          <div style={{flex:1,background:T.bg2,borderRadius:14,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:300,color:T.lavender}}>{doneTasks.length+"/"+sessTasks.length}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>Tasks</div></div>
                        </div>
                        {volNames.length>0&&<div style={{marginBottom:14}}>
                          <div style={{fontSize:10,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Attendees</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{volNames.map(function(n){return <Pill key={n} bg={T.peach+"22"} color={T.peach}>{n}</Pill>;})}</div>
                        </div>}
                        {sessHvs.length>0&&<div style={{marginBottom:14}}>
                          <div style={{fontSize:10,color:T.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Harvest</div>
                          {sessHvs.map(function(h){var cc=gcc(h.crop);return <div key={h.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.textMid,padding:"5px 0",borderBottom:"1px solid "+T.border+"44"}}><span style={{color:cc.ac,fontWeight:600}}>{h.crop}</span><span>{h.amount} {h.unit} — {h.quality}</span></div>;})}
                        </div>}
                        {sessTasks.length>0&&<div style={{marginBottom:16}}>
                          <div style={{fontSize:10,color:T.lavender,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Tasks ({doneTasks.length}/{sessTasks.length} done)</div>
                          {sessTasks.map(function(t){return <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"3px 0",color:t.done?T.textDim:T.textMid,textDecoration:t.done?"line-through":"none"}}><span style={{color:t.done?T.green:T.textDim}}>{t.done?"✓":"○"}</span><span>{t.text}</span></div>;})}
                        </div>}
                        {totalSH===0&&sessHvs.length===0&&sessTasks.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:12,marginBottom:12}}>No data logged for this session yet.</div>}
                        <button onClick={function(){
                          var html="<html><head><title>Session Report — "+sessLabel+"</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#333;padding:0 24px;}h1{font-size:22px;color:#8B7355;border-bottom:2px solid #D4AF7A;padding-bottom:10px;margin-bottom:6px;}h2{font-size:12px;color:#9C6B52;text-transform:uppercase;letter-spacing:0.12em;margin:20px 0 8px;}.meta{font-size:13px;color:#888;margin-bottom:20px;}.stats{display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap;}.stat{text-align:center;}.stat-val{font-size:28px;font-weight:300;color:#9C6B52;line-height:1;}.stat-lbl{font-size:10px;text-transform:uppercase;color:#999;margin-top:2px;}table{width:100%;border-collapse:collapse;}td{padding:7px 0;border-bottom:1px solid #eee;font-size:13px;}.done{color:#bbb;text-decoration:line-through;}.pill{display:inline-block;background:#F5EFE6;padding:3px 10px;border-radius:12px;font-size:12px;margin:2px 3px 2px 0;color:#9C6B52;}@media print{button{display:none;}}</style></head><body>";
                          html+="<h1>Little Portion Farm — Session Report</h1>";
                          html+="<div class='meta'>"+sessLabel+" &nbsp;·&nbsp; Generated "+todayStr+"</div>";
                          html+="<div class='stats'><div class='stat'><div class='stat-val'>"+totalSH+"</div><div class='stat-lbl'>Showed Up</div></div><div class='stat'><div class='stat-val'>"+(totalSU||"—")+"</div><div class='stat-lbl'>Signed Up</div></div><div class='stat'><div class='stat-val'>"+Math.round(totalLbs*10)/10+"</div><div class='stat-lbl'>lbs Harvested</div></div><div class='stat'><div class='stat-val'>"+doneTasks.length+"/"+sessTasks.length+"</div><div class='stat-lbl'>Tasks Done</div></div></div>";
                          if(volNames.length>0){html+="<h2>Attendees</h2><p>"+volNames.map(function(n){return "<span class='pill'>"+n+"</span>";}).join("")+"</p>";}
                          if(sessHvs.length>0){html+="<h2>Harvest</h2><table><tr><th style='text-align:left;font-size:11px;color:#999;padding-bottom:4px;'>Crop</th><th style='text-align:right;font-size:11px;color:#999;padding-bottom:4px;'>Amount</th><th style='text-align:right;font-size:11px;color:#999;padding-bottom:4px;'>Quality</th></tr>";sessHvs.forEach(function(h){html+="<tr><td style='font-weight:600'>"+h.crop+"</td><td style='text-align:right'>"+h.amount+" "+h.unit+"</td><td style='text-align:right;color:#888'>"+h.quality+"</td></tr>";});html+="</table>";}
                          if(sessTasks.length>0){html+="<h2>Tasks</h2><table>";sessTasks.forEach(function(t){html+="<tr><td style='width:20px;color:"+(t.done?"#4CAF50":"#bbb")+"'>"+(t.done?"✓":"○")+"</td><td class='"+(t.done?"done":"")+"'>"+t.text+"</td><td style='text-align:right;color:#aaa;font-size:11px'>"+t.category+"</td></tr>";});html+="</table>";}
                          html+="</body></html>";
                          var w=window.open("","_blank");if(w){w.document.write(html);w.document.close();setTimeout(function(){w.print();},500);}
                        }} style={Object.assign({},btn(),{width:"100%"})}>Print / Save Report</button>
                      </div>;
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {tab==="weather"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#e8f0e8,#dce8dc)",borderRadius:24,padding:28,marginBottom:18,textAlign:"center",position:"relative",overflow:"hidden",boxShadow:T.shadowLg}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.teal+","+T.butter+","+T.peach+")"}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14}}>
                <div style={{fontSize:9,letterSpacing:"0.4em",color:T.teal,textTransform:"uppercase",fontWeight:700}}>Ellicott City, MD</div>
                <button onClick={function(){setMyWD(null);setWD(null);loadMyW();}} style={{background:"rgba(255,255,255,0.5)",border:"none",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:12,color:T.teal}} title="Refresh live weather">&#x21BB; Refresh</button>
              </div>
              {!wD&&!mwEdit&&myWLd&&<div style={{fontSize:14,color:T.textDim,padding:"12px 0"}}>Loading live weather...</div>}
              {!wD&&!mwEdit&&!myWLd&&<button onClick={function(){setMwEdit(true);}} style={btn()}>Enter Weather Manually</button>}
              {mwEdit&&<div><div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}}><input type="number" value={mwTemp} onChange={function(e){setMwTemp(e.target.value);}} placeholder="F" style={{width:65,padding:10,borderRadius:14,border:"1.5px solid "+T.border,background:"rgba(255,255,255,0.7)",color:T.text,fontSize:22,textAlign:"center",outline:"none"}}/><select value={mwCond} onChange={function(e){setMwCond(e.target.value);}} style={{padding:10,borderRadius:14,border:"1.5px solid "+T.border,background:"rgba(255,255,255,0.7)",color:T.text,fontSize:12,outline:"none"}}>{MW_CONDS.map(function(c){return <option key={c}>{c}</option>;})}</select></div><div style={{display:"flex",gap:8,justifyContent:"center"}}><button onClick={saveManualW} style={btn()}>Save</button><button onClick={function(){setMwEdit(false);}} style={btn2()}>Cancel</button></div></div>}
              {wD&&!mwEdit&&<div><div style={{fontSize:56}}>{wIc(wD.weatherCode||0)}</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><div style={{fontSize:48,fontWeight:300,color:T.text,lineHeight:1}}>{wD.tempF}°</div>{wD.live&&<span style={{fontSize:10,fontWeight:700,color:"#fff",background:T.teal,borderRadius:10,padding:"3px 8px",letterSpacing:"0.06em"}}>LIVE</span>}</div><div style={{fontSize:17,color:T.textMid,margin:"8px 0 8px"}}>{wD.condition}</div>{wD.live&&<div style={{fontSize:12,color:T.textDim,marginBottom:12}}>{wD.windMph} mph wind{wD.precipIn>0?" · "+wD.precipIn+"\" precip":""}</div>}<button onClick={function(){setMwTemp(String(wD.tempF));setMwCond(wD.condition||"Clear");setMwEdit(true);}} style={btn2(T.teal)}>Override</button></div>}
            </div>
            {wD&&wD.forecast&&wD.forecast.length>0&&(function(){
              var todayIso=new Date().toISOString().slice(0,10);
              var dows=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
              return <div style={crd({padding:"16px 12px",marginBottom:0})}>
                <Sec>7-Day Forecast</Sec>
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                  {wD.forecast.map(function(day){
                    var d=new Date(day.date+"T12:00:00");
                    var isToday=day.date===todayIso;
                    var label=isToday?"Today":dows[d.getDay()];
                    var hasSess=ss.some(function(s){var p=s.date.split("/");var sd=p[2]+"-"+p[0]+"-"+p[1];return sd===day.date;});
                    return <div key={day.date} style={{flexShrink:0,width:66,textAlign:"center",background:isToday?"rgba(255,255,255,0.7)":T.bg2,borderRadius:14,padding:"10px 4px",border:isToday?"1.5px solid "+T.teal:"1.5px solid transparent"}}>
                      <div style={{fontSize:10,fontWeight:isToday?700:400,color:isToday?T.teal:T.textDim,marginBottom:4}}>{label}</div>
                      <div style={{fontSize:24,lineHeight:1,marginBottom:4}}>{wIc(day.weatherCode)}</div>
                      <div style={{fontSize:13,fontWeight:700,color:T.text}}>{day.hi}°</div>
                      <div style={{fontSize:11,color:T.textDim}}>{day.lo}°</div>
                      {day.precipIn>0&&<div style={{fontSize:10,color:T.teal,marginTop:2}}>💧</div>}
                      {hasSess&&<div style={{fontSize:10,marginTop:2}} title="Farm session">🌿</div>}
                    </div>;
                  })}
                </div>
              </div>;
            })()}
            <div style={crd({padding:16})}><Sec>Weather Note</Sec><SeSel val={wDy} onChange={function(e){setWDy(e.target.value);}} ss={upcomingSs} style={{width:"100%",marginBottom:8}}/><textarea value={wN} onChange={function(e){setWN(e.target.value);}} placeholder="e.g. Hot day, moved harvesting earlier" rows={2} style={ta_s}/><button onClick={function(){if(wN.trim()){setWLog(function(pv){return pv.concat([{id:mkid(),day:wDy,note:wN.trim(),date:todayStr}]);});setWN("");}}} disabled={!wN.trim()} style={Object.assign({},btn(T.teal,"#fff"),{marginTop:8,opacity:!wN.trim()?0.4:1})}>Save Note</button></div>
            {wLog.slice().reverse().map(function(e){return <div key={e.id} style={crd({padding:"12px 16px"})}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Pill bg={T.tealBg} color={T.teal}>{(e.day||"").slice(0,3)}</Pill><span style={{fontSize:11,color:T.textDim}}>{e.date}</span><button onClick={function(){setWLog(function(wl){return wl.filter(function(x){return x.id!==e.id;});});}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div><p style={{margin:0,fontSize:13,color:T.textMid,fontStyle:"italic"}}>{e.note}</p></div>;})}
          </div>
        )}

        {tab==="volunteers"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
              {[["attendance","Attendance"],["roster","Roster"],["hours","Hours"],["recognition","Recognition"],["comms","Comms"]].map(function(arr){
                var k=arr[0],l=arr[1],act=vT===k;
                return <button key={k} onClick={function(){setVT(k);}} style={{flex:1,background:act?T.white:"transparent",color:act?T.peach:T.textDim,border:act?"none":"1.5px solid "+T.border,borderRadius:16,padding:"10px 6px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:act?700:400,boxShadow:act?T.shadow:"none"}}>{l}</button>;
              })}
            </div>
            {vT==="attendance"&&(
              <div>
                <div style={crd({padding:16})}>
                  <Sec>Log Attendance</Sec>
                  <SeSel val={aSe} onChange={function(e){setASe(e.target.value);var sessObj=ss.find(function(s){return s.id===e.target.value;});setASg(String((sessObj&&sessObj.signup)||SIG_MAP[e.target.value]||""));}} ss={ss} style={{width:"100%",marginBottom:10}}/>
                  <div style={{display:"flex",gap:10,marginBottom:10}}><div style={{flex:1}}><Lbl>Signed Up</Lbl><input type="number" value={aSg} onChange={function(e){setASg(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",textAlign:"center",fontSize:20})}/></div><div style={{flex:1}}><Lbl>Showed Up</Lbl><input type="number" value={aCn} onChange={function(e){setACn(e.target.value);}} placeholder="0" style={Object.assign({},inp_s,{width:"100%",textAlign:"center",fontSize:20})}/></div></div>
                  {vols.length>0&&<div style={{marginBottom:10}}><Lbl>Who Showed Up</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{vols.map(function(v){var sel=aWh.includes(v.id);var ec=EXP_C[v.experience];return <button key={v.id} onClick={function(){setAWh(function(pv){return pv.includes(v.id)?pv.filter(function(x){return x!==v.id;}):pv.concat([v.id]);});}} style={{background:sel?T.teal+"22":ec.bg,color:sel?T.teal:ec.tx,border:"1px solid "+(sel?T.teal:ec.bd),borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:sel?700:400}}>{v.name}</button>;})}</div></div>}
                  <textarea value={aNm} onChange={function(e){setANm(e.target.value);}} placeholder="Other names (optional)..." rows={2} style={Object.assign({},ta_s,{marginBottom:10})}/>
                  <button onClick={saveAtt} disabled={!aCn} style={Object.assign({},btn(),{opacity:!aCn?0.4:1})}>Save Attendance</button>
                </div>
                <div style={crd({padding:18,position:"relative",overflow:"hidden"})}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+T.teal+","+T.lavender+","+T.peach+")"}}/>
                  <Sec>End-of-Session Debrief</Sec>
                  <div style={{fontSize:12,color:T.textDim,marginBottom:12}}>AI writes a 3-sentence summary to share with your team.</div>
                  {!debrief&&!debriefLd&&<button onClick={genDebrief} style={Object.assign({},btn(T.teal,"#fff"),{width:"100%"})}>Generate Debrief</button>}
                  {debriefLd&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:12}}>Writing...</div>}
                  {debrief&&<div><div style={{background:T.tealBg,borderRadius:16,padding:16,marginBottom:12,border:"1px solid "+T.teal+"33"}}><p style={{margin:0,fontSize:14,color:T.text,lineHeight:1.8}}>{debrief}</p></div><div style={{display:"flex",gap:8}}><button onClick={function(){try{navigator.clipboard.writeText(debrief);}catch(e){}}} style={Object.assign({},btn(T.teal,"#fff"),{flex:1,fontSize:12})}>Copy</button><button onClick={genDebrief} style={Object.assign({},btn2(T.lavender),{flex:1,fontSize:12})}>Redo</button><button onClick={function(){setDebrief("");}} style={Object.assign({},btn2(),{fontSize:12})}>Clear</button></div></div>}
                </div>
                {Object.entries(att).map(function(entry){return entry[1].map(function(e){return <div key={e.id} style={crd()}><div style={{padding:"12px 16px",borderBottom:"1px solid "+T.border}}><span style={{fontSize:13,fontWeight:700,color:T.peach}}>{e.label}</span><span style={{fontSize:11,color:T.textDim,float:"right"}}>{e.date}</span></div><div style={{padding:"12px 16px"}}><div style={{display:"flex",gap:8}}><Stat label="Signup" value={e.signup} color={T.textMid}/><Stat label="Showed" value={e.count} color={e.count>=e.signup?T.green:T.rose}/><Stat label="Rate" value={(e.signup?Math.round(e.count/e.signup*100):100)+"%"} color={T.peach}/></div>{e.names&&<div style={{marginTop:8,fontSize:12,color:T.textDim,fontStyle:"italic"}}>{e.names}</div>}</div></div>;});})}
              </div>
            )}
            {vT==="roster"&&(
              <div>
                <div style={crd({padding:16})}>
                  <Sec>Add Volunteer</Sec>
                  <input value={vNm} onChange={function(e){setVNm(e.target.value);}} placeholder="Name" style={Object.assign({},inp_s,{width:"100%",marginBottom:8})}/>
                  <select value={vEx} onChange={function(e){setVEx(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:8})}>{EXP_LVL.map(function(l){return <option key={l}>{l}</option>;})}</select>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>{SKILLS.map(function(sk){var sel=vSk.includes(sk);return <button key={sk} onClick={function(){togSk(sk);}} style={{background:sel?T.teal+"22":"transparent",color:sel?T.teal:T.textDim,border:"1px solid "+(sel?T.teal:T.border),borderRadius:20,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>{sk}</button>;})}</div>
                  <button onClick={addVol} disabled={!vNm.trim()} style={Object.assign({},btn(),{opacity:!vNm.trim()?0.4:1})}>+ Add Volunteer</button>
                </div>
                {vols.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>No volunteers yet.</div>}
                {vols.map(function(v){
                  var ec=EXP_C[v.experience];
                  var isOpen=volDetail===v.id;
                  var vSess=getVolSessions(v.id);
                  var vHrs=getVolHours(v.id);
                  var vAttRecs=Object.entries(att).filter(function(entry){return(entry[1]||[]).some(function(e){return(e.volIds||[]).includes(v.id);});});
                  var lastSessDate=null;
                  vAttRecs.forEach(function(entry){entry[1].forEach(function(e){if((e.volIds||[]).includes(v.id)&&e.date){if(!lastSessDate||new Date(e.date)>new Date(lastSessDate))lastSessDate=e.date;}});});
                  var volCrops={};
                  vAttRecs.forEach(function(entry){var sid=entry[0];hvs.filter(function(h){return h.session===sid;}).forEach(function(h){volCrops[h.crop]=(volCrops[h.crop]||0)+h.amount;});});
                  var volCropEntries=Object.entries(volCrops).sort(function(a,b){return b[1]-a[1];});
                  return <div key={v.id} style={crd({overflow:"hidden"})}>
                    <div onClick={function(){setVolDetail(function(prev){return prev===v.id?null:v.id;});}} style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:ec.bg,border:"2px solid "+ec.bd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:ec.tx,flexShrink:0,fontWeight:700}}>{v.name.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:14,color:T.text}}>{v.name}</div>
                        <div style={{display:"flex",gap:6,marginTop:4,alignItems:"center"}}>
                          <Pill bg={ec.bg} color={ec.tx}>{v.experience}</Pill>
                          {lastSessDate&&<span style={{fontSize:10,color:T.textDim}}>Last: {lastSessDate}</span>}
                        </div>
                      </div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:300,color:T.peach}}>{vSC(v.id)}</div><div style={{fontSize:9,color:T.textDim}}>sessions</div></div>
                      <span style={{color:T.textDim,fontSize:12}}>{isOpen?"▲":"▼"}</span>
                    </div>
                    {isOpen&&<div style={{borderTop:"1px solid "+T.border,padding:"14px 16px"}}>
                      <div style={{display:"flex",gap:10,marginBottom:14}}>
                        <div style={{flex:1,background:T.bg2,borderRadius:12,padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:300,color:T.teal}}>{vHrs}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>Hours</div></div>
                        <div style={{flex:1,background:T.bg2,borderRadius:12,padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:300,color:T.peach}}>{vSess}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>Sessions</div></div>
                        <div style={{flex:1,background:T.bg2,borderRadius:12,padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:300,color:T.gold}}>{volCropEntries.length}</div><div style={{fontSize:9,color:T.textDim,marginTop:2}}>Crops</div></div>
                      </div>
                      {v.skills&&v.skills.length>0&&<div style={{marginBottom:12}}>
                        <div style={{fontSize:10,color:T.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Skills</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{v.skills.map(function(sk){return <Pill key={sk} bg={T.tealBg} color={T.teal}>{sk}</Pill>;})}</div>
                      </div>}
                      {volCropEntries.length>0&&<div style={{marginBottom:12}}>
                        <div style={{fontSize:10,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Crops Worked</div>
                        {volCropEntries.slice(0,5).map(function(arr){var cc=gcc(arr[0]);return <div key={arr[0]} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}><div style={{width:6,height:6,borderRadius:"50%",background:cc.ac}}/><span style={{flex:1,fontSize:12,color:T.textMid}}>{arr[0]}</span><span style={{fontSize:12,fontWeight:600,color:cc.ac}}>{Math.round(arr[1]*10)/10} lbs</span></div>;})}
                      </div>}
                      {vAttRecs.length>0&&<div>
                        <div style={{fontSize:10,color:T.lavender,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Recent Sessions</div>
                        {vAttRecs.slice(0,5).map(function(entry){var sid=entry[0];var sessObj=ss.find(function(s){return s.id===sid;});if(!sessObj)return null;return <div key={sid} style={{fontSize:12,color:T.textMid,padding:"3px 0"}}>{sessObj.dow}, {sessObj.date} — {sessObj.time||""}</div>;})}
                      </div>}
                      <button onClick={function(e){e.stopPropagation();setVols(function(pv){return pv.filter(function(x){return x.id!==v.id;});});}} style={Object.assign({},btn2(T.rose),{width:"100%",marginTop:12,fontSize:11})}>Remove Volunteer</button>
                    </div>}
                  </div>;
                })}
              </div>
            )}
            {vT==="hours"&&(
              <div>
                {vols.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>Add volunteers to the roster to track hours.</div>}
                {(function(){
                  var ranked=vols.map(function(v){return{v:v,sessions:getVolSessions(v.id),hours:getVolHours(v.id)};}).sort(function(a,b){return b.hours-a.hours;});
                  var totalHours=ranked.reduce(function(a,r){return a+r.hours;},0);
                  var totalSessions=ranked.reduce(function(a,r){return a+r.sessions;},0);
                  var maxHours=ranked.length?ranked[0].hours||1:1;
                  return <div>
                    <div style={{display:"flex",gap:10,marginBottom:16}}>
                      <div style={{flex:1,background:T.white,borderRadius:18,padding:"16px 12px",textAlign:"center",boxShadow:T.shadow}}><div style={{fontSize:28,fontWeight:300,color:T.gold}}>{totalHours}</div><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase",marginTop:4}}>Total Hrs</div></div>
                      <div style={{flex:1,background:T.white,borderRadius:18,padding:"16px 12px",textAlign:"center",boxShadow:T.shadow}}><div style={{fontSize:28,fontWeight:300,color:T.teal}}>{totalSessions}</div><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase",marginTop:4}}>Sessions</div></div>
                      <div style={{flex:1,background:T.white,borderRadius:18,padding:"16px 12px",textAlign:"center",boxShadow:T.shadow}}><div style={{fontSize:28,fontWeight:300,color:T.peach}}>{vols.length}</div><div style={{fontSize:10,color:T.textDim,textTransform:"uppercase",marginTop:4}}>Volunteers</div></div>
                    </div>
                    <div style={crd({padding:18})}>
                      <Sec>Hours Leaderboard</Sec>
                      {ranked.map(function(r,i){var ec=EXP_C[r.v.experience];var pb=Math.round((r.hours/maxHours)*100);var medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":"";return <div key={r.v.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:i<ranked.length-1?"1px solid "+T.border:"none"}}>
                        <div style={{width:28,textAlign:"center",fontSize:i<3?20:13,color:T.textDim,fontWeight:700,flexShrink:0}}>{medal||"#"+(i+1)}</div>
                        <div style={{width:36,height:36,borderRadius:"50%",background:ec.bg,border:"2px solid "+ec.bd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:ec.tx,fontWeight:700,flexShrink:0}}>{r.v.name.charAt(0)}</div>
                        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:4}}>{r.v.name}</div><div style={{height:6,background:T.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:pb+"%",background:i===0?"linear-gradient(90deg,"+T.gold+","+T.peach+")":"linear-gradient(90deg,"+T.teal+","+T.green+")",borderRadius:3}}/></div></div>
                        <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:18,fontWeight:700,color:i===0?T.gold:T.textMid}}>{r.hours}</div><div style={{fontSize:10,color:T.textDim}}>hrs</div></div>
                      </div>;})}</div>
                  </div>;
                })()}
              </div>
            )}
            {vT==="comms"&&(
              <div>
                <div style={crd({padding:16})}>
                  <Sec>Log Conversation</Sec>
                  <select value={commVol} onChange={function(e){setCommVol(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:8})}>
                    <option value="">— Select Volunteer —</option>
                    {vols.map(function(v){return <option key={v.id} value={v.id}>{v.name}</option>;})}
                  </select>
                  <select value={commType} onChange={function(e){setCommType(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:8})}>
                    {["Conversation","Absence Noted","Follow-up Needed","Recognition"].map(function(t){return <option key={t}>{t}</option>;})}
                  </select>
                  <textarea value={commNote} onChange={function(e){setCommNote(e.target.value);}} placeholder="Notes from the conversation..." rows={3} style={Object.assign({},ta_s,{marginBottom:8})}/>
                  <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,fontSize:13,color:T.textMid,cursor:"pointer"}}>
                    <input type="checkbox" checked={commFU} onChange={function(e){setCommFU(e.target.checked);}} style={{accentColor:T.peach}}/> Flag for follow-up
                  </label>
                  <button onClick={function(){if(!commVol||!commNote.trim())return;setCommLogs(function(pv){return [{id:mkid(),volId:commVol,note:commNote.trim(),type:commType,followUp:commFU,date:todayStr}].concat(pv);});setCommNote("");setCommFU(false);}} disabled={!commVol||!commNote.trim()} style={Object.assign({},btn(),{opacity:(!commVol||!commNote.trim())?0.4:1})}>Save Log</button>
                </div>
                {(function(){var fu=commLogs.filter(function(l){return l.followUp;});return fu.length>0&&<div style={crd({padding:16,border:"1.5px solid "+T.rose+"55"})}>
                  <div style={{fontSize:10,color:T.rose,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>⚑ Follow-ups Needed ({fu.length})</div>
                  {fu.map(function(l){var v=gVol(l.volId);return <div key={l.id} style={{paddingBottom:10,marginBottom:10,borderBottom:"1px solid "+T.border}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><span style={{fontWeight:600,fontSize:13,color:T.text}}>{v?v.name:"Unknown"}</span><span style={{fontSize:11,color:T.textDim}}>{l.date}</span></div>
                    <div style={{fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:6}}>{l.note}</div>
                    <button onClick={function(){setCommLogs(function(pv){return pv.map(function(x){return x.id===l.id?Object.assign({},x,{followUp:false}):x;});});}} style={{fontSize:10,padding:"3px 10px",background:T.rose+"15",color:T.rose,border:"1px solid "+T.rose+"44",borderRadius:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>Mark resolved</button>
                  </div>;})}
                </div>;}())}
                {commLogs.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>No logs yet. Use this to track conversations, absences, and follow-ups.</div>}
                {commLogs.filter(function(l){return !l.followUp;}).map(function(l){
                  var v=gVol(l.volId);
                  var typeC={"Conversation":T.teal,"Absence Noted":T.rose,"Follow-up Needed":T.peach,"Recognition":T.gold};
                  var tc=typeC[l.type]||T.textDim;
                  return <div key={l.id} style={crd({padding:14})}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:600,fontSize:13,color:T.text}}>{v?v.name:"Unknown"}</span><Pill bg={tc+"22"} color={tc}>{l.type}</Pill></div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:11,color:T.textDim}}>{l.date}</span>
                        <button onClick={function(){setCommLogs(function(pv){return pv.filter(function(x){return x.id!==l.id;});});}} style={{fontSize:10,padding:"2px 7px",background:"transparent",color:T.textDim,border:"1px solid "+T.border,borderRadius:10,cursor:"pointer",fontFamily:"Georgia,serif"}}>✕</button>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:T.textMid,lineHeight:1.6}}>{l.note}</div>
                  </div>;
                })}
              </div>
            )}
            {vT==="recognition"&&(
              <div>
                {vols.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>Add volunteers to the roster first.</div>}
                {vols.map(function(v){
                  var sessions=getVolSessions(v.id);var hours=getVolHours(v.id);var ec=EXP_C[v.experience];
                  var earnedH=VOL_MILESTONES.filter(function(m){return hours>=m.hours;});
                  var nextH=VOL_MILESTONES.find(function(m){return hours<m.hours;});
                  var earnedS=SESSION_MILESTONES.filter(function(m){return sessions>=m.sessions;});
                  var nextS=SESSION_MILESTONES.find(function(m){return sessions<m.sessions;});
                  var topBadge=earnedH.length?earnedH[earnedH.length-1]:earnedS.length?earnedS[earnedS.length-1]:null;
                  return <div key={v.id} style={crd({padding:18})}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:ec.bg,border:"2px solid "+ec.bd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:ec.tx,fontWeight:700,flexShrink:0}}>{v.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:T.text}}>{v.name}</div><div style={{fontSize:12,color:T.textDim}}>{hours} hrs · {sessions} sessions</div></div>
                      {topBadge&&<div style={{fontSize:28}}>{topBadge.icon}</div>}
                      <button onClick={function(){if(topBadge)setCertVol({vol:v,milestone:topBadge,type:"hours",value:hours});}} disabled={!topBadge} style={Object.assign({},btn2(T.gold),{fontSize:11,padding:"6px 12px",opacity:topBadge?1:0.3})}>Cert</button>
                    </div>
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:10,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Hours</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>{VOL_MILESTONES.map(function(m){return <span key={m.hours} style={{fontSize:18,opacity:hours>=m.hours?1:0.2}} title={m.label}>{m.icon}</span>;})}</div>
                      {nextH&&<div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.textDim,marginBottom:3}}><span>Next: {nextH.label}</span><span>{hours}/{nextH.hours} hrs</span></div><div style={{height:6,background:T.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:Math.min(100,Math.round((hours/nextH.hours)*100))+"%",background:"linear-gradient(90deg,"+T.peach+","+T.gold+")",borderRadius:3}}/></div></div>}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:T.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Sessions</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>{SESSION_MILESTONES.map(function(m){return <span key={m.sessions} style={{fontSize:18,opacity:sessions>=m.sessions?1:0.2}} title={m.label}>{m.icon}</span>;})}</div>
                      {nextS&&<div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.textDim,marginBottom:3}}><span>Next: {nextS.label}</span><span>{sessions}/{nextS.sessions}</span></div><div style={{height:6,background:T.bg2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:Math.min(100,Math.round((sessions/nextS.sessions)*100))+"%",background:"linear-gradient(90deg,"+T.teal+","+T.green+")",borderRadius:3}}/></div></div>}
                    </div>
                  </div>;
                })}
              </div>
            )}
          </div>
        )}

        {tab==="briefing"&&(
          <div>
            <div style={crd({padding:18})}>
              <Sec>Log Common Mistake or Reminder</Sec>
              <textarea value={brInp} onChange={function(e){setBrInp(e.target.value);}} placeholder="e.g. people keep leaving the hoop house door open" rows={3} style={ta_s}/>
              <div style={{display:"flex",gap:8,marginTop:10,marginBottom:10}}>
                <div style={{flex:1}}><Lbl>Category</Lbl><select value={brCat} onChange={function(e){setBrCat(e.target.value);}} style={Object.assign({},inp_s,{width:"100%"})}>{BR_CATS.map(function(c){return <option key={c}>{c}</option>;})}</select></div>
                <div style={{flex:1,display:"flex",alignItems:"flex-end"}}><button onClick={function(){setBrUseAi(!brUseAi);}} style={{background:brUseAi?T.teal+"18":"transparent",color:brUseAi?T.teal:T.textDim,border:"1.5px solid "+(brUseAi?T.teal:T.border),borderRadius:14,padding:"10px 14px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",width:"100%"}}>{brUseAi?"AI: ON":"AI: OFF"}</button></div>
              </div>
              <PhotoPicker value={brPhoto} onChange={setBrPhoto}/>
              <button onClick={addBrief} disabled={brLd||!brInp.trim()} style={Object.assign({},btn(),{width:"100%",opacity:(brLd||!brInp.trim())?0.4:1})}>{brLd?"Processing...":"Add to Briefing"}</button>
            </div>
            {briefs.length===0&&<div style={{textAlign:"center",color:T.textDim,fontSize:14,fontStyle:"italic",marginTop:20}}>No briefing items yet.</div>}
            {briefs.map(function(b){
              var sevC=b.severity==="critical"?{bg:T.roseBg,color:T.rose}:b.severity==="important"?{bg:T.peachBg2,color:T.peach}:{bg:T.butterBg,color:T.gold};
              var catC=gc(b.category||"General");
              return <div key={b.id} style={crd()}><div style={{height:3,background:sevC.color}}/><div style={{padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}><Pill bg={sevC.bg} color={sevC.color}>{b.severity}</Pill><Pill bg={catC.bg} color={catC.ac}>{b.category||"General"}</Pill><span style={{fontSize:11,color:T.textDim,marginLeft:"auto"}}>{b.date}</span><button onClick={function(){setBriefs(function(pv){return pv.filter(function(x){return x.id!==b.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div>
                <p style={{margin:0,fontSize:14,color:T.text,lineHeight:1.7}}>{b.text}</p>
                {b.photo&&<div style={{position:"relative",marginTop:10}}><img src={b.photo} style={{width:"100%",borderRadius:10,maxHeight:180,objectFit:"cover",display:"block"}}/><button onClick={function(){setBriefs(function(pv){return pv.map(function(x){return x.id===b.id?Object.assign({},x,{photo:null}):x;});});}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13,lineHeight:"24px",textAlign:"center",padding:0}}>✕</button></div>}
                <div style={{display:"flex",gap:6,marginTop:10}}>{["heads-up","important","critical"].map(function(s){var act=b.severity===s;var sc=s==="critical"?{bg:T.roseBg,color:T.rose}:s==="important"?{bg:T.peachBg2,color:T.peach}:{bg:T.butterBg,color:T.gold};return <button key={s} onClick={function(){setBriefs(function(pv){return pv.map(function(x){return x.id===b.id?Object.assign({},x,{severity:s}):x;});});}} style={{background:act?sc.bg:"transparent",color:act?sc.color:T.textDim,border:"1px solid "+T.border,borderRadius:10,padding:"4px 10px",fontSize:10,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:act?700:400}}>{s}</button>;})}</div>
              </div></div>;
            })}
          </div>
        )}

        {tab==="notes"&&(
          <div>
            <div style={crd({padding:16})}><Sec>Leadership Notes</Sec><textarea value={nInp} onChange={function(e){setNInp(e.target.value);}} placeholder="e.g. remind people to push down spinach" rows={3} style={ta_s}/><PhotoPicker value={nPhoto} onChange={setNPhoto}/><button onClick={addNote} disabled={nLd||!nInp.trim()} style={Object.assign({},btn(T.teal,"#fff"),{marginTop:8,opacity:(nLd||!nInp.trim())?0.4:1})}>{nLd?"Adding...":"Add Note"}</button></div>
            {notes.length===0&&<div style={{textAlign:"center",color:T.textDim,fontStyle:"italic",padding:20}}>No notes yet.</div>}
            {(function(){var grp=NOTE_CATS.reduce(function(a,cat){var its=notes.filter(function(n){return n.category===cat;});if(its.length)a[cat]=its;return a;},{});return Object.entries(grp).map(function(arr){var cat=arr[0],items=arr[1],c=gc(cat);return <div key={cat} style={crd()}><div style={{padding:"10px 16px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:c.ac,marginRight:10}}/><span style={{fontWeight:700,fontSize:11,color:c.ac,textTransform:"uppercase"}}>{cat}</span></div><div style={{padding:"4px 16px 8px"}}>{items.map(function(n){return <div key={n.id} style={{padding:"10px 0",borderBottom:"1px solid "+T.border}}><div style={{display:"flex",alignItems:"flex-start",gap:8}}><span style={{flex:1,fontSize:13,color:T.textMid,lineHeight:1.5}}>{n.text}</span><span style={{fontSize:11,color:T.textDim,whiteSpace:"nowrap"}}>{n.date}</span><button onClick={function(){setNotes(function(ns){return ns.filter(function(x){return x.id!==n.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div>{n.photo&&<div style={{position:"relative",marginTop:8}}><img src={n.photo} style={{width:"100%",borderRadius:10,maxHeight:160,objectFit:"cover",display:"block"}}/><button onClick={function(){setNotes(function(ns){return ns.map(function(x){return x.id===n.id?Object.assign({},x,{photo:null}):x;});});}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13,lineHeight:"24px",textAlign:"center",padding:0}}>✕</button></div>}</div>;})}</div></div>;});})()}
          </div>
        )}

        {tab==="observations"&&(
          <div>
            <div style={crd({padding:16})}><Sec>Farm Observations</Sec><textarea value={oInp} onChange={function(e){setOInp(e.target.value);}} placeholder="e.g. east tunnel row 3 looking dry" rows={3} style={ta_s}/><PhotoPicker value={oPhoto} onChange={setOPhoto}/><button onClick={addOb} disabled={oLd||!oInp.trim()} style={Object.assign({},btn(T.teal,"#fff"),{marginTop:8,opacity:(oLd||!oInp.trim())?0.4:1})}>{oLd?"Logging...":"Log Observation"}</button></div>
            {obs.length===0&&<div style={{textAlign:"center",color:T.textDim,fontSize:14,fontStyle:"italic",marginTop:20}}>No observations yet.</div>}
            {obs.map(function(o){var c=gc(o.category||"General");return <div key={o.id} style={crd()}><div style={{height:2,background:c.ac}}/><div style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"flex-start",gap:10}}><div style={{flex:1}}><div style={{fontSize:13,color:T.textMid,lineHeight:1.5}}>{o.text}</div><div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}><Pill bg={c.bg} color={c.ac}>{o.category||"General"}</Pill><span style={{fontSize:11,color:T.textDim}}>{o.date}</span></div>{o.suggestedTask&&<div style={{marginTop:8,background:T.tealBg,borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:T.teal,flex:1}}>Suggested: {o.suggestedTask}</span><button onClick={function(){setTasks(function(pv){return pv.concat([{id:mkid(),text:o.suggestedTask,category:"General",done:false,recurring:false,day:TODAY}]);});setObs(function(pv){return pv.map(function(x){return x.id===o.id?Object.assign({},x,{suggestedTask:null}):x;});});}} style={{background:T.teal,color:"#fff",border:"none",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add</button></div>}{o.photo&&<div style={{position:"relative",marginTop:8}}><img src={o.photo} style={{width:"100%",borderRadius:10,maxHeight:180,objectFit:"cover",display:"block"}}/><button onClick={function(){setObs(function(pv){return pv.map(function(x){return x.id===o.id?Object.assign({},x,{photo:null}):x;});});}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13,lineHeight:"24px",textAlign:"center",padding:0}}>✕</button></div>}</div><button onClick={function(){setObs(function(pv){return pv.filter(function(x){return x.id!==o.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div></div></div>;})}
          </div>
        )}

        {tab==="techniques"&&(
          <div>
            <div style={crd({padding:16})}>
              <Sec>Build Technique Card</Sec>
              <div style={{display:"flex",gap:8,marginBottom:10}}><select value={tCr} onChange={function(e){setTCr(e.target.value);}} style={Object.assign({},inp_s,{flex:1})}>{TECH_CROPS.map(function(c){return <option key={c}>{c}</option>;})}</select><select value={tTk} onChange={function(e){setTTk(e.target.value);}} style={Object.assign({},inp_s,{flex:1})}>{TECH_TASKS.map(function(t){return <option key={t}>{t}</option>;})}</select></div>
              <textarea value={tR} onChange={function(e){setTR(e.target.value);}} placeholder="Describe how to do it..." rows={4} style={ta_s}/>
              {tSt&&<div style={{textAlign:"center",fontSize:12,color:tSt.includes("Error")?T.rose:T.green,marginTop:8}}>{tSt}</div>}
              <PhotoPicker value={tPhoto} onChange={setTPhoto}/>
              <button onClick={buildTech} disabled={tLd||!tR.trim()} style={Object.assign({},btn(),{marginTop:10,width:"100%",opacity:(tLd||!tR.trim())?0.4:1})}>{tLd?"Building...":"Build Card"}</button>
            </div>
            {techs.length===0&&<div style={{textAlign:"center",color:T.textDim,fontSize:14,fontStyle:"italic",marginTop:20}}>No technique cards yet.</div>}
            {techs.map(function(tech){return <div key={tech.id} style={crd()}><div style={{padding:"14px 16px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center"}}><span style={{flex:1,fontWeight:700,fontSize:15,color:T.peach}}>{tech.title}</span><button onClick={function(){setTechs(function(pv){return pv.filter(function(x){return x.id!==tech.id;});});}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16}}>X</button></div><div style={{padding:"14px 16px"}}>{tech.photo&&<div style={{position:"relative",marginBottom:14}}><img src={tech.photo} style={{width:"100%",borderRadius:10,maxHeight:180,objectFit:"cover",display:"block"}}/><button onClick={function(){setTechs(function(pv){return pv.map(function(x){return x.id===tech.id?Object.assign({},x,{photo:null}):x;});});}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13,lineHeight:"24px",textAlign:"center",padding:0}}>✕</button></div>}{(tech.steps||[]).map(function(step,i){return <div key={i} style={{display:"flex",gap:12,marginBottom:12}}><div style={{width:28,height:28,borderRadius:"50%",background:T.peachBg2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.peach,flexShrink:0}}>{i+1}</div><p style={{fontSize:14,color:T.textMid,lineHeight:1.6,margin:0,paddingTop:4}}>{step}</p></div>;})} {tech.tips&&<div style={{background:T.butterBg,borderRadius:12,padding:"12px 14px"}}><span style={{fontSize:10,color:T.gold,fontWeight:700,textTransform:"uppercase"}}>Tip</span><p style={{fontSize:13,color:T.textMid,lineHeight:1.6,margin:"4px 0 0",fontStyle:"italic"}}>{tech.tips}</p></div>}</div></div>;})}
          </div>
        )}

        {tab==="calendar"&&(function(){
          var today=new Date(); today.setHours(0,0,0,0);
          function sessDate(s){var p=s.date.split("/");return new Date(p[2],p[0]-1,p[1]);}
          function isPastSess(s){return sessDate(s)<today;}
          var sortedSs=ss.slice().sort(function(a,b){return sessDate(a)-sessDate(b);});
          var upcoming=sortedSs.filter(function(s){return !isPastSess(s);});
          var past=sortedSs.filter(function(s){return isPastSess(s);}).reverse();
          function addSession(){
            if(!calDate||!calTime.trim())return;
            var d=new Date(calDate+"T12:00:00");
            var dows=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var newS={id:mkid(),date:(d.getMonth()+1).toString().padStart(2,"0")+"/"+(d.getDate()).toString().padStart(2,"0")+"/"+d.getFullYear(),dow:dows[d.getDay()],time:calTime.trim(),signup:parseInt(calSig)||0};
            setSs(function(pv){return pv.concat([newS]);});
            setCalDate(""); setCalTime(""); setCalSig(""); setCalShow(false);
          }
          function delSession(id){setSs(function(pv){return pv.filter(function(s){return s.id!==id;});});}
          function toggleExp(id){setCalExpanded(function(pv){var n=Object.assign({},pv);n[id]=!n[id];return n;});}
          function parseCalSessions(){
            if(!calAiInp.trim())return;
            var DOWS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            // Normalize: collapse multiple spaces, unify dash variants, remove zero-width chars
            var text=calAiInp.replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/[—–]/g,"-").replace(/\u00a0/g," ");
            var lines=text.split(/\r?\n/).map(function(l){return l.trim();}).filter(function(l){return l.length>0;});
            var sessions=[];
            var curDate=null,curDow=null;
            // date: 04/01/2026 or 4/1/2026
            var dateRe=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            // time token: 1:00pm, 8:30am, 11:30am — with or without space before am/pm
            var timeTok=/(\d{1,2}:\d{2})\s*(am|pm)/i;
            // full range on one line: 1:00pm- 4:00pm or 1:00pm-4:00pm or 1:00 pm - 4:00 pm
            var rangeRe=/(\d{1,2}:\d{2})\s*(am|pm)[^0-9]*(\d{1,2}:\d{2})\s*(am|pm)/i;
            var slotRe=/(\d+)\s*of\s*\d+\s*slots?\s*filled/i;
            var dowRe=/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i;
            var skipRe=/^(sign\s*up|volunteer\s*on\s*farm|filled|slots?)$/i;
            var pendingTimes=[];
            var lastTimeTok=null;
            function makeRange(h1,ap1,h2,ap2){return h1+(ap1.toLowerCase())+"-"+h2+(ap2.toLowerCase());}
            function flushTimes(signup){
              pendingTimes.forEach(function(t){
                if(curDate){
                  var p=curDate.split("/");var d=new Date(p[2],p[0]-1,p[1]);
                  sessions.push({id:mkid(),date:curDate,dow:curDow||DOWS[d.getDay()],time:t,signup:signup||0});
                }
              });
              pendingTimes=[];lastTimeTok=null;
            }
            var i=0;
            while(i<lines.length){
              var ln=lines[i];
              if(dateRe.test(ln)){
                if(pendingTimes.length>0)flushTimes(0);
                curDate=ln; curDow=null; lastTimeTok=null;
                if(lines[i+1]&&dowRe.test(lines[i+1])){curDow=lines[i+1];i++;}
              } else if(dowRe.test(ln)){
                curDow=ln;
              } else if(slotRe.test(ln)){
                var sm=ln.match(slotRe);
                flushTimes(parseInt(sm[1])||0);
              } else if(!skipRe.test(ln)){
                // try full range on this line
                var rm=ln.match(rangeRe);
                if(rm){
                  pendingTimes.push(makeRange(rm[1],rm[2],rm[3],rm[4]));
                  lastTimeTok=null;
                } else if(timeTok.test(ln)){
                  // single time token — may be start or end of a split range
                  var tm=ln.match(timeTok);
                  if(lastTimeTok){
                    // pair with previous token to form range
                    pendingTimes.push(makeRange(lastTimeTok[1],lastTimeTok[2],tm[1],tm[2]));
                    lastTimeTok=null;
                  } else {
                    lastTimeTok=tm;
                  }
                }
              }
              i++;
            }
            if(pendingTimes.length>0)flushTimes(0);
            if(sessions.length===0){setCalAiResult("No sessions found — make sure you paste the full Sign-Up Genius text.");return;}
            setSs(function(pv){return pv.concat(sessions);});
            setCalAiResult("Added "+sessions.length+" session"+(sessions.length>1?"s":"")+"!");
            setCalAiInp("");
            setTimeout(function(){setCalAiResult(null);},5000);
          }
          var MNS=["January","February","March","April","May","June","July","August","September","October","November","December"];
          function daysInMonth(ym){var y=Math.floor(ym/100),m=ym%100;return new Date(y,m,0).getDate();}
          function firstDow(ym){var y=Math.floor(ym/100),m=ym%100;return new Date(y,m-1,1).getDay();}
          function cellDate(ym,day){var y=Math.floor(ym/100),m=ym%100;return String(m).padStart(2,"0")+"/"+String(day).padStart(2,"0")+"/"+y;}
          function prevMonth(ym){var y=Math.floor(ym/100),m=ym%100;m--;if(m<1){m=12;y--;}return y*100+m;}
          function nextMonth(ym){var y=Math.floor(ym/100),m=ym%100;m++;if(m>12){m=1;y++;}return y*100+m;}
          var sessByDate={};
          ss.forEach(function(s){if(!sessByDate[s.date])sessByDate[s.date]=[];sessByDate[s.date].push(s);});
          var todayMDY=(today.getMonth()+1).toString().padStart(2,"0")+"/"+today.getDate().toString().padStart(2,"0")+"/"+today.getFullYear();
          var calY=Math.floor(calMonth/100),calM=calMonth%100;
          var calDays=daysInMonth(calMonth),calOffset=firstDow(calMonth);
          var calCells=[];
          for(var ci=0;ci<calOffset;ci++)calCells.push(null);
          for(var cd=1;cd<=calDays;cd++)calCells.push(cd);
          while(calCells.length%7!==0)calCells.push(null);
          var selSessions=calSelDay?(sessByDate[calSelDay]||[]):[];
          var selIsPast=selSessions.length>0&&sessDate(selSessions[0])<today;
          var selDt=calSelDay?(function(){var p=calSelDay.split("/");return new Date(p[2],p[0]-1,p[1]);}()):null;
          var selDow=selDt?["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][selDt.getDay()]:"";
          return <div>
            <div style={crd({padding:20,marginBottom:0})}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <button onClick={function(){setCalMonth(prevMonth(calMonth));setCalSelDay(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:T.textMid,padding:"2px 10px",lineHeight:1}}>&#8249;</button>
                <span style={{fontWeight:700,fontSize:16,color:T.text,fontFamily:"Georgia,serif"}}>{MNS[calM-1]} {calY}</span>
                <button onClick={function(){setCalMonth(nextMonth(calMonth));setCalSelDay(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:T.textMid,padding:"2px 10px",lineHeight:1}}>&#8250;</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:4}}>
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(function(d){return <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:T.textDim,padding:"3px 0",textTransform:"uppercase",letterSpacing:"0.06em"}}>{d}</div>;})}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                {calCells.map(function(day,i){
                  if(!day)return <div key={"e"+i}/>;
                  var cd=cellDate(calMonth,day);
                  var isToday=cd===todayMDY;
                  var isSel=cd===calSelDay;
                  var isPast2=new Date(calY,calM-1,day)<today;
                  var daySess=sessByDate[cd]||[];
                  return <div key={cd} onClick={function(){setCalSelDay(function(prev){return prev===cd?null:cd;});}} style={{textAlign:"center",padding:"5px 2px",borderRadius:10,cursor:"pointer",border:isSel?"2px solid "+T.peach:"2px solid transparent",background:isToday?T.peachBg:"transparent"}}>
                    <div style={{fontSize:13,fontWeight:isToday?700:400,color:isPast2?T.textDim:T.text,marginBottom:2}}>{day}</div>
                    <div style={{display:"flex",justifyContent:"center",gap:3,minHeight:8}}>
                      {daySess.length>0&&<div style={{width:7,height:7,borderRadius:"50%",background:T.peach}}/>}
                      {daySess.length>1&&<div style={{width:7,height:7,borderRadius:"50%",background:T.teal}}/>}
                    </div>
                  </div>;
                })}
              </div>
            </div>
            {calSelDay&&<div style={crd({padding:20,marginBottom:0})}>
              <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:12,fontFamily:"Georgia,serif"}}>{selDow}, {calSelDay}</div>
              {selIsPast?(
                selSessions.map(function(s){
                  var recs=att[s.id]||[];
                  var totalCt=recs.reduce(function(a,r){return a+r.count;},0);
                  var names=recs.map(function(r){return r.names;}).filter(Boolean).join(", ");
                  var sHvs=hvs.filter(function(h){return h.session===s.id;});
                  return <div key={s.id}>
                    <div style={{fontSize:13,color:T.textMid,marginBottom:10}}>{s.time||"Time not recorded"}</div>
                    {totalCt===0&&sHvs.length===0&&<div style={{color:T.textDim,fontSize:13,fontStyle:"italic"}}>No data logged for this session.</div>}
                    {totalCt>0&&<div style={{marginBottom:10}}>
                      <div style={{fontSize:11,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>Volunteers</div>
                      <div style={{fontSize:13,color:T.textMid,lineHeight:1.6}}>{names||"Count logged, no names recorded"}{totalCt>0&&<span style={{color:T.textDim}}> ({totalCt} total)</span>}</div>
                    </div>}
                    {sHvs.length>0&&<div>
                      <div style={{fontSize:11,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>Harvest</div>
                      {sHvs.map(function(h){return <div key={h.id} style={{fontSize:13,color:T.textMid,marginBottom:4}}>{h.crop} — {h.amount} {h.unit} ({h.quality})</div>;})}
                    </div>}
                  </div>;
                })
              ):(
                <div>
                  {selSessions.length===0&&<div style={{color:T.textDim,fontSize:13,fontStyle:"italic",marginBottom:10}}>No sessions scheduled.</div>}
                  {selSessions.map(function(s){return <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bg2,borderRadius:12,padding:"10px 14px",marginBottom:8}}>
                    <div style={{fontSize:13,color:T.textMid}}>{s.time||"Time TBD"}{s.signup?<span style={{color:T.textDim}}> · {s.signup} expected</span>:null}</div>
                    <button onClick={function(){delSession(s.id);}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:15,padding:"2px 6px"}}>&#x2715;</button>
                  </div>;})}
                  <button onClick={function(){var p=calSelDay.split("/");setCalDate(p[2]+"-"+p[0]+"-"+p[1]);setCalShow(true);}} style={Object.assign({},btn(T.bg2,T.peach),{width:"100%",boxShadow:"none",marginTop:4})}>+ Add session on this day</button>
                </div>
              )}
            </div>}
            <div style={crd({padding:20,marginBottom:0})}>
              <Sec>Paste from Sign-Up Genius</Sec>
              <div style={{fontSize:12,color:T.textDim,marginBottom:10,lineHeight:1.6}}>Paste the Sign-Up Genius page text directly — dates, times, and slot counts are read automatically.</div>
              <textarea value={calAiInp} onChange={function(e){setCalAiInp(e.target.value);}} placeholder="Paste Sign-Up Genius text here..." rows={4} style={Object.assign({},ta_s,{marginBottom:10})}/>
              <button onClick={parseCalSessions} disabled={!calAiInp.trim()} style={Object.assign({},btn(),{width:"100%",opacity:!calAiInp.trim()?0.4:1})}>Import Sessions</button>
              {calAiResult&&<div style={{marginTop:10,padding:"10px 14px",background:calAiResult.startsWith("Added")?T.greenBg:T.roseBg,borderRadius:12,fontSize:13,color:calAiResult.startsWith("Added")?T.green:T.rose,fontWeight:600,textAlign:"center"}}>{calAiResult}</div>}
            </div>
            <div style={crd({padding:20})}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <Sec style={{marginBottom:0}}>Upcoming Sessions</Sec>
                <button onClick={function(){setCalShow(function(v){return !v;});}} style={Object.assign({},btn(),{padding:"8px 16px",fontSize:12})}>{calShow?"Cancel":"+ Add Session"}</button>
              </div>
              {calShow&&<div style={{background:T.bg2,borderRadius:14,padding:16,marginBottom:16}}>
                <Lbl>Date</Lbl>
                <input type="date" value={calDate} onChange={function(e){setCalDate(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:10,boxSizing:"border-box"})}/>
                <Lbl>Time (e.g. 1pm-4pm)</Lbl>
                <input type="text" placeholder="1pm-4pm" value={calTime} onChange={function(e){setCalTime(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:10,boxSizing:"border-box"})}/>
                <Lbl>Expected Signups</Lbl>
                <input type="number" placeholder="0" value={calSig} onChange={function(e){setCalSig(e.target.value);}} style={Object.assign({},inp_s,{width:"100%",marginBottom:14,boxSizing:"border-box"})}/>
                <button onClick={addSession} disabled={!calDate||!calTime.trim()} style={Object.assign({},btn(),{width:"100%",opacity:(!calDate||!calTime.trim())?0.4:1})}>Save Session</button>
              </div>}
              {upcoming.length===0&&<div style={{color:T.textDim,fontSize:14,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>No upcoming sessions. Add one above.</div>}
              {upcoming.map(function(s){return <div key={s.id} style={{background:T.bg2,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
                <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:700,color:T.peach,fontSize:15}}>{s.dow}, {s.date}</div>
                    <div style={{fontSize:13,color:T.textMid,marginTop:2}}>{s.time}{s.signup?<span style={{color:T.textDim}}> &middot; {s.signup} expected</span>:null}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <button onClick={function(){genSessionBrief(s);}} disabled={sessBriefLd&&sessBriefId===s.id} style={Object.assign({},btn2(T.teal),{fontSize:10,padding:"5px 10px"})}>{sessBriefLd&&sessBriefId===s.id?"...":"Brief"}</button>
                    <button onClick={function(){delSession(s.id);}} style={{background:"none",border:"none",cursor:"pointer",color:T.textDim,fontSize:16,padding:"4px 8px"}} title="Delete">&#x2715;</button>
                  </div>
                </div>
                {sessBrief&&sessBriefId===s.id&&<div style={{borderTop:"1px solid "+T.border,padding:"14px 16px"}}>
                  <div style={{fontSize:10,color:T.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Session Briefing</div>
                  <div style={{background:T.white,borderRadius:12,padding:14,fontSize:13,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",border:"1px solid "+T.border}}>{sessBrief}</div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button onClick={function(){try{navigator.clipboard.writeText(sessBrief);}catch(e){}}} style={Object.assign({},btn(T.teal,"#fff"),{flex:1,fontSize:11,padding:"8px 12px"})}>Copy</button>
                    <button onClick={function(){window.print();}} style={Object.assign({},btn2(T.lavender),{flex:1,fontSize:11,padding:"8px 12px"})}>Print</button>
                    <button onClick={function(){setSessBrief(null);setSessBriefId(null);}} style={Object.assign({},btn2(),{fontSize:11,padding:"8px 12px"})}>Close</button>
                  </div>
                </div>}
              </div>;})}
            </div>
            <div style={crd({padding:20,marginTop:0})}>
              <Sec>Session History</Sec>
              {past.length===0&&<div style={{color:T.textDim,fontSize:14,fontStyle:"italic",textAlign:"center",padding:"12px 0"}}>No past sessions yet.</div>}
              {past.map(function(s){
                var records=(att[s.id]||[]);
                var totalCount=records.reduce(function(a,r){return a+r.count;},0);
                var names=records.map(function(r){return r.names;}).filter(Boolean).join(", ");
                var sessHvs=hvs.filter(function(h){return h.session===s.id;});
                var totalLbs=sessHvs.reduce(function(a,h){return a+(parseFloat(h.amount)||0);},0);
                var exp=calExpanded[s.id];
                return <div key={s.id} style={{background:T.bg2,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
                  <button onClick={function(){toggleExp(s.id);}} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"14px 16px",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontWeight:700,color:T.peach,fontSize:15}}>{s.dow}, {s.date}</div>
                      <div style={{fontSize:13,color:T.textMid,marginTop:2}}>{s.time}</div>
                    </div>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      {totalCount>0&&<Pill>{totalCount} volunteers</Pill>}
                      {totalLbs>0&&<Pill bg={T.butterBg} color={T.gold}>{totalLbs.toFixed(1)} lbs</Pill>}
                      <span style={{color:T.textDim,fontSize:12}}>{exp?"▲":"▼"}</span>
                    </div>
                  </button>
                  {exp&&<div style={{borderTop:"1px solid "+T.border,padding:"12px 16px"}}>
                    {totalCount===0&&sessHvs.length===0&&<div style={{color:T.textDim,fontSize:13,fontStyle:"italic"}}>No data logged for this session.</div>}
                    {totalCount>0&&<div style={{marginBottom:10}}>
                      <div style={{fontSize:11,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Volunteers</div>
                      <div style={{fontSize:13,color:T.textMid,lineHeight:1.6}}>{names||"Count logged, no names recorded"}</div>
                    </div>}
                    {sessHvs.length>0&&<div>
                      <div style={{fontSize:11,color:T.peach,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Harvest</div>
                      {sessHvs.map(function(h){return <div key={h.id} style={{fontSize:13,color:T.textMid,marginBottom:4}}>{h.crop} — {h.amount} {h.unit} ({h.quality})</div>;})}
                    </div>}
                  </div>}
                </div>;
              })}
            </div>
          </div>;
        })()}

        {tab==="settings"&&(
          <div>
            <div style={crd({padding:20})}>
              <Sec>Claude AI Settings</Sec>
              <div style={{fontSize:13,color:T.textMid,marginBottom:16,lineHeight:1.6}}>Your API key is saved on this device and used for AI features like smart task adding, journal writing, observations, and technique cards.</div>
              <ApiKeyInput/>
            </div>
            <div style={crd({padding:20})}>
              <Sec>Cloud Sync</Sec>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:window._fbReady?T.tealBg:T.bg2,borderRadius:14,marginBottom:14}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:window._fbReady?"#7ab87a":T.textDim,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:window._fbReady?T.teal:T.textMid}}>{window._fbReady?"Connected to Firebase":"Not connected"}</div>
                  <div style={{fontSize:11,color:T.textDim,marginTop:2}}>{window._fbReady?"All changes save to the cloud automatically.":"Firebase could not be reached. Saving locally only."}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:T.textMid,marginBottom:10,lineHeight:1.5}}>On a new device, tap <b>Pull from Cloud</b> to load all your farm data from Firebase.</div>
              <SyncButton/>
            </div>
          </div>
        )}

        {tab==="about"&&(
          <div style={{padding:"0 0 40px"}}>
            <div style={{padding:"18px 20px 10px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:22}}>ℹ️</span>
              <span style={{fontSize:20,fontWeight:800,color:T.text}}>About Little Portion Farm</span>
            </div>

            <div style={crd({padding:20,marginBottom:16})}>
              <Sec>Our Farm</Sec>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:"0 0 10px"}}>Little Portion Farm is a working 10-acre farm that serves as both an agro-ecosystem and a place of ministry for the Franciscan Friars Conventual. We grow a variety of vegetables and tend to the land using sustainable, regenerative, and traditional methods.</p>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:0}}>The farm is a place of community, prayer, and learning — open to volunteers, neighbors, and friends of the mission.</p>
            </div>

            <div style={crd({padding:20,marginBottom:16})}>
              <Sec>Our Team</Sec>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:"0 0 14px"}}>Our farm depends on the generous help of volunteers — people of all backgrounds who come to work the land, learn, and serve.</p>
              <div style={{borderTop:"1px solid "+T.border,paddingTop:14,marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,color:T.teal,marginBottom:3}}>Matt Jones — Farm Manager</div>
                <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:0}}>Matt has a background in sustainable agriculture and has been stewarding Little Portion Farm for several years. He leads the farming operations and volunteer coordination.</p>
              </div>
              <div style={{borderTop:"1px solid "+T.border,paddingTop:14}}>
                <div style={{fontSize:13,fontWeight:700,color:T.teal,marginBottom:3}}>Kelly Neale — Assistant Farm Manager</div>
                <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:0}}>Kelly supports day-to-day farm work and volunteer programs.</p>
              </div>
            </div>

            <div style={crd({padding:20,marginBottom:16})}>
              <Sec>Our Partners</Sec>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,color:T.gold,marginBottom:3}}>Mary's Land Farm</div>
                <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:0}}>A neighboring Franciscan farm community that shares resources, values, and mission with Little Portion.</p>
              </div>
              <div style={{borderTop:"1px solid "+T.border,paddingTop:14}}>
                <div style={{fontSize:13,fontWeight:700,color:T.gold,marginBottom:3}}>Franciscan Center of Baltimore</div>
                <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:0}}>An urban ministry that receives some of our harvest to help feed those in need.</p>
              </div>
            </div>

            <div style={crd({padding:20,marginBottom:16})}>
              <Sec>Our Friars</Sec>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:"0 0 10px"}}>Little Portion Farm is run by the Franciscan Friars Conventual, a branch of the Franciscan family founded in the spirit of St. Francis of Assisi.</p>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:"0 0 10px"}}>The name "Little Portion" refers to the Portiuncula — the small chapel in Italy that St. Francis deeply loved and where he gathered his early community.</p>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:0}}>The friars here live out the Franciscan charism of poverty, fraternity, and care for creation, guided by the Justice, Peace, and Integrity of Creation (JPIC) Ministry.</p>
            </div>

            <div style={crd({padding:20,marginBottom:16})}>
              <Sec>Our Patron</Sec>
              <div style={{fontSize:13,fontWeight:700,color:T.peach,marginBottom:8}}>Blessed Giles of Assisi — Feast Day: April 23</div>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:"0 0 10px"}}>Blessed Giles of Assisi was one of the earliest companions of St. Francis. He joined Francis only weeks after Bernardo da Quintavalle, making him the third friar of the Order.</p>
              <p style={{fontSize:14,color:T.text,lineHeight:1.65,margin:0}}>Giles was known for his contemplative nature, his manual labor, and his deep wisdom. He spent years as a pilgrim and hermit, and was known for the simplicity and joy with which he lived.</p>
            </div>

            <div style={crd({padding:20})}>
              <Sec>Connect With Us</Sec>
              <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
                <div style={{textAlign:"center",flex:"1 1 140px",minWidth:140}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Farm Website</div>
                  <img src={"https://api.qrserver.com/v1/create-qr-code/?data="+encodeURIComponent("https://www.littleportionfarm.org")+"&size=180x180&color=3a3028&bgcolor=ffffff"} alt="Farm Website QR Code" style={{width:160,height:160,borderRadius:10,display:"block",margin:"0 auto 8px"}}/>
                  <a href="https://www.littleportionfarm.org" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:T.teal,wordBreak:"break-all",textDecoration:"underline"}}>littleportionfarm.org</a>
                </div>
                <div style={{textAlign:"center",flex:"1 1 140px",minWidth:140}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Sign Up to Volunteer</div>
                  <img src={"https://api.qrserver.com/v1/create-qr-code/?data="+encodeURIComponent("https://www.signupgenius.com/go/9040F4EAAA82EA3FF2-march#/")+"&size=180x180&color=3a3028&bgcolor=ffffff"} alt="Sign-Up Genius QR Code" style={{width:160,height:160,borderRadius:10,display:"block",margin:"0 auto 8px"}}/>
                  <a href="https://www.signupgenius.com/go/9040F4EAAA82EA3FF2-march#/" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:T.teal,wordBreak:"break-all",textDecoration:"underline"}}>signupgenius.com/go/9040F4EAAA82EA3FF2-march</a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
