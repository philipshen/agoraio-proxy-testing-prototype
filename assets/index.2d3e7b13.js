var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,i=(t,n,o)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o,s=(e,t)=>{for(var n in t||(t={}))a.call(t,n)&&i(e,n,t[n]);if(o)for(var n of o(t))r.call(t,n)&&i(e,n,t[n]);return e},l=(e,o)=>t(e,n(o));import{R as c,j as d,c as u,G as g,T as f,a as h}from"./vendor.d0c867fb.js";const m={display:"flex",justifyContent:"center",alignItems:"center"},p=l(s({},m),{flexFlow:"row"}),w=l(s({},m),{flexFlow:"column"}),y=c.forwardRef(((e,t)=>{var n=e,{sx:i,children:c}=n,u=((e,t)=>{var n={};for(var i in e)a.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&o)for(var i of o(e))t.indexOf(i)<0&&r.call(e,i)&&(n[i]=e[i]);return n})(n,["sx","children"]);return d("div",l(s({},u),{css:i,ref:t}),c)}));y.displayName="Bx";const v={spacing:[0,8,16,32,64],fontSizes:[0,12,14,16,20,24,32,48,64],fontWeights:[0,100,200,400,600],lineHeights:[0,1.4],pallete:{text:{primary:"#18191B",secondary:"rgba(26, 27, 30, 0.64)",white:"#fff"},background:{primary:"#292C33",white:"#fff"},hr:"rgba(0, 0, 0, 0.08)"}};function b(){return d(g,{styles:[u`
          :root {
            --font-family: -apple-system, sans-serif;
            --font-size: 16px;
            --font-weight: 400;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: var(--font-family);
            font-size: var(--font-size);
            font-weight: var(--font-weight);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `]})}const x={v3_4_0:"3.4",v4_4_0:"4.4.0"};function S(e,t){const n=c.useContext(k);if(!n)throw new Error("hook must be used in the context of a DurableState.Provider");let o=n.get(e);return o||void 0===t||(o=t,n.set(e,o)),[o,t=>n.put(e,t),()=>n.del(e)]}function C({names:e=[],children:t}){e.forEach((e=>P(e)));const[n,o]=c.useState(0),a=e=>"com.experiencewelcome.DurableState:"+e,r=t=>{(t=>{if(P(t),!e.length)return t;if(!e.includes(t))throw new Error(`DurableState name '${t}' not found in: ${e.join(",")}. If this is a new entry, add it to the list of names passed to DurableState.Provider`)})(t);const n=t.split(".")[0];return window[n+"Storage"]},i=(e,t)=>{r(e).setItem(a(e),JSON.stringify(t))};return c.createElement(k.Provider,{value:{get:e=>{const t=r(e).getItem(a(e));if(t)return JSON.parse(t)},set:i,put:(e,t)=>{i(e,t),o((e=>++e))},del:e=>{r(e).removeItem(a(e)),o((e=>++e))}}},t)}const k=c.createContext(null);function P(e){const[t]=e.split(".");if(!["session","local"].includes(t))throw new Error(`'${e}' is missing storage type, use 'session.${e}' or 'local.${e}'`)}const T=c.createContext(),_={[x.v3_4_0]:"https://download.agora.io/sdk/release/AgoraRTCSDK-3.4.0.js",[x.v4_4_0]:"https://download.agora.io/sdk/release/AgoraRTC_N-4.4.0.js"};function E(e){const[t,n]=S("local.agora_version",x.v4_4_0),[o,a]=c.useState(!1);c.useEffect((()=>{let e=_[t];e||(e=_[x.v4_4_0]);new Promise(((t,n)=>{const o=document.createElement("script");document.body.appendChild(o),o.onload=t,o.onerror=n,o.async=!0,o.src=e})).then((()=>{console.debug("Successfully loaded Agora"),a(!0)})).catch((e=>console.error("Failed to download Agora",e)))}),[]);const r=c.useCallback((e=>{e!==t&&(n(e),window.location.reload())}),[t]);return d(T.Provider,{value:{setVersion:r,agoraVersion:t}},o?e.children:e.loadingScreen)}async function I(){return(await fetch("send-receive-test")).json()}async function O(e,t,n,o=!1){const a=AgoraRTC.createClient({mode:"rtc",codec:"vp8"});AgoraRTC.setParameter("SUBSCRIBE_TCC",!1),o&&(console.log("Starting proxy server"),a.startProxyServer(3));const r=a.join(e.appId,e.channel,n,t);if(o)return await r,a;const i=new Promise(((e,t)=>setTimeout((()=>t(new Error("Join timed out"))),7e3)));try{return await Promise.race([i,r]),console.log("Joined channel with uid "+t),a}catch(s){return console.debug("Join channel failed; retrying with proxy",s),await a.leave(),O(e,t,n,!0)}}let j,R,A,J,U,z;async function N(){null==R||R.forEach((e=>e.stop())),await Promise.all([null==j?void 0:j.leave(),null==A?void 0:A.leave()]),j=void 0,A=void 0}async function D(e,t,n=!1,o=!1){let a;o&&(a=function(){const e=window.localStorage.getItem("agora_test_metadata");if(e)return JSON.parse(e)}(),a&&console.debug("Using cached test metadata")),a||(console.debug("Fetching test metadata"),a=await I(),function(e){window.localStorage.setItem("agora_test_metadata",JSON.stringify(e))}(a));const r={channel:a.channel,appId:a.appId};try{[j,A]=await Promise.all([O(r,a.senderUid,a.senderToken,n),O(r,a.receiverUid,a.receiverToken,n)]),A.on("user-published",(async(e,n)=>{e.uid===a.senderUid?(await A.subscribe(e,n),"video"===n&&e.videoTrack.play(t)):console.error(`Unrecognized user ${e.uid} published to channel`)})),R=await AgoraRTC.createMicrophoneAndCameraTracks({},{encoderConfig:{width:480,height:270}}),await j.publish(R),R[1].play(e)}catch(i){throw N(),i}return a}async function F(e,t,n,o=!1){const a=AgoraRTC.createClient({mode:"rtc",codec:"vp8"}),r=async o=>new Promise(((r,i)=>{a.init(e.appId,(()=>{console.debug("Client initialized"),o&&(console.debug("Starting proxy server"),a.startProxyServer(3)),a.join(n,e.channel,t,void 0,(()=>{r(a),console.debug("Joined with uid "+t)}),i)}),i)})),i=new Promise(((e,t)=>{setTimeout((()=>{t(new Error("Join timed out"))}),7e3)}));try{return await Promise.race([r(o),i]),a}catch(s){return console.debug("Join channel failed; retrying with proxy",s),await new Promise(((e,t)=>a.leave(e,t))),r(!0)}}async function $(){var e,t;await Promise.all([new Promise(((e,t)=>null==J?void 0:J.leave(e,t))),new Promise(((e,t)=>null==z?void 0:z.leave(e,t)))]),null==(e=null==U?void 0:U.getAudioTrack())||e.stop(),null==(t=null==U?void 0:U.getVideoTrack())||t.stop(),null==U||U.stop(),J=void 0,z=void 0}async function B(e,t,n=!1,o=!1){let a;o&&(a=function(){const e=window.localStorage.getItem("agora_test_metadata");if(e)return JSON.parse(e)}(),a&&console.debug("Using cached test metadata")),a||(console.debug("Fetching test metadata"),a=await I(),function(e){window.localStorage.setItem("agora_test_metadata",JSON.stringify(e))}(a));const r={channel:a.channel,appId:a.appId};try{[J,z]=await Promise.all([F(r,a.senderUid,a.senderToken,n),F(r,a.receiverUid,a.receiverToken,n)]),z.on("stream-added",(({stream:e})=>{z.subscribe(e,{video:!0,audio:!0},(e=>console.error("Failed to subscribe: "+e)))})),z.on("stream-subscribed",(({stream:e})=>{e.play(t,{muted:!0})})),J.on("stream-published",(({stream:t})=>{t.play(e,{muted:!0})})),U=AgoraRTC.createStream({streamID:r.senderUid,audio:!0,video:!0}),await new Promise(((e,t)=>U.init(e,t))),J.publish(U,(e=>{console.debug("Failed to publish",e)}))}catch(i){throw $(),i}return a}const V=0,M=1,L=2;function W(){const e=c.useContext(T),[t,n]=c.useState(V),[o,a]=c.useState(),[r,i]=S("local.eagerEnableProxy",!1),[s,l]=S("local.useTestMetadataCache",!1),u="send-stream",g="recv-stream",f={backgroundColor:"black",height:270,width:480,marginLeft:20,marginRight:20,marginTop:40},h="3"===e.agoraVersion.charAt(0);return d(y,{sx:{color:"white",padding:40,width:"100%"}},d("button",{type:"submit",onClick:()=>{switch(t){case L:(async()=>{h?await $():await N(),a(null),n(V)})();break;case V:(async()=>{let e;n(M),e=h?await B(u,g,r,s):await D(u,g,r,s),n(L),a(e)})()}}},(()=>{switch(t){case L:return"Stop test";case V:return"Start test";case M:return"Starting test..."}})()),d("h3",null,"Control Panel"),Object.values(x).map((t=>d("button",{key:t,type:"submit",onClick:()=>e.setVersion(t)},t,e.agoraVersion===t?" (current)":""))),d("div",{style:{marginTop:8}},d("label",{for:"eagerEnableProxyCheckbox"},"Eagerly enable proxy"),d("input",{type:"checkbox",name:"eagerEnableProxyCheckbox",checked:r,onChange:e=>i(e.target.checked)})),d("div",{style:{marginTop:8}},d("label",{for:"eagerEnableProxyCheckbox"},"Use test metadata cache"),d("input",{type:"checkbox",name:"eagerEnableProxyCheckbox",checked:s,onChange:e=>l(e.target.checked)})),d("h3",null,"Test Metadata"),d("p",{style:{width:"60%",wordBreak:"break-all"}},JSON.stringify(o)),d("div",null,d("div",{style:{float:"left"}},d("h3",null,"Sender"),d("div",{id:u,style:f})),d("div",{style:{float:"left"}},d("h3",null,"Receiver"),d("div",{id:g,style:f}))))}function H(){return d(f,{theme:v},d(b,null),d(C,null,d(E,{loadingScreen:d(y,{sx:{color:"white"}},"Loading Agora....")},d(G,null))))}function G(){const e=["sendReceiveTest"],[t,n]=S("session.currentScreenId",e[0]);return d(y,{sx:l(s({},w),{alignItems:"stretch",width:"100vw",minHeight:"100vh"})},d(y,{sx:e=>l(s({},p),{justifyContent:"flex-start","& > *":{padding:e.spacing[1],marginLeft:e.spacing[2],color:e.pallete.text.secondary,"&[data-is-active=true]":{color:e.pallete.text.primary,fontWeight:e.fontWeights[4]}}})},d(y,{"data-is-active":"sendReceiveTest"===t,onClick:()=>(t=>{if(!e.includes(t))throw new Error(`unrecognized screen id: ${t}`);n(t)})("sendReceiveTest")},"Send/Receive Test")),d(y,{sx:e=>l(s({flex:2,background:e.pallete.background.primary},p),{alignItems:"stretch"})},{sendReceiveTest:d(W,null)}[t]))}h.render(c.createElement(c.StrictMode,null,c.createElement(H,null)),document.getElementById("root"));
