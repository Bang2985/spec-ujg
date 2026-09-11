import{c as s}from"./createLucideIcon.C8ZDLO3c.js";import{r as u}from"./index.BzlQF5oU.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]],x=s("panel-left",f);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}]],y=s("panel-right",o);function h(e,t,n){let r=new Set(t).add(void 0);return e.listen((a,c,i)=>{r.has(i)&&n(a,c,i)})}let l=(e,t)=>n=>{e.current!==n&&(e.current=n,t())};function m(e,{keys:t,deps:n=[e,t]}={}){let r=u.useRef();r.current=e.get();let a=u.useCallback(i=>(l(r,i)(e.value),t?.length>0?h(e,t,l(r,i)):e.listen(l(r,i))),n),c=()=>r.current;return u.useSyncExternalStore(a,c,c)}export{y as P,x as a,m as u};
