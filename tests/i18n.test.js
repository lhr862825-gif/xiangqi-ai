const {test}=require('node:test');
const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const {XiangqiI18n}=require('../i18n.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function setup(browser='en-US',saved,blocked=false){
    const texts=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(m=>({dataset:{i18n:m[1]},textContent:''}));
    const aria=[...html.matchAll(/data-i18n-aria="([^"]+)"/g)].map(m=>({dataset:{i18nAria:m[1]},setAttribute(k,v){this[k]=v;}}));
    const picker={value:''},storage=new Map(saved?[['xiangqi-language',saved]]:[]);
    const document={documentElement:{},getElementById:()=>picker,querySelectorAll:selector=>selector==='[data-i18n]'?texts:aria};
    const sandbox={document,navigator:{language:browser},localStorage:{getItem:k=>{if(blocked)throw Error('Unavailable');return storage.get(k);},setItem:(k,v)=>{if(blocked)throw Error('Unavailable');storage.set(k,v);}}};
    vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'../i18n.js'),'utf8')+'\nthis.i18n=new XiangqiI18n();',sandbox);
    return {i18n:sandbox.i18n,document,picker,texts,aria,storage};
}
test('Every page translation and all dictionary entries have Chinese and English text',()=>{for(const match of html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g))assert.ok(XiangqiI18n.messages[match[1]],match[1]);for(const [key,message] of Object.entries(XiangqiI18n.messages)){assert.ok(message.zh,key);assert.ok(message.en,key);}assert.match(html,/value="zh"/);assert.match(html,/value="en"/);});
test('English browser defaults to English and saved Chinese preference takes priority',()=>{const english=setup();assert.equal(english.i18n.language,'en');assert.equal(english.document.documentElement.lang,'en');assert.equal(english.picker.value,'en');for(const element of english.texts)assert.equal(element.textContent,XiangqiI18n.messages[element.dataset.i18n].en);assert.equal(english.aria[0]['aria-label'],'Xiangqi board');const chinese=setup('en-US','zh');assert.equal(chinese.i18n.language,'zh');assert.equal(chinese.document.documentElement.lang,'zh-CN');});
test('Language selection persists and storage failure remains usable',()=>{const state=setup('zh-CN');state.i18n.setLanguage('en');assert.equal(state.storage.get('xiangqi-language'),'en');assert.equal(state.i18n.t('thinkingDepth',{depth:4}),'AI is thinking · Depth 4');state.i18n.setLanguage('invalid');assert.equal(state.i18n.language,'en');const blocked=setup('en-US',null,true);assert.doesNotThrow(()=>blocked.i18n.setLanguage('zh'));assert.equal(blocked.i18n.language,'zh');});
