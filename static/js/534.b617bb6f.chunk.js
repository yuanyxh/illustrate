"use strict";(self.webpackChunkillustrate=self.webpackChunkillustrate||[]).push([[534,26],{148:function(e,t,n){n.d(t,{Z:function(){return l}});n(1233);var r=n(3908),a=n(2257),i=n(8255),o=n(1272),s={"extra-information":"ExtraInformation_extra-information__7IIIz",title:"ExtraInformation_title__uuJSl",wrapper:"ExtraInformation_wrapper__U6DgQ",other:"ExtraInformation_other__V71-O",platform:"ExtraInformation_platform__qc+Lo","platform-item":"ExtraInformation_platform-item__9f9b1"},c=n(7881);function l(e){var t=e.platform;return(0,c.jsx)(i.Z,{type:"primary",children:{header:function(){return(0,c.jsx)("span",{children:"\u6848\u4f8b\u76f8\u5173\u94fe\u63a5\uff1a"})},body:function(){var e,n;return(0,c.jsxs)("div",{className:s.wrapper,children:[(0,c.jsxs)("div",{className:s.foremost,children:[(0,c.jsxs)("span",{className:s.platform,children:[a.t.blog,"\uff1a"]}),(0,c.jsx)(r.rU,{to:(null===(e=t.blog)||void 0===e?void 0:e.url)||"",target:"_blank",children:(0,c.jsx)(o.Z,{type:"primary",children:null===(n=t.blog)||void 0===n?void 0:n.title})})]}),(0,c.jsxs)("div",{className:s.other,children:[(0,c.jsx)("span",{className:s.platform,children:"\u53d1\u5e03\u5e73\u53f0\uff1a"}),(0,c.jsx)("p",{className:s["platform-item"],children:Object.keys(t).map((function(e){var n;return(0,c.jsx)(r.rU,{to:(null===(n=t[e])||void 0===n?void 0:n.url)||"",target:"_blank",children:(0,c.jsx)(o.Z,{type:"primary",children:a.t[e]})},e)}))})]})]})}}})}},524:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(1233),a=n(3908),i=n(7321),o=n(1272),s=n(9838),c=n(1026),l={"screen-boundary":"ScreenBoundary_screen-boundary__ZDeGv",title:"ScreenBoundary_title__pIMfC",desc:"ScreenBoundary_desc__0lN-0",footer:"ScreenBoundary_footer__sFdXH"},u=n(7881);function d(e){var t=e.children,n=e.displayInMobile,d=void 0!==n&&n;return(0,r.useContext)(c.ScreenContext)&&!1===d?(0,u.jsx)(i.Z,{className:l["screen-boundary"],children:{header:function(){return(0,u.jsx)("h1",{className:l.title,children:"\u6e29\u99a8\u63d0\u793a"})},body:function(){return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(o.Z,{block:!0,type:"info",children:"\u6b64\u9875\u4e0d\u5efa\u8bae\u5728\u79fb\u52a8\u7aef\u6216\u5c0f\u5c4f\u8bbe\u5907\u4e0a\u6e32\u67d3"}),(0,u.jsx)("p",{className:l.desc,children:"\u57fa\u4e8e\u6280\u672f\u6216\u7528\u6237\u4f53\u9a8c\u8003\u8651\uff0c\u5f53\u524d\u9875\u9762\u6682\u4e0d\u652f\u6301\u5728\u6b64\u73af\u5883\u4e2d\u5c55\u793a\uff0c\u5efa\u8bae\u4f7f\u7528\u5927\u5c4f\u8bbe\u5907\u4f53\u9a8c\uff0c\u5982\u7535\u8111\u3001\u5e73\u677f\u7b49\u3002"}),(0,u.jsx)("footer",{className:l.footer,children:(0,u.jsx)(a.rU,{to:"/",children:(0,u.jsx)(s.Z,{type:"primary",children:"\u8fd4\u56de\u9996\u9875"})})})]})}}}):t}},8255:function(e,t,n){n.d(t,{Z:function(){return h}});var r=n(1413),a=n(9439),i=n(4925),o=n(1233),s=n(5034),c=n(6429),l={tip:"Tip_tip__LNTuj","tip-primary":"Tip_tip-primary__EAMUK","tip-success":"Tip_tip-success__feMEZ","tip-info":"Tip_tip-info__9b9z2","tip-warning":"Tip_tip-warning__+9WRn","tip-danger":"Tip_tip-danger__KHeBd","tip-title":"Tip_tip-title__3+lfq","tip-desc":"Tip_tip-desc__FIuUb","tip-close":"Tip_tip-close__9UyE6","tip-leave":"Tip_tip-leave__2BXBh",leave:"Tip_leave__YwMOn"},u=n(7881),d=["children","style","autoClose","type","showClose","className"],f=(0,c.dh)(l);function h(e){var t=e.children,n=e.style,h=e.autoClose,p=e.type,m=void 0===p?"default":p,v=e.showClose,y=void 0!==v&&v,_=e.className,x=void 0===_?"":_,g=(0,i.Z)(e,d),b=(0,o.useState)(!0),j=(0,a.Z)(b,2),k=j[0],w=j[1],N=(0,o.useState)(-1),Z=(0,a.Z)(N,2),S=Z[0],E=Z[1],C=(0,o.useRef)(null);(0,s.Yz)(k,C,{active:""},{active:l["tip-leave"]}),(0,o.useEffect)((function(){if("number"===typeof h){var e=window.setTimeout((function(){M()}),h);return E(e),function(){window.clearTimeout(e)}}}),[]);var D=f(["tip","tip-".concat(m)]),M=function(){w(!1),S&&window.clearTimeout(S)};return(0,u.jsxs)("div",(0,r.Z)((0,r.Z)({ref:C,className:(0,c.$S)(D,x),style:n},g),{},{children:[(0,u.jsx)("h2",{className:l["tip-title"],children:t.header()}),(0,u.jsx)("div",{className:l["tip-desc"],children:t.body()}),(0,c.fM)(y)&&(0,u.jsx)("button",{className:l["tip-close"],onClick:M,children:(0,u.jsx)("i",{className:"iconfont icon-guanbi"})})]}))}},1026:function(e,t,n){n.r(t),n.d(t,{ScreenContext:function(){return w},default:function(){return Z}});var r=n(9439),a=n(1233),i=n(4110),o=n(3908),s=n(1998),c=n(8245),l=n(5034),u=n(6429),d=n(6181),f=n(3985),h=n(1272),p={navbar:"Navbar_navbar__RR-7V",left:"Navbar_left__XvGnq","logo-container":"Navbar_logo-container__KAOMy",logo:"Navbar_logo__raDWX","logo-text":"Navbar_logo-text__pIOYz",menu:"Navbar_menu__Je5-1",right:"Navbar_right__5ecqi",list:"Navbar_list__1Mkvt","list-item":"Navbar_list-item__XVzFo"},m=n(7881);function v(e){var t=e.toggle,n=(0,a.useContext)(w),r=(0,d.CG)((function(e){return e.colorScheme.colorScheme})),i=(0,d.TL)();return(0,m.jsxs)("nav",{className:p.navbar,children:[(0,m.jsx)("div",{className:p.left,children:n?(0,m.jsx)("div",{className:p.menu,onClick:function(){return t(!0)},children:(0,m.jsx)("i",{className:"iconfont icon-menu"})}):(0,m.jsx)(o.rU,{style:{height:"100%"},to:"/",children:(0,m.jsxs)("h1",{className:p["logo-container"],title:"yuanyxh",children:[(0,m.jsx)("img",{className:p.logo,src:"/logo.png",alt:"logo"}),(0,m.jsx)(h.Z,{className:p["logo-text"],block:!0,size:"large",children:"yuanyxh"})]})})}),(0,m.jsx)("div",{className:p.right,children:(0,m.jsxs)("ul",{className:p.list,children:[(0,u.fM)("light"===r)&&(0,m.jsx)("li",{className:p["list-item"],title:"light",onClick:function(){return i((0,f.uW)("dark"))},children:(0,m.jsx)("i",{className:"iconfont icon-light",style:{color:"var(--color-primary)"}})}),(0,u.fM)("dark"===r)&&(0,m.jsx)("li",{className:p["list-item"],title:"dark",onClick:function(){return i((0,f.uW)("light"))},children:(0,m.jsx)("i",{className:"iconfont icon-dark",style:{color:"var(--color-info-dark-2)"}})}),(0,m.jsx)("li",{className:p["list-item"],title:"blog",children:(0,m.jsx)(o.rU,{to:"https://yuanyxh.com/",target:"_blank",children:(0,m.jsx)("i",{className:"iconfont icon-blog",style:{color:"var(--color-primary)",fontSize:"calc(var(--font-size-extra-large) * 1)"}})})}),(0,m.jsx)("li",{className:p["list-item"],title:"github",children:(0,m.jsx)(o.rU,{to:"https://github.com/yuanyxh/illustrate",target:"_blank",children:(0,m.jsx)("i",{className:"iconfont icon-github-fill",style:{color:"var(--color-info-dark-2)"}})})})]})})]})}var y={sidebar:"Sidebar_sidebar__hNbrJ","visible-side":"Sidebar_visible-side__O2-+e",link:"Sidebar_link__-q4Gx",active:"Sidebar_active__BsHgg",mask:"Sidebar_mask__0UCPB"},_=(0,u.dh)(y);function x(e){var t=e.visibleSide,n=e.toggle,r=(0,l.Qt)(),i=(0,a.useContext)(w),s=_(["link","active"]),c=_({"visible-side":t,sidebar:!0},"scroll-y");return(0,a.useEffect)((function(){i&&n(!1)}),[i]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("aside",{className:c,children:r.map((function(e,t){return(0,m.jsx)(o.OL,{to:"".concat(e.path),className:function(e){return e.isActive?s:y.link},onClick:function(){return n(!1)},children:(0,m.jsx)("span",{className:"doubleline-substring",children:e.title})},t)}))}),i&&(0,m.jsx)("div",{className:"mask ".concat(t?"visible":""),onClick:function(){return n(!1)},onScroll:function(e){return e.stopPropagation()}})]})}var g=n(9910),b="Main_main__6Seoj",j=(0,a.memo)((function(){return(0,m.jsx)("main",{className:b,children:(0,m.jsx)(a.Suspense,{fallback:(0,m.jsx)(g.Z,{style:{height:"100vh"},delay:150}),children:(0,m.jsx)(i.j3,{})})})})),k={layout:"Layout_layout__bMgkl"},w=(0,a.createContext)(!1),N=new Map;function Z(){var e=(0,a.useState)(!1),t=(0,r.Z)(e,2),n=t[0],d=t[1],f=(0,l.EV)(),h=(0,i.TH)(),p=(0,i.bS)(h.pathname),y=(0,a.useCallback)((function(e){return d((function(){return e}))}),[]);(0,a.useMemo)((function(){f?window.document.documentElement.setAttribute("screen","small"):window.document.documentElement.removeAttribute("screen")}),[f]),(0,a.useEffect)((function(){if((0,u.xb)(p))window.document.title=s.ZP.PROJECT_NAME;else if(N.has(p.pattern.path))window.document.title=N.get(p.pattern.path)||s.ZP.PROJECT_NAME;else{var e=p.pattern.path.split("/").filter((function(e){return""!==e.trim()})),t=_(g(e,c._.slice(0)));window.document.title=t,N.set(p.pattern.path,t)}return function(){window.document.title=s.ZP.PROJECT_NAME}}),[p]),(0,l.tv)();var _=function(e){return""!==e.trim()?"".concat(e," | ").concat(s.ZP.PROJECT_NAME):s.ZP.PROJECT_NAME},g=function e(t,n){var r=t.shift();if((0,u.xb)(n)||(0,u.xb)(r))return"";for(var a=0;a<n.length;a++){if(n[a].path===r||n[a].path==="/".concat(r))return 0===t.length?n[a].title||"":e(t,n=n[a].children)}for(var i=0;i<n.length;i++){var o=e([r],n[i].children);if(""!==o)return o}return""};return(0,m.jsxs)(w.Provider,{value:f,children:[(0,m.jsxs)("div",{className:k.layout,children:[(0,m.jsx)(v,{toggle:y}),(0,m.jsx)(x,{visibleSide:n,toggle:y}),(0,m.jsx)(j,{})]}),(0,m.jsx)(o.GI,{getKey:function(e){return e.pathname}})]})}},7571:function(e,t,n){n.r(t),n.d(t,{default:function(){return ge}});var r=n(4165),a=n(5861),i=n(9439),o=n(1233),s=n(7321),c=n(9838),l=n(3131),u=n(524),d=n(148),f=n(3433),h=n(4925);function p(e){var t,n,r,a=2;for("undefined"!=typeof Symbol&&(n=Symbol.asyncIterator,r=Symbol.iterator);a--;){if(n&&null!=(t=e[n]))return t.call(e);if(r&&null!=(t=e[r]))return new m(t.call(e));n="@@asyncIterator",r="@@iterator"}throw new TypeError("Object is not async iterable")}function m(e){function t(e){if(Object(e)!==e)return Promise.reject(new TypeError(e+" is not an object."));var t=e.done;return Promise.resolve(e.value).then((function(e){return{value:e,done:t}}))}return m=function(e){this.s=e,this.n=e.next},m.prototype={s:null,n:null,next:function(){return t(this.n.apply(this.s,arguments))},return:function(e){var n=this.s.return;return void 0===n?Promise.resolve({value:e,done:!0}):t(n.apply(this.s,arguments))},throw:function(e){var n=this.s.return;return void 0===n?Promise.reject(e):t(n.apply(this.s,arguments))}},new m(e)}var v=[{id:"group_1",items:[{id:"copy",type:"copy",name:"\u590d\u5236",icon:"icon-fuzhi"},{id:"cut",type:"cut",name:"\u526a\u5207",icon:"icon-jianqie"},{id:"paste",type:"paste",name:"\u7c98\u8d34",icon:"icon-niantie"}]},{id:"group_2",items:[{id:"move-to",type:"move-to",name:"\u79fb\u52a8\u5230",icon:"icon-yidongdaowenjianjia"},{id:"copy-to",type:"copy-to",name:"\u590d\u5236\u5230",icon:"icon-fuzhi1"}]},{id:"group_3",items:[{id:"remove",type:"remove",name:"\u5220\u9664",icon:"icon-shanchu"},{id:"rename",type:"rename",name:"\u91cd\u547d\u540d",icon:"icon-zhongmingming"}]},{id:"group_4",items:[{id:"create",type:"create",name:"\u65b0\u5efa\u6587\u4ef6\u5939",icon:"icon-xinjianwenjianjia"}]},{id:"group_5",items:[{id:"list",type:"list",name:"\u5217\u8868",icon:"icon-liebiao"},{id:"thumbnail",type:"thumbnail",name:"\u7f29\u7565\u56fe",icon:"icon-dasuolvetuliebiao"}]}],y=["paste","create","list","thumbnail"],_="\u65b0\u5efa\u6587\u4ef6\u5939",x="\u65b0\u5efa\u6587\u4ef6",g="icon-wenjianjia",b="icon-wenjian",j={move:{TITLE:"\u79fb\u52a8\u9879\u76ee",DESC:"\u9009\u62e9\u4f60\u8981\u5c06\u6587\u4ef6\u79fb\u52a8\u5230\u7684\u5730\u65b9\uff0c\u7136\u540e\u5355\u51fb\u79fb\u52a8\u6309\u94ae\u3002",BUTTON_TEXT:"\u79fb\u52a8"},copy:{TITLE:"\u590d\u5236\u9879\u76ee",DESC:"\u9009\u62e9\u4f60\u8981\u5c06\u6587\u4ef6\u590d\u5236\u5230\u7684\u5730\u65b9\uff0c\u7136\u540e\u5355\u51fb\u590d\u5236\u6309\u94ae\u3002",BUTTON_TEXT:"\u590d\u5236"}},k=n(6429),w=n(5671),N=n(3144),Z=function(e){var t=e.findIndex((function(e){return"create"!==e.type&&"file"===e.handle.kind})),n={type:"create",name:"directory"};return-1===t?e.push(n):e.splice(t,0,n),(0,f.Z)(e)},S=function(e){return"create"===e.type?"directory"===e.name?g:b:"directory"===e.type?g:b},E=function(e,t){if(t!==_&&t!==x)return t;var n=t,r=1;return e=e.filter((function(e){return e.name.startsWith(t)})),function a(){e.find((function(e){return e.name===t}))&&(t=n+"(".concat(++r,")"),a())}(),t},C=function(e){var t="";return 0===e.length?"/":((0,k.Ed)(e,(function(e){t+="/",t+=e})),t)},D=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a,o,s,c,l,u,d,f;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=[],a=!1,o=!1,e.prev=3,c=p(t.entries());case 5:return e.next=7,c.next();case 7:if(!(a=!(l=e.sent).done)){e.next=21;break}if(u=(0,i.Z)(l.value,2),d=u[0],"directory"!==(f=u[1]).kind){e.next=17;break}return e.t0=n,e.next=13,D(f);case 13:e.t1=e.sent,e.t0.push.call(e.t0,e.t1),e.next=18;break;case 17:n.push({name:d,type:f.kind});case 18:a=!1,e.next=5;break;case 21:e.next=27;break;case 23:e.prev=23,e.t2=e.catch(3),o=!0,s=e.t2;case 27:if(e.prev=27,e.prev=28,!a||null==c.return){e.next=32;break}return e.next=32,c.return();case 32:if(e.prev=32,!o){e.next=35;break}throw s;case 35:return e.finish(32);case 36:return e.finish(27);case 37:return e.abrupt("return",{name:t.name,type:t.kind,children:n});case 38:case"end":return e.stop()}}),e,null,[[3,23,27,37],[28,,32,36]])})));return function(t){return e.apply(this,arguments)}}(),M=function e(t,n,r){if("directory"!==t.type)return[];r+="/";var a=t.children,i=[];return(0,k.Ed)(a,(function(t){"directory"===t.type?(t.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())&&i.push(Object.assign({},t,{path:r+t.name})),i.push.apply(i,(0,f.Z)(e(t,n,r+t.name)))):t.name.toLocaleLowerCase().includes(n.toLocaleLowerCase())&&i.push(Object.assign({},t,{path:r+t.name}))})),i},L=function(e){var t=e.split("/");return t[t.length-2]},T=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(t,n){var a,i,o;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.resolve(n.handle);case 2:if(a=e.sent){e.next=5;break}return e.abrupt("return");case 5:a.pop(),i=t;case 7:if(!(o=a.shift())){e.next=13;break}return e.next=10,i.getDirectoryHandle(o);case 10:i=e.sent,e.next=7;break;case 13:return e.abrupt("return",i);case 14:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),I=function(e,t){var n=t.name;return"directory"===t.type?e.getDirectoryHandle(n,{create:!0}):e.getFileHandle(n,{create:!0})},P=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(t,n){var a,o,s,c,l,u,d,f,h,m,v,y,_,x=arguments;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=x.length>2&&void 0!==x[2]?x[2]:{discard:!1},e.next=3,I(t,n);case 3:if(o=e.sent,s=a.discard,"directory"!==n.type||"directory"!==o.kind){e.next=42;break}c=!1,l=!1,e.prev=8,d=p(n.handle.entries());case 10:return e.next=12,d.next();case 12:if(!(c=!(f=e.sent).done)){e.next=24;break}if(h=(0,i.Z)(f.value,2),m=h[0],v=h[1],!s){e.next=19;break}return e.next=17,A.call(this,o,{type:v.kind,name:m,handle:v},{discard:s});case 17:e.next=21;break;case 19:return e.next=21,A.call(this,o,{type:v.kind,name:m,handle:v});case 21:c=!1,e.next=10;break;case 24:e.next=30;break;case 26:e.prev=26,e.t0=e.catch(8),l=!0,u=e.t0;case 30:if(e.prev=30,e.prev=31,!c||null==d.return){e.next=35;break}return e.next=35,d.return();case 35:if(e.prev=35,!l){e.next=38;break}throw u;case 38:return e.finish(35);case 39:return e.finish(30);case 40:e.next=54;break;case 42:if("file"===n.handle.kind&&"file"===o.kind){e.next=44;break}return e.abrupt("return");case 44:return e.next=46,n.handle.getFile();case 46:return y=e.sent,e.next=49,o.createWritable();case 49:return _=e.sent,e.next=52,_.write(new Blob([y]));case 52:return e.next=54,_.close();case 54:case"end":return e.stop()}}),e,this,[[8,26,30,40],[31,,35,39]])})));return function(t,n){return e.apply(this,arguments)}}(),A=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(t,n){var a,i=arguments;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!1!==(a=i.length>2&&void 0!==i[2]?i[2]:{discard:!1}).discard){e.next=4;break}return e.abrupt("return",P.call(this,t,n,a));case 4:return e.next=6,P.call(this,t,n,a);case 6:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}(),B=function(){function e(t){(0,w.Z)(this,e),this.stack=void 0,this.forwardStack=void 0,this.stack=[t],this.forwardStack=[]}return(0,N.Z)(e,[{key:"push",value:function(e){return this.stack.push(e)}},{key:"pop",value:function(){return this.stack.pop()}},{key:"back",value:function(){if(1===this.stack.length)return this.stack[this.stack.length-1];var e=this.stack.pop(),t=this.forwardStack[this.forwardStack.length-1];return(0===this.forwardStack.length&&e||e&&t.isSameEntry(e))&&this.forwardStack.push(e),this.stack[this.stack.length-1]}},{key:"forward",value:function(){var e=this.forwardStack.pop();return e&&this.stack.push(e),e}}]),e}(),O=function(){function e(t){(0,w.Z)(this,e),this.state="copy",this.datatransfer=void 0,this.update=void 0,this.datatransfer=[],this.update=t}return(0,N.Z)(e,[{key:"copy",value:function(e){this.state="copy",this.datatransfer=e,this.update(e)}},{key:"cut",value:function(e){this.state="cut",this.datatransfer=e,this.update(e)}},{key:"paste",value:function(){var e=this.datatransfer;return this.datatransfer=[],this.update([]),e}}]),e}(),z=n(1272),H={header:"Header_header__HRJXU","header-item-group":"Header_header-item-group__r5nsq","header-item":"Header_header-item__XvpQA","is-select":"Header_is-select__-7EtE","is-disabled":"Header_is-disabled__+mDI1",icon:"Header_icon__cWGJP"},U=n(7881),F=(0,k.dh)(H);function R(e){var t=e.nodeClick,n=e.select,r=e.display,a=(0,o.useContext)(ye).clipboard,i=F(["icon"]," iconfont"),s=function(e){var t=H["is-disabled"];return y.includes(e.type)||0!==n.length?"rename"===e.type&&n.length>1||"paste"===e.type&&0===(null===a||void 0===a?void 0:a.datatransfer.length)?t:"":t},c=function(e){return e.type===r?H["is-select"]:""};return(0,U.jsx)("header",{className:H.header,children:v.map((function(e){return(0,U.jsx)("div",{className:H["header-item-group"],children:e.items.map((function(e){return(0,U.jsxs)("div",{className:(0,k.$S)(H["header-item"],c(e),s(e)),onClick:function(){t(e.type)},children:[(0,U.jsx)("i",{className:(0,k.$S)(i,e.icon)}),(0,U.jsx)("span",{style:{marginTop:5},children:e.name})]},e.id)}))},e.id)}))})}var q=n(5034),X=n(7474),Y={"new-handle":"NewHandle_new-handle__r1Bkp"};function J(e){var t=e.item,n=e.currentDirectory,i=e.directoryList,s=e.setDirectoryList,c=e.setSelect,l=(0,q.tT)(""),u=l.value,d=l.change;(0,o.useEffect)((function(){var e=i.find((function(e){return"create"===e.type}));e&&(d(E(i,"directory"===e.name?_:x)),c([]))}),[i]);var h="directory"===t.name,p=u,m=function(){if(n){p.trim()||(p=h?_:x),p=E(i,p);var e=i.findIndex((function(e){return t===e})),o=i.find((function(t,n){return n!==e&&t.name===p}));o||((0,a.Z)((0,r.Z)().mark((function t(){var a;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n[h?"getDirectoryHandle":"getFileHandle"](p,{create:!0});case 2:a=t.sent,i[e]={name:p,type:h?"directory":"file",handle:a},s((0,f.Z)(i));case 5:case"end":return t.stop()}}),t)})))(),d(""))}};return(0,U.jsxs)("div",{className:Y["new-handle"],onMouseDown:function(e){return e.stopPropagation()},children:[(0,U.jsx)("i",{className:(0,k.$S)("iconfont",S(t))}),(0,U.jsx)("div",{className:Y["item-name"],children:(0,U.jsx)(X.Z,{value:u,change:function(e){var t;t=e,!(0,k.yz)(/[\\\\/:*?\\"<>|]/)(t)&&d(e)},autofocus:!0,selectInFocus:!0,size:"small",blur:function(){return m()},enter:function(){return m()}})})]})}var $={item:"Item_item__QGHcA","is-select":"Item_is-select__2+VlG","is-cut":"Item_is-cut__1Qqtg","item-list":"Item_item-list__34vh3","item-name":"Item_item-name__QQerl","item-thumbnail":"Item_item-thumbnail__t5ER2","item-confirm":"Item_item-confirm__7bHV5"},W=(0,k.dh)($),G=$;function Q(e){var t=e.item,n=e.isSelect,r=e.isCut,a=e.display,i=e.setSelect,o=e.onEnter,s=W(["item","item-".concat(a)]),c=W({"is-select":n,"is-cut":r});return(0,U.jsxs)("div",{className:(0,k.$S)(s,c),title:t.name,"data-display":a,"data-name":t.name,onClick:function(e){e.stopPropagation(),function(e,t){i(t?function(t){return t.includes(e)?t:[].concat((0,f.Z)(t),[e])}:[e])}(t,e.ctrlKey)},onDoubleClick:function(e){e.stopPropagation(),o(t)},onMouseDown:function(e){return e.stopPropagation()},children:[(0,U.jsx)("i",{className:(0,k.$S)("iconfont",S(t))}),(0,U.jsx)(z.Z,{className:$["item-name"],truncated:!0,children:t.name})]})}var K="Body_body-content__Donz6",V="Body_file-clipboard__Z6HNO",ee="Body_frame__+YgSv",te="Body_empty__jjNQ6",ne=(0,o.forwardRef)((function(e,t){var n=e.root,r=e.currentDirectory,a=e.setCurrentDirectroy,i=e.directoryList,s=e.setDirectoryList,c=e.select,l=e.setSelect,u=e.display,d=void 0===u?"list":u,f=e.onClipboard,h=(0,o.useContext)(ye),p=h.history,m=h.clipboard,v=(0,o.useRef)(null);(0,o.useEffect)((function(){var e;null===(e=window.document.querySelector("."+V))||void 0===e||e.focus()}),[c,n,r,i,d]);var y=(0,k.wD)(v),_=[],x=!1,g=0,b=0,j=0,w=0,N=function(){if(x){x=!1;var e=i.filter((function(e){return _.find((function(t){return t===e.name}))}));_=[],l(e),y.hide(),y.css("width",0),y.css("height",0),g=0,b=0,j=0,w=0}},Z=function(e){"directory"===e.type&&(a(e.handle),null===p||void 0===p||p.push(e.handle))};return(0,U.jsx)(U.Fragment,{children:(0,U.jsxs)("div",{className:K,onMouseDown:function(e){x=!0;var t=e.target.scrollTop;g=e.nativeEvent.offsetX,b=t+e.nativeEvent.offsetY,y.show()},onMouseUp:function(){return N()},onMouseLeave:function(){return N()},onMouseMove:function(e){var t;if(x&&v.current){j=(0===j?g:j)+e.movementX,w=(0===w?b:w)+e.movementY;var n=Math.min(g,j),r=Math.min(b,w),a=Math.max(g,j),i=Math.max(b,w);y.css("left",n+"px"),y.css("top",r+"px"),y.css("width",Math.abs(g-j)+"px"),y.css("height",Math.abs(b-w)+"px");var o=null===(t=v.current.parentElement)||void 0===t?void 0:t.children;if(o)for(var s=function(){var e=o[c];if(e.classList.contains(ee))return"continue";var t=e.getAttribute("data-name")||"",s=new k.Ae(a-n,i-r,n+(a-n)/2,r+(i-r)/2);k.Ae.from(e).intersectRectangle(s)?(_.includes(t)||_.push(t),e.classList.add(G["is-select"])):(_=_.filter((function(e){return e!==t})),e.classList.remove(G["is-select"]))},c=0;c<o.length;c++)s()}},children:[i.map((function(e){return"create"===e.type?(0,U.jsx)(J,{item:e,currentDirectory:r,directoryList:i,setDirectoryList:s,select:c,setSelect:l},e.name):(0,U.jsx)(Q,{item:e,select:c,display:d,isSelect:c.includes(e),isCut:(null===m||void 0===m?void 0:m.datatransfer.includes(e))||!1,setSelect:l,onEnter:Z},e.name)})),(0,k.fM)(0===i.length)&&(0,U.jsxs)("div",{className:te,children:[(0,U.jsx)("i",{className:"iconfont icon-kongbaiye",style:{fontSize:60}}),(0,U.jsx)(z.Z,{type:"info",children:"\u6b64\u6587\u4ef6\u5939\u4e3a\u7a7a"})]}),(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)("div",{ref:v,className:ee}),(0,U.jsx)("input",{ref:t,type:"text",className:V,onCopy:function(){return f("copy")},onCut:function(){return f("cut")},onPaste:function(){return f("paste")}})]})]})})})),re=n(1413),ae={location:"Location_location__PcU9w","location-history":"Location_location-history__aQW7Y","location-history-back":"Location_location-history-back__P9kLU","location-history-forward":"Location_location-history-forward__74APU","is-disabled":"Location_is-disabled__jzBDw","location-path":"Location_location-path__sD2Y6","location-search":"Location_location-search__8LdXD","search-result-list":"Location_search-result-list__nOYgF","search-result-item":"Location_search-result-item__UvO92","search-result-text":"Location_search-result-text__241dH","search-result-where":"Location_search-result-where__Lselj"},ie=(0,k.dh)(ae);function oe(e){var t=e.root,n=e.directoryList,s=e.currentDirectory,c=e.setCurrentDirectroy,l=(0,o.useContext)(ye).history,u=(0,q.tT)("/"),d=(0,q.tT)(""),f=(0,o.useState)(!1),h=(0,i.Z)(f,2),p=h[0],m=h[1],v=(0,o.useState)(!1),y=(0,i.Z)(v,2),_=y[0],x=y[1],g=(0,o.useState)(null),b=(0,i.Z)(g,2),j=b[0],w=b[1],N=(0,o.useState)([]),Z=(0,i.Z)(N,2),S=Z[0],E=Z[1];(0,o.useEffect)((function(){m(t===s);var e=n.filter((function(e){return"create"!==e.type&&"directory"===e.type}));null!==l&&void 0!==l&&l.forwardStack.length&&x(!1),n.length&&0!==(null===l||void 0===l?void 0:l.forwardStack.length)&&0!==e.length||x(!0)}),[u.value,n]),(0,o.useEffect)((function(){t&&s&&(0,a.Z)((0,r.Z)().mark((function e(){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.resolve(s);case 2:(n=e.sent)&&u.change(C(n));case 4:case"end":return e.stop()}}),e)})))()}),[s]),(0,o.useEffect)((function(){t&&s&&(0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=w,e.next=3,D(s);case 3:e.t1=e.sent,(0,e.t0)(e.t1);case 5:case"end":return e.stop()}}),e)})))()}),[s]),(0,o.useEffect)((function(){if(!j||!d.value)return E([]);E(M(j,d.value,""))}),[d.value]);var T=ie({"is-disabled":p}),I=ie({"is-disabled":_});return(0,U.jsxs)("div",{className:ae.location,children:[(0,U.jsxs)("div",{className:ae["location-history"],children:[(0,U.jsx)("button",{className:(0,k.$S)(ae["location-history-back"],T),onClick:function(){return function(){var e=null===l||void 0===l?void 0:l.back();e&&c(e)}()},children:(0,U.jsx)("i",{className:"iconfont icon-a-zuojiantouzhixiangzuojiantou"})}),(0,U.jsx)("button",{className:(0,k.$S)(ae["location-history-forward"],I),onClick:function(){return function(){var e=null===l||void 0===l?void 0:l.forward();e&&c(e)}()},children:(0,U.jsx)("i",{className:"iconfont icon-a-youjiantouzhixiangyoujiantou"})})]}),(0,U.jsx)("div",{className:ae["location-path"],children:(0,U.jsx)(X.Z,(0,re.Z)((0,re.Z)({},u),{},{disabled:!0,children:{prefix:function(){return(0,U.jsx)("i",{className:"iconfont icon-24gf-folderOpen"})}}}))}),(0,U.jsxs)("div",{className:ae["location-search"],children:[(0,U.jsx)(X.Z,(0,re.Z)((0,re.Z)({},d),{},{placeholder:"\u5728 ".concat(null===s||void 0===s?void 0:s.name," \u4e2d\u641c\u7d22"),focus:function(){return j&&d.value&&E(M(j,d.value,""))},blur:function(){return E([])},children:{prefix:function(){return(0,U.jsx)("i",{className:"iconfont icon-sousuo"})}}})),(0,k.fM)(S.length)&&(0,U.jsx)("ul",{className:ae["search-result-list"],children:S.map((function(e){return(0,U.jsxs)("li",{className:ae["search-result-item"],children:[(0,U.jsx)("span",{title:e.name,className:ae["search-result-text"],children:e.name}),(0,U.jsx)("span",{title:e.path,className:ae["search-result-where"],children:L(e.path)})]},e.path)}))})]})]})}var se=n(456),ce=n(7004),le={overlay:"Dialog_overlay__p44Bj","overlay-enter-active":"Dialog_overlay-enter-active__TzjyW","overlay-fade-in":"Dialog_overlay-fade-in__I8r5D","overlay-leave-active":"Dialog_overlay-leave-active__e1q17","overlay-fade-out":"Dialog_overlay-fade-out__JmGhX","dialog-overlay":"Dialog_dialog-overlay__0LnjD","dialog-overlay-enter-active":"Dialog_dialog-overlay-enter-active__GsZem","dialog-overlay-fade-in":"Dialog_dialog-overlay-fade-in__Pnjrr","dialog-overlay-leave-active":"Dialog_dialog-overlay-leave-active__9xjqm","dialog-overlay-fade-out":"Dialog_dialog-overlay-fade-out__LR1D1",dialog:"Dialog_dialog__PnMlh","dialog-header":"Dialog_dialog-header__OQk+I","dialog-header-title":"Dialog_dialog-header-title__eI0qR","dialog-header-close":"Dialog_dialog-header-close__ZhrYu","dialog-header-icon":"Dialog_dialog-header-icon__MaKYO","dialog-body":"Dialog_dialog-body__MR4US","dialog-footer":"Dialog_dialog-footer__u0Z2U"},ue=["show","change","onClose","children","title","modal","showClose","closeOnClickModal","className","style"];function de(e){return!!e&&"function"===typeof e.body}function fe(e){var t=e.show,n=e.change,r=e.onClose,a=e.children,i=e.title,s=void 0===i?"":i,c=e.modal,l=e.showClose,u=void 0===l||l,d=e.closeOnClickModal,f=void 0===d||d,p=e.className,m=void 0===p?"":p,v=e.style,y=(0,h.Z)(e,ue),_=(0,o.useRef)(null),x=(0,o.useRef)(null);(0,q.Yz)(t,_,(0,k.qH)(le["overlay-enter-active"]),(0,k.qH)(le["overlay-leave-active"])),(0,q.Yz)(t,x,(0,k.qH)(le["dialog-overlay-enter-active"]),(0,k.qH)(le["dialog-overlay-leave-active"]));var g=(0,k.Dx)((function(){f&&(n(!1),r&&r())})),b=g.onMouseDown,j=g.onMouseUp,w=g.onClick;return(0,se.createPortal)((0,U.jsx)(ce.Z,{ref:_,className:le.overlay,mask:c,children:(0,U.jsx)("div",{ref:x,role:"dialog","aria-modal":!0,"aria-label":s,className:(0,k.$S)(le["dialog-overlay"]),onMouseDown:b,onMouseUp:j,onClick:w,children:(0,U.jsxs)("div",(0,re.Z)((0,re.Z)({className:(0,k.$S)(le.dialog,m),style:v},y),{},{children:[(0,U.jsxs)("header",{className:le["dialog-header"],children:[de(a)&&a.header?a.header():(0,U.jsx)("span",{className:le["dialog-header-title"],children:s}),(0,k.fM)(u)&&(0,U.jsx)("button",{className:le["dialog-header-close"],"aria-label":"close",type:"button",onClick:function(){n(!1),r&&r()},children:(0,U.jsx)("i",{className:(0,k.$S)("iconfont icon-guanbi",le["dialog-header-icon"])})})]}),(0,U.jsx)("section",{className:le["dialog-body"],children:de(a)?a.body():a}),(0,U.jsx)("footer",{className:le["dialog-footer"],children:de(a)&&a.footer?a.footer():""})]}))})}),window.document.body)}var he={catalog:"Catalog_catalog__OwHWE","directory-select":"Catalog_directory-select__A7LML",operate:"Catalog_operate__I2IO2",resolve:"Catalog_resolve__jYW+t"};function pe(e){var t=e.show,n=e.change,r=e.config;return(0,U.jsx)(fe,{className:he.catalog,modal:!1,closeOnClickModal:!1,show:t,change:n,title:r.TITLE,children:{body:function(){return(0,U.jsxs)("div",{children:[(0,U.jsx)("div",{className:he.desc,children:(0,U.jsx)(z.Z,{type:"info",children:r.DESC})}),(0,U.jsx)("div",{className:he["directory-select"]})]})},footer:function(){return(0,U.jsxs)("div",{className:he.operate,children:[(0,U.jsx)(c.Z,{className:he["create-dierctory"],children:"\u65b0\u5efa\u6587\u4ef6\u5939"}),(0,U.jsxs)("div",{className:he.resolve,children:[(0,U.jsx)(c.Z,{type:"primary",children:r.BUTTON_TEXT}),(0,U.jsx)(c.Z,{children:"\u53d6\u6d88"})]})]})}}})}var me={"file-system-controller":"FileSystemController_file-system-controller__JzJeO","file-system-controller-body":"FileSystemController_file-system-controller-body__8o36I",locked:"FileSystemController_locked__C-qcf"},ve=["root","canCrateRootDirectory"],ye=(0,o.createContext)({history:null,clipboard:null});function _e(e){var t=e.root,n=e.canCrateRootDirectory,c=void 0!==n&&n,l=(0,h.Z)(e,ve),u=(0,o.useState)(t),d=(0,i.Z)(u,2),m=d[0],v=d[1],y=(0,o.useState)([]),_=(0,i.Z)(y,2),x=_[0],g=_[1],b=(0,o.useState)([]),w=(0,i.Z)(b,2),N=w[0],S=w[1],E=(0,o.useState)([]),C=(0,i.Z)(E,2),D=C[0],M=C[1],L=(0,o.useState)("list"),I=(0,i.Z)(L,2),P=I[0],H=I[1],F=(0,o.useState)(!1),q=(0,i.Z)(F,2),X=q[0],Y=q[1],J=(0,o.useState)(j.copy),$=(0,i.Z)(J,2),W=$[0],G=$[1],Q=(0,o.useRef)(null),K=(0,o.useMemo)((function(){return t&&new B(t)}),[t]),V=(0,o.useMemo)((function(){return new O(M)}),[]);(0,o.useEffect)((function(){t||(v(null),g([]),S([]),H("list"),Y(!1),V.paste()),v(t)}),[t]),(0,o.useEffect)((function(){m&&(S([]),(0,a.Z)((0,r.Z)().mark((function e(){var t,n,a,o,s,c,l,u,d,f,h;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=m.entries(),n=[],a=[],o=!1,s=!1,e.prev=5,l=p(t);case 7:return e.next=9,l.next();case 9:if(!(o=!(u=e.sent).done)){e.next=15;break}d=(0,i.Z)(u.value,2),f=d[0],"directory"===(h=d[1]).kind?n.push({type:"directory",name:f,handle:h}):"file"===h.kind&&a.push({type:"file",name:f,handle:h});case 12:o=!1,e.next=7;break;case 15:e.next=21;break;case 17:e.prev=17,e.t0=e.catch(5),s=!0,c=e.t0;case 21:if(e.prev=21,e.prev=22,!o||null==l.return){e.next=26;break}return e.next=26,l.return();case 26:if(e.prev=26,!s){e.next=29;break}throw c;case 29:return e.finish(26);case 30:return e.finish(21);case 31:g([].concat(n,a));case 32:case"end":return e.stop()}}),e,null,[[5,17,21,31],[22,,26,30]])})))())}),[m,D]);var ee=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(){var t,n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(m){e.next=2;break}return e.abrupt("return");case 2:if(!(t=N.shift())){e.next=12;break}if(n=t.name,!((a=x.findIndex((function(e){return e===t})))<0)){e.next=7;break}return e.abrupt("return");case 7:return e.next=9,m.removeEntry(n,{recursive:!0});case 9:x.splice(a,1),e.next=2;break;case 12:S([]),g((0,f.Z)(x));case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),te=function(e){"copy"===e&&V.copy(N),"cut"===e&&V.cut(N),"paste"===e&&re()},re=function(){if(t&&m){var e=0,n=V.datatransfer,i=V.state,o=function(){0===--e&&V.paste()};(0,k.Ed)(n,function(){var n=(0,a.Z)((0,r.Z)().mark((function n(a){var s;return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if("copy"!==i){n.next=5;break}e++,A.call(t,m,a).finally(o),n.next=10;break;case 5:return e++,n.next=8,T(t,a);case 8:(s=n.sent)&&A.call(s,m,a,{discard:!0}).finally((function(){o(),s.removeEntry(a.name,{recursive:!0})}));case 10:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}},ae=function(e){switch(e){case"copy":V.copy(N);break;case"cut":V.cut(N);break;case"create":g(Z(x));break;case"paste":re();break;case"move-to":Y(!0),G(j.move);break;case"copy-to":Y(!0),G(j.copy);break;case"remove":ee();break;case"list":case"thumbnail":H(e)}};return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(ye.Provider,{value:{history:K,clipboard:V},children:(0,U.jsx)(s.Z,{bodyStyle:{padding:0,paddingBottom:15},className:(0,k.$S)(me["file-system-controller"],l.className||""),style:Object.assign({position:"relative",userSelect:"none"},l.style||{}),onClick:function(){var e;return null===(e=Q.current)||void 0===e?void 0:e.focus()},children:{header:function(){return(0,U.jsx)(R,{nodeClick:ae,select:N,display:P})},body:function(){return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsxs)("section",{className:me["file-system-controller-body"],children:[(0,U.jsx)(oe,{root:t,directoryList:x,currentDirectory:m,setCurrentDirectroy:v}),(0,U.jsx)(ne,{ref:Q,root:t,currentDirectory:m,setCurrentDirectroy:v,directoryList:x,setDirectoryList:g,select:N,setSelect:S,display:P,onClipboard:te})]}),(0,k.fM)(!c&&!t)&&(0,U.jsxs)("div",{className:me.locked,children:[(0,U.jsx)("i",{className:"iconfont icon-lock",style:{fontSize:60,marginBottom:8}}),(0,U.jsx)(z.Z,{type:"info",children:"\u8bf7\u5148\u9009\u62e9\u672c\u5730\u6587\u4ef6"})]})]})}}})}),(0,U.jsx)(pe,{show:X,change:Y,config:W})]})}var xe={"file-system-access":"FileSystemAccess_file-system-access__DmkzF"};function ge(){var e=(0,o.useState)(null),t=(0,i.Z)(e,2),n=t[0],f=t[1];return(0,U.jsx)(u.Z,{children:(0,U.jsxs)("div",{className:xe["file-system-access"],children:[(0,U.jsx)(d.Z,{platform:{blog:{title:"\u5229\u7528 FileSystem API \u5b9e\u73b0\u4e00\u4e2a web \u7aef\u7684\u6b8b\u7f3a\u7248\u6587\u4ef6\u7ba1\u7406\u5668",url:"https://yuanyxh.com/posts/produce/%E5%88%A9%E7%94%A8%20FileSystem%20API%20%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%20web%20%E7%AB%AF%E7%9A%84%E6%AE%8B%E7%BC%BA%E7%89%88%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%99%A8.html"},juejin:{url:"https://juejin.cn/post/7269013062676512808"},zhihu:{url:"https://zhuanlan.zhihu.com/p/651144415"},csdn:{url:"https://blog.csdn.net/yuanfgbb/article/details/132398476?spm=1001.2014.3001.5502"}}}),(0,U.jsxs)(s.Z,{shadow:"never",children:[(0,U.jsx)(c.Z,{className:"openDirectory",type:"primary",onClick:function(){(0,a.Z)((0,r.Z)().mark((function e(){var t;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("function"!==typeof window.showDirectoryPicker){e.next=7;break}return e.next=3,window.showDirectoryPicker({mode:"readwrite"});case 3:t=e.sent,f(t),e.next=8;break;case 7:l.Z.alert({type:"warning",title:"\u83b7\u53d6\u76ee\u5f55\u5931\u8d25",message:"\u5f53\u524d\u6d4f\u89c8\u5668\u6682\u4e0d\u652f\u6301 window.showDirectoryPicker \u65b9\u6cd5\uff0c\u8bf7\u4f7f\u7528\u6700\u65b0\u6d4f\u89c8\u5668\u6216\u524d\u5f80 MDN \u67e5\u770b\u6d4f\u89c8\u5668\u652f\u6301\u6027\u3002"});case 8:case"end":return e.stop()}}),e)})))()},children:"\u6253\u5f00\u65b0\u6587\u4ef6\u5939"}),(0,U.jsx)(c.Z,{style:{marginLeft:10},onClick:function(){return f(null)},children:"\u5173\u95ed\u5f53\u524d\u6587\u4ef6\u5939"}),(0,U.jsx)(_e,{root:n,style:{marginTop:30}})]})]})})}}}]);
//# sourceMappingURL=534.b617bb6f.chunk.js.map