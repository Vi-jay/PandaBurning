import{d as e,o,c as s,t,a,F as l,b as n}from"./vendor.1441a587.js";!function(e=".",o="__import__"){try{self[o]=new Function("u","return import(u)")}catch(s){const t=new URL(e,location),a=e=>{URL.revokeObjectURL(e.src),e.remove()};self[o]=e=>new Promise(((s,l)=>{const n=new URL(e,t);if(self[o].moduleMap[n])return s(self[o].moduleMap[n]);const r=new Blob([`import * as m from '${n}';`,`${o}.moduleMap['${n}']=m;`],{type:"text/javascript"}),m=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(r),onerror(){l(new Error(`Failed to import: ${e}`)),a(m)},onload(){s(self[o].moduleMap[n]),a(m)}});document.head.appendChild(m)})),self[o].moduleMap={}}}("assets/");var r=e({expose:[],props:{msg:String},setup:e=>(a,l)=>(o(),s("h1",null,t(e.msg),1))});r.__scopeId="data-v-0bfd9733";const m=a("img",{alt:"Vue logo",src:"./assets/code.8f8c059e.jpg"},null,-1),c=a("img",{alt:"Vue logo",src:"./assets/code1.7480eac8.jpg"},null,-1);n(e({expose:[],setup:e=>(e,t)=>(o(),s(l,null,[a("div",null,[m,a(r,{msg:"Chat with this lonely man !"})]),a("div",null,[c,a(r,{msg:"Offer him a cup of milk tea !"})])],64))})).mount("#app");
