import { chromium } from 'playwright-core';
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const REPO='/home/user/workshop-design-system';
const OUT=join(REPO,'assets','pptx-icons');
mkdirSync(OUT,{recursive:true});
const iconsJs = readFileSync(join(REPO,'project/js/icons.js'),'utf8');

// icons to render (name -> ink color hex)
const K='#1B1E23', BLUE='#1E5A8C', RED='#B0332E', GREEN='#3F7A44', ORANGE='#C1631A', PURPLE='#6B4E9E';
const icons=[
 ['icon-mail',K],['icon-phone',K],['icon-clock',K],['icon-user',K],['icon-users',K],
 ['icon-chart-bar',K],['icon-chart-pie',K],['icon-target',BLUE],['icon-trend-up',GREEN],['icon-trend-down',RED],
 ['icon-cpu',PURPLE],['icon-robot',PURPLE],['icon-sparkle',PURPLE],['icon-shield-check',GREEN],['icon-warning',ORANGE],
 ['icon-check',GREEN],['icon-rocket',BLUE],['icon-lightbulb',ORANGE],['icon-calendar',K],['icon-gear',K],
 ['icon-database',BLUE],['icon-globe',K],['icon-search',K],['icon-flag',ORANGE],['icon-star',ORANGE],
 ['icon-handshake',GREEN],['icon-building',K],['icon-map-pin',RED],['icon-file-text',K],['icon-lock',K],
 ['icon-key',ORANGE],['icon-trophy',GREEN],['icon-route',BLUE],['icon-layers',K],['icon-gauge',BLUE],['icon-list',K]
];

function chromiumPath(){
 for(const d of readdirSync('/opt/pw-browsers')) if(d.startsWith('chromium-')){const b=join('/opt/pw-browsers',d,'chrome-linux','chrome'); if(existsSync(b))return b;}
 return null;
}
const browser=await chromium.launch({executablePath:chromiumPath(),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:300,height:300},deviceScaleFactor:4});
await page.setContent(`<!doctype html><html><head><meta charset=utf8><style>
 html,body{margin:0;background:transparent}
 .wrap{width:240px;height:240px;display:grid;place-items:center}
 .icon{width:200px;height:200px;stroke-width:1.4}
</style></head><body><div class="wrap"><svg class="icon"><use id="u" href="#icon-mail"></use></svg></div>
<script>${iconsJs}</script></body></html>`);
await page.waitForTimeout(300);
for(const [name,color] of icons){
 await page.evaluate(([n,c])=>{
   const u=document.getElementById('u'); u.setAttribute('href','#'+n);
   const svg=document.querySelector('.icon'); svg.style.color=c;
 },[name,color]);
 await page.waitForTimeout(60);
 const el=await page.$('.wrap');
 await el.screenshot({path:join(OUT,name+'.png'),omitBackground:true});
}
await browser.close();
console.log('rendered',icons.length,'icons to',OUT);
