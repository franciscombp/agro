import{c as Ko,b as Aa,p as Ra,S as Zo,i as Ti,t as gr}from"./index-Bf1nzSCu.js";/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Qr="160",Un={ROTATE:0,DOLLY:1,PAN:2},Dn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ao=1,so=2,Yt=3,hn=0,ut=1,Ca=2,Sn=100,$r=204,ea=205,oo=0,Jo=1,Qo=2,un=0,$o=1,el=2,tl=3,nl=4,il=5,rl=6,lo=300,Qn=301,$n=302,ta=303,na=304,ar=306,ia=1e3,qt=1001,ra=1002,at=1003,La=1004,_r=1005,Ut=1006,al=1007,$i=1008,En=1009,ca=1012,co=1013,ln=1014,cn=1015,vi=1016,uo=1017,ho=1018,yn=1020,Ot=1023,Tn=1026,ei=1027,po=1029,fo=1031,mo=1033,vr=33776,xr=33777,Mr=33778,Sr=33779,Pa=35840,Ua=35841,Da=35842,Ia=35843,go=36196,Na=37492,Oa=37496,Fa=37808,Ba=37809,za=37810,Ha=37811,Ga=37812,Va=37813,ka=37814,Wa=37815,Xa=37816,ja=37817,Ya=37818,qa=37819,Ka=37820,Za=37821,Er=36492,Ja=36494,Qa=36495,$a=36284,es=36285,ts=36286,_o=3e3,bn=3001,Ft="",Qe="srgb",Kt="srgb-linear",ua="display-p3",sr="display-p3-linear",er="linear",Be="srgb",tr="rec709",nr="p3",In=7680,ns=35044,is="300 es",aa=1035,ti=2e3,ir=2001;class Rn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const n=this._listeners[e];if(n!==void 0){const i=n.indexOf(t);i!==-1&&n.splice(i,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const t=this._listeners[e.type];if(t!==void 0){e.target=this;const n=t.slice(0);for(let i=0,a=n.length;i<a;i++)n[i].call(this,e);e.target=null}}}const tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ji=Math.PI/180,sa=180/Math.PI;function xi(){const r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(tt[255&r]+tt[r>>8&255]+tt[r>>16&255]+tt[r>>24&255]+"-"+tt[255&e]+tt[e>>8&255]+"-"+tt[e>>16&15|64]+tt[e>>24&255]+"-"+tt[63&t|128]+tt[t>>8&255]+"-"+tt[t>>16&255]+tt[t>>24&255]+tt[255&n]+tt[n>>8&255]+tt[n>>16&255]+tt[n>>24&255]).toLowerCase()}function st(r,e,t){return Math.max(e,Math.min(t,r))}function sl(r,e){return(r%e+e)%e}function yr(r,e,t){return(1-t)*r+t*e}function rs(r){return(r&r-1)==0&&r!==0}function oa(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function ci(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ct(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}const ol={DEG2RAD:Ji};class _e{constructor(e=0,t=0){_e.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),a=this.x-e.x,s=this.y-e.y;return this.x=a*n-s*i+e.x,this.y=a*i+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Le{constructor(e,t,n,i,a,s,l,c,o){Le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,a,s,l,c,o)}set(e,t,n,i,a,s,l,c,o){const u=this.elements;return u[0]=e,u[1]=i,u[2]=l,u[3]=t,u[4]=a,u[5]=c,u[6]=n,u[7]=s,u[8]=o,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,a=this.elements,s=n[0],l=n[3],c=n[6],o=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],v=i[0],p=i[3],M=i[6],m=i[1],_=i[4],C=i[7],L=i[2],w=i[5],b=i[8];return a[0]=s*v+l*m+c*L,a[3]=s*p+l*_+c*w,a[6]=s*M+l*C+c*b,a[1]=o*v+u*m+d*L,a[4]=o*p+u*_+d*w,a[7]=o*M+u*C+d*b,a[2]=h*v+f*m+g*L,a[5]=h*p+f*_+g*w,a[8]=h*M+f*C+g*b,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],a=e[3],s=e[4],l=e[5],c=e[6],o=e[7],u=e[8];return t*s*u-t*l*o-n*a*u+n*l*c+i*a*o-i*s*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],a=e[3],s=e[4],l=e[5],c=e[6],o=e[7],u=e[8],d=u*s-l*o,h=l*c-u*a,f=o*a-s*c,g=t*d+n*h+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=d*v,e[1]=(i*o-u*n)*v,e[2]=(l*n-i*s)*v,e[3]=h*v,e[4]=(u*t-i*c)*v,e[5]=(i*a-l*t)*v,e[6]=f*v,e[7]=(n*c-o*t)*v,e[8]=(s*t-n*a)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,a,s,l){const c=Math.cos(a),o=Math.sin(a);return this.set(n*c,n*o,-n*(c*s+o*l)+s+e,-i*o,i*c,-i*(-o*s+c*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply(Tr.makeScale(e,t)),this}rotate(e){return this.premultiply(Tr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Tr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Tr=new Le;function vo(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function rr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function ll(){const r=rr("canvas");return r.style.display="block",r}const as={};function _i(r){r in as||(as[r]=!0,console.warn(r))}const ss=new Le().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),os=new Le().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),bi={[Kt]:{transfer:er,primaries:tr,toReference:r=>r,fromReference:r=>r},[Qe]:{transfer:Be,primaries:tr,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[sr]:{transfer:er,primaries:nr,toReference:r=>r.applyMatrix3(os),fromReference:r=>r.applyMatrix3(ss)},[ua]:{transfer:Be,primaries:nr,toReference:r=>r.convertSRGBToLinear().applyMatrix3(os),fromReference:r=>r.applyMatrix3(ss).convertLinearToSRGB()}},cl=new Set([Kt,sr]),Fe={enabled:!0,_workingColorSpace:Kt,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!cl.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const n=bi[e].toReference;return(0,bi[t].fromReference)(n(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return bi[r].primaries},getTransfer:function(r){return r===Ft?er:bi[r].transfer}};function Jn(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function br(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}let Nn;class xo{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Nn===void 0&&(Nn=rr("canvas")),Nn.width=e.width,Nn.height=e.height;const n=Nn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Nn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),a=i.data;for(let s=0;s<a.length;s++)a[s]=255*Jn(a[s]/255);return n.putImageData(i,0,0),t}if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(255*Jn(t[n]/255)):t[n]=Jn(t[n]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ul=0;class Mo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ul++}),this.uuid=xi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let a;if(Array.isArray(i)){a=[];for(let s=0,l=i.length;s<l;s++)i[s].isDataTexture?a.push(wr(i[s].image)):a.push(wr(i[s]))}else a=wr(i);n.url=a}return t||(e.images[this.uuid]=n),n}}function wr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?xo.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let hl=0;class mt extends Rn{constructor(e=mt.DEFAULT_IMAGE,t=mt.DEFAULT_MAPPING,n=1001,i=1001,a=1006,s=1008,l=1023,c=1009,o=mt.DEFAULT_ANISOTROPY,u=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hl++}),this.uuid=xi(),this.name="",this.source=new Mo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=a,this.minFilter=s,this.anisotropy=o,this.format=l,this.internalFormat=null,this.type=c,this.offset=new _e(0,0),this.repeat=new _e(1,1),this.center=new _e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(_i("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===bn?Qe:Ft),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==lo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ia:e.x=e.x-Math.floor(e.x);break;case qt:e.x=e.x<0?0:1;break;case ra:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case ia:e.y=e.y-Math.floor(e.y);break;case qt:e.y=e.y<0?0:1;break;case ra:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return _i("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Qe?bn:_o}set encoding(e){_i("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===bn?Qe:Ft}}mt.DEFAULT_IMAGE=null,mt.DEFAULT_MAPPING=lo,mt.DEFAULT_ANISOTROPY=1;class Ve{constructor(e=0,t=0,n=0,i=1){Ve.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,a=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i+s[12]*a,this.y=s[1]*t+s[5]*n+s[9]*i+s[13]*a,this.z=s[2]*t+s[6]*n+s[10]*i+s[14]*a,this.w=s[3]*t+s[7]*n+s[11]*i+s[15]*a,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,a;const c=e.elements,o=c[0],u=c[4],d=c[8],h=c[1],f=c[5],g=c[9],v=c[2],p=c[6],M=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+v)<.1&&Math.abs(g+p)<.1&&Math.abs(o+f+M-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(o+1)/2,C=(f+1)/2,L=(M+1)/2,w=(u+h)/4,b=(d+v)/4,I=(g+p)/4;return _>C&&_>L?_<.01?(n=0,i=.707106781,a=.707106781):(n=Math.sqrt(_),i=w/n,a=b/n):C>L?C<.01?(n=.707106781,i=0,a=.707106781):(i=Math.sqrt(C),n=w/i,a=I/i):L<.01?(n=.707106781,i=.707106781,a=0):(a=Math.sqrt(L),n=b/a,i=I/a),this.set(n,i,a,t),this}let m=Math.sqrt((p-g)*(p-g)+(d-v)*(d-v)+(h-u)*(h-u));return Math.abs(m)<.001&&(m=1),this.x=(p-g)/m,this.y=(d-v)/m,this.z=(h-u)/m,this.w=Math.acos((o+f+M-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class dl extends Rn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ve(0,0,e,t),this.scissorTest=!1,this.viewport=new Ve(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(_i("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===bn?Qe:Ft),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new mt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){this.width===e&&this.height===t&&this.depth===n||(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Mo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends dl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class So extends mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=at,this.minFilter=at,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pl extends mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=at,this.minFilter=at,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,a,s,l){let c=n[i+0],o=n[i+1],u=n[i+2],d=n[i+3];const h=a[s+0],f=a[s+1],g=a[s+2],v=a[s+3];if(l===0)return e[t+0]=c,e[t+1]=o,e[t+2]=u,void(e[t+3]=d);if(l===1)return e[t+0]=h,e[t+1]=f,e[t+2]=g,void(e[t+3]=v);if(d!==v||c!==h||o!==f||u!==g){let p=1-l;const M=c*h+o*f+u*g+d*v,m=M>=0?1:-1,_=1-M*M;if(_>Number.EPSILON){const L=Math.sqrt(_),w=Math.atan2(L,M*m);p=Math.sin(p*w)/L,l=Math.sin(l*w)/L}const C=l*m;if(c=c*p+h*C,o=o*p+f*C,u=u*p+g*C,d=d*p+v*C,p===1-l){const L=1/Math.sqrt(c*c+o*o+u*u+d*d);c*=L,o*=L,u*=L,d*=L}}e[t]=c,e[t+1]=o,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,a,s){const l=n[i],c=n[i+1],o=n[i+2],u=n[i+3],d=a[s],h=a[s+1],f=a[s+2],g=a[s+3];return e[t]=l*g+u*d+c*f-o*h,e[t+1]=c*g+u*h+o*d-l*f,e[t+2]=o*g+u*f+l*h-c*d,e[t+3]=u*g-l*d-c*h-o*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,a=e._z,s=e._order,l=Math.cos,c=Math.sin,o=l(n/2),u=l(i/2),d=l(a/2),h=c(n/2),f=c(i/2),g=c(a/2);switch(s){case"XYZ":this._x=h*u*d+o*f*g,this._y=o*f*d-h*u*g,this._z=o*u*g+h*f*d,this._w=o*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+o*f*g,this._y=o*f*d-h*u*g,this._z=o*u*g-h*f*d,this._w=o*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-o*f*g,this._y=o*f*d+h*u*g,this._z=o*u*g+h*f*d,this._w=o*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-o*f*g,this._y=o*f*d+h*u*g,this._z=o*u*g-h*f*d,this._w=o*u*d+h*f*g;break;case"YZX":this._x=h*u*d+o*f*g,this._y=o*f*d+h*u*g,this._z=o*u*g-h*f*d,this._w=o*u*d-h*f*g;break;case"XZY":this._x=h*u*d-o*f*g,this._y=o*f*d-h*u*g,this._z=o*u*g+h*f*d,this._w=o*u*d+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],a=t[8],s=t[1],l=t[5],c=t[9],o=t[2],u=t[6],d=t[10],h=n+l+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(a-o)*f,this._z=(s-i)*f}else if(n>l&&n>d){const f=2*Math.sqrt(1+n-l-d);this._w=(u-c)/f,this._x=.25*f,this._y=(i+s)/f,this._z=(a+o)/f}else if(l>d){const f=2*Math.sqrt(1+l-n-d);this._w=(a-o)/f,this._x=(i+s)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+d-n-l);this._w=(s-i)/f,this._x=(a+o)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,a=e._z,s=e._w,l=t._x,c=t._y,o=t._z,u=t._w;return this._x=n*u+s*l+i*o-a*c,this._y=i*u+s*c+a*l-n*o,this._z=a*u+s*o+n*c-i*l,this._w=s*u-n*l-i*c-a*o,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,a=this._z,s=this._w;let l=s*e._w+n*e._x+i*e._y+a*e._z;if(l<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,l=-l):this.copy(e),l>=1)return this._w=s,this._x=n,this._y=i,this._z=a,this;const c=1-l*l;if(c<=Number.EPSILON){const f=1-t;return this._w=f*s+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*a+t*this._z,this.normalize(),this}const o=Math.sqrt(c),u=Math.atan2(o,l),d=Math.sin((1-t)*u)/o,h=Math.sin(t*u)/o;return this._w=s*d+this._w*h,this._x=n*d+this._x*h,this._y=i*d+this._y*h,this._z=a*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),a=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(a),n*Math.cos(a),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ls.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ls.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*i,this.y=a[1]*t+a[4]*n+a[7]*i,this.z=a[2]*t+a[5]*n+a[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,a=e.elements,s=1/(a[3]*t+a[7]*n+a[11]*i+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*i+a[12])*s,this.y=(a[1]*t+a[5]*n+a[9]*i+a[13])*s,this.z=(a[2]*t+a[6]*n+a[10]*i+a[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,a=e.x,s=e.y,l=e.z,c=e.w,o=2*(s*i-l*n),u=2*(l*t-a*i),d=2*(a*n-s*t);return this.x=t+c*o+s*d-l*u,this.y=n+c*u+l*o-a*d,this.z=i+c*d+a*u-s*o,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i,this.y=a[1]*t+a[5]*n+a[9]*i,this.z=a[2]*t+a[6]*n+a[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,a=e.z,s=t.x,l=t.y,c=t.z;return this.x=i*c-a*l,this.y=a*s-n*c,this.z=n*l-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ar.copy(this).projectOnVector(e),this.sub(Ar)}reflect(e){return this.sub(Ar.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=2*(Math.random()-.5),t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ar=new A,ls=new dn;class Zt{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Rt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Rt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Rt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,l=a.count;s<l;s++)e.isMesh===!0?e.getVertexPosition(s,Rt):Rt.fromBufferAttribute(a,s),Rt.applyMatrix4(e.matrixWorld),this.expandByPoint(Rt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),wi.copy(n.boundingBox)),wi.applyMatrix4(e.matrixWorld),this.union(wi)}const i=e.children;for(let a=0,s=i.length;a<s;a++)this.expandByObject(i[a],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Rt),Rt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ui),Ai.subVectors(this.max,ui),On.subVectors(e.a,ui),Fn.subVectors(e.b,ui),Bn.subVectors(e.c,ui),en.subVectors(Fn,On),tn.subVectors(Bn,Fn),gn.subVectors(On,Bn);let t=[0,-en.z,en.y,0,-tn.z,tn.y,0,-gn.z,gn.y,en.z,0,-en.x,tn.z,0,-tn.x,gn.z,0,-gn.x,-en.y,en.x,0,-tn.y,tn.x,0,-gn.y,gn.x,0];return!!Rr(t,On,Fn,Bn,Ai)&&(t=[1,0,0,0,1,0,0,0,1],!!Rr(t,On,Fn,Bn,Ai)&&(Ri.crossVectors(en,tn),t=[Ri.x,Ri.y,Ri.z],Rr(t,On,Fn,Bn,Ai)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Rt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Rt).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Gt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gt)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Gt=[new A,new A,new A,new A,new A,new A,new A,new A],Rt=new A,wi=new Zt,On=new A,Fn=new A,Bn=new A,en=new A,tn=new A,gn=new A,ui=new A,Ai=new A,Ri=new A,_n=new A;function Rr(r,e,t,n,i){for(let a=0,s=r.length-3;a<=s;a+=3){_n.fromArray(r,a);const l=i.x*Math.abs(_n.x)+i.y*Math.abs(_n.y)+i.z*Math.abs(_n.z),c=e.dot(_n),o=t.dot(_n),u=n.dot(_n);if(Math.max(-Math.max(c,o,u),Math.min(c,o,u))>l)return!1}return!0}const fl=new Zt,hi=new A,Cr=new A;class Jt{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):fl.setFromPoints(e).getCenter(n);let i=0;for(let a=0,s=e.length;a<s;a++)i=Math.max(i,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;hi.subVectors(e,this.center);const t=hi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=.5*(n-this.radius);this.center.addScaledVector(hi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(hi.copy(e.center).add(Cr)),this.expandByPoint(hi.copy(e.center).sub(Cr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Vt=new A,Lr=new A,Ci=new A,nn=new A,Pr=new A,Li=new A,Ur=new A;class Mi{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Vt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vt.copy(this.origin).addScaledVector(this.direction,t),Vt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Lr.copy(e).add(t).multiplyScalar(.5),Ci.copy(t).sub(e).normalize(),nn.copy(this.origin).sub(Lr);const a=.5*e.distanceTo(t),s=-this.direction.dot(Ci),l=nn.dot(this.direction),c=-nn.dot(Ci),o=nn.lengthSq(),u=Math.abs(1-s*s);let d,h,f,g;if(u>0)if(d=s*c-l,h=s*l-c,g=a*u,d>=0)if(h>=-g)if(h<=g){const v=1/u;d*=v,h*=v,f=d*(d+s*h+2*l)+h*(s*d+h+2*c)+o}else h=a,d=Math.max(0,-(s*h+l)),f=-d*d+h*(h+2*c)+o;else h=-a,d=Math.max(0,-(s*h+l)),f=-d*d+h*(h+2*c)+o;else h<=-g?(d=Math.max(0,-(-s*a+l)),h=d>0?-a:Math.min(Math.max(-a,-c),a),f=-d*d+h*(h+2*c)+o):h<=g?(d=0,h=Math.min(Math.max(-a,-c),a),f=h*(h+2*c)+o):(d=Math.max(0,-(s*a+l)),h=d>0?a:Math.min(Math.max(-a,-c),a),f=-d*d+h*(h+2*c)+o);else h=s>0?-a:a,d=Math.max(0,-(s*h+l)),f=-d*d+h*(h+2*c)+o;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Lr).addScaledVector(Ci,h),f}intersectSphere(e,t){Vt.subVectors(e.center,this.origin);const n=Vt.dot(this.direction),i=Vt.dot(Vt)-n*n,a=e.radius*e.radius;if(i>a)return null;const s=Math.sqrt(a-i),l=n-s,c=n+s;return c<0?null:l<0?this.at(c,t):this.at(l,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,a,s,l,c;const o=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return o>=0?(n=(e.min.x-h.x)*o,i=(e.max.x-h.x)*o):(n=(e.max.x-h.x)*o,i=(e.min.x-h.x)*o),u>=0?(a=(e.min.y-h.y)*u,s=(e.max.y-h.y)*u):(a=(e.max.y-h.y)*u,s=(e.min.y-h.y)*u),n>s||a>i?null:((a>n||isNaN(n))&&(n=a),(s<i||isNaN(i))&&(i=s),d>=0?(l=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(l=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),n>c||l>i?null:((l>n||n!=n)&&(n=l),(c<i||i!=i)&&(i=c),i<0?null:this.at(n>=0?n:i,t)))}intersectsBox(e){return this.intersectBox(e,Vt)!==null}intersectTriangle(e,t,n,i,a){Pr.subVectors(t,e),Li.subVectors(n,e),Ur.crossVectors(Pr,Li);let s,l=this.direction.dot(Ur);if(l>0){if(i)return null;s=1}else{if(!(l<0))return null;s=-1,l=-l}nn.subVectors(this.origin,e);const c=s*this.direction.dot(Li.crossVectors(nn,Li));if(c<0)return null;const o=s*this.direction.dot(Pr.cross(nn));if(o<0||c+o>l)return null;const u=-s*nn.dot(Ur);return u<0?null:this.at(u/l,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Te{constructor(e,t,n,i,a,s,l,c,o,u,d,h,f,g,v,p){Te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,a,s,l,c,o,u,d,h,f,g,v,p)}set(e,t,n,i,a,s,l,c,o,u,d,h,f,g,v,p){const M=this.elements;return M[0]=e,M[4]=t,M[8]=n,M[12]=i,M[1]=a,M[5]=s,M[9]=l,M[13]=c,M[2]=o,M[6]=u,M[10]=d,M[14]=h,M[3]=f,M[7]=g,M[11]=v,M[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Te().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/zn.setFromMatrixColumn(e,0).length(),a=1/zn.setFromMatrixColumn(e,1).length(),s=1/zn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,a=e.z,s=Math.cos(n),l=Math.sin(n),c=Math.cos(i),o=Math.sin(i),u=Math.cos(a),d=Math.sin(a);if(e.order==="XYZ"){const h=s*u,f=s*d,g=l*u,v=l*d;t[0]=c*u,t[4]=-c*d,t[8]=o,t[1]=f+g*o,t[5]=h-v*o,t[9]=-l*c,t[2]=v-h*o,t[6]=g+f*o,t[10]=s*c}else if(e.order==="YXZ"){const h=c*u,f=c*d,g=o*u,v=o*d;t[0]=h+v*l,t[4]=g*l-f,t[8]=s*o,t[1]=s*d,t[5]=s*u,t[9]=-l,t[2]=f*l-g,t[6]=v+h*l,t[10]=s*c}else if(e.order==="ZXY"){const h=c*u,f=c*d,g=o*u,v=o*d;t[0]=h-v*l,t[4]=-s*d,t[8]=g+f*l,t[1]=f+g*l,t[5]=s*u,t[9]=v-h*l,t[2]=-s*o,t[6]=l,t[10]=s*c}else if(e.order==="ZYX"){const h=s*u,f=s*d,g=l*u,v=l*d;t[0]=c*u,t[4]=g*o-f,t[8]=h*o+v,t[1]=c*d,t[5]=v*o+h,t[9]=f*o-g,t[2]=-o,t[6]=l*c,t[10]=s*c}else if(e.order==="YZX"){const h=s*c,f=s*o,g=l*c,v=l*o;t[0]=c*u,t[4]=v-h*d,t[8]=g*d+f,t[1]=d,t[5]=s*u,t[9]=-l*u,t[2]=-o*u,t[6]=f*d+g,t[10]=h-v*d}else if(e.order==="XZY"){const h=s*c,f=s*o,g=l*c,v=l*o;t[0]=c*u,t[4]=-d,t[8]=o*u,t[1]=h*d+v,t[5]=s*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=l*u,t[10]=v*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ml,e,gl)}lookAt(e,t,n){const i=this.elements;return pt.subVectors(e,t),pt.lengthSq()===0&&(pt.z=1),pt.normalize(),rn.crossVectors(n,pt),rn.lengthSq()===0&&(Math.abs(n.z)===1?pt.x+=1e-4:pt.z+=1e-4,pt.normalize(),rn.crossVectors(n,pt)),rn.normalize(),Pi.crossVectors(pt,rn),i[0]=rn.x,i[4]=Pi.x,i[8]=pt.x,i[1]=rn.y,i[5]=Pi.y,i[9]=pt.y,i[2]=rn.z,i[6]=Pi.z,i[10]=pt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,a=this.elements,s=n[0],l=n[4],c=n[8],o=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],v=n[6],p=n[10],M=n[14],m=n[3],_=n[7],C=n[11],L=n[15],w=i[0],b=i[4],I=i[8],U=i[12],N=i[1],K=i[5],R=i[9],z=i[13],B=i[2],te=i[6],ue=i[10],Z=i[14],X=i[3],q=i[7],O=i[11],j=i[15];return a[0]=s*w+l*N+c*B+o*X,a[4]=s*b+l*K+c*te+o*q,a[8]=s*I+l*R+c*ue+o*O,a[12]=s*U+l*z+c*Z+o*j,a[1]=u*w+d*N+h*B+f*X,a[5]=u*b+d*K+h*te+f*q,a[9]=u*I+d*R+h*ue+f*O,a[13]=u*U+d*z+h*Z+f*j,a[2]=g*w+v*N+p*B+M*X,a[6]=g*b+v*K+p*te+M*q,a[10]=g*I+v*R+p*ue+M*O,a[14]=g*U+v*z+p*Z+M*j,a[3]=m*w+_*N+C*B+L*X,a[7]=m*b+_*K+C*te+L*q,a[11]=m*I+_*R+C*ue+L*O,a[15]=m*U+_*z+C*Z+L*j,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],a=e[12],s=e[1],l=e[5],c=e[9],o=e[13],u=e[2],d=e[6],h=e[10],f=e[14];return e[3]*(+a*c*d-i*o*d-a*l*h+n*o*h+i*l*f-n*c*f)+e[7]*(+t*c*f-t*o*h+a*s*h-i*s*f+i*o*u-a*c*u)+e[11]*(+t*o*d-t*l*f-a*s*d+n*s*f+a*l*u-n*o*u)+e[15]*(-i*l*u-t*c*d+t*l*h+i*s*d-n*s*h+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],a=e[3],s=e[4],l=e[5],c=e[6],o=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],v=e[13],p=e[14],M=e[15],m=d*p*o-v*h*o+v*c*f-l*p*f-d*c*M+l*h*M,_=g*h*o-u*p*o-g*c*f+s*p*f+u*c*M-s*h*M,C=u*v*o-g*d*o+g*l*f-s*v*f-u*l*M+s*d*M,L=g*d*c-u*v*c-g*l*h+s*v*h+u*l*p-s*d*p,w=t*m+n*_+i*C+a*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/w;return e[0]=m*b,e[1]=(v*h*a-d*p*a-v*i*f+n*p*f+d*i*M-n*h*M)*b,e[2]=(l*p*a-v*c*a+v*i*o-n*p*o-l*i*M+n*c*M)*b,e[3]=(d*c*a-l*h*a-d*i*o+n*h*o+l*i*f-n*c*f)*b,e[4]=_*b,e[5]=(u*p*a-g*h*a+g*i*f-t*p*f-u*i*M+t*h*M)*b,e[6]=(g*c*a-s*p*a-g*i*o+t*p*o+s*i*M-t*c*M)*b,e[7]=(s*h*a-u*c*a+u*i*o-t*h*o-s*i*f+t*c*f)*b,e[8]=C*b,e[9]=(g*d*a-u*v*a-g*n*f+t*v*f+u*n*M-t*d*M)*b,e[10]=(s*v*a-g*l*a+g*n*o-t*v*o-s*n*M+t*l*M)*b,e[11]=(u*l*a-s*d*a-u*n*o+t*d*o+s*n*f-t*l*f)*b,e[12]=L*b,e[13]=(u*v*i-g*d*i+g*n*h-t*v*h-u*n*p+t*d*p)*b,e[14]=(g*l*i-s*v*i-g*n*c+t*v*c+s*n*p-t*l*p)*b,e[15]=(s*d*i-u*l*i+u*n*c-t*d*c-s*n*h+t*l*h)*b,this}scale(e){const t=this.elements,n=e.x,i=e.y,a=e.z;return t[0]*=n,t[4]*=i,t[8]*=a,t[1]*=n,t[5]*=i,t[9]*=a,t[2]*=n,t[6]*=i,t[10]*=a,t[3]*=n,t[7]*=i,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),a=1-n,s=e.x,l=e.y,c=e.z,o=a*s,u=a*l;return this.set(o*s+n,o*l-i*c,o*c+i*l,0,o*l+i*c,u*l+n,u*c-i*s,0,o*c-i*l,u*c+i*s,a*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,a,s){return this.set(1,n,a,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,a=t._x,s=t._y,l=t._z,c=t._w,o=a+a,u=s+s,d=l+l,h=a*o,f=a*u,g=a*d,v=s*u,p=s*d,M=l*d,m=c*o,_=c*u,C=c*d,L=n.x,w=n.y,b=n.z;return i[0]=(1-(v+M))*L,i[1]=(f+C)*L,i[2]=(g-_)*L,i[3]=0,i[4]=(f-C)*w,i[5]=(1-(h+M))*w,i[6]=(p+m)*w,i[7]=0,i[8]=(g+_)*b,i[9]=(p-m)*b,i[10]=(1-(h+v))*b,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let a=zn.set(i[0],i[1],i[2]).length();const s=zn.set(i[4],i[5],i[6]).length(),l=zn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(a=-a),e.x=i[12],e.y=i[13],e.z=i[14],Ct.copy(this);const c=1/a,o=1/s,u=1/l;return Ct.elements[0]*=c,Ct.elements[1]*=c,Ct.elements[2]*=c,Ct.elements[4]*=o,Ct.elements[5]*=o,Ct.elements[6]*=o,Ct.elements[8]*=u,Ct.elements[9]*=u,Ct.elements[10]*=u,t.setFromRotationMatrix(Ct),n.x=a,n.y=s,n.z=l,this}makePerspective(e,t,n,i,a,s,l=2e3){const c=this.elements,o=2*a/(t-e),u=2*a/(n-i),d=(t+e)/(t-e),h=(n+i)/(n-i);let f,g;if(l===ti)f=-(s+a)/(s-a),g=-2*s*a/(s-a);else{if(l!==ir)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);f=-s/(s-a),g=-s*a/(s-a)}return c[0]=o,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,a,s,l=2e3){const c=this.elements,o=1/(t-e),u=1/(n-i),d=1/(s-a),h=(t+e)*o,f=(n+i)*u;let g,v;if(l===ti)g=(s+a)*d,v=-2*d;else{if(l!==ir)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);g=a*d,v=-1*d}return c[0]=2*o,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const zn=new A,Ct=new Te,ml=new A(0,0,0),gl=new A(1,1,1),rn=new A,Pi=new A,pt=new A,cs=new Te,us=new dn;class or{constructor(e=0,t=0,n=0,i=or.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,a=i[0],s=i[4],l=i[8],c=i[1],o=i[5],u=i[9],d=i[2],h=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(h,o),this._z=0);break;case"YXZ":this._x=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(l,f),this._z=Math.atan2(c,o)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-s,o)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-st(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-s,o));break;case"YZX":this._z=Math.asin(st(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,o),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(l,f));break;case"XZY":this._z=Math.asin(-st(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(h,o),this._y=Math.atan2(l,a)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return cs.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cs,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return us.setFromEuler(this),this.setFromQuaternion(us,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}or.DEFAULT_ORDER="XYZ";class Eo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}}let _l=0;const hs=new A,Hn=new dn,kt=new Te,Ui=new A,di=new A,vl=new A,xl=new dn,ds=new A(1,0,0),ps=new A(0,1,0),fs=new A(0,0,1),Ml={type:"added"},Sl={type:"removed"};class Xe extends Rn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_l++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xe.DEFAULT_UP.clone();const e=new A,t=new or,n=new dn,i=new A(1,1,1);t._onChange(function(){n.setFromEuler(t,!1)}),n._onChange(function(){t.setFromQuaternion(n,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Te},normalMatrix:{value:new Le}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=Xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Eo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.multiply(Hn),this}rotateOnWorldAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.premultiply(Hn),this}rotateX(e){return this.rotateOnAxis(ds,e)}rotateY(e){return this.rotateOnAxis(ps,e)}rotateZ(e){return this.rotateOnAxis(fs,e)}translateOnAxis(e,t){return hs.copy(e).applyQuaternion(this.quaternion),this.position.add(hs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ds,e)}translateY(e){return this.translateOnAxis(ps,e)}translateZ(e){return this.translateOnAxis(fs,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(kt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ui.copy(e):Ui.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),di.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kt.lookAt(di,Ui,this.up):kt.lookAt(Ui,di,this.up),this.quaternion.setFromRotationMatrix(kt),i&&(kt.extractRotation(i.matrixWorld),Hn.setFromRotationMatrix(kt),this.quaternion.premultiply(Hn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Ml)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Sl)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),kt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),kt.multiply(e.parent.matrixWorld)),e.applyMatrix4(kt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let a=0,s=i.length;a<s;a++)i[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(di,e,vl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(di,xl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const a=t[n];a.matrixWorldAutoUpdate!==!0&&e!==!0||a.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let a=0,s=i.length;a<s;a++){const l=i[a];l.matrixWorldAutoUpdate===!0&&l.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};function a(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(l=>({boxInitialized:l.boxInitialized,boxMin:l.box.min.toArray(),boxMax:l.box.max.toArray(),sphereInitialized:l.sphereInitialized,sphereRadius:l.sphere.radius,sphereCenter:l.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=a(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let o=0,u=c.length;o<u;o++){const d=c[o];a(e.shapes,d)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,o=this.material.length;c<o;c++)l.push(a(e.materials,this.material[c]));i.material=l}else i.material=a(e.materials,this.material);if(this.children.length>0){i.children=[];for(let l=0;l<this.children.length;l++)i.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];i.animations.push(a(e.animations,c))}}if(t){const l=s(e.geometries),c=s(e.materials),o=s(e.textures),u=s(e.images),d=s(e.shapes),h=s(e.skeletons),f=s(e.animations),g=s(e.nodes);l.length>0&&(n.geometries=l),c.length>0&&(n.materials=c),o.length>0&&(n.textures=o),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function s(l){const c=[];for(const o in l){const u=l[o];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Xe.DEFAULT_UP=new A(0,1,0),Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0,Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Lt=new A,Wt=new A,Dr=new A,Xt=new A,Gn=new A,Vn=new A,ms=new A,Ir=new A,Nr=new A,Or=new A;let Di=!1;class St{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Lt.subVectors(e,t),i.cross(Lt);const a=i.lengthSq();return a>0?i.multiplyScalar(1/Math.sqrt(a)):i.set(0,0,0)}static getBarycoord(e,t,n,i,a){Lt.subVectors(i,t),Wt.subVectors(n,t),Dr.subVectors(e,t);const s=Lt.dot(Lt),l=Lt.dot(Wt),c=Lt.dot(Dr),o=Wt.dot(Wt),u=Wt.dot(Dr),d=s*o-l*l;if(d===0)return a.set(0,0,0),null;const h=1/d,f=(o*c-l*u)*h,g=(s*u-l*c)*h;return a.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Xt)!==null&&Xt.x>=0&&Xt.y>=0&&Xt.x+Xt.y<=1}static getUV(e,t,n,i,a,s,l,c){return Di===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Di=!0),this.getInterpolation(e,t,n,i,a,s,l,c)}static getInterpolation(e,t,n,i,a,s,l,c){return this.getBarycoord(e,t,n,i,Xt)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Xt.x),c.addScaledVector(s,Xt.y),c.addScaledVector(l,Xt.z),c)}static isFrontFacing(e,t,n,i){return Lt.subVectors(n,t),Wt.subVectors(e,t),Lt.cross(Wt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Lt.subVectors(this.c,this.b),Wt.subVectors(this.a,this.b),.5*Lt.cross(Wt).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return St.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return St.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,a){return Di===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Di=!0),St.getInterpolation(e,this.a,this.b,this.c,t,n,i,a)}getInterpolation(e,t,n,i,a){return St.getInterpolation(e,this.a,this.b,this.c,t,n,i,a)}containsPoint(e){return St.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return St.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,a=this.c;let s,l;Gn.subVectors(i,n),Vn.subVectors(a,n),Ir.subVectors(e,n);const c=Gn.dot(Ir),o=Vn.dot(Ir);if(c<=0&&o<=0)return t.copy(n);Nr.subVectors(e,i);const u=Gn.dot(Nr),d=Vn.dot(Nr);if(u>=0&&d<=u)return t.copy(i);const h=c*d-u*o;if(h<=0&&c>=0&&u<=0)return s=c/(c-u),t.copy(n).addScaledVector(Gn,s);Or.subVectors(e,a);const f=Gn.dot(Or),g=Vn.dot(Or);if(g>=0&&f<=g)return t.copy(a);const v=f*o-c*g;if(v<=0&&o>=0&&g<=0)return l=o/(o-g),t.copy(n).addScaledVector(Vn,l);const p=u*g-f*d;if(p<=0&&d-u>=0&&f-g>=0)return ms.subVectors(a,i),l=(d-u)/(d-u+(f-g)),t.copy(i).addScaledVector(ms,l);const M=1/(p+v+h);return s=v*M,l=h*M,t.copy(n).addScaledVector(Gn,s).addScaledVector(Vn,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const yo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},an={h:0,s:0,l:0},Ii={h:0,s:0,l:0};function Fr(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}class Ee{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Qe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Fe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Fe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Fe.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Fe.workingColorSpace){if(e=sl(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,s=2*n-a;this.r=Fr(s,a,e+1/3),this.g=Fr(s,a,e),this.b=Fr(s,a,e-1/3)}return Fe.toWorkingColorSpace(this,i),this}setStyle(e,t=Qe){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=i[1],l=i[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=i[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Qe){const n=yo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Jn(e.r),this.g=Jn(e.g),this.b=Jn(e.b),this}copyLinearToSRGB(e){return this.r=br(e.r),this.g=br(e.g),this.b=br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qe){return Fe.fromWorkingColorSpace(nt.copy(this),e),65536*Math.round(st(255*nt.r,0,255))+256*Math.round(st(255*nt.g,0,255))+Math.round(st(255*nt.b,0,255))}getHexString(e=Qe){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Fe.workingColorSpace){Fe.fromWorkingColorSpace(nt.copy(this),t);const n=nt.r,i=nt.g,a=nt.b,s=Math.max(n,i,a),l=Math.min(n,i,a);let c,o;const u=(l+s)/2;if(l===s)c=0,o=0;else{const d=s-l;switch(o=u<=.5?d/(s+l):d/(2-s-l),s){case n:c=(i-a)/d+(i<a?6:0);break;case i:c=(a-n)/d+2;break;case a:c=(n-i)/d+4}c/=6}return e.h=c,e.s=o,e.l=u,e}getRGB(e,t=Fe.workingColorSpace){return Fe.fromWorkingColorSpace(nt.copy(this),t),e.r=nt.r,e.g=nt.g,e.b=nt.b,e}getStyle(e=Qe){Fe.fromWorkingColorSpace(nt.copy(this),e);const t=nt.r,n=nt.g,i=nt.b;return e!==Qe?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*n)},${Math.round(255*i)})`}offsetHSL(e,t,n){return this.getHSL(an),this.setHSL(an.h+e,an.s+t,an.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(an),e.getHSL(Ii);const n=yr(an.h,Ii.h,t),i=yr(an.s,Ii.s,t),a=yr(an.l,Ii.l,t);return this.setHSL(n,i,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*i,this.g=a[1]*t+a[4]*n+a[7]*i,this.b=a[2]*t+a[5]*n+a[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const nt=new Ee;Ee.NAMES=yo;let El=0;class ri extends Rn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:El++}),this.uuid=xi(),this.name="",this.type="Material",this.blending=1,this.side=hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$r,this.blendDst=ea,this.blendEquation=Sn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ee(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=In,this.stencilZFail=In,this.stencilZPass=In,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];i!==void 0?i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function i(a){const s=[];for(const l in a){const c=a[l];delete c.metadata,s.push(c)}return s}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==hn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==$r&&(n.blendSrc=this.blendSrc),this.blendDst!==ea&&(n.blendDst=this.blendDst),this.blendEquation!==Sn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==In&&(n.stencilFail=this.stencilFail),this.stencilZFail!==In&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==In&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData),t){const a=i(e.textures),s=i(e.images);a.length>0&&(n.textures=a),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let a=0;a!==i;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ha extends ri{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}yl();function yl(){const r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){const o=c-127;o<-27?(n[c]=0,n[256|c]=32768,i[c]=24,i[256|c]=24):o<-14?(n[c]=1024>>-o-14,n[256|c]=1024>>-o-14|32768,i[c]=-o-1,i[256|c]=-o-1):o<=15?(n[c]=o+15<<10,n[256|c]=o+15<<10|32768,i[c]=13,i[256|c]=13):o<128?(n[c]=31744,n[256|c]=64512,i[c]=24,i[256|c]=24):(n[c]=31744,n[256|c]=64512,i[c]=13,i[256|c]=13)}const a=new Uint32Array(2048),s=new Uint32Array(64),l=new Uint32Array(64);for(let c=1;c<1024;++c){let o=c<<13,u=0;for(;!(8388608&o);)o<<=1,u-=8388608;o&=-8388609,u+=947912704,a[c]=o|u}for(let c=1024;c<2048;++c)a[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)s[c]=c<<23;s[31]=1199570944,s[32]=2147483648;for(let c=33;c<63;++c)s[c]=2147483648+(c-32<<23);s[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(l[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:a,exponentTable:s,offsetTable:l}}const Ge=new A,Ni=new _e;class Dt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ns,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,a=this.itemSize;i<a;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ni.fromBufferAttribute(this,t),Ni.applyMatrix3(e),this.setXY(t,Ni.x,Ni.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ge.fromBufferAttribute(this,t),Ge.applyMatrix3(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ge.fromBufferAttribute(this,t),Ge.applyMatrix4(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ge.fromBufferAttribute(this,t),Ge.applyNormalMatrix(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ge.fromBufferAttribute(this,t),Ge.transformDirection(e),this.setXYZ(t,Ge.x,Ge.y,Ge.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,a){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),a=ct(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ns&&(e.usage=this.usage),e}}class To extends Dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class bo extends Dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ke extends Dt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Tl=0;const Mt=new Te,Br=new Xe,kn=new A,ft=new Zt,pi=new Zt,Ke=new A;class ht extends Rn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tl++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vo(e)?bo:To)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Le().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Mt.makeRotationFromQuaternion(e),this.applyMatrix4(Mt),this}rotateX(e){return Mt.makeRotationX(e),this.applyMatrix4(Mt),this}rotateY(e){return Mt.makeRotationY(e),this.applyMatrix4(Mt),this}rotateZ(e){return Mt.makeRotationZ(e),this.applyMatrix4(Mt),this}translate(e,t,n){return Mt.makeTranslation(e,t,n),this.applyMatrix4(Mt),this}scale(e,t,n){return Mt.makeScale(e,t,n),this.applyMatrix4(Mt),this}lookAt(e){return Br.lookAt(e),Br.updateMatrix(),this.applyMatrix4(Br.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(kn).negate(),this.translate(kn.x,kn.y,kn.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const a=e[n];t.push(a.x,a.y,a.z||0)}return this.setAttribute("position",new ke(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),void this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const a=t[n];ft.setFromBufferAttribute(a),this.morphTargetsRelative?(Ke.addVectors(this.boundingBox.min,ft.min),this.boundingBox.expandByPoint(Ke),Ke.addVectors(this.boundingBox.max,ft.max),this.boundingBox.expandByPoint(Ke)):(this.boundingBox.expandByPoint(ft.min),this.boundingBox.expandByPoint(ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),void this.boundingSphere.set(new A,1/0);if(e){const n=this.boundingSphere.center;if(ft.setFromBufferAttribute(e),t)for(let a=0,s=t.length;a<s;a++){const l=t[a];pi.setFromBufferAttribute(l),this.morphTargetsRelative?(Ke.addVectors(ft.min,pi.min),ft.expandByPoint(Ke),Ke.addVectors(ft.max,pi.max),ft.expandByPoint(Ke)):(ft.expandByPoint(pi.min),ft.expandByPoint(pi.max))}ft.getCenter(n);let i=0;for(let a=0,s=e.count;a<s;a++)Ke.fromBufferAttribute(e,a),i=Math.max(i,n.distanceToSquared(Ke));if(t)for(let a=0,s=t.length;a<s;a++){const l=t[a],c=this.morphTargetsRelative;for(let o=0,u=l.count;o<u;o++)Ke.fromBufferAttribute(l,o),c&&(kn.fromBufferAttribute(e,o),Ke.add(kn)),i=Math.max(i,n.distanceToSquared(Ke))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");const n=e.array,i=t.position.array,a=t.normal.array,s=t.uv.array,l=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*l),4));const c=this.getAttribute("tangent").array,o=[],u=[];for(let N=0;N<l;N++)o[N]=new A,u[N]=new A;const d=new A,h=new A,f=new A,g=new _e,v=new _e,p=new _e,M=new A,m=new A;function _(N,K,R){d.fromArray(i,3*N),h.fromArray(i,3*K),f.fromArray(i,3*R),g.fromArray(s,2*N),v.fromArray(s,2*K),p.fromArray(s,2*R),h.sub(d),f.sub(d),v.sub(g),p.sub(g);const z=1/(v.x*p.y-p.x*v.y);isFinite(z)&&(M.copy(h).multiplyScalar(p.y).addScaledVector(f,-v.y).multiplyScalar(z),m.copy(f).multiplyScalar(v.x).addScaledVector(h,-p.x).multiplyScalar(z),o[N].add(M),o[K].add(M),o[R].add(M),u[N].add(m),u[K].add(m),u[R].add(m))}let C=this.groups;C.length===0&&(C=[{start:0,count:n.length}]);for(let N=0,K=C.length;N<K;++N){const R=C[N],z=R.start;for(let B=z,te=z+R.count;B<te;B+=3)_(n[B+0],n[B+1],n[B+2])}const L=new A,w=new A,b=new A,I=new A;function U(N){b.fromArray(a,3*N),I.copy(b);const K=o[N];L.copy(K),L.sub(b.multiplyScalar(b.dot(K))).normalize(),w.crossVectors(I,K);const R=w.dot(u[N])<0?-1:1;c[4*N]=L.x,c[4*N+1]=L.y,c[4*N+2]=L.z,c[4*N+3]=R}for(let N=0,K=C.length;N<K;++N){const R=C[N],z=R.start;for(let B=z,te=z+R.count;B<te;B+=3)U(n[B+0]),U(n[B+1]),U(n[B+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Dt(new Float32Array(3*t.count),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const i=new A,a=new A,s=new A,l=new A,c=new A,o=new A,u=new A,d=new A;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),v=e.getX(h+1),p=e.getX(h+2);i.fromBufferAttribute(t,g),a.fromBufferAttribute(t,v),s.fromBufferAttribute(t,p),u.subVectors(s,a),d.subVectors(i,a),u.cross(d),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),o.fromBufferAttribute(n,p),l.add(u),c.add(u),o.add(u),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,o.x,o.y,o.z)}else for(let h=0,f=t.count;h<f;h+=3)i.fromBufferAttribute(t,h+0),a.fromBufferAttribute(t,h+1),s.fromBufferAttribute(t,h+2),u.subVectors(s,a),d.subVectors(i,a),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ke.fromBufferAttribute(e,t),Ke.normalize(),e.setXYZ(t,Ke.x,Ke.y,Ke.z)}toNonIndexed(){function e(l,c){const o=l.array,u=l.itemSize,d=l.normalized,h=new o.constructor(c.length*u);let f=0,g=0;for(let v=0,p=c.length;v<p;v++){f=l.isInterleavedBufferAttribute?c[v]*l.data.stride+l.offset:c[v]*u;for(let M=0;M<u;M++)h[g++]=o[f++]}return new Dt(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ht,n=this.index.array,i=this.attributes;for(const l in i){const c=e(i[l],n);t.setAttribute(l,c)}const a=this.morphAttributes;for(const l in a){const c=[],o=a[l];for(let u=0,d=o.length;u<d;u++){const h=e(o[u],n);c.push(h)}t.morphAttributes[l]=c}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let l=0,c=s.length;l<c;l++){const o=s[l];t.addGroup(o.start,o.count,o.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const o in c)c[o]!==void 0&&(e[o]=c[o]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const o=n[c];e.data.attributes[c]=o.toJSON(e.data)}const i={};let a=!1;for(const c in this.morphAttributes){const o=this.morphAttributes[c],u=[];for(let d=0,h=o.length;d<h;d++){const f=o[d];u.push(f.toJSON(e.data))}u.length>0&&(i[c]=u,a=!0)}a&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere={center:l.center.toArray(),radius:l.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const o in i){const u=i[o];this.setAttribute(o,u.clone(t))}const a=e.morphAttributes;for(const o in a){const u=[],d=a[o];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[o]=u}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let o=0,u=s.length;o<u;o++){const d=s[o];this.addGroup(d.start,d.count,d.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gs=new Te,vn=new Mi,Oi=new Jt,_s=new A,Wn=new A,Xn=new A,jn=new A,zr=new A,Fi=new A,Bi=new _e,zi=new _e,Hi=new _e,vs=new A,xs=new A,Ms=new A,Gi=new A,Vi=new A;class Ze extends Xe{constructor(e=new ht,t=new ha){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,a=n.length;i<a;i++){const s=n[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=i}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,a=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const l=this.morphTargetInfluences;if(a&&l){Fi.set(0,0,0);for(let c=0,o=a.length;c<o;c++){const u=l[c],d=a[c];u!==0&&(zr.fromBufferAttribute(d,e),s?Fi.addScaledVector(zr,u):Fi.addScaledVector(zr.sub(t),u))}t.add(Fi)}return t}raycast(e,t){const n=this.geometry,i=this.material,a=this.matrixWorld;if(i!==void 0){if(n.boundingSphere===null&&n.computeBoundingSphere(),Oi.copy(n.boundingSphere),Oi.applyMatrix4(a),vn.copy(e.ray).recast(e.near),Oi.containsPoint(vn.origin)===!1&&(vn.intersectSphere(Oi,_s)===null||vn.origin.distanceToSquared(_s)>(e.far-e.near)**2))return;gs.copy(a).invert(),vn.copy(e.ray).applyMatrix4(gs),n.boundingBox!==null&&vn.intersectsBox(n.boundingBox)===!1||this._computeIntersections(e,t,vn)}}_computeIntersections(e,t,n){let i;const a=this.geometry,s=this.material,l=a.index,c=a.attributes.position,o=a.attributes.uv,u=a.attributes.uv1,d=a.attributes.normal,h=a.groups,f=a.drawRange;if(l!==null)if(Array.isArray(s))for(let g=0,v=h.length;g<v;g++){const p=h[g],M=s[p.materialIndex];for(let m=Math.max(p.start,f.start),_=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));m<_;m+=3)i=ki(this,M,e,n,o,u,d,l.getX(m),l.getX(m+1),l.getX(m+2)),i&&(i.faceIndex=Math.floor(m/3),i.face.materialIndex=p.materialIndex,t.push(i))}else for(let g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);g<v;g+=3)i=ki(this,s,e,n,o,u,d,l.getX(g),l.getX(g+1),l.getX(g+2)),i&&(i.faceIndex=Math.floor(g/3),t.push(i));else if(c!==void 0)if(Array.isArray(s))for(let g=0,v=h.length;g<v;g++){const p=h[g],M=s[p.materialIndex];for(let m=Math.max(p.start,f.start),_=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));m<_;m+=3)i=ki(this,M,e,n,o,u,d,m,m+1,m+2),i&&(i.faceIndex=Math.floor(m/3),i.face.materialIndex=p.materialIndex,t.push(i))}else for(let g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);g<v;g+=3)i=ki(this,s,e,n,o,u,d,g,g+1,g+2),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}function ki(r,e,t,n,i,a,s,l,c,o){r.getVertexPosition(l,Wn),r.getVertexPosition(c,Xn),r.getVertexPosition(o,jn);const u=function(d,h,f,g,v,p,M,m){let _;if(_=h.side===ut?g.intersectTriangle(M,p,v,!0,m):g.intersectTriangle(v,p,M,h.side===hn,m),_===null)return null;Vi.copy(m),Vi.applyMatrix4(d.matrixWorld);const C=f.ray.origin.distanceTo(Vi);return C<f.near||C>f.far?null:{distance:C,point:Vi.clone(),object:d}}(r,e,t,n,Wn,Xn,jn,Gi);if(u){i&&(Bi.fromBufferAttribute(i,l),zi.fromBufferAttribute(i,c),Hi.fromBufferAttribute(i,o),u.uv=St.getInterpolation(Gi,Wn,Xn,jn,Bi,zi,Hi,new _e)),a&&(Bi.fromBufferAttribute(a,l),zi.fromBufferAttribute(a,c),Hi.fromBufferAttribute(a,o),u.uv1=St.getInterpolation(Gi,Wn,Xn,jn,Bi,zi,Hi,new _e),u.uv2=u.uv1),s&&(vs.fromBufferAttribute(s,l),xs.fromBufferAttribute(s,c),Ms.fromBufferAttribute(s,o),u.normal=St.getInterpolation(Gi,Wn,Xn,jn,vs,xs,Ms,new A),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:l,b:c,c:o,normal:new A,materialIndex:0};St.getNormal(Wn,Xn,jn,d.normal),u.face=d}return u}class ai extends ht{constructor(e=1,t=1,n=1,i=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:a,depthSegments:s};const l=this;i=Math.floor(i),a=Math.floor(a),s=Math.floor(s);const c=[],o=[],u=[],d=[];let h=0,f=0;function g(v,p,M,m,_,C,L,w,b,I,U){const N=C/b,K=L/I,R=C/2,z=L/2,B=w/2,te=b+1,ue=I+1;let Z=0,X=0;const q=new A;for(let O=0;O<ue;O++){const j=O*K-z;for(let se=0;se<te;se++){const S=se*N-R;q[v]=S*m,q[p]=j*_,q[M]=B,o.push(q.x,q.y,q.z),q[v]=0,q[p]=0,q[M]=w>0?1:-1,u.push(q.x,q.y,q.z),d.push(se/b),d.push(1-O/I),Z+=1}}for(let O=0;O<I;O++)for(let j=0;j<b;j++){const se=h+j+te*O,S=h+j+te*(O+1),E=h+(j+1)+te*(O+1),D=h+(j+1)+te*O;c.push(se,S,D),c.push(S,E,D),X+=6}l.addGroup(f,X,U),f+=X,h+=Z}g("z","y","x",-1,-1,n,t,e,s,a,0),g("z","y","x",1,-1,n,t,-e,s,a,1),g("x","z","y",1,1,e,n,t,i,s,2),g("x","z","y",1,-1,e,n,-t,i,s,3),g("x","y","z",1,-1,e,t,n,i,a,4),g("x","y","z",-1,-1,e,t,-n,i,a,5),this.setIndex(c),this.setAttribute("position",new ke(o,3)),this.setAttribute("normal",new ke(u,3)),this.setAttribute("uv",new ke(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ai(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ni(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function rt(r){const e={};for(let t=0;t<r.length;t++){const n=ni(r[t]);for(const i in n)e[i]=n[i]}return e}function wo(r){return r.getRenderTarget()===null?r.outputColorSpace:Fe.workingColorSpace}const bl={clone:ni,merge:rt};class An extends ri{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ni(e.uniforms),this.uniformsGroups=function(t){const n=[];for(let i=0;i<t.length;i++)n.push(t[i].clone());return n}(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class da extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=ti}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Et extends da{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=2*sa*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(.5*Ji*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*sa*Math.atan(Math.tan(.5*Ji*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,a,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(.5*Ji*this.fov)/this.zoom,n=2*t,i=this.aspect*n,a=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const c=s.fullWidth,o=s.fullHeight;a+=s.offsetX*i/c,t-=s.offsetY*n/o,i*=s.width/c,n*=s.height/o}const l=this.filmOffset;l!==0&&(a+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Yn=-90;class wl extends Xe{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Et(Yn,1,e,t);i.layers=this.layers,this.add(i);const a=new Et(Yn,1,e,t);a.layers=this.layers,this.add(a);const s=new Et(Yn,1,e,t);s.layers=this.layers,this.add(s);const l=new Et(Yn,1,e,t);l.layers=this.layers,this.add(l);const c=new Et(Yn,1,e,t);c.layers=this.layers,this.add(c);const o=new Et(Yn,1,e,t);o.layers=this.layers,this.add(o)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,a,s,l,c]=t;for(const o of t)this.remove(o);if(e===ti)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else{if(e!==ir)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1)}for(const o of t)this.add(o),o.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,l,c,o,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,a),e.setRenderTarget(n,1,i),e.render(t,s),e.setRenderTarget(n,2,i),e.render(t,l),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,o),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ao extends mt{constructor(e,t,n,i,a,s,l,c,o,u){super(e=e!==void 0?e:[],t=t!==void 0?t:Qn,n,i,a,s,l,c,o,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Al extends wn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(_i("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===bn?Qe:Ft),this.texture=new Ao(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ut}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ai(5,5,5),a=new An({name:"CubemapFromEquirect",uniforms:ni(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ut,blending:0});a.uniforms.tEquirect.value=t;const s=new Ze(i,a),l=t.minFilter;return t.minFilter===$i&&(t.minFilter=Ut),new wl(1,10,this).update(e,s),t.minFilter=l,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,n,i){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,i);e.setRenderTarget(a)}}const Hr=new A,Rl=new A,Cl=new Le;class on{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Hr.subVectors(n,t).cross(Rl.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Hr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/i;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Cl.getNormalMatrix(e),i=this.coplanarPoint(Hr).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xn=new Jt,Wi=new A;class lr{constructor(e=new on,t=new on,n=new on,i=new on,a=new on,s=new on){this.planes=[e,t,n,i,a,s]}set(e,t,n,i,a,s){const l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(n),l[3].copy(i),l[4].copy(a),l[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){const n=this.planes,i=e.elements,a=i[0],s=i[1],l=i[2],c=i[3],o=i[4],u=i[5],d=i[6],h=i[7],f=i[8],g=i[9],v=i[10],p=i[11],M=i[12],m=i[13],_=i[14],C=i[15];if(n[0].setComponents(c-a,h-o,p-f,C-M).normalize(),n[1].setComponents(c+a,h+o,p+f,C+M).normalize(),n[2].setComponents(c+s,h+u,p+g,C+m).normalize(),n[3].setComponents(c-s,h-u,p-g,C-m).normalize(),n[4].setComponents(c-l,h-d,p-v,C-_).normalize(),t===ti)n[5].setComponents(c+l,h+d,p+v,C+_).normalize();else{if(t!==ir)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(l,d,v,_).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),xn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xn)}intersectsSprite(e){return xn.center.set(0,0,0),xn.radius=.7071067811865476,xn.applyMatrix4(e.matrixWorld),this.intersectsSphere(xn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Wi.x=i.normal.x>0?e.max.x:e.min.x,Wi.y=i.normal.y>0?e.max.y:e.min.y,Wi.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Wi)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ro(){let r=null,e=!1,t=null,n=null;function i(a,s){t(a,s),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){r=a}}}function Ll(r,e){const t=e.isWebGL2,n=new WeakMap;return{get:function(i){return i.isInterleavedBufferAttribute&&(i=i.data),n.get(i)},remove:function(i){i.isInterleavedBufferAttribute&&(i=i.data);const a=n.get(i);a&&(r.deleteBuffer(a.buffer),n.delete(i))},update:function(i,a){if(i.isGLBufferAttribute){const l=n.get(i);return void((!l||l.version<i.version)&&n.set(i,{buffer:i.buffer,type:i.type,bytesPerElement:i.elementSize,version:i.version}))}i.isInterleavedBufferAttribute&&(i=i.data);const s=n.get(i);if(s===void 0)n.set(i,function(l,c){const o=l.array,u=l.usage,d=o.byteLength,h=r.createBuffer();let f;if(r.bindBuffer(c,h),r.bufferData(c,o,u),l.onUploadCallback(),o instanceof Float32Array)f=r.FLOAT;else if(o instanceof Uint16Array)if(l.isFloat16BufferAttribute){if(!t)throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");f=r.HALF_FLOAT}else f=r.UNSIGNED_SHORT;else if(o instanceof Int16Array)f=r.SHORT;else if(o instanceof Uint32Array)f=r.UNSIGNED_INT;else if(o instanceof Int32Array)f=r.INT;else if(o instanceof Int8Array)f=r.BYTE;else if(o instanceof Uint8Array)f=r.UNSIGNED_BYTE;else{if(!(o instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+o);f=r.UNSIGNED_BYTE}return{buffer:h,type:f,bytesPerElement:o.BYTES_PER_ELEMENT,version:l.version,size:d}}(i,a));else if(s.version<i.version){if(s.size!==i.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(l,c,o){const u=c.array,d=c._updateRange,h=c.updateRanges;if(r.bindBuffer(o,l),d.count===-1&&h.length===0&&r.bufferSubData(o,0,u),h.length!==0){for(let f=0,g=h.length;f<g;f++){const v=h[f];t?r.bufferSubData(o,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count):r.bufferSubData(o,v.start*u.BYTES_PER_ELEMENT,u.subarray(v.start,v.start+v.count))}c.clearUpdateRanges()}d.count!==-1&&(t?r.bufferSubData(o,d.offset*u.BYTES_PER_ELEMENT,u,d.offset,d.count):r.bufferSubData(o,d.offset*u.BYTES_PER_ELEMENT,u.subarray(d.offset,d.offset+d.count)),d.count=-1),c.onUploadCallback()})(s.buffer,i,a),s.version=i.version}}}}class cr extends ht{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const a=e/2,s=t/2,l=Math.floor(n),c=Math.floor(i),o=l+1,u=c+1,d=e/l,h=t/c,f=[],g=[],v=[],p=[];for(let M=0;M<u;M++){const m=M*h-s;for(let _=0;_<o;_++){const C=_*d-a;g.push(C,-m,0),v.push(0,0,1),p.push(_/l),p.push(1-M/c)}}for(let M=0;M<c;M++)for(let m=0;m<l;m++){const _=m+o*M,C=m+o*(M+1),L=m+1+o*(M+1),w=m+1+o*M;f.push(_,C,w),f.push(C,L,w)}this.setIndex(f),this.setAttribute("position",new ke(g,3)),this.setAttribute("normal",new ke(v,3)),this.setAttribute("uv",new ke(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cr(e.width,e.height,e.widthSegments,e.heightSegments)}}const ye={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},re={common:{diffuse:{value:new Ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new _e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new Ee(16777215)},opacity:{value:1},center:{value:new _e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},Nt={basic:{uniforms:rt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:ye.meshbasic_vert,fragmentShader:ye.meshbasic_frag},lambert:{uniforms:rt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new Ee(0)}}]),vertexShader:ye.meshlambert_vert,fragmentShader:ye.meshlambert_frag},phong:{uniforms:rt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new Ee(0)},specular:{value:new Ee(1118481)},shininess:{value:30}}]),vertexShader:ye.meshphong_vert,fragmentShader:ye.meshphong_frag},standard:{uniforms:rt([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new Ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag},toon:{uniforms:rt([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new Ee(0)}}]),vertexShader:ye.meshtoon_vert,fragmentShader:ye.meshtoon_frag},matcap:{uniforms:rt([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:ye.meshmatcap_vert,fragmentShader:ye.meshmatcap_frag},points:{uniforms:rt([re.points,re.fog]),vertexShader:ye.points_vert,fragmentShader:ye.points_frag},dashed:{uniforms:rt([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ye.linedashed_vert,fragmentShader:ye.linedashed_frag},depth:{uniforms:rt([re.common,re.displacementmap]),vertexShader:ye.depth_vert,fragmentShader:ye.depth_frag},normal:{uniforms:rt([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:ye.meshnormal_vert,fragmentShader:ye.meshnormal_frag},sprite:{uniforms:rt([re.sprite,re.fog]),vertexShader:ye.sprite_vert,fragmentShader:ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ye.background_vert,fragmentShader:ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ye.backgroundCube_vert,fragmentShader:ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ye.cube_vert,fragmentShader:ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ye.equirect_vert,fragmentShader:ye.equirect_frag},distanceRGBA:{uniforms:rt([re.common,re.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ye.distanceRGBA_vert,fragmentShader:ye.distanceRGBA_frag},shadow:{uniforms:rt([re.lights,re.fog,{color:{value:new Ee(0)},opacity:{value:1}}]),vertexShader:ye.shadow_vert,fragmentShader:ye.shadow_frag}};Nt.physical={uniforms:rt([Nt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new _e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new Ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new _e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new Ee(0)},specularColor:{value:new Ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new _e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag};const Xi={r:0,b:0,g:0};function Pl(r,e,t,n,i,a,s){const l=new Ee(0);let c,o,u=a===!0?0:1,d=null,h=0,f=null;function g(v,p){v.getRGB(Xi,wo(r)),n.buffers.color.setClear(Xi.r,Xi.g,Xi.b,p,s)}return{getClearColor:function(){return l},setClearColor:function(v,p=1){l.set(v),u=p,g(l,u)},getClearAlpha:function(){return u},setClearAlpha:function(v){u=v,g(l,u)},render:function(v,p){let M=!1,m=p.isScene===!0?p.background:null;m&&m.isTexture&&(m=(p.backgroundBlurriness>0?t:e).get(m)),m===null?g(l,u):m&&m.isColor&&(g(m,1),M=!0);const _=r.xr.getEnvironmentBlendMode();_==="additive"?n.buffers.color.setClear(0,0,0,1,s):_==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(r.autoClear||M)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),m&&(m.isCubeTexture||m.mapping===ar)?(o===void 0&&(o=new Ze(new ai(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:ni(Nt.backgroundCube.uniforms),vertexShader:Nt.backgroundCube.vertexShader,fragmentShader:Nt.backgroundCube.fragmentShader,side:ut,depthTest:!1,depthWrite:!1,fog:!1})),o.geometry.deleteAttribute("normal"),o.geometry.deleteAttribute("uv"),o.onBeforeRender=function(C,L,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(o.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(o)),o.material.uniforms.envMap.value=m,o.material.uniforms.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,o.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,o.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,o.material.toneMapped=Fe.getTransfer(m.colorSpace)!==Be,d===m&&h===m.version&&f===r.toneMapping||(o.material.needsUpdate=!0,d=m,h=m.version,f=r.toneMapping),o.layers.enableAll(),v.unshift(o,o.geometry,o.material,0,0,null)):m&&m.isTexture&&(c===void 0&&(c=new Ze(new cr(2,2),new An({name:"BackgroundMaterial",uniforms:ni(Nt.background.uniforms),vertexShader:Nt.background.vertexShader,fragmentShader:Nt.background.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=m,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Fe.getTransfer(m.colorSpace)!==Be,m.matrixAutoUpdate===!0&&m.updateMatrix(),c.material.uniforms.uvTransform.value.copy(m.matrix),d===m&&h===m.version&&f===r.toneMapping||(c.material.needsUpdate=!0,d=m,h=m.version,f=r.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}}}function Ul(r,e,t,n){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),a=n.isWebGL2?null:e.get("OES_vertex_array_object"),s=n.isWebGL2||a!==null,l={},c=f(null);let o=c,u=!1;function d(L){return n.isWebGL2?r.bindVertexArray(L):a.bindVertexArrayOES(L)}function h(L){return n.isWebGL2?r.deleteVertexArray(L):a.deleteVertexArrayOES(L)}function f(L){const w=[],b=[],I=[];for(let U=0;U<i;U++)w[U]=0,b[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:b,attributeDivisors:I,object:L,attributes:{},index:null}}function g(){const L=o.newAttributes;for(let w=0,b=L.length;w<b;w++)L[w]=0}function v(L){p(L,0)}function p(L,w){const b=o.newAttributes,I=o.enabledAttributes,U=o.attributeDivisors;b[L]=1,I[L]===0&&(r.enableVertexAttribArray(L),I[L]=1),U[L]!==w&&((n.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,w),U[L]=w)}function M(){const L=o.newAttributes,w=o.enabledAttributes;for(let b=0,I=w.length;b<I;b++)w[b]!==L[b]&&(r.disableVertexAttribArray(b),w[b]=0)}function m(L,w,b,I,U,N,K){K===!0?r.vertexAttribIPointer(L,w,b,U,N):r.vertexAttribPointer(L,w,b,I,U,N)}function _(){C(),u=!0,o!==c&&(o=c,d(o.object))}function C(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:function(L,w,b,I,U){let N=!1;if(s){const K=function(R,z,B){const te=B.wireframe===!0;let ue=l[R.id];ue===void 0&&(ue={},l[R.id]=ue);let Z=ue[z.id];Z===void 0&&(Z={},ue[z.id]=Z);let X=Z[te];return X===void 0&&(X=f(n.isWebGL2?r.createVertexArray():a.createVertexArrayOES()),Z[te]=X),X}(I,b,w);o!==K&&(o=K,d(o.object)),N=function(R,z,B,te){const ue=o.attributes,Z=z.attributes;let X=0;const q=B.getAttributes();for(const O in q)if(q[O].location>=0){const j=ue[O];let se=Z[O];if(se===void 0&&(O==="instanceMatrix"&&R.instanceMatrix&&(se=R.instanceMatrix),O==="instanceColor"&&R.instanceColor&&(se=R.instanceColor)),j===void 0||j.attribute!==se||se&&j.data!==se.data)return!0;X++}return o.attributesNum!==X||o.index!==te}(L,I,b,U),N&&function(R,z,B,te){const ue={},Z=z.attributes;let X=0;const q=B.getAttributes();for(const O in q)if(q[O].location>=0){let j=Z[O];j===void 0&&(O==="instanceMatrix"&&R.instanceMatrix&&(j=R.instanceMatrix),O==="instanceColor"&&R.instanceColor&&(j=R.instanceColor));const se={};se.attribute=j,j&&j.data&&(se.data=j.data),ue[O]=se,X++}o.attributes=ue,o.attributesNum=X,o.index=te}(L,I,b,U)}else{const K=w.wireframe===!0;o.geometry===I.id&&o.program===b.id&&o.wireframe===K||(o.geometry=I.id,o.program=b.id,o.wireframe=K,N=!0)}U!==null&&t.update(U,r.ELEMENT_ARRAY_BUFFER),(N||u)&&(u=!1,function(K,R,z,B){if(n.isWebGL2===!1&&(K.isInstancedMesh||B.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const te=B.attributes,ue=z.getAttributes(),Z=R.defaultAttributeValues;for(const X in ue){const q=ue[X];if(q.location>=0){let O=te[X];if(O===void 0&&(X==="instanceMatrix"&&K.instanceMatrix&&(O=K.instanceMatrix),X==="instanceColor"&&K.instanceColor&&(O=K.instanceColor)),O!==void 0){const j=O.normalized,se=O.itemSize,S=t.get(O);if(S===void 0)continue;const E=S.buffer,D=S.type,V=S.bytesPerElement,P=n.isWebGL2===!0&&(D===r.INT||D===r.UNSIGNED_INT||O.gpuType===co);if(O.isInterleavedBufferAttribute){const k=O.data,Q=k.stride,J=O.offset;if(k.isInstancedInterleavedBuffer){for(let ne=0;ne<q.locationSize;ne++)p(q.location+ne,k.meshPerAttribute);K.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let ne=0;ne<q.locationSize;ne++)v(q.location+ne);r.bindBuffer(r.ARRAY_BUFFER,E);for(let ne=0;ne<q.locationSize;ne++)m(q.location+ne,se/q.locationSize,D,j,Q*V,(J+se/q.locationSize*ne)*V,P)}else{if(O.isInstancedBufferAttribute){for(let k=0;k<q.locationSize;k++)p(q.location+k,O.meshPerAttribute);K.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let k=0;k<q.locationSize;k++)v(q.location+k);r.bindBuffer(r.ARRAY_BUFFER,E);for(let k=0;k<q.locationSize;k++)m(q.location+k,se/q.locationSize,D,j,se*V,se/q.locationSize*k*V,P)}}else if(Z!==void 0){const j=Z[X];if(j!==void 0)switch(j.length){case 2:r.vertexAttrib2fv(q.location,j);break;case 3:r.vertexAttrib3fv(q.location,j);break;case 4:r.vertexAttrib4fv(q.location,j);break;default:r.vertexAttrib1fv(q.location,j)}}}}M()}(L,w,b,I),U!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))},reset:_,resetDefaultState:C,dispose:function(){_();for(const L in l){const w=l[L];for(const b in w){const I=w[b];for(const U in I)h(I[U].object),delete I[U];delete w[b]}delete l[L]}},releaseStatesOfGeometry:function(L){if(l[L.id]===void 0)return;const w=l[L.id];for(const b in w){const I=w[b];for(const U in I)h(I[U].object),delete I[U];delete w[b]}delete l[L.id]},releaseStatesOfProgram:function(L){for(const w in l){const b=l[w];if(b[L.id]===void 0)continue;const I=b[L.id];for(const U in I)h(I[U].object),delete I[U];delete b[L.id]}},initAttributes:g,enableAttribute:v,disableUnusedAttributes:M}}function Dl(r,e,t,n){const i=n.isWebGL2;let a;this.setMode=function(s){a=s},this.render=function(s,l){r.drawArrays(a,s,l),t.update(l,a,1)},this.renderInstances=function(s,l,c){if(c===0)return;let o,u;if(i)o=r,u="drawArraysInstanced";else if(o=e.get("ANGLE_instanced_arrays"),u="drawArraysInstancedANGLE",o===null)return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");o[u](a,s,l,c),t.update(l,a,c)},this.renderMultiDraw=function(s,l,c){if(c===0)return;const o=e.get("WEBGL_multi_draw");if(o===null)for(let u=0;u<c;u++)this.render(s[u],l[u]);else{o.multiDrawArraysWEBGL(a,s,0,l,0,c);let u=0;for(let d=0;d<c;d++)u+=l[d];t.update(u,a,1)}}}function Il(r,e,t){let n;function i(C){if(C==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&r.constructor.name==="WebGL2RenderingContext";let s=t.precision!==void 0?t.precision:"highp";const l=i(s);l!==s&&(console.warn("THREE.WebGLRenderer:",s,"not supported, using",l,"instead."),s=l);const c=a||e.has("WEBGL_draw_buffers"),o=t.logarithmicDepthBuffer===!0,u=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=r.getParameter(r.MAX_TEXTURE_SIZE),f=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),v=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),p=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),m=d>0,_=a||e.has("OES_texture_float");return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:function(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n},getMaxPrecision:i,precision:s,logarithmicDepthBuffer:o,maxTextures:u,maxVertexTextures:d,maxTextureSize:h,maxCubemapSize:f,maxAttributes:g,maxVertexUniforms:v,maxVaryings:p,maxFragmentUniforms:M,vertexTextures:m,floatFragmentTextures:_,floatVertexTextures:m&&_,maxSamples:a?r.getParameter(r.MAX_SAMPLES):0}}function Nl(r){const e=this;let t=null,n=0,i=!1,a=!1;const s=new on,l=new Le,c={value:null,needsUpdate:!1};function o(u,d,h,f){const g=u!==null?u.length:0;let v=null;if(g!==0){if(v=c.value,f!==!0||v===null){const p=h+4*g,M=d.matrixWorldInverse;l.getNormalMatrix(M),(v===null||v.length<p)&&(v=new Float32Array(p));for(let m=0,_=h;m!==g;++m,_+=4)s.copy(u[m]).applyMatrix4(M,l),s.normal.toArray(v,_),v[_+3]=s.constant}c.value=v,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,v}this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const h=u.length!==0||d||n!==0||i;return i=d,n=u.length,h},this.beginShadows=function(){a=!0,o(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,d){t=o(u,d,0)},this.setState=function(u,d,h){const f=u.clippingPlanes,g=u.clipIntersection,v=u.clipShadows,p=r.get(u);if(!i||f===null||f.length===0||a&&!v)a?o(null):function(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}();else{const M=a?0:n,m=4*M;let _=p.clippingState||null;c.value=_,_=o(f,d,m,h);for(let C=0;C!==m;++C)_[C]=t[C];p.clippingState=_,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}}}function Ol(r){let e=new WeakMap;function t(i,a){return a===ta?i.mapping=Qn:a===na&&(i.mapping=$n),i}function n(i){const a=i.target;a.removeEventListener("dispose",n);const s=e.get(a);s!==void 0&&(e.delete(a),s.dispose())}return{get:function(i){if(i&&i.isTexture){const a=i.mapping;if(a===ta||a===na){if(e.has(i))return t(e.get(i).texture,i.mapping);{const s=i.image;if(s&&s.height>0){const l=new Al(s.height/2);return l.fromEquirectangularTexture(r,i),e.set(i,l),i.addEventListener("dispose",n),t(l.texture,i.mapping)}return null}}}return i},dispose:function(){e=new WeakMap}}}class Co extends da{constructor(e=-1,t=1,n=1,i=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let a=n-e,s=n+e,l=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const o=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=o*this.view.offsetX,s=a+o*this.view.width,l-=u*this.view.offsetY,c=l-u*this.view.height}this.projectionMatrix.makeOrthographic(a,s,l,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ss=[.125,.215,.35,.446,.526,.582],fi=20,Gr=new Co,Es=new Ee;let Vr=null,kr=0,Wr=0;const Mn=(1+Math.sqrt(5))/2,qn=1/Mn,ys=[new A(1,1,1),new A(-1,1,1),new A(1,1,-1),new A(-1,1,-1),new A(0,Mn,qn),new A(0,Mn,-qn),new A(qn,0,Mn),new A(-qn,0,Mn),new A(Mn,qn,0),new A(-Mn,qn,0)];class Ts{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Vr=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Wr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,i,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=As(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ws(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vr,kr,Wr),e.scissorTest=!1,ji(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qn||e.mapping===$n?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vr=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Wr=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:vi,format:Ot,colorSpace:Kt,depthBuffer:!1},i=bs(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bs(e,t,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=function(s){const l=[],c=[],o=[];let u=s;const d=s-4+1+Ss.length;for(let h=0;h<d;h++){const f=Math.pow(2,u);c.push(f);let g=1/f;h>s-4?g=Ss[h-s+4-1]:h===0&&(g=0),o.push(g);const v=1/(f-2),p=-v,M=1+v,m=[p,p,M,p,M,M,p,p,M,M,p,M],_=6,C=6,L=3,w=2,b=1,I=new Float32Array(L*C*_),U=new Float32Array(w*C*_),N=new Float32Array(b*C*_);for(let R=0;R<_;R++){const z=R%3*2/3-1,B=R>2?0:-1,te=[z,B,0,z+2/3,B,0,z+2/3,B+1,0,z,B,0,z+2/3,B+1,0,z,B+1,0];I.set(te,L*C*R),U.set(m,w*C*R);const ue=[R,R,R,R,R,R];N.set(ue,b*C*R)}const K=new ht;K.setAttribute("position",new Dt(I,L)),K.setAttribute("uv",new Dt(U,w)),K.setAttribute("faceIndex",new Dt(N,b)),l.push(K),u>4&&u--}return{lodPlanes:l,sizeLods:c,sigmas:o}}(a)),this._blurMaterial=function(s,l,c){const o=new Float32Array(fi),u=new A(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:fi,CUBEUV_TEXEL_WIDTH:1/l,CUBEUV_TEXEL_HEIGHT:1/c,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:o},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:u}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}(a,e,t)}return i}_compileMaterial(e){const t=new Ze(this._lodPlanes[0],e);this._renderer.compile(t,Gr)}_sceneToCubeUV(e,t,n,i){const a=new Et(90,1,t,n),s=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,o=c.autoClear,u=c.toneMapping;c.getClearColor(Es),c.toneMapping=un,c.autoClear=!1;const d=new ha({name:"PMREM.Background",side:ut,depthWrite:!1,depthTest:!1}),h=new Ze(new ai,d);let f=!1;const g=e.background;g?g.isColor&&(d.color.copy(g),e.background=null,f=!0):(d.color.copy(Es),f=!0);for(let v=0;v<6;v++){const p=v%3;p===0?(a.up.set(0,s[v],0),a.lookAt(l[v],0,0)):p===1?(a.up.set(0,0,s[v]),a.lookAt(0,l[v],0)):(a.up.set(0,s[v],0),a.lookAt(0,0,l[v]));const M=this._cubeSize;ji(i,p*M,v>2?M:0,M,M),c.setRenderTarget(i),f&&c.render(h,a),c.render(e,a)}h.geometry.dispose(),h.material.dispose(),c.toneMapping=u,c.autoClear=o,e.background=g}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Qn||e.mapping===$n;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=As()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ws());const a=i?this._cubemapMaterial:this._equirectMaterial,s=new Ze(this._lodPlanes[0],a);a.uniforms.envMap.value=e;const l=this._cubeSize;ji(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,Gr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const a=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),s=ys[(i-1)%ys.length];this._blur(e,i-1,i,a,s)}t.autoClear=n}_blur(e,t,n,i,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,i,"latitudinal",a),this._halfBlur(s,e,n,n,i,"longitudinal",a)}_halfBlur(e,t,n,i,a,s,l){const c=this._renderer,o=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=new Ze(this._lodPlanes[i],o),d=o.uniforms,h=this._sizeLods[n]-1,f=isFinite(a)?Math.PI/(2*h):2*Math.PI/39,g=a/f,v=isFinite(a)?1+Math.floor(3*g):fi;v>fi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${v} samples when the maximum is set to 20`);const p=[];let M=0;for(let C=0;C<fi;++C){const L=C/g,w=Math.exp(-L*L/2);p.push(w),C===0?M+=w:C<v&&(M+=2*w)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=v,d.weights.value=p,d.latitudinal.value=s==="latitudinal",l&&(d.poleAxis.value=l);const{_lodMax:m}=this;d.dTheta.value=f,d.mipInt.value=m-n;const _=this._sizeLods[i];ji(t,3*_*(i>m-4?i-m+4:0),4*(this._cubeSize-_),3*_,2*_),c.setRenderTarget(t),c.render(u,Gr)}}function bs(r,e,t){const n=new wn(r,e,t);return n.texture.mapping=ar,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ji(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function ws(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function As(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function pa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Fl(r){let e=new WeakMap,t=null;function n(i){const a=i.target;a.removeEventListener("dispose",n);const s=e.get(a);s!==void 0&&(e.delete(a),s.dispose())}return{get:function(i){if(i&&i.isTexture){const a=i.mapping,s=a===ta||a===na,l=a===Qn||a===$n;if(s||l){if(i.isRenderTargetTexture&&i.needsPMREMUpdate===!0){i.needsPMREMUpdate=!1;let c=e.get(i);return t===null&&(t=new Ts(r)),c=s?t.fromEquirectangular(i,c):t.fromCubemap(i,c),e.set(i,c),c.texture}if(e.has(i))return e.get(i).texture;{const c=i.image;if(s&&c&&c.height>0||l&&c&&function(o){let u=0;const d=6;for(let h=0;h<d;h++)o[h]!==void 0&&u++;return u===d}(c)){t===null&&(t=new Ts(r));const o=s?t.fromEquirectangular(i):t.fromCubemap(i);return e.set(i,o),i.addEventListener("dispose",n),o.texture}return null}}}return i},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function Bl(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function zl(r,e,t,n){const i={},a=new WeakMap;function s(c){const o=c.target;o.index!==null&&e.remove(o.index);for(const d in o.attributes)e.remove(o.attributes[d]);for(const d in o.morphAttributes){const h=o.morphAttributes[d];for(let f=0,g=h.length;f<g;f++)e.remove(h[f])}o.removeEventListener("dispose",s),delete i[o.id];const u=a.get(o);u&&(e.remove(u),a.delete(o)),n.releaseStatesOfGeometry(o),o.isInstancedBufferGeometry===!0&&delete o._maxInstanceCount,t.memory.geometries--}function l(c){const o=[],u=c.index,d=c.attributes.position;let h=0;if(u!==null){const v=u.array;h=u.version;for(let p=0,M=v.length;p<M;p+=3){const m=v[p+0],_=v[p+1],C=v[p+2];o.push(m,_,_,C,C,m)}}else{if(d===void 0)return;{const v=d.array;h=d.version;for(let p=0,M=v.length/3-1;p<M;p+=3){const m=p+0,_=p+1,C=p+2;o.push(m,_,_,C,C,m)}}}const f=new(vo(o)?bo:To)(o,1);f.version=h;const g=a.get(c);g&&e.remove(g),a.set(c,f)}return{get:function(c,o){return i[o.id]===!0||(o.addEventListener("dispose",s),i[o.id]=!0,t.memory.geometries++),o},update:function(c){const o=c.attributes;for(const d in o)e.update(o[d],r.ARRAY_BUFFER);const u=c.morphAttributes;for(const d in u){const h=u[d];for(let f=0,g=h.length;f<g;f++)e.update(h[f],r.ARRAY_BUFFER)}},getWireframeAttribute:function(c){const o=a.get(c);if(o){const u=c.index;u!==null&&o.version<u.version&&l(c)}else l(c);return a.get(c)}}}function Hl(r,e,t,n){const i=n.isWebGL2;let a,s,l;this.setMode=function(c){a=c},this.setIndex=function(c){s=c.type,l=c.bytesPerElement},this.render=function(c,o){r.drawElements(a,o,s,c*l),t.update(o,a,1)},this.renderInstances=function(c,o,u){if(u===0)return;let d,h;if(i)d=r,h="drawElementsInstanced";else if(d=e.get("ANGLE_instanced_arrays"),h="drawElementsInstancedANGLE",d===null)return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");d[h](a,o,s,c*l,u),t.update(o,a,u)},this.renderMultiDraw=function(c,o,u){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let h=0;h<u;h++)this.render(c[h]/l,o[h]);else{d.multiDrawElementsWEBGL(a,o,0,s,c,0,u);let h=0;for(let f=0;f<u;f++)h+=o[f];t.update(h,a,1)}}}function Gl(r){const e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,n,i){switch(e.calls++,n){case r.TRIANGLES:e.triangles+=i*(t/3);break;case r.LINES:e.lines+=i*(t/2);break;case r.LINE_STRIP:e.lines+=i*(t-1);break;case r.LINE_LOOP:e.lines+=i*t;break;case r.POINTS:e.points+=i*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function Vl(r,e){return r[0]-e[0]}function kl(r,e){return Math.abs(e[1])-Math.abs(r[1])}function Wl(r,e,t){const n={},i=new Float32Array(8),a=new WeakMap,s=new Ve,l=[];for(let c=0;c<8;c++)l[c]=[c,0];return{update:function(c,o,u){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let g=a.get(o);if(g===void 0||g.count!==f){let z=function(){K.dispose(),a.delete(o),o.removeEventListener("dispose",z)};g!==void 0&&g.texture.dispose();const M=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,C=o.morphAttributes.position||[],L=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let b=0;M===!0&&(b=1),m===!0&&(b=2),_===!0&&(b=3);let I=o.attributes.position.count*b,U=1;I>e.maxTextureSize&&(U=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const N=new Float32Array(I*U*4*f),K=new So(N,I,U,f);K.type=cn,K.needsUpdate=!0;const R=4*b;for(let B=0;B<f;B++){const te=C[B],ue=L[B],Z=w[B],X=I*U*4*B;for(let q=0;q<te.count;q++){const O=q*R;M===!0&&(s.fromBufferAttribute(te,q),N[X+O+0]=s.x,N[X+O+1]=s.y,N[X+O+2]=s.z,N[X+O+3]=0),m===!0&&(s.fromBufferAttribute(ue,q),N[X+O+4]=s.x,N[X+O+5]=s.y,N[X+O+6]=s.z,N[X+O+7]=0),_===!0&&(s.fromBufferAttribute(Z,q),N[X+O+8]=s.x,N[X+O+9]=s.y,N[X+O+10]=s.z,N[X+O+11]=Z.itemSize===4?s.w:1)}}g={count:f,texture:K,size:new _e(I,U)},a.set(o,g),o.addEventListener("dispose",z)}let v=0;for(let M=0;M<d.length;M++)v+=d[M];const p=o.morphTargetsRelative?1:1-v;u.getUniforms().setValue(r,"morphTargetBaseInfluence",p),u.getUniforms().setValue(r,"morphTargetInfluences",d),u.getUniforms().setValue(r,"morphTargetsTexture",g.texture,t),u.getUniforms().setValue(r,"morphTargetsTextureSize",g.size)}else{const h=d===void 0?0:d.length;let f=n[o.id];if(f===void 0||f.length!==h){f=[];for(let m=0;m<h;m++)f[m]=[m,0];n[o.id]=f}for(let m=0;m<h;m++){const _=f[m];_[0]=m,_[1]=d[m]}f.sort(kl);for(let m=0;m<8;m++)m<h&&f[m][1]?(l[m][0]=f[m][0],l[m][1]=f[m][1]):(l[m][0]=Number.MAX_SAFE_INTEGER,l[m][1]=0);l.sort(Vl);const g=o.morphAttributes.position,v=o.morphAttributes.normal;let p=0;for(let m=0;m<8;m++){const _=l[m],C=_[0],L=_[1];C!==Number.MAX_SAFE_INTEGER&&L?(g&&o.getAttribute("morphTarget"+m)!==g[C]&&o.setAttribute("morphTarget"+m,g[C]),v&&o.getAttribute("morphNormal"+m)!==v[C]&&o.setAttribute("morphNormal"+m,v[C]),i[m]=L,p+=L):(g&&o.hasAttribute("morphTarget"+m)===!0&&o.deleteAttribute("morphTarget"+m),v&&o.hasAttribute("morphNormal"+m)===!0&&o.deleteAttribute("morphNormal"+m),i[m]=0)}const M=o.morphTargetsRelative?1:1-p;u.getUniforms().setValue(r,"morphTargetBaseInfluence",M),u.getUniforms().setValue(r,"morphTargetInfluences",i)}}}}function Xl(r,e,t,n){let i=new WeakMap;function a(s){const l=s.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:function(s){const l=n.render.frame,c=s.geometry,o=e.get(s,c);if(i.get(o)!==l&&(e.update(o),i.set(o,l)),s.isInstancedMesh&&(s.hasEventListener("dispose",a)===!1&&s.addEventListener("dispose",a),i.get(s)!==l&&(t.update(s.instanceMatrix,r.ARRAY_BUFFER),s.instanceColor!==null&&t.update(s.instanceColor,r.ARRAY_BUFFER),i.set(s,l))),s.isSkinnedMesh){const u=s.skeleton;i.get(u)!==l&&(u.update(),i.set(u,l))}return o},dispose:function(){i=new WeakMap}}}class Lo extends mt{constructor(e,t,n,i,a,s,l,c,o,u){if((u=u!==void 0?u:Tn)!==Tn&&u!==ei)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Tn&&(n=ln),n===void 0&&u===ei&&(n=yn),super(null,i,a,s,l,c,u,n,o),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=l!==void 0?l:at,this.minFilter=c!==void 0?c:at,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Po=new mt,Uo=new Lo(1,1);Uo.compareFunction=515;const Do=new So,Io=new pl,No=new Ao,Rs=[],Cs=[],Ls=new Float32Array(16),Ps=new Float32Array(9),Us=new Float32Array(4);function si(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let a=Rs[i];if(a===void 0&&(a=new Float32Array(i),Rs[i]=a),e!==0){n.toArray(a,0);for(let s=1,l=0;s!==e;++s)l+=t,r[s].toArray(a,l)}return a}function je(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Ye(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function ur(r,e){let t=Cs[e];t===void 0&&(t=new Int32Array(e),Cs[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function jl(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Yl(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(je(t,e))return;r.uniform2fv(this.addr,e),Ye(t,e)}}function ql(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(je(t,e))return;r.uniform3fv(this.addr,e),Ye(t,e)}}function Kl(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(je(t,e))return;r.uniform4fv(this.addr,e),Ye(t,e)}}function Zl(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(je(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Ye(t,e)}else{if(je(t,n))return;Us.set(n),r.uniformMatrix2fv(this.addr,!1,Us),Ye(t,n)}}function Jl(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(je(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Ye(t,e)}else{if(je(t,n))return;Ps.set(n),r.uniformMatrix3fv(this.addr,!1,Ps),Ye(t,n)}}function Ql(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(je(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Ye(t,e)}else{if(je(t,n))return;Ls.set(n),r.uniformMatrix4fv(this.addr,!1,Ls),Ye(t,n)}}function $l(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function ec(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(je(t,e))return;r.uniform2iv(this.addr,e),Ye(t,e)}}function tc(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(je(t,e))return;r.uniform3iv(this.addr,e),Ye(t,e)}}function nc(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(je(t,e))return;r.uniform4iv(this.addr,e),Ye(t,e)}}function ic(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function rc(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(je(t,e))return;r.uniform2uiv(this.addr,e),Ye(t,e)}}function ac(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(je(t,e))return;r.uniform3uiv(this.addr,e),Ye(t,e)}}function sc(r,e){const t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(je(t,e))return;r.uniform4uiv(this.addr,e),Ye(t,e)}}function oc(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);const a=this.type===r.SAMPLER_2D_SHADOW?Uo:Po;t.setTexture2D(e||a,i)}function lc(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Io,i)}function cc(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||No,i)}function uc(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Do,i)}function hc(r,e){r.uniform1fv(this.addr,e)}function dc(r,e){const t=si(e,this.size,2);r.uniform2fv(this.addr,t)}function pc(r,e){const t=si(e,this.size,3);r.uniform3fv(this.addr,t)}function fc(r,e){const t=si(e,this.size,4);r.uniform4fv(this.addr,t)}function mc(r,e){const t=si(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function gc(r,e){const t=si(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function _c(r,e){const t=si(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function vc(r,e){r.uniform1iv(this.addr,e)}function xc(r,e){r.uniform2iv(this.addr,e)}function Mc(r,e){r.uniform3iv(this.addr,e)}function Sc(r,e){r.uniform4iv(this.addr,e)}function Ec(r,e){r.uniform1uiv(this.addr,e)}function yc(r,e){r.uniform2uiv(this.addr,e)}function Tc(r,e){r.uniform3uiv(this.addr,e)}function bc(r,e){r.uniform4uiv(this.addr,e)}function wc(r,e,t){const n=this.cache,i=e.length,a=ur(t,i);je(n,a)||(r.uniform1iv(this.addr,a),Ye(n,a));for(let s=0;s!==i;++s)t.setTexture2D(e[s]||Po,a[s])}function Ac(r,e,t){const n=this.cache,i=e.length,a=ur(t,i);je(n,a)||(r.uniform1iv(this.addr,a),Ye(n,a));for(let s=0;s!==i;++s)t.setTexture3D(e[s]||Io,a[s])}function Rc(r,e,t){const n=this.cache,i=e.length,a=ur(t,i);je(n,a)||(r.uniform1iv(this.addr,a),Ye(n,a));for(let s=0;s!==i;++s)t.setTextureCube(e[s]||No,a[s])}function Cc(r,e,t){const n=this.cache,i=e.length,a=ur(t,i);je(n,a)||(r.uniform1iv(this.addr,a),Ye(n,a));for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||Do,a[s])}class Lc{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=function(i){switch(i){case 5126:return jl;case 35664:return Yl;case 35665:return ql;case 35666:return Kl;case 35674:return Zl;case 35675:return Jl;case 35676:return Ql;case 5124:case 35670:return $l;case 35667:case 35671:return ec;case 35668:case 35672:return tc;case 35669:case 35673:return nc;case 5125:return ic;case 36294:return rc;case 36295:return ac;case 36296:return sc;case 35678:case 36198:case 36298:case 36306:case 35682:return oc;case 35679:case 36299:case 36307:return lc;case 35680:case 36300:case 36308:case 36293:return cc;case 36289:case 36303:case 36311:case 36292:return uc}}(t.type)}}class Pc{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=function(i){switch(i){case 5126:return hc;case 35664:return dc;case 35665:return pc;case 35666:return fc;case 35674:return mc;case 35675:return gc;case 35676:return _c;case 5124:case 35670:return vc;case 35667:case 35671:return xc;case 35668:case 35672:return Mc;case 35669:case 35673:return Sc;case 5125:return Ec;case 36294:return yc;case 36295:return Tc;case 36296:return bc;case 35678:case 36198:case 36298:case 36306:case 35682:return wc;case 35679:case 36299:case 36307:return Ac;case 35680:case 36300:case 36308:case 36293:return Rc;case 36289:case 36303:case 36311:case 36292:return Cc}}(t.type)}}class Uc{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let a=0,s=i.length;a!==s;++a){const l=i[a];l.setValue(e,t[l.id],n)}}}const Xr=/(\w+)(\])?(\[|\.)?/g;function Ds(r,e){r.seq.push(e),r.map[e.id]=e}function Dc(r,e,t){const n=r.name,i=n.length;for(Xr.lastIndex=0;;){const a=Xr.exec(n),s=Xr.lastIndex;let l=a[1];const c=a[2]==="]",o=a[3];if(c&&(l|=0),o===void 0||o==="["&&s+2===i){Ds(t,o===void 0?new Lc(l,r,e):new Pc(l,r,e));break}{let u=t.map[l];u===void 0&&(u=new Uc(l),Ds(t,u)),t=u}}}class Qi{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const a=e.getActiveUniform(t,i);Dc(a,e.getUniformLocation(t,a.name),this)}}setValue(e,t,n,i){const a=this.map[t];a!==void 0&&a.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let a=0,s=t.length;a!==s;++a){const l=t[a],c=n[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,a=e.length;i!==a;++i){const s=e[i];s.id in t&&n.push(s)}return n}}function Is(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const Ic=37297;let Nc=0;function Ns(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const a=/ERROR: 0:(\d+)/.exec(i);if(a){const s=parseInt(a[1]);return t.toUpperCase()+`

`+i+`

`+function(l,c){const o=l.split(`
`),u=[],d=Math.max(c-6,0),h=Math.min(c+6,o.length);for(let f=d;f<h;f++){const g=f+1;u.push(`${g===c?">":" "} ${g}: ${o[f]}`)}return u.join(`
`)}(r.getShaderSource(e),s)}return i}function Oc(r,e){const t=function(n){const i=Fe.getPrimaries(Fe.workingColorSpace),a=Fe.getPrimaries(n);let s;switch(i===a?s="":i===nr&&a===tr?s="LinearDisplayP3ToLinearSRGB":i===tr&&a===nr&&(s="LinearSRGBToLinearDisplayP3"),n){case Kt:case sr:return[s,"LinearTransferOETF"];case Qe:case ua:return[s,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[s,"LinearTransferOETF"]}}(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Fc(r,e){let t;switch(e){case $o:t="Linear";break;case el:t="Reinhard";break;case tl:t="OptimizedCineon";break;case nl:t="ACESFilmic";break;case rl:t="AgX";break;case il:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Kn(r){return r!==""}function Os(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fs(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Bc=/^[ \t]*#include +<([\w\d./]+)>/gm;function la(r){return r.replace(Bc,Hc)}const zc=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Hc(r,e){let t=ye[e];if(t===void 0){const n=zc.get(e);if(n===void 0)throw new Error("Can not resolve #include <"+e+">");t=ye[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n)}return la(t)}const Gc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bs(r){return r.replace(Gc,Vc)}function Vc(r,e,t,n){let i="";for(let a=parseInt(e);a<parseInt(t);a++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return i}function zs(r){let e="precision "+r.precision+` float;
precision `+r.precision+" int;";return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function kc(r,e,t,n){const i=r.getContext(),a=t.defines;let s=t.vertexShader,l=t.fragmentShader;const c=function(R){let z="SHADOWMAP_TYPE_BASIC";return R.shadowMapType===ao?z="SHADOWMAP_TYPE_PCF":R.shadowMapType===so?z="SHADOWMAP_TYPE_PCF_SOFT":R.shadowMapType===Yt&&(z="SHADOWMAP_TYPE_VSM"),z}(t),o=function(R){let z="ENVMAP_TYPE_CUBE";if(R.envMap)switch(R.envMapMode){case Qn:case $n:z="ENVMAP_TYPE_CUBE";break;case ar:z="ENVMAP_TYPE_CUBE_UV"}return z}(t),u=function(R){let z="ENVMAP_MODE_REFLECTION";return R.envMap&&R.envMapMode===$n&&(z="ENVMAP_MODE_REFRACTION"),z}(t),d=function(R){let z="ENVMAP_BLENDING_NONE";if(R.envMap)switch(R.combine){case oo:z="ENVMAP_BLENDING_MULTIPLY";break;case Jo:z="ENVMAP_BLENDING_MIX";break;case Qo:z="ENVMAP_BLENDING_ADD"}return z}(t),h=function(R){const z=R.envMapCubeUVHeight;if(z===null)return null;const B=Math.log2(z)-2,te=1/z;return{texelWidth:1/(3*Math.max(Math.pow(2,B),112)),texelHeight:te,maxMip:B}}(t),f=t.isWebGL2?"":function(R){return[R.extensionDerivatives||R.envMapCubeUVHeight||R.bumpMap||R.normalMapTangentSpace||R.clearcoatNormalMap||R.flatShading||R.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(R.extensionFragDepth||R.logarithmicDepthBuffer)&&R.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",R.extensionDrawBuffers&&R.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(R.extensionShaderTextureLOD||R.envMap||R.transmission)&&R.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Kn).join(`
`)}(t),g=function(R){return[R.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Kn).join(`
`)}(t),v=function(R){const z=[];for(const B in R){const te=R[B];te!==!1&&z.push("#define "+B+" "+te)}return z.join(`
`)}(a),p=i.createProgram();let M,m,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(M=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Kn).join(`
`),M.length>0&&(M+=`
`),m=[f,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Kn).join(`
`),m.length>0&&(m+=`
`)):(M=[zs(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Kn).join(`
`),m=[f,zs(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+o:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==un?"#define TONE_MAPPING":"",t.toneMapping!==un?ye.tonemapping_pars_fragment:"",t.toneMapping!==un?Fc("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ye.colorspace_pars_fragment,Oc("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Kn).join(`
`)),s=la(s),s=Os(s,t),s=Fs(s,t),l=la(l),l=Os(l,t),l=Fs(l,t),s=Bs(s),l=Bs(l),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,M=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,m=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===is?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===is?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const C=_+M+s,L=_+m+l,w=Is(i,i.VERTEX_SHADER,C),b=Is(i,i.FRAGMENT_SHADER,L);function I(R){if(r.debug.checkShaderErrors){const z=i.getProgramInfoLog(p).trim(),B=i.getShaderInfoLog(w).trim(),te=i.getShaderInfoLog(b).trim();let ue=!0,Z=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(ue=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,p,w,b);else{const X=Ns(i,w,"vertex"),q=Ns(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+z+`
`+X+`
`+q)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):B!==""&&te!==""||(Z=!1);Z&&(R.diagnostics={runnable:ue,programLog:z,vertexShader:{log:B,prefix:M},fragmentShader:{log:te,prefix:m}})}i.deleteShader(w),i.deleteShader(b),U=new Qi(i,p),N=function(z,B){const te={},ue=z.getProgramParameter(B,z.ACTIVE_ATTRIBUTES);for(let Z=0;Z<ue;Z++){const X=z.getActiveAttrib(B,Z),q=X.name;let O=1;X.type===z.FLOAT_MAT2&&(O=2),X.type===z.FLOAT_MAT3&&(O=3),X.type===z.FLOAT_MAT4&&(O=4),te[q]={type:X.type,location:z.getAttribLocation(B,q),locationSize:O}}return te}(i,p)}let U,N;i.attachShader(p,w),i.attachShader(p,b),t.index0AttributeName!==void 0?i.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p),this.getUniforms=function(){return U===void 0&&I(this),U},this.getAttributes=function(){return N===void 0&&I(this),N};let K=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return K===!1&&(K=i.getProgramParameter(p,Ic)),K},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Nc++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=b,this}let Wc=0;class Xc{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),a=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(i)===!1&&(s.add(i),i.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new jc(e),t.set(e,n)),n}}class jc{constructor(e){this.id=Wc++,this.code=e,this.usedTimes=0}}function Yc(r,e,t,n,i,a,s){const l=new Eo,c=new Xc,o=[],u=i.isWebGL2,d=i.logarithmicDepthBuffer,h=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(p){return p===0?"uv":`uv${p}`}return{getParameters:function(p,M,m,_,C){const L=_.fog,w=C.geometry,b=p.isMeshStandardMaterial?_.environment:null,I=(p.isMeshStandardMaterial?t:e).get(p.envMap||b),U=I&&I.mapping===ar?I.image.height:null,N=g[p.type];p.precision!==null&&(f=i.getMaxPrecision(p.precision),f!==p.precision&&console.warn("THREE.WebGLProgram.getParameters:",p.precision,"not supported, using",f,"instead."));const K=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,R=K!==void 0?K.length:0;let z,B,te,ue,Z=0;if(w.morphAttributes.position!==void 0&&(Z=1),w.morphAttributes.normal!==void 0&&(Z=2),w.morphAttributes.color!==void 0&&(Z=3),N){const Se=Nt[N];z=Se.vertexShader,B=Se.fragmentShader}else z=p.vertexShader,B=p.fragmentShader,c.update(p),te=c.getVertexShaderID(p),ue=c.getFragmentShaderID(p);const X=r.getRenderTarget(),q=C.isInstancedMesh===!0,O=C.isBatchedMesh===!0,j=!!p.map,se=!!p.matcap,S=!!I,E=!!p.aoMap,D=!!p.lightMap,V=!!p.bumpMap,P=!!p.normalMap,k=!!p.displacementMap,Q=!!p.emissiveMap,J=!!p.metalnessMap,ne=!!p.roughnessMap,le=p.anisotropy>0,de=p.clearcoat>0,y=p.iridescence>0,ie=p.sheen>0,G=p.transmission>0,H=le&&!!p.anisotropyMap,ee=de&&!!p.clearcoatMap,oe=de&&!!p.clearcoatNormalMap,ce=de&&!!p.clearcoatRoughnessMap,fe=y&&!!p.iridescenceMap,Me=y&&!!p.iridescenceThicknessMap,pe=ie&&!!p.sheenColorMap,me=ie&&!!p.sheenRoughnessMap,we=!!p.specularMap,Je=!!p.specularColorMap,ge=!!p.specularIntensityMap,Ae=G&&!!p.transmissionMap,Re=G&&!!p.thicknessMap,Cn=!!p.gradientMap,Bt=!!p.alphaMap,Ln=p.alphaTest>0,ot=!!p.alphaHash,$e=!!p.extensions,dt=!!w.attributes.uv1,x=!!w.attributes.uv2,he=!!w.attributes.uv3;let be=un;return p.toneMapped&&(X!==null&&X.isXRRenderTarget!==!0||(be=r.toneMapping)),{isWebGL2:u,shaderID:N,shaderType:p.type,shaderName:p.name,vertexShader:z,fragmentShader:B,defines:p.defines,customVertexShaderID:te,customFragmentShaderID:ue,isRawShaderMaterial:p.isRawShaderMaterial===!0,glslVersion:p.glslVersion,precision:f,batching:O,instancing:q,instancingColor:q&&C.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:X===null?r.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Kt,map:j,matcap:se,envMap:S,envMapMode:S&&I.mapping,envMapCubeUVHeight:U,aoMap:E,lightMap:D,bumpMap:V,normalMap:P,displacementMap:h&&k,emissiveMap:Q,normalMapObjectSpace:P&&p.normalMapType===1,normalMapTangentSpace:P&&p.normalMapType===0,metalnessMap:J,roughnessMap:ne,anisotropy:le,anisotropyMap:H,clearcoat:de,clearcoatMap:ee,clearcoatNormalMap:oe,clearcoatRoughnessMap:ce,iridescence:y,iridescenceMap:fe,iridescenceThicknessMap:Me,sheen:ie,sheenColorMap:pe,sheenRoughnessMap:me,specularMap:we,specularColorMap:Je,specularIntensityMap:ge,transmission:G,transmissionMap:Ae,thicknessMap:Re,gradientMap:Cn,opaque:p.transparent===!1&&p.blending===1,alphaMap:Bt,alphaTest:Ln,alphaHash:ot,combine:p.combine,mapUv:j&&v(p.map.channel),aoMapUv:E&&v(p.aoMap.channel),lightMapUv:D&&v(p.lightMap.channel),bumpMapUv:V&&v(p.bumpMap.channel),normalMapUv:P&&v(p.normalMap.channel),displacementMapUv:k&&v(p.displacementMap.channel),emissiveMapUv:Q&&v(p.emissiveMap.channel),metalnessMapUv:J&&v(p.metalnessMap.channel),roughnessMapUv:ne&&v(p.roughnessMap.channel),anisotropyMapUv:H&&v(p.anisotropyMap.channel),clearcoatMapUv:ee&&v(p.clearcoatMap.channel),clearcoatNormalMapUv:oe&&v(p.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&v(p.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&v(p.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&v(p.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&v(p.sheenColorMap.channel),sheenRoughnessMapUv:me&&v(p.sheenRoughnessMap.channel),specularMapUv:we&&v(p.specularMap.channel),specularColorMapUv:Je&&v(p.specularColorMap.channel),specularIntensityMapUv:ge&&v(p.specularIntensityMap.channel),transmissionMapUv:Ae&&v(p.transmissionMap.channel),thicknessMapUv:Re&&v(p.thicknessMap.channel),alphaMapUv:Bt&&v(p.alphaMap.channel),vertexTangents:!!w.attributes.tangent&&(P||le),vertexColors:p.vertexColors,vertexAlphas:p.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,vertexUv1s:dt,vertexUv2s:x,vertexUv3s:he,pointsUvs:C.isPoints===!0&&!!w.attributes.uv&&(j||Bt),fog:!!L,useFog:p.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:p.flatShading===!0,sizeAttenuation:p.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:C.isSkinnedMesh===!0,morphTargets:w.morphAttributes.position!==void 0,morphNormals:w.morphAttributes.normal!==void 0,morphColors:w.morphAttributes.color!==void 0,morphTargetsCount:R,morphTextureStride:Z,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:p.dithering,shadowMapEnabled:r.shadowMap.enabled&&m.length>0,shadowMapType:r.shadowMap.type,toneMapping:be,useLegacyLights:r._useLegacyLights,decodeVideoTexture:j&&p.map.isVideoTexture===!0&&Fe.getTransfer(p.map.colorSpace)===Be,premultipliedAlpha:p.premultipliedAlpha,doubleSided:p.side===2,flipSided:p.side===ut,useDepthPacking:p.depthPacking>=0,depthPacking:p.depthPacking||0,index0AttributeName:p.index0AttributeName,extensionDerivatives:$e&&p.extensions.derivatives===!0,extensionFragDepth:$e&&p.extensions.fragDepth===!0,extensionDrawBuffers:$e&&p.extensions.drawBuffers===!0,extensionShaderTextureLOD:$e&&p.extensions.shaderTextureLOD===!0,extensionClipCullDistance:$e&&p.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:p.customProgramCacheKey()}},getProgramCacheKey:function(p){const M=[];if(p.shaderID?M.push(p.shaderID):(M.push(p.customVertexShaderID),M.push(p.customFragmentShaderID)),p.defines!==void 0)for(const m in p.defines)M.push(m),M.push(p.defines[m]);return p.isRawShaderMaterial===!1&&(function(m,_){m.push(_.precision),m.push(_.outputColorSpace),m.push(_.envMapMode),m.push(_.envMapCubeUVHeight),m.push(_.mapUv),m.push(_.alphaMapUv),m.push(_.lightMapUv),m.push(_.aoMapUv),m.push(_.bumpMapUv),m.push(_.normalMapUv),m.push(_.displacementMapUv),m.push(_.emissiveMapUv),m.push(_.metalnessMapUv),m.push(_.roughnessMapUv),m.push(_.anisotropyMapUv),m.push(_.clearcoatMapUv),m.push(_.clearcoatNormalMapUv),m.push(_.clearcoatRoughnessMapUv),m.push(_.iridescenceMapUv),m.push(_.iridescenceThicknessMapUv),m.push(_.sheenColorMapUv),m.push(_.sheenRoughnessMapUv),m.push(_.specularMapUv),m.push(_.specularColorMapUv),m.push(_.specularIntensityMapUv),m.push(_.transmissionMapUv),m.push(_.thicknessMapUv),m.push(_.combine),m.push(_.fogExp2),m.push(_.sizeAttenuation),m.push(_.morphTargetsCount),m.push(_.morphAttributeCount),m.push(_.numDirLights),m.push(_.numPointLights),m.push(_.numSpotLights),m.push(_.numSpotLightMaps),m.push(_.numHemiLights),m.push(_.numRectAreaLights),m.push(_.numDirLightShadows),m.push(_.numPointLightShadows),m.push(_.numSpotLightShadows),m.push(_.numSpotLightShadowsWithMaps),m.push(_.numLightProbes),m.push(_.shadowMapType),m.push(_.toneMapping),m.push(_.numClippingPlanes),m.push(_.numClipIntersection),m.push(_.depthPacking)}(M,p),function(m,_){l.disableAll(),_.isWebGL2&&l.enable(0),_.supportsVertexTextures&&l.enable(1),_.instancing&&l.enable(2),_.instancingColor&&l.enable(3),_.matcap&&l.enable(4),_.envMap&&l.enable(5),_.normalMapObjectSpace&&l.enable(6),_.normalMapTangentSpace&&l.enable(7),_.clearcoat&&l.enable(8),_.iridescence&&l.enable(9),_.alphaTest&&l.enable(10),_.vertexColors&&l.enable(11),_.vertexAlphas&&l.enable(12),_.vertexUv1s&&l.enable(13),_.vertexUv2s&&l.enable(14),_.vertexUv3s&&l.enable(15),_.vertexTangents&&l.enable(16),_.anisotropy&&l.enable(17),_.alphaHash&&l.enable(18),_.batching&&l.enable(19),m.push(l.mask),l.disableAll(),_.fog&&l.enable(0),_.useFog&&l.enable(1),_.flatShading&&l.enable(2),_.logarithmicDepthBuffer&&l.enable(3),_.skinning&&l.enable(4),_.morphTargets&&l.enable(5),_.morphNormals&&l.enable(6),_.morphColors&&l.enable(7),_.premultipliedAlpha&&l.enable(8),_.shadowMapEnabled&&l.enable(9),_.useLegacyLights&&l.enable(10),_.doubleSided&&l.enable(11),_.flipSided&&l.enable(12),_.useDepthPacking&&l.enable(13),_.dithering&&l.enable(14),_.transmission&&l.enable(15),_.sheen&&l.enable(16),_.opaque&&l.enable(17),_.pointsUvs&&l.enable(18),_.decodeVideoTexture&&l.enable(19),m.push(l.mask)}(M,p),M.push(r.outputColorSpace)),M.push(p.customProgramCacheKey),M.join()},getUniforms:function(p){const M=g[p.type];let m;if(M){const _=Nt[M];m=bl.clone(_.uniforms)}else m=p.uniforms;return m},acquireProgram:function(p,M){let m;for(let _=0,C=o.length;_<C;_++){const L=o[_];if(L.cacheKey===M){m=L,++m.usedTimes;break}}return m===void 0&&(m=new kc(r,M,p,a),o.push(m)),m},releaseProgram:function(p){if(--p.usedTimes==0){const M=o.indexOf(p);o[M]=o[o.length-1],o.pop(),p.destroy()}},releaseShaderCache:function(p){c.remove(p)},programs:o,dispose:function(){c.dispose()}}}function qc(){let r=new WeakMap;return{get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,n){r.get(e)[t]=n},dispose:function(){r=new WeakMap}}}function Kc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function Hs(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Gs(){const r=[];let e=0;const t=[],n=[],i=[];function a(s,l,c,o,u,d){let h=r[e];return h===void 0?(h={id:s.id,object:s,geometry:l,material:c,groupOrder:o,renderOrder:s.renderOrder,z:u,group:d},r[e]=h):(h.id=s.id,h.object=s,h.geometry=l,h.material=c,h.groupOrder=o,h.renderOrder=s.renderOrder,h.z=u,h.group=d),e++,h}return{opaque:t,transmissive:n,transparent:i,init:function(){e=0,t.length=0,n.length=0,i.length=0},push:function(s,l,c,o,u,d){const h=a(s,l,c,o,u,d);c.transmission>0?n.push(h):c.transparent===!0?i.push(h):t.push(h)},unshift:function(s,l,c,o,u,d){const h=a(s,l,c,o,u,d);c.transmission>0?n.unshift(h):c.transparent===!0?i.unshift(h):t.unshift(h)},finish:function(){for(let s=e,l=r.length;s<l;s++){const c=r[s];if(c.id===null)break;c.id=null,c.object=null,c.geometry=null,c.material=null,c.group=null}},sort:function(s,l){t.length>1&&t.sort(s||Kc),n.length>1&&n.sort(l||Hs),i.length>1&&i.sort(l||Hs)}}}function Zc(){let r=new WeakMap;return{get:function(e,t){const n=r.get(e);let i;return n===void 0?(i=new Gs,r.set(e,[i])):t>=n.length?(i=new Gs,n.push(i)):i=n[t],i},dispose:function(){r=new WeakMap}}}function Jc(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new Ee};break;case"SpotLight":t={position:new A,direction:new A,color:new Ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new Ee,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new Ee,groundColor:new Ee};break;case"RectAreaLight":t={color:new Ee,position:new A,halfWidth:new A,halfHeight:new A}}return r[e.id]=t,t}}}let Qc=0;function $c(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function eu(r,e){const t=new Jc,n=function(){const c={};return{get:function(o){if(c[o.id]!==void 0)return c[o.id];let u;switch(o.type){case"DirectionalLight":case"SpotLight":u={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"PointLight":u={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e,shadowCameraNear:1,shadowCameraFar:1e3}}return c[o.id]=u,u}}}(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new A);const a=new A,s=new Te,l=new Te;return{setup:function(c,o){let u=0,d=0,h=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let f=0,g=0,v=0,p=0,M=0,m=0,_=0,C=0,L=0,w=0,b=0;c.sort($c);const I=o===!0?Math.PI:1;for(let N=0,K=c.length;N<K;N++){const R=c[N],z=R.color,B=R.intensity,te=R.distance,ue=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=z.r*B*I,d+=z.g*B*I,h+=z.b*B*I;else if(R.isLightProbe){for(let Z=0;Z<9;Z++)i.probe[Z].addScaledVector(R.sh.coefficients[Z],B);b++}else if(R.isDirectionalLight){const Z=t.get(R);if(Z.color.copy(R.color).multiplyScalar(R.intensity*I),R.castShadow){const X=R.shadow,q=n.get(R);q.shadowBias=X.bias,q.shadowNormalBias=X.normalBias,q.shadowRadius=X.radius,q.shadowMapSize=X.mapSize,i.directionalShadow[f]=q,i.directionalShadowMap[f]=ue,i.directionalShadowMatrix[f]=R.shadow.matrix,m++}i.directional[f]=Z,f++}else if(R.isSpotLight){const Z=t.get(R);Z.position.setFromMatrixPosition(R.matrixWorld),Z.color.copy(z).multiplyScalar(B*I),Z.distance=te,Z.coneCos=Math.cos(R.angle),Z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Z.decay=R.decay,i.spot[v]=Z;const X=R.shadow;if(R.map&&(i.spotLightMap[L]=R.map,L++,X.updateMatrices(R),R.castShadow&&w++),i.spotLightMatrix[v]=X.matrix,R.castShadow){const q=n.get(R);q.shadowBias=X.bias,q.shadowNormalBias=X.normalBias,q.shadowRadius=X.radius,q.shadowMapSize=X.mapSize,i.spotShadow[v]=q,i.spotShadowMap[v]=ue,C++}v++}else if(R.isRectAreaLight){const Z=t.get(R);Z.color.copy(z).multiplyScalar(B),Z.halfWidth.set(.5*R.width,0,0),Z.halfHeight.set(0,.5*R.height,0),i.rectArea[p]=Z,p++}else if(R.isPointLight){const Z=t.get(R);if(Z.color.copy(R.color).multiplyScalar(R.intensity*I),Z.distance=R.distance,Z.decay=R.decay,R.castShadow){const X=R.shadow,q=n.get(R);q.shadowBias=X.bias,q.shadowNormalBias=X.normalBias,q.shadowRadius=X.radius,q.shadowMapSize=X.mapSize,q.shadowCameraNear=X.camera.near,q.shadowCameraFar=X.camera.far,i.pointShadow[g]=q,i.pointShadowMap[g]=ue,i.pointShadowMatrix[g]=R.shadow.matrix,_++}i.point[g]=Z,g++}else if(R.isHemisphereLight){const Z=t.get(R);Z.skyColor.copy(R.color).multiplyScalar(B*I),Z.groundColor.copy(R.groundColor).multiplyScalar(B*I),i.hemi[M]=Z,M++}}p>0&&(e.isWebGL2?r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=re.LTC_FLOAT_1,i.rectAreaLTC2=re.LTC_FLOAT_2):(i.rectAreaLTC1=re.LTC_HALF_1,i.rectAreaLTC2=re.LTC_HALF_2):r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=re.LTC_FLOAT_1,i.rectAreaLTC2=re.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=re.LTC_HALF_1,i.rectAreaLTC2=re.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const U=i.hash;U.directionalLength===f&&U.pointLength===g&&U.spotLength===v&&U.rectAreaLength===p&&U.hemiLength===M&&U.numDirectionalShadows===m&&U.numPointShadows===_&&U.numSpotShadows===C&&U.numSpotMaps===L&&U.numLightProbes===b||(i.directional.length=f,i.spot.length=v,i.rectArea.length=p,i.point.length=g,i.hemi.length=M,i.directionalShadow.length=m,i.directionalShadowMap.length=m,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=C,i.spotShadowMap.length=C,i.directionalShadowMatrix.length=m,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=C+L-w,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=b,U.directionalLength=f,U.pointLength=g,U.spotLength=v,U.rectAreaLength=p,U.hemiLength=M,U.numDirectionalShadows=m,U.numPointShadows=_,U.numSpotShadows=C,U.numSpotMaps=L,U.numLightProbes=b,i.version=Qc++)},setupView:function(c,o){let u=0,d=0,h=0,f=0,g=0;const v=o.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const m=c[p];if(m.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(m.matrixWorld),a.setFromMatrixPosition(m.target.matrixWorld),_.direction.sub(a),_.direction.transformDirection(v),u++}else if(m.isSpotLight){const _=i.spot[h];_.position.setFromMatrixPosition(m.matrixWorld),_.position.applyMatrix4(v),_.direction.setFromMatrixPosition(m.matrixWorld),a.setFromMatrixPosition(m.target.matrixWorld),_.direction.sub(a),_.direction.transformDirection(v),h++}else if(m.isRectAreaLight){const _=i.rectArea[f];_.position.setFromMatrixPosition(m.matrixWorld),_.position.applyMatrix4(v),l.identity(),s.copy(m.matrixWorld),s.premultiply(v),l.extractRotation(s),_.halfWidth.set(.5*m.width,0,0),_.halfHeight.set(0,.5*m.height,0),_.halfWidth.applyMatrix4(l),_.halfHeight.applyMatrix4(l),f++}else if(m.isPointLight){const _=i.point[d];_.position.setFromMatrixPosition(m.matrixWorld),_.position.applyMatrix4(v),d++}else if(m.isHemisphereLight){const _=i.hemi[g];_.direction.setFromMatrixPosition(m.matrixWorld),_.direction.transformDirection(v),g++}}},state:i}}function Vs(r,e){const t=new eu(r,e),n=[],i=[];return{init:function(){n.length=0,i.length=0},state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:function(a){t.setup(n,a)},setupLightsView:function(a){t.setupView(n,a)},pushLight:function(a){n.push(a)},pushShadow:function(a){i.push(a)}}}function tu(r,e){let t=new WeakMap;return{get:function(n,i=0){const a=t.get(n);let s;return a===void 0?(s=new Vs(r,e),t.set(n,[s])):i>=a.length?(s=new Vs(r,e),a.push(s)):s=a[i],s},dispose:function(){t=new WeakMap}}}class nu extends ri{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class iu extends ri{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function ru(r,e,t){let n=new lr;const i=new _e,a=new _e,s=new Ve,l=new nu({depthPacking:3201}),c=new iu,o={},u=t.maxTextureSize,d={[hn]:ut,[ut]:hn,2:2},h=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _e},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new ht;g.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ze(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ao;let M=this.type;function m(w,b){const I=e.update(v);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new wn(i.x,i.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,r.setRenderTarget(w.mapPass),r.clear(),r.renderBufferDirect(b,null,I,h,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,r.setRenderTarget(w.map),r.clear(),r.renderBufferDirect(b,null,I,f,v,null)}function _(w,b,I,U){let N=null;const K=I.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(K!==void 0)N=K;else if(N=I.isPointLight===!0?c:l,r.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const R=N.uuid,z=b.uuid;let B=o[R];B===void 0&&(B={},o[R]=B);let te=B[z];te===void 0&&(te=N.clone(),B[z]=te,b.addEventListener("dispose",L)),N=te}return N.visible=b.visible,N.wireframe=b.wireframe,N.side=U===Yt?b.shadowSide!==null?b.shadowSide:b.side:b.shadowSide!==null?b.shadowSide:d[b.side],N.alphaMap=b.alphaMap,N.alphaTest=b.alphaTest,N.map=b.map,N.clipShadows=b.clipShadows,N.clippingPlanes=b.clippingPlanes,N.clipIntersection=b.clipIntersection,N.displacementMap=b.displacementMap,N.displacementScale=b.displacementScale,N.displacementBias=b.displacementBias,N.wireframeLinewidth=b.wireframeLinewidth,N.linewidth=b.linewidth,I.isPointLight===!0&&N.isMeshDistanceMaterial===!0&&(r.properties.get(N).light=I),N}function C(w,b,I,U,N){if(w.visible===!1)return;if(w.layers.test(b.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&N===Yt)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,w.matrixWorld);const R=e.update(w),z=w.material;if(Array.isArray(z)){const B=R.groups;for(let te=0,ue=B.length;te<ue;te++){const Z=B[te],X=z[Z.materialIndex];if(X&&X.visible){const q=_(w,X,U,N);w.onBeforeShadow(r,w,b,I,R,q,Z),r.renderBufferDirect(I,null,R,q,w,Z),w.onAfterShadow(r,w,b,I,R,q,Z)}}}else if(z.visible){const B=_(w,z,U,N);w.onBeforeShadow(r,w,b,I,R,B,null),r.renderBufferDirect(I,null,R,B,w,null),w.onAfterShadow(r,w,b,I,R,B,null)}}const K=w.children;for(let R=0,z=K.length;R<z;R++)C(K[R],b,I,U,N)}function L(w){w.target.removeEventListener("dispose",L);for(const b in o){const I=o[b],U=w.target.uuid;U in I&&(I[U].dispose(),delete I[U])}}this.render=function(w,b,I){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const U=r.getRenderTarget(),N=r.getActiveCubeFace(),K=r.getActiveMipmapLevel(),R=r.state;R.setBlending(0),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const z=M!==Yt&&this.type===Yt,B=M===Yt&&this.type!==Yt;for(let te=0,ue=w.length;te<ue;te++){const Z=w[te],X=Z.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const q=X.getFrameExtents();if(i.multiply(q),a.copy(X.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/q.x),i.x=a.x*q.x,X.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/q.y),i.y=a.y*q.y,X.mapSize.y=a.y)),X.map===null||z===!0||B===!0){const j=this.type!==Yt?{minFilter:at,magFilter:at}:{};X.map!==null&&X.map.dispose(),X.map=new wn(i.x,i.y,j),X.map.texture.name=Z.name+".shadowMap",X.camera.updateProjectionMatrix()}r.setRenderTarget(X.map),r.clear();const O=X.getViewportCount();for(let j=0;j<O;j++){const se=X.getViewport(j);s.set(a.x*se.x,a.y*se.y,a.x*se.z,a.y*se.w),R.viewport(s),X.updateMatrices(Z,j),n=X.getFrustum(),C(b,I,X.camera,Z,this.type)}X.isPointLightShadow!==!0&&this.type===Yt&&m(X,I),X.needsUpdate=!1}M=this.type,p.needsUpdate=!1,r.setRenderTarget(U,N,K)}}function au(r,e,t){const n=t.isWebGL2,i=new function(){let y=!1;const ie=new Ve;let G=null;const H=new Ve(0,0,0,0);return{setMask:function(ee){G===ee||y||(r.colorMask(ee,ee,ee,ee),G=ee)},setLocked:function(ee){y=ee},setClear:function(ee,oe,ce,fe,Me){Me===!0&&(ee*=fe,oe*=fe,ce*=fe),ie.set(ee,oe,ce,fe),H.equals(ie)===!1&&(r.clearColor(ee,oe,ce,fe),H.copy(ie))},reset:function(){y=!1,G=null,H.set(-1,0,0,0)}}},a=new function(){let y=!1,ie=null,G=null,H=null;return{setTest:function(ee){ee?V(r.DEPTH_TEST):P(r.DEPTH_TEST)},setMask:function(ee){ie===ee||y||(r.depthMask(ee),ie=ee)},setFunc:function(ee){if(G!==ee){switch(ee){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:default:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL)}G=ee}},setLocked:function(ee){y=ee},setClear:function(ee){H!==ee&&(r.clearDepth(ee),H=ee)},reset:function(){y=!1,ie=null,G=null,H=null}}},s=new function(){let y=!1,ie=null,G=null,H=null,ee=null,oe=null,ce=null,fe=null,Me=null;return{setTest:function(pe){y||(pe?V(r.STENCIL_TEST):P(r.STENCIL_TEST))},setMask:function(pe){ie===pe||y||(r.stencilMask(pe),ie=pe)},setFunc:function(pe,me,we){G===pe&&H===me&&ee===we||(r.stencilFunc(pe,me,we),G=pe,H=me,ee=we)},setOp:function(pe,me,we){oe===pe&&ce===me&&fe===we||(r.stencilOp(pe,me,we),oe=pe,ce=me,fe=we)},setLocked:function(pe){y=pe},setClear:function(pe){Me!==pe&&(r.clearStencil(pe),Me=pe)},reset:function(){y=!1,ie=null,G=null,H=null,ee=null,oe=null,ce=null,fe=null,Me=null}}},l=new WeakMap,c=new WeakMap;let o={},u={},d=new WeakMap,h=[],f=null,g=!1,v=null,p=null,M=null,m=null,_=null,C=null,L=null,w=new Ee(0,0,0),b=0,I=!1,U=null,N=null,K=null,R=null,z=null;const B=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,ue=0;const Z=r.getParameter(r.VERSION);Z.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(Z)[1]),te=ue>=1):Z.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),te=ue>=2);let X=null,q={};const O=r.getParameter(r.SCISSOR_BOX),j=r.getParameter(r.VIEWPORT),se=new Ve().fromArray(O),S=new Ve().fromArray(j);function E(y,ie,G,H){const ee=new Uint8Array(4),oe=r.createTexture();r.bindTexture(y,oe),r.texParameteri(y,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(y,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ce=0;ce<G;ce++)!n||y!==r.TEXTURE_3D&&y!==r.TEXTURE_2D_ARRAY?r.texImage2D(ie+ce,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ee):r.texImage3D(ie,0,r.RGBA,1,1,H,0,r.RGBA,r.UNSIGNED_BYTE,ee);return oe}const D={};function V(y){o[y]!==!0&&(r.enable(y),o[y]=!0)}function P(y){o[y]!==!1&&(r.disable(y),o[y]=!1)}D[r.TEXTURE_2D]=E(r.TEXTURE_2D,r.TEXTURE_2D,1),D[r.TEXTURE_CUBE_MAP]=E(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(D[r.TEXTURE_2D_ARRAY]=E(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),D[r.TEXTURE_3D]=E(r.TEXTURE_3D,r.TEXTURE_3D,1,1)),i.setClear(0,0,0,1),a.setClear(1),s.setClear(0),V(r.DEPTH_TEST),a.setFunc(3),ne(!1),le(1),V(r.CULL_FACE),J(0);const k={[Sn]:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};if(n)k[103]=r.MIN,k[104]=r.MAX;else{const y=e.get("EXT_blend_minmax");y!==null&&(k[103]=y.MIN_EXT,k[104]=y.MAX_EXT)}const Q={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,[$r]:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,[ea]:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function J(y,ie,G,H,ee,oe,ce,fe,Me,pe){if(y!==0){if(g===!1&&(V(r.BLEND),g=!0),y===5)ee=ee||ie,oe=oe||G,ce=ce||H,ie===p&&ee===_||(r.blendEquationSeparate(k[ie],k[ee]),p=ie,_=ee),G===M&&H===m&&oe===C&&ce===L||(r.blendFuncSeparate(Q[G],Q[H],Q[oe],Q[ce]),M=G,m=H,C=oe,L=ce),fe.equals(w)!==!1&&Me===b||(r.blendColor(fe.r,fe.g,fe.b,Me),w.copy(fe),b=Me),v=y,I=!1;else if(y!==v||pe!==I){if(p===Sn&&_===Sn||(r.blendEquation(r.FUNC_ADD),p=Sn,_=Sn),pe)switch(y){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",y)}else switch(y){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",y)}M=null,m=null,C=null,L=null,w.set(0,0,0),b=0,v=y,I=pe}}else g===!0&&(P(r.BLEND),g=!1)}function ne(y){U!==y&&(y?r.frontFace(r.CW):r.frontFace(r.CCW),U=y)}function le(y){y!==0?(V(r.CULL_FACE),y!==N&&(y===1?r.cullFace(r.BACK):y===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):P(r.CULL_FACE),N=y}function de(y,ie,G){y?(V(r.POLYGON_OFFSET_FILL),R===ie&&z===G||(r.polygonOffset(ie,G),R=ie,z=G)):P(r.POLYGON_OFFSET_FILL)}return{buffers:{color:i,depth:a,stencil:s},enable:V,disable:P,bindFramebuffer:function(y,ie){return u[y]!==ie&&(r.bindFramebuffer(y,ie),u[y]=ie,n&&(y===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=ie),y===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=ie)),!0)},drawBuffers:function(y,ie){let G=h,H=!1;if(y)if(G=d.get(ie),G===void 0&&(G=[],d.set(ie,G)),y.isWebGLMultipleRenderTargets){const ee=y.texture;if(G.length!==ee.length||G[0]!==r.COLOR_ATTACHMENT0){for(let oe=0,ce=ee.length;oe<ce;oe++)G[oe]=r.COLOR_ATTACHMENT0+oe;G.length=ee.length,H=!0}}else G[0]!==r.COLOR_ATTACHMENT0&&(G[0]=r.COLOR_ATTACHMENT0,H=!0);else G[0]!==r.BACK&&(G[0]=r.BACK,H=!0);H&&(t.isWebGL2?r.drawBuffers(G):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(G))},useProgram:function(y){return f!==y&&(r.useProgram(y),f=y,!0)},setBlending:J,setMaterial:function(y,ie){y.side===2?P(r.CULL_FACE):V(r.CULL_FACE);let G=y.side===ut;ie&&(G=!G),ne(G),y.blending===1&&y.transparent===!1?J(0):J(y.blending,y.blendEquation,y.blendSrc,y.blendDst,y.blendEquationAlpha,y.blendSrcAlpha,y.blendDstAlpha,y.blendColor,y.blendAlpha,y.premultipliedAlpha),a.setFunc(y.depthFunc),a.setTest(y.depthTest),a.setMask(y.depthWrite),i.setMask(y.colorWrite);const H=y.stencilWrite;s.setTest(H),H&&(s.setMask(y.stencilWriteMask),s.setFunc(y.stencilFunc,y.stencilRef,y.stencilFuncMask),s.setOp(y.stencilFail,y.stencilZFail,y.stencilZPass)),de(y.polygonOffset,y.polygonOffsetFactor,y.polygonOffsetUnits),y.alphaToCoverage===!0?V(r.SAMPLE_ALPHA_TO_COVERAGE):P(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:ne,setCullFace:le,setLineWidth:function(y){y!==K&&(te&&r.lineWidth(y),K=y)},setPolygonOffset:de,setScissorTest:function(y){y?V(r.SCISSOR_TEST):P(r.SCISSOR_TEST)},activeTexture:function(y){y===void 0&&(y=r.TEXTURE0+B-1),X!==y&&(r.activeTexture(y),X=y)},bindTexture:function(y,ie,G){G===void 0&&(G=X===null?r.TEXTURE0+B-1:X);let H=q[G];H===void 0&&(H={type:void 0,texture:void 0},q[G]=H),H.type===y&&H.texture===ie||(X!==G&&(r.activeTexture(G),X=G),r.bindTexture(y,ie||D[y]),H.type=y,H.texture=ie)},unbindTexture:function(){const y=q[X];y!==void 0&&y.type!==void 0&&(r.bindTexture(y.type,null),y.type=void 0,y.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},compressedTexImage3D:function(){try{r.compressedTexImage3D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texImage2D:function(){try{r.texImage2D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texImage3D:function(){try{r.texImage3D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},updateUBOMapping:function(y,ie){let G=c.get(ie);G===void 0&&(G=new WeakMap,c.set(ie,G));let H=G.get(y);H===void 0&&(H=r.getUniformBlockIndex(ie,y.name),G.set(y,H))},uniformBlockBinding:function(y,ie){const G=c.get(ie).get(y);l.get(ie)!==G&&(r.uniformBlockBinding(ie,G,y.__bindingPointIndex),l.set(ie,G))},texStorage2D:function(){try{r.texStorage2D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texStorage3D:function(){try{r.texStorage3D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texSubImage2D:function(){try{r.texSubImage2D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texSubImage3D:function(){try{r.texSubImage3D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},scissor:function(y){se.equals(y)===!1&&(r.scissor(y.x,y.y,y.z,y.w),se.copy(y))},viewport:function(y){S.equals(y)===!1&&(r.viewport(y.x,y.y,y.z,y.w),S.copy(y))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),n===!0&&(r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),o={},X=null,q={},u={},d=new WeakMap,h=[],f=null,g=!1,v=null,p=null,M=null,m=null,_=null,C=null,L=null,w=new Ee(0,0,0),b=0,I=!1,U=null,N=null,K=null,R=null,z=null,se.set(0,0,r.canvas.width,r.canvas.height),S.set(0,0,r.canvas.width,r.canvas.height),i.reset(),a.reset(),s.reset()}}}function su(r,e,t,n,i,a,s){const l=i.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let d;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(S,E){return f?new OffscreenCanvas(S,E):rr("canvas")}function v(S,E,D,V){let P=1;if((S.width>V||S.height>V)&&(P=V/Math.max(S.width,S.height)),P<1||E===!0){if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){const k=E?oa:Math.floor,Q=k(P*S.width),J=k(P*S.height);d===void 0&&(d=g(Q,J));const ne=D?g(Q,J):d;return ne.width=Q,ne.height=J,ne.getContext("2d").drawImage(S,0,0,Q,J),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Q+"x"+J+")."),ne}return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S}return S}function p(S){return rs(S.width)&&rs(S.height)}function M(S,E){return S.generateMipmaps&&E&&S.minFilter!==at&&S.minFilter!==Ut}function m(S){r.generateMipmap(S)}function _(S,E,D,V,P=!1){if(l===!1)return E;if(S!==null){if(r[S]!==void 0)return r[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let k=E;if(E===r.RED&&(D===r.FLOAT&&(k=r.R32F),D===r.HALF_FLOAT&&(k=r.R16F),D===r.UNSIGNED_BYTE&&(k=r.R8)),E===r.RED_INTEGER&&(D===r.UNSIGNED_BYTE&&(k=r.R8UI),D===r.UNSIGNED_SHORT&&(k=r.R16UI),D===r.UNSIGNED_INT&&(k=r.R32UI),D===r.BYTE&&(k=r.R8I),D===r.SHORT&&(k=r.R16I),D===r.INT&&(k=r.R32I)),E===r.RG&&(D===r.FLOAT&&(k=r.RG32F),D===r.HALF_FLOAT&&(k=r.RG16F),D===r.UNSIGNED_BYTE&&(k=r.RG8)),E===r.RGBA){const Q=P?er:Fe.getTransfer(V);D===r.FLOAT&&(k=r.RGBA32F),D===r.HALF_FLOAT&&(k=r.RGBA16F),D===r.UNSIGNED_BYTE&&(k=Q===Be?r.SRGB8_ALPHA8:r.RGBA8),D===r.UNSIGNED_SHORT_4_4_4_4&&(k=r.RGBA4),D===r.UNSIGNED_SHORT_5_5_5_1&&(k=r.RGB5_A1)}return k!==r.R16F&&k!==r.R32F&&k!==r.RG16F&&k!==r.RG32F&&k!==r.RGBA16F&&k!==r.RGBA32F||e.get("EXT_color_buffer_float"),k}function C(S,E,D){return M(S,D)===!0||S.isFramebufferTexture&&S.minFilter!==at&&S.minFilter!==Ut?Math.log2(Math.max(E.width,E.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?E.mipmaps.length:1}function L(S){return S===at||S===La||S===_r?r.NEAREST:r.LINEAR}function w(S){const E=S.target;E.removeEventListener("dispose",w),function(D){const V=n.get(D);if(V.__webglInit===void 0)return;const P=D.source,k=h.get(P);if(k){const Q=k[V.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&I(D),Object.keys(k).length===0&&h.delete(P)}n.remove(D)}(E),E.isVideoTexture&&u.delete(E)}function b(S){const E=S.target;E.removeEventListener("dispose",b),function(D){const V=D.texture,P=n.get(D),k=n.get(V);if(k.__webglTexture!==void 0&&(r.deleteTexture(k.__webglTexture),s.memory.textures--),D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(P.__webglFramebuffer[Q]))for(let J=0;J<P.__webglFramebuffer[Q].length;J++)r.deleteFramebuffer(P.__webglFramebuffer[Q][J]);else r.deleteFramebuffer(P.__webglFramebuffer[Q]);P.__webglDepthbuffer&&r.deleteRenderbuffer(P.__webglDepthbuffer[Q])}else{if(Array.isArray(P.__webglFramebuffer))for(let Q=0;Q<P.__webglFramebuffer.length;Q++)r.deleteFramebuffer(P.__webglFramebuffer[Q]);else r.deleteFramebuffer(P.__webglFramebuffer);if(P.__webglDepthbuffer&&r.deleteRenderbuffer(P.__webglDepthbuffer),P.__webglMultisampledFramebuffer&&r.deleteFramebuffer(P.__webglMultisampledFramebuffer),P.__webglColorRenderbuffer)for(let Q=0;Q<P.__webglColorRenderbuffer.length;Q++)P.__webglColorRenderbuffer[Q]&&r.deleteRenderbuffer(P.__webglColorRenderbuffer[Q]);P.__webglDepthRenderbuffer&&r.deleteRenderbuffer(P.__webglDepthRenderbuffer)}if(D.isWebGLMultipleRenderTargets)for(let Q=0,J=V.length;Q<J;Q++){const ne=n.get(V[Q]);ne.__webglTexture&&(r.deleteTexture(ne.__webglTexture),s.memory.textures--),n.remove(V[Q])}n.remove(V),n.remove(D)}(E)}function I(S){const E=n.get(S);r.deleteTexture(E.__webglTexture);const D=S.source;delete h.get(D)[E.__cacheKey],s.memory.textures--}let U=0;function N(S,E){const D=n.get(S);if(S.isVideoTexture&&function(V){const P=s.render.frame;u.get(V)!==P&&(u.set(V,P),V.update())}(S),S.isRenderTargetTexture===!1&&S.version>0&&D.__version!==S.version){const V=S.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(V.complete!==!1)return void ue(D,S,E);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(r.TEXTURE_2D,D.__webglTexture,r.TEXTURE0+E)}const K={[ia]:r.REPEAT,[qt]:r.CLAMP_TO_EDGE,[ra]:r.MIRRORED_REPEAT},R={[at]:r.NEAREST,[La]:r.NEAREST_MIPMAP_NEAREST,[_r]:r.NEAREST_MIPMAP_LINEAR,[Ut]:r.LINEAR,[al]:r.LINEAR_MIPMAP_NEAREST,[$i]:r.LINEAR_MIPMAP_LINEAR},z={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function B(S,E,D){if(D?(r.texParameteri(S,r.TEXTURE_WRAP_S,K[E.wrapS]),r.texParameteri(S,r.TEXTURE_WRAP_T,K[E.wrapT]),S!==r.TEXTURE_3D&&S!==r.TEXTURE_2D_ARRAY||r.texParameteri(S,r.TEXTURE_WRAP_R,K[E.wrapR]),r.texParameteri(S,r.TEXTURE_MAG_FILTER,R[E.magFilter]),r.texParameteri(S,r.TEXTURE_MIN_FILTER,R[E.minFilter])):(r.texParameteri(S,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(S,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),S!==r.TEXTURE_3D&&S!==r.TEXTURE_2D_ARRAY||r.texParameteri(S,r.TEXTURE_WRAP_R,r.CLAMP_TO_EDGE),E.wrapS===qt&&E.wrapT===qt||console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(S,r.TEXTURE_MAG_FILTER,L(E.magFilter)),r.texParameteri(S,r.TEXTURE_MIN_FILTER,L(E.minFilter)),E.minFilter!==at&&E.minFilter!==Ut&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(r.texParameteri(S,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(S,r.TEXTURE_COMPARE_FUNC,z[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const V=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===at||E.minFilter!==_r&&E.minFilter!==$i||E.type===cn&&e.has("OES_texture_float_linear")===!1||l===!1&&E.type===vi&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(r.texParameterf(S,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function te(S,E){let D=!1;S.__webglInit===void 0&&(S.__webglInit=!0,E.addEventListener("dispose",w));const V=E.source;let P=h.get(V);P===void 0&&(P={},h.set(V,P));const k=function(Q){const J=[];return J.push(Q.wrapS),J.push(Q.wrapT),J.push(Q.wrapR||0),J.push(Q.magFilter),J.push(Q.minFilter),J.push(Q.anisotropy),J.push(Q.internalFormat),J.push(Q.format),J.push(Q.type),J.push(Q.generateMipmaps),J.push(Q.premultiplyAlpha),J.push(Q.flipY),J.push(Q.unpackAlignment),J.push(Q.colorSpace),J.join()}(E);if(k!==S.__cacheKey){P[k]===void 0&&(P[k]={texture:r.createTexture(),usedTimes:0},s.memory.textures++,D=!0),P[k].usedTimes++;const Q=P[S.__cacheKey];Q!==void 0&&(P[S.__cacheKey].usedTimes--,Q.usedTimes===0&&I(E)),S.__cacheKey=k,S.__webglTexture=P[k].texture}return D}function ue(S,E,D){let V=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(V=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(V=r.TEXTURE_3D);const P=te(S,E),k=E.source;t.bindTexture(V,S.__webglTexture,r.TEXTURE0+D);const Q=n.get(k);if(k.version!==Q.__version||P===!0){t.activeTexture(r.TEXTURE0+D);const J=Fe.getPrimaries(Fe.workingColorSpace),ne=E.colorSpace===Ft?null:Fe.getPrimaries(E.colorSpace),le=E.colorSpace===Ft||J===ne?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const de=function(me){return!l&&(me.wrapS!==qt||me.wrapT!==qt||me.minFilter!==at&&me.minFilter!==Ut)}(E)&&p(E.image)===!1;let y=v(E.image,de,!1,i.maxTextureSize);y=se(E,y);const ie=p(y)||l,G=a.convert(E.format,E.colorSpace);let H,ee=a.convert(E.type),oe=_(E.internalFormat,G,ee,E.colorSpace,E.isVideoTexture);B(V,E,ie);const ce=E.mipmaps,fe=l&&E.isVideoTexture!==!0&&oe!==go,Me=Q.__version===void 0||P===!0,pe=C(E,y,ie);if(E.isDepthTexture)oe=r.DEPTH_COMPONENT,l?oe=E.type===cn?r.DEPTH_COMPONENT32F:E.type===ln?r.DEPTH_COMPONENT24:E.type===yn?r.DEPTH24_STENCIL8:r.DEPTH_COMPONENT16:E.type===cn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===Tn&&oe===r.DEPTH_COMPONENT&&E.type!==ca&&E.type!==ln&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=ln,ee=a.convert(E.type)),E.format===ei&&oe===r.DEPTH_COMPONENT&&(oe=r.DEPTH_STENCIL,E.type!==yn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=yn,ee=a.convert(E.type))),Me&&(fe?t.texStorage2D(r.TEXTURE_2D,1,oe,y.width,y.height):t.texImage2D(r.TEXTURE_2D,0,oe,y.width,y.height,0,G,ee,null));else if(E.isDataTexture)if(ce.length>0&&ie){fe&&Me&&t.texStorage2D(r.TEXTURE_2D,pe,oe,ce[0].width,ce[0].height);for(let me=0,we=ce.length;me<we;me++)H=ce[me],fe?t.texSubImage2D(r.TEXTURE_2D,me,0,0,H.width,H.height,G,ee,H.data):t.texImage2D(r.TEXTURE_2D,me,oe,H.width,H.height,0,G,ee,H.data);E.generateMipmaps=!1}else fe?(Me&&t.texStorage2D(r.TEXTURE_2D,pe,oe,y.width,y.height),t.texSubImage2D(r.TEXTURE_2D,0,0,0,y.width,y.height,G,ee,y.data)):t.texImage2D(r.TEXTURE_2D,0,oe,y.width,y.height,0,G,ee,y.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){fe&&Me&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,oe,ce[0].width,ce[0].height,y.depth);for(let me=0,we=ce.length;me<we;me++)H=ce[me],E.format!==Ot?G!==null?fe?t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,me,0,0,0,H.width,H.height,y.depth,G,H.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,me,oe,H.width,H.height,y.depth,0,H.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):fe?t.texSubImage3D(r.TEXTURE_2D_ARRAY,me,0,0,0,H.width,H.height,y.depth,G,ee,H.data):t.texImage3D(r.TEXTURE_2D_ARRAY,me,oe,H.width,H.height,y.depth,0,G,ee,H.data)}else{fe&&Me&&t.texStorage2D(r.TEXTURE_2D,pe,oe,ce[0].width,ce[0].height);for(let me=0,we=ce.length;me<we;me++)H=ce[me],E.format!==Ot?G!==null?fe?t.compressedTexSubImage2D(r.TEXTURE_2D,me,0,0,H.width,H.height,G,H.data):t.compressedTexImage2D(r.TEXTURE_2D,me,oe,H.width,H.height,0,H.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):fe?t.texSubImage2D(r.TEXTURE_2D,me,0,0,H.width,H.height,G,ee,H.data):t.texImage2D(r.TEXTURE_2D,me,oe,H.width,H.height,0,G,ee,H.data)}else if(E.isDataArrayTexture)fe?(Me&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,oe,y.width,y.height,y.depth),t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,y.width,y.height,y.depth,G,ee,y.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,oe,y.width,y.height,y.depth,0,G,ee,y.data);else if(E.isData3DTexture)fe?(Me&&t.texStorage3D(r.TEXTURE_3D,pe,oe,y.width,y.height,y.depth),t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,y.width,y.height,y.depth,G,ee,y.data)):t.texImage3D(r.TEXTURE_3D,0,oe,y.width,y.height,y.depth,0,G,ee,y.data);else if(E.isFramebufferTexture){if(Me)if(fe)t.texStorage2D(r.TEXTURE_2D,pe,oe,y.width,y.height);else{let me=y.width,we=y.height;for(let Je=0;Je<pe;Je++)t.texImage2D(r.TEXTURE_2D,Je,oe,me,we,0,G,ee,null),me>>=1,we>>=1}}else if(ce.length>0&&ie){fe&&Me&&t.texStorage2D(r.TEXTURE_2D,pe,oe,ce[0].width,ce[0].height);for(let me=0,we=ce.length;me<we;me++)H=ce[me],fe?t.texSubImage2D(r.TEXTURE_2D,me,0,0,G,ee,H):t.texImage2D(r.TEXTURE_2D,me,oe,G,ee,H);E.generateMipmaps=!1}else fe?(Me&&t.texStorage2D(r.TEXTURE_2D,pe,oe,y.width,y.height),t.texSubImage2D(r.TEXTURE_2D,0,0,0,G,ee,y)):t.texImage2D(r.TEXTURE_2D,0,oe,G,ee,y);M(E,ie)&&m(V),Q.__version=k.version,E.onUpdate&&E.onUpdate(E)}S.__version=E.version}function Z(S,E,D,V,P,k){const Q=a.convert(D.format,D.colorSpace),J=a.convert(D.type),ne=_(D.internalFormat,Q,J,D.colorSpace);if(!n.get(E).__hasExternalTextures){const le=Math.max(1,E.width>>k),de=Math.max(1,E.height>>k);P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY?t.texImage3D(P,k,ne,le,de,E.depth,0,Q,J,null):t.texImage2D(P,k,ne,le,de,0,Q,J,null)}t.bindFramebuffer(r.FRAMEBUFFER,S),j(E)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,V,P,n.get(D).__webglTexture,0,O(E)):(P===r.TEXTURE_2D||P>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&P<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,V,P,n.get(D).__webglTexture,k),t.bindFramebuffer(r.FRAMEBUFFER,null)}function X(S,E,D){if(r.bindRenderbuffer(r.RENDERBUFFER,S),E.depthBuffer&&!E.stencilBuffer){let V=l===!0?r.DEPTH_COMPONENT24:r.DEPTH_COMPONENT16;if(D||j(E)){const P=E.depthTexture;P&&P.isDepthTexture&&(P.type===cn?V=r.DEPTH_COMPONENT32F:P.type===ln&&(V=r.DEPTH_COMPONENT24));const k=O(E);j(E)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,k,V,E.width,E.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,k,V,E.width,E.height)}else r.renderbufferStorage(r.RENDERBUFFER,V,E.width,E.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,S)}else if(E.depthBuffer&&E.stencilBuffer){const V=O(E);D&&j(E)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,V,r.DEPTH24_STENCIL8,E.width,E.height):j(E)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,V,r.DEPTH24_STENCIL8,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,S)}else{const V=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let P=0;P<V.length;P++){const k=V[P],Q=a.convert(k.format,k.colorSpace),J=a.convert(k.type),ne=_(k.internalFormat,Q,J,k.colorSpace),le=O(E);D&&j(E)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,le,ne,E.width,E.height):j(E)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,le,ne,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,ne,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function q(S){const E=n.get(S),D=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!E.__autoAllocateDepthBuffer){if(D)throw new Error("target.depthTexture not supported in Cube render targets");(function(V,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,V),!P.depthTexture||!P.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");n.get(P.depthTexture).__webglTexture&&P.depthTexture.image.width===P.width&&P.depthTexture.image.height===P.height||(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),N(P.depthTexture,0);const k=n.get(P.depthTexture).__webglTexture,Q=O(P);if(P.depthTexture.format===Tn)j(P)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,k,0,Q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,k,0);else{if(P.depthTexture.format!==ei)throw new Error("Unknown depthTexture format");j(P)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,k,0,Q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,k,0)}})(E.__webglFramebuffer,S)}else if(D){E.__webglDepthbuffer=[];for(let V=0;V<6;V++)t.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[V]),E.__webglDepthbuffer[V]=r.createRenderbuffer(),X(E.__webglDepthbuffer[V],S,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=r.createRenderbuffer(),X(E.__webglDepthbuffer,S,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function O(S){return Math.min(i.maxSamples,S.samples)}function j(S){const E=n.get(S);return l&&S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function se(S,E){const D=S.colorSpace,V=S.format,P=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===aa||D!==Kt&&D!==Ft&&(Fe.getTransfer(D)===Be?l===!1?e.has("EXT_sRGB")===!0&&V===Ot?(S.format=aa,S.minFilter=Ut,S.generateMipmaps=!1):E=xo.sRGBToLinear(E):V===Ot&&P===En||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",D)),E}this.allocateTextureUnit=function(){const S=U;return S>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+i.maxTextures),U+=1,S},this.resetTextureUnits=function(){U=0},this.setTexture2D=N,this.setTexture2DArray=function(S,E){const D=n.get(S);S.version>0&&D.__version!==S.version?ue(D,S,E):t.bindTexture(r.TEXTURE_2D_ARRAY,D.__webglTexture,r.TEXTURE0+E)},this.setTexture3D=function(S,E){const D=n.get(S);S.version>0&&D.__version!==S.version?ue(D,S,E):t.bindTexture(r.TEXTURE_3D,D.__webglTexture,r.TEXTURE0+E)},this.setTextureCube=function(S,E){const D=n.get(S);S.version>0&&D.__version!==S.version?function(V,P,k){if(P.image.length!==6)return;const Q=te(V,P),J=P.source;t.bindTexture(r.TEXTURE_CUBE_MAP,V.__webglTexture,r.TEXTURE0+k);const ne=n.get(J);if(J.version!==ne.__version||Q===!0){t.activeTexture(r.TEXTURE0+k);const le=Fe.getPrimaries(Fe.workingColorSpace),de=P.colorSpace===Ft?null:Fe.getPrimaries(P.colorSpace),y=P.colorSpace===Ft||le===de?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,P.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,P.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,y);const ie=P.isCompressedTexture||P.image[0].isCompressedTexture,G=P.image[0]&&P.image[0].isDataTexture,H=[];for(let ge=0;ge<6;ge++)H[ge]=ie||G?G?P.image[ge].image:P.image[ge]:v(P.image[ge],!1,!0,i.maxCubemapSize),H[ge]=se(P,H[ge]);const ee=H[0],oe=p(ee)||l,ce=a.convert(P.format,P.colorSpace),fe=a.convert(P.type),Me=_(P.internalFormat,ce,fe,P.colorSpace),pe=l&&P.isVideoTexture!==!0,me=ne.__version===void 0||Q===!0;let we,Je=C(P,ee,oe);if(B(r.TEXTURE_CUBE_MAP,P,oe),ie){pe&&me&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Je,Me,ee.width,ee.height);for(let ge=0;ge<6;ge++){we=H[ge].mipmaps;for(let Ae=0;Ae<we.length;Ae++){const Re=we[Ae];P.format!==Ot?ce!==null?pe?t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae,0,0,Re.width,Re.height,ce,Re.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae,Me,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):pe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae,0,0,Re.width,Re.height,ce,fe,Re.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae,Me,Re.width,Re.height,0,ce,fe,Re.data)}}}else{we=P.mipmaps,pe&&me&&(we.length>0&&Je++,t.texStorage2D(r.TEXTURE_CUBE_MAP,Je,Me,H[0].width,H[0].height));for(let ge=0;ge<6;ge++)if(G){pe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,H[ge].width,H[ge].height,ce,fe,H[ge].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Me,H[ge].width,H[ge].height,0,ce,fe,H[ge].data);for(let Ae=0;Ae<we.length;Ae++){const Re=we[Ae].image[ge].image;pe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae+1,0,0,Re.width,Re.height,ce,fe,Re.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae+1,Me,Re.width,Re.height,0,ce,fe,Re.data)}}else{pe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ce,fe,H[ge]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,Me,ce,fe,H[ge]);for(let Ae=0;Ae<we.length;Ae++){const Re=we[Ae];pe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae+1,0,0,ce,fe,Re.image[ge]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ae+1,Me,ce,fe,Re.image[ge])}}}M(P,oe)&&m(r.TEXTURE_CUBE_MAP),ne.__version=J.version,P.onUpdate&&P.onUpdate(P)}V.__version=P.version}(D,S,E):t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+E)},this.rebindTextures=function(S,E,D){const V=n.get(S);E!==void 0&&Z(V.__webglFramebuffer,S,S.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),D!==void 0&&q(S)},this.setupRenderTarget=function(S){const E=S.texture,D=n.get(S),V=n.get(E);S.addEventListener("dispose",b),S.isWebGLMultipleRenderTargets!==!0&&(V.__webglTexture===void 0&&(V.__webglTexture=r.createTexture()),V.__version=E.version,s.memory.textures++);const P=S.isWebGLCubeRenderTarget===!0,k=S.isWebGLMultipleRenderTargets===!0,Q=p(S)||l;if(P){D.__webglFramebuffer=[];for(let J=0;J<6;J++)if(l&&E.mipmaps&&E.mipmaps.length>0){D.__webglFramebuffer[J]=[];for(let ne=0;ne<E.mipmaps.length;ne++)D.__webglFramebuffer[J][ne]=r.createFramebuffer()}else D.__webglFramebuffer[J]=r.createFramebuffer()}else{if(l&&E.mipmaps&&E.mipmaps.length>0){D.__webglFramebuffer=[];for(let J=0;J<E.mipmaps.length;J++)D.__webglFramebuffer[J]=r.createFramebuffer()}else D.__webglFramebuffer=r.createFramebuffer();if(k)if(i.drawBuffers){const J=S.texture;for(let ne=0,le=J.length;ne<le;ne++){const de=n.get(J[ne]);de.__webglTexture===void 0&&(de.__webglTexture=r.createTexture(),s.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(l&&S.samples>0&&j(S)===!1){const J=k?E:[E];D.__webglMultisampledFramebuffer=r.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let ne=0;ne<J.length;ne++){const le=J[ne];D.__webglColorRenderbuffer[ne]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,D.__webglColorRenderbuffer[ne]);const de=a.convert(le.format,le.colorSpace),y=a.convert(le.type),ie=_(le.internalFormat,de,y,le.colorSpace,S.isXRRenderTarget===!0),G=O(S);r.renderbufferStorageMultisample(r.RENDERBUFFER,G,ie,S.width,S.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ne,r.RENDERBUFFER,D.__webglColorRenderbuffer[ne])}r.bindRenderbuffer(r.RENDERBUFFER,null),S.depthBuffer&&(D.__webglDepthRenderbuffer=r.createRenderbuffer(),X(D.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(P){t.bindTexture(r.TEXTURE_CUBE_MAP,V.__webglTexture),B(r.TEXTURE_CUBE_MAP,E,Q);for(let J=0;J<6;J++)if(l&&E.mipmaps&&E.mipmaps.length>0)for(let ne=0;ne<E.mipmaps.length;ne++)Z(D.__webglFramebuffer[J][ne],S,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ne);else Z(D.__webglFramebuffer[J],S,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);M(E,Q)&&m(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(k){const J=S.texture;for(let ne=0,le=J.length;ne<le;ne++){const de=J[ne],y=n.get(de);t.bindTexture(r.TEXTURE_2D,y.__webglTexture),B(r.TEXTURE_2D,de,Q),Z(D.__webglFramebuffer,S,de,r.COLOR_ATTACHMENT0+ne,r.TEXTURE_2D,0),M(de,Q)&&m(r.TEXTURE_2D)}t.unbindTexture()}else{let J=r.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(l?J=S.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(J,V.__webglTexture),B(J,E,Q),l&&E.mipmaps&&E.mipmaps.length>0)for(let ne=0;ne<E.mipmaps.length;ne++)Z(D.__webglFramebuffer[ne],S,E,r.COLOR_ATTACHMENT0,J,ne);else Z(D.__webglFramebuffer,S,E,r.COLOR_ATTACHMENT0,J,0);M(E,Q)&&m(J),t.unbindTexture()}S.depthBuffer&&q(S)},this.updateRenderTargetMipmap=function(S){const E=p(S)||l,D=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let V=0,P=D.length;V<P;V++){const k=D[V];if(M(k,E)){const Q=S.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,J=n.get(k).__webglTexture;t.bindTexture(Q,J),m(Q),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(S){if(l&&S.samples>0&&j(S)===!1){const E=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],D=S.width,V=S.height;let P=r.COLOR_BUFFER_BIT;const k=[],Q=S.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,J=n.get(S),ne=S.isWebGLMultipleRenderTargets===!0;if(ne)for(let le=0;le<E.length;le++)t.bindFramebuffer(r.FRAMEBUFFER,J.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,J.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,J.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,J.__webglFramebuffer);for(let le=0;le<E.length;le++){k.push(r.COLOR_ATTACHMENT0+le),S.depthBuffer&&k.push(Q);const de=J.__ignoreDepthValues!==void 0&&J.__ignoreDepthValues;if(de===!1&&(S.depthBuffer&&(P|=r.DEPTH_BUFFER_BIT),S.stencilBuffer&&(P|=r.STENCIL_BUFFER_BIT)),ne&&r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,J.__webglColorRenderbuffer[le]),de===!0&&(r.invalidateFramebuffer(r.READ_FRAMEBUFFER,[Q]),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[Q])),ne){const y=n.get(E[le]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,y,0)}r.blitFramebuffer(0,0,D,V,0,0,D,V,P,r.NEAREST),o&&r.invalidateFramebuffer(r.READ_FRAMEBUFFER,k)}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ne)for(let le=0;le<E.length;le++){t.bindFramebuffer(r.FRAMEBUFFER,J.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,J.__webglColorRenderbuffer[le]);const de=n.get(E[le]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,J.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.TEXTURE_2D,de,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,J.__webglMultisampledFramebuffer)}},this.setupDepthRenderbuffer=q,this.setupFrameBufferTexture=Z,this.useMultisampledRTT=j}function ou(r,e,t){const n=t.isWebGL2;return{convert:function(i,a=""){let s;const l=Fe.getTransfer(a);if(i===En)return r.UNSIGNED_BYTE;if(i===uo)return r.UNSIGNED_SHORT_4_4_4_4;if(i===ho)return r.UNSIGNED_SHORT_5_5_5_1;if(i===1010)return r.BYTE;if(i===1011)return r.SHORT;if(i===ca)return r.UNSIGNED_SHORT;if(i===co)return r.INT;if(i===ln)return r.UNSIGNED_INT;if(i===cn)return r.FLOAT;if(i===vi)return n?r.HALF_FLOAT:(s=e.get("OES_texture_half_float"),s!==null?s.HALF_FLOAT_OES:null);if(i===1021)return r.ALPHA;if(i===Ot)return r.RGBA;if(i===1024)return r.LUMINANCE;if(i===1025)return r.LUMINANCE_ALPHA;if(i===Tn)return r.DEPTH_COMPONENT;if(i===ei)return r.DEPTH_STENCIL;if(i===aa)return s=e.get("EXT_sRGB"),s!==null?s.SRGB_ALPHA_EXT:null;if(i===1028)return r.RED;if(i===po)return r.RED_INTEGER;if(i===1030)return r.RG;if(i===fo)return r.RG_INTEGER;if(i===mo)return r.RGBA_INTEGER;if(i===vr||i===xr||i===Mr||i===Sr)if(l===Be){if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s===null)return null;if(i===vr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Mr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Sr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(s=e.get("WEBGL_compressed_texture_s3tc"),s===null)return null;if(i===vr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===xr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Mr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Sr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(i===Pa||i===Ua||i===Da||i===Ia){if(s=e.get("WEBGL_compressed_texture_pvrtc"),s===null)return null;if(i===Pa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ua)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Da)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ia)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(i===go)return s=e.get("WEBGL_compressed_texture_etc1"),s!==null?s.COMPRESSED_RGB_ETC1_WEBGL:null;if(i===Na||i===Oa){if(s=e.get("WEBGL_compressed_texture_etc"),s===null)return null;if(i===Na)return l===Be?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Oa)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}if(i===Fa||i===Ba||i===za||i===Ha||i===Ga||i===Va||i===ka||i===Wa||i===Xa||i===ja||i===Ya||i===qa||i===Ka||i===Za){if(s=e.get("WEBGL_compressed_texture_astc"),s===null)return null;if(i===Fa)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ba)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===za)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ha)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ga)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Va)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ka)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wa)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Xa)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ja)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ya)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===qa)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ka)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Za)return l===Be?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}if(i===Er||i===Ja||i===Qa){if(s=e.get("EXT_texture_compression_bptc"),s===null)return null;if(i===Er)return l===Be?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ja)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(i===36283||i===$a||i===es||i===ts){if(s=e.get("EXT_texture_compression_rgtc"),s===null)return null;if(i===Er)return s.COMPRESSED_RED_RGTC1_EXT;if(i===$a)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===es)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ts)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return i===yn?n?r.UNSIGNED_INT_24_8:(s=e.get("WEBGL_depth_texture"),s!==null?s.UNSIGNED_INT_24_8_WEBGL:null):r[i]!==void 0?r[i]:null}}}class lu extends Et{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Pt extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const cu={type:"move"};class jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,a=null,s=null;const l=this._targetRay,c=this._grip,o=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(o&&e.hand){s=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),M=this._getHandJoint(o,v);p!==null&&(M.matrix.fromArray(p.transform.matrix),M.matrix.decompose(M.position,M.rotation,M.scale),M.matrixWorldNeedsUpdate=!0,M.jointRadius=p.radius),M.visible=p!==null}const u=o.joints["index-finger-tip"],d=o.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;o.inputState.pinching&&h>f+g?(o.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!o.inputState.pinching&&h<=f-g&&(o.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&a!==null&&(i=a),i!==null&&(l.matrix.fromArray(i.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,i.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(i.linearVelocity)):l.hasLinearVelocity=!1,i.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(i.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(cu)))}return l!==null&&(l.visible=i!==null),c!==null&&(c.visible=a!==null),o!==null&&(o.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Pt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class uu extends Rn{constructor(e,t){super();const n=this;let i=null,a=1,s=null,l="local-floor",c=1,o=null,u=null,d=null,h=null,f=null,g=null;const v=t.getContextAttributes();let p=null,M=null;const m=[],_=[],C=new _e;let L=null;const w=new Et;w.layers.enable(1),w.viewport=new Ve;const b=new Et;b.layers.enable(2),b.viewport=new Ve;const I=[w,b],U=new lu;U.layers.enable(1),U.layers.enable(2);let N=null,K=null;function R(O){const j=_.indexOf(O.inputSource);if(j===-1)return;const se=m[j];se!==void 0&&(se.update(O.inputSource,O.frame,o||s),se.dispatchEvent({type:O.type,data:O.inputSource}))}function z(){i.removeEventListener("select",R),i.removeEventListener("selectstart",R),i.removeEventListener("selectend",R),i.removeEventListener("squeeze",R),i.removeEventListener("squeezestart",R),i.removeEventListener("squeezeend",R),i.removeEventListener("end",z),i.removeEventListener("inputsourceschange",B);for(let O=0;O<m.length;O++){const j=_[O];j!==null&&(_[O]=null,m[O].disconnect(j))}N=null,K=null,e.setRenderTarget(p),f=null,h=null,d=null,i=null,M=null,q.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}function B(O){for(let j=0;j<O.removed.length;j++){const se=O.removed[j],S=_.indexOf(se);S>=0&&(_[S]=null,m[S].disconnect(se))}for(let j=0;j<O.added.length;j++){const se=O.added[j];let S=_.indexOf(se);if(S===-1){for(let D=0;D<m.length;D++){if(D>=_.length){_.push(se),S=D;break}if(_[D]===null){_[D]=se,S=D;break}}if(S===-1)break}const E=m[S];E&&E.connect(se)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let j=m[O];return j===void 0&&(j=new jr,m[O]=j),j.getTargetRaySpace()},this.getControllerGrip=function(O){let j=m[O];return j===void 0&&(j=new jr,m[O]=j),j.getGripSpace()},this.getHand=function(O){let j=m[O];return j===void 0&&(j=new jr,m[O]=j),j.getHandSpace()},this.setFramebufferScaleFactor=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){l=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return o||s},this.setReferenceSpace=function(O){o=O},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",R),i.addEventListener("selectstart",R),i.addEventListener("selectend",R),i.addEventListener("squeeze",R),i.addEventListener("squeezestart",R),i.addEventListener("squeezeend",R),i.addEventListener("end",z),i.addEventListener("inputsourceschange",B),v.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const j={antialias:i.renderState.layers!==void 0||v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(i,t,j),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new wn(f.framebufferWidth,f.framebufferHeight,{format:Ot,type:En,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let j=null,se=null,S=null;v.depth&&(S=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,j=v.stencil?ei:Tn,se=v.stencil?yn:ln);const E={colorFormat:t.RGBA8,depthFormat:S,scaleFactor:a};d=new XRWebGLBinding(i,t),h=d.createProjectionLayer(E),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),M=new wn(h.textureWidth,h.textureHeight,{format:Ot,type:En,depthTexture:new Lo(h.textureWidth,h.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0}),e.properties.get(M).__ignoreDepthValues=h.ignoreDepthValues}M.isXRRenderTarget=!0,this.setFoveation(c),o=null,s=await i.requestReferenceSpace(l),q.setContext(i),q.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};const te=new A,ue=new A;function Z(O,j){j===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(j.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;U.near=b.near=w.near=O.near,U.far=b.far=w.far=O.far,N===U.near&&K===U.far||(i.updateRenderState({depthNear:U.near,depthFar:U.far}),N=U.near,K=U.far);const j=O.parent,se=U.cameras;Z(U,j);for(let S=0;S<se.length;S++)Z(se[S],j);se.length===2?function(S,E,D){te.setFromMatrixPosition(E.matrixWorld),ue.setFromMatrixPosition(D.matrixWorld);const V=te.distanceTo(ue),P=E.projectionMatrix.elements,k=D.projectionMatrix.elements,Q=P[14]/(P[10]-1),J=P[14]/(P[10]+1),ne=(P[9]+1)/P[5],le=(P[9]-1)/P[5],de=(P[8]-1)/P[0],y=(k[8]+1)/k[0],ie=Q*de,G=Q*y,H=V/(-de+y),ee=H*-de;E.matrixWorld.decompose(S.position,S.quaternion,S.scale),S.translateX(ee),S.translateZ(H),S.matrixWorld.compose(S.position,S.quaternion,S.scale),S.matrixWorldInverse.copy(S.matrixWorld).invert();const oe=Q+H,ce=J+H,fe=ie-ee,Me=G+(V-ee),pe=ne*J/ce*oe,me=le*J/ce*oe;S.projectionMatrix.makePerspective(fe,Me,pe,me,oe,ce),S.projectionMatrixInverse.copy(S.projectionMatrix).invert()}(U,w,b):U.projectionMatrix.copy(w.projectionMatrix),function(S,E,D){D===null?S.matrix.copy(E.matrixWorld):(S.matrix.copy(D.matrixWorld),S.matrix.invert(),S.matrix.multiply(E.matrixWorld)),S.matrix.decompose(S.position,S.quaternion,S.scale),S.updateMatrixWorld(!0),S.projectionMatrix.copy(E.projectionMatrix),S.projectionMatrixInverse.copy(E.projectionMatrixInverse),S.isPerspectiveCamera&&(S.fov=2*sa*Math.atan(1/S.projectionMatrix.elements[5]),S.zoom=1)}(O,U,j)},this.getCamera=function(){return U},this.getFoveation=function(){if(h!==null||f!==null)return c},this.setFoveation=function(O){c=O,h!==null&&(h.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)};let X=null;const q=new Ro;q.setAnimationLoop(function(O,j){if(u=j.getViewerPose(o||s),g=j,u!==null){const se=u.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let S=!1;se.length!==U.cameras.length&&(U.cameras.length=0,S=!0);for(let E=0;E<se.length;E++){const D=se[E];let V=null;if(f!==null)V=f.getViewport(D);else{const k=d.getViewSubImage(h,D);V=k.viewport,E===0&&(e.setRenderTargetTextures(M,k.colorTexture,h.ignoreDepthValues?void 0:k.depthStencilTexture),e.setRenderTarget(M))}let P=I[E];P===void 0&&(P=new Et,P.layers.enable(E),P.viewport=new Ve,I[E]=P),P.matrix.fromArray(D.transform.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale),P.projectionMatrix.fromArray(D.projectionMatrix),P.projectionMatrixInverse.copy(P.projectionMatrix).invert(),P.viewport.set(V.x,V.y,V.width,V.height),E===0&&(U.matrix.copy(P.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),S===!0&&U.cameras.push(P)}}for(let se=0;se<m.length;se++){const S=_[se],E=m[se];S!==null&&E!==void 0&&E.update(S,j,o||s)}X&&X(O,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}),this.setAnimationLoop=function(O){X=O},this.dispose=function(){}}}function hu(r,e){function t(i,a){i.matrixAutoUpdate===!0&&i.updateMatrix(),a.value.copy(i.matrix)}function n(i,a){i.opacity.value=a.opacity,a.color&&i.diffuse.value.copy(a.color),a.emissive&&i.emissive.value.copy(a.emissive).multiplyScalar(a.emissiveIntensity),a.map&&(i.map.value=a.map,t(a.map,i.mapTransform)),a.alphaMap&&(i.alphaMap.value=a.alphaMap,t(a.alphaMap,i.alphaMapTransform)),a.bumpMap&&(i.bumpMap.value=a.bumpMap,t(a.bumpMap,i.bumpMapTransform),i.bumpScale.value=a.bumpScale,a.side===ut&&(i.bumpScale.value*=-1)),a.normalMap&&(i.normalMap.value=a.normalMap,t(a.normalMap,i.normalMapTransform),i.normalScale.value.copy(a.normalScale),a.side===ut&&i.normalScale.value.negate()),a.displacementMap&&(i.displacementMap.value=a.displacementMap,t(a.displacementMap,i.displacementMapTransform),i.displacementScale.value=a.displacementScale,i.displacementBias.value=a.displacementBias),a.emissiveMap&&(i.emissiveMap.value=a.emissiveMap,t(a.emissiveMap,i.emissiveMapTransform)),a.specularMap&&(i.specularMap.value=a.specularMap,t(a.specularMap,i.specularMapTransform)),a.alphaTest>0&&(i.alphaTest.value=a.alphaTest);const s=e.get(a).envMap;if(s&&(i.envMap.value=s,i.flipEnvMap.value=s.isCubeTexture&&s.isRenderTargetTexture===!1?-1:1,i.reflectivity.value=a.reflectivity,i.ior.value=a.ior,i.refractionRatio.value=a.refractionRatio),a.lightMap){i.lightMap.value=a.lightMap;const l=r._useLegacyLights===!0?Math.PI:1;i.lightMapIntensity.value=a.lightMapIntensity*l,t(a.lightMap,i.lightMapTransform)}a.aoMap&&(i.aoMap.value=a.aoMap,i.aoMapIntensity.value=a.aoMapIntensity,t(a.aoMap,i.aoMapTransform))}return{refreshFogUniforms:function(i,a){a.color.getRGB(i.fogColor.value,wo(r)),a.isFog?(i.fogNear.value=a.near,i.fogFar.value=a.far):a.isFogExp2&&(i.fogDensity.value=a.density)},refreshMaterialUniforms:function(i,a,s,l,c){a.isMeshBasicMaterial||a.isMeshLambertMaterial?n(i,a):a.isMeshToonMaterial?(n(i,a),function(o,u){u.gradientMap&&(o.gradientMap.value=u.gradientMap)}(i,a)):a.isMeshPhongMaterial?(n(i,a),function(o,u){o.specular.value.copy(u.specular),o.shininess.value=Math.max(u.shininess,1e-4)}(i,a)):a.isMeshStandardMaterial?(n(i,a),function(o,u){o.metalness.value=u.metalness,u.metalnessMap&&(o.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,o.metalnessMapTransform)),o.roughness.value=u.roughness,u.roughnessMap&&(o.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,o.roughnessMapTransform)),e.get(u).envMap&&(o.envMapIntensity.value=u.envMapIntensity)}(i,a),a.isMeshPhysicalMaterial&&function(o,u,d){o.ior.value=u.ior,u.sheen>0&&(o.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),o.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(o.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,o.sheenColorMapTransform)),u.sheenRoughnessMap&&(o.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,o.sheenRoughnessMapTransform))),u.clearcoat>0&&(o.clearcoat.value=u.clearcoat,o.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(o.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,o.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(o.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,o.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(o.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,o.clearcoatNormalMapTransform),o.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===ut&&o.clearcoatNormalScale.value.negate())),u.iridescence>0&&(o.iridescence.value=u.iridescence,o.iridescenceIOR.value=u.iridescenceIOR,o.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],o.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(o.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,o.iridescenceMapTransform)),u.iridescenceThicknessMap&&(o.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,o.iridescenceThicknessMapTransform))),u.transmission>0&&(o.transmission.value=u.transmission,o.transmissionSamplerMap.value=d.texture,o.transmissionSamplerSize.value.set(d.width,d.height),u.transmissionMap&&(o.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,o.transmissionMapTransform)),o.thickness.value=u.thickness,u.thicknessMap&&(o.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,o.thicknessMapTransform)),o.attenuationDistance.value=u.attenuationDistance,o.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(o.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(o.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,o.anisotropyMapTransform))),o.specularIntensity.value=u.specularIntensity,o.specularColor.value.copy(u.specularColor),u.specularColorMap&&(o.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,o.specularColorMapTransform)),u.specularIntensityMap&&(o.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,o.specularIntensityMapTransform))}(i,a,c)):a.isMeshMatcapMaterial?(n(i,a),function(o,u){u.matcap&&(o.matcap.value=u.matcap)}(i,a)):a.isMeshDepthMaterial?n(i,a):a.isMeshDistanceMaterial?(n(i,a),function(o,u){const d=e.get(u).light;o.referencePosition.value.setFromMatrixPosition(d.matrixWorld),o.nearDistance.value=d.shadow.camera.near,o.farDistance.value=d.shadow.camera.far}(i,a)):a.isMeshNormalMaterial?n(i,a):a.isLineBasicMaterial?(function(o,u){o.diffuse.value.copy(u.color),o.opacity.value=u.opacity,u.map&&(o.map.value=u.map,t(u.map,o.mapTransform))}(i,a),a.isLineDashedMaterial&&function(o,u){o.dashSize.value=u.dashSize,o.totalSize.value=u.dashSize+u.gapSize,o.scale.value=u.scale}(i,a)):a.isPointsMaterial?function(o,u,d,h){o.diffuse.value.copy(u.color),o.opacity.value=u.opacity,o.size.value=u.size*d,o.scale.value=.5*h,u.map&&(o.map.value=u.map,t(u.map,o.uvTransform)),u.alphaMap&&(o.alphaMap.value=u.alphaMap,t(u.alphaMap,o.alphaMapTransform)),u.alphaTest>0&&(o.alphaTest.value=u.alphaTest)}(i,a,s,l):a.isSpriteMaterial?function(o,u){o.diffuse.value.copy(u.color),o.opacity.value=u.opacity,o.rotation.value=u.rotation,u.map&&(o.map.value=u.map,t(u.map,o.mapTransform)),u.alphaMap&&(o.alphaMap.value=u.alphaMap,t(u.alphaMap,o.alphaMapTransform)),u.alphaTest>0&&(o.alphaTest.value=u.alphaTest)}(i,a):a.isShadowMaterial?(i.color.value.copy(a.color),i.opacity.value=a.opacity):a.isShaderMaterial&&(a.uniformsNeedUpdate=!1)}}}function du(r,e,t,n){let i={},a={},s=[];const l=t.isWebGL2?r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(d,h,f,g){const v=d.value,p=h+"_"+f;if(g[p]===void 0)return g[p]=typeof v=="number"||typeof v=="boolean"?v:v.clone(),!0;{const M=g[p];if(typeof v=="number"||typeof v=="boolean"){if(M!==v)return g[p]=v,!0}else if(M.equals(v)===!1)return M.copy(v),!0}return!1}function o(d){const h={boundary:0,storage:0};return typeof d=="number"||typeof d=="boolean"?(h.boundary=4,h.storage=4):d.isVector2?(h.boundary=8,h.storage=8):d.isVector3||d.isColor?(h.boundary=16,h.storage=12):d.isVector4?(h.boundary=16,h.storage=16):d.isMatrix3?(h.boundary=48,h.storage=48):d.isMatrix4?(h.boundary=64,h.storage=64):d.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",d),h}function u(d){const h=d.target;h.removeEventListener("dispose",u);const f=s.indexOf(h.__bindingPointIndex);s.splice(f,1),r.deleteBuffer(i[h.id]),delete i[h.id],delete a[h.id]}return{bind:function(d,h){const f=h.program;n.uniformBlockBinding(d,f)},update:function(d,h){let f=i[d.id];f===void 0&&(function(p){const M=p.uniforms;let m=0;const _=16;for(let L=0,w=M.length;L<w;L++){const b=Array.isArray(M[L])?M[L]:[M[L]];for(let I=0,U=b.length;I<U;I++){const N=b[I],K=Array.isArray(N.value)?N.value:[N.value];for(let R=0,z=K.length;R<z;R++){const B=o(K[R]),te=m%_;te!==0&&_-te<B.boundary&&(m+=_-te),N.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=m,m+=B.storage}}}const C=m%_;C>0&&(m+=_-C),p.__size=m,p.__cache={}}(d),f=function(p){const M=function(){for(let L=0;L<l;L++)if(s.indexOf(L)===-1)return s.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}();p.__bindingPointIndex=M;const m=r.createBuffer(),_=p.__size,C=p.usage;return r.bindBuffer(r.UNIFORM_BUFFER,m),r.bufferData(r.UNIFORM_BUFFER,_,C),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,M,m),m}(d),i[d.id]=f,d.addEventListener("dispose",u));const g=h.program;n.updateUBOMapping(d,g);const v=e.render.frame;a[d.id]!==v&&(function(p){const M=i[p.id],m=p.uniforms,_=p.__cache;r.bindBuffer(r.UNIFORM_BUFFER,M);for(let C=0,L=m.length;C<L;C++){const w=Array.isArray(m[C])?m[C]:[m[C]];for(let b=0,I=w.length;b<I;b++){const U=w[b];if(c(U,C,b,_)===!0){const N=U.__offset,K=Array.isArray(U.value)?U.value:[U.value];let R=0;for(let z=0;z<K.length;z++){const B=K[z],te=o(B);typeof B=="number"||typeof B=="boolean"?(U.__data[0]=B,r.bufferSubData(r.UNIFORM_BUFFER,N+R,U.__data)):B.isMatrix3?(U.__data[0]=B.elements[0],U.__data[1]=B.elements[1],U.__data[2]=B.elements[2],U.__data[3]=0,U.__data[4]=B.elements[3],U.__data[5]=B.elements[4],U.__data[6]=B.elements[5],U.__data[7]=0,U.__data[8]=B.elements[6],U.__data[9]=B.elements[7],U.__data[10]=B.elements[8],U.__data[11]=0):(B.toArray(U.__data,R),R+=te.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,N,U.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}(d),a[d.id]=v)},dispose:function(){for(const d in i)r.deleteBuffer(i[d]);s=[],i={},a={}}}}class Oo{constructor(e={}){const{canvas:t=ll(),context:n=null,depth:i=!0,stencil:a=!0,alpha:s=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:o=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=e;let h;this.isWebGLRenderer=!0,h=n!==null?n.getContextAttributes().alpha:s;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const M=[],m=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qe,this._useLegacyLights=!1,this.toneMapping=un,this.toneMappingExposure=1;const _=this;let C=!1,L=0,w=0,b=null,I=-1,U=null;const N=new Ve,K=new Ve;let R=null;const z=new Ee(0);let B=0,te=t.width,ue=t.height,Z=1,X=null,q=null;const O=new Ve(0,0,te,ue),j=new Ve(0,0,te,ue);let se=!1;const S=new lr;let E=!1,D=!1,V=null;const P=new Te,k=new _e,Q=new A,J={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ne(){return b===null?Z:1}let le,de,y,ie,G,H,ee,oe,ce,fe,Me,pe,me,we,Je,ge,Ae,Re,Cn,Bt,Ln,ot,$e,dt,x=n;function he(T,F){for(let W=0;W<T.length;W++){const $=T[W],Y=t.getContext($,F);if(Y!==null)return Y}return null}try{const T={alpha:!0,depth:i,stencil:a,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:o,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Qr}`),t.addEventListener("webglcontextlost",qe,!1),t.addEventListener("webglcontextrestored",yt,!1),t.addEventListener("webglcontextcreationerror",it,!1),x===null){const F=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&F.shift(),x=he(F,T),x===null)throw he(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&x instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),x.getShaderPrecisionFormat===void 0&&(x.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}function be(){le=new Bl(x),de=new Il(x,le,e),le.init(de),ot=new ou(x,le,de),y=new au(x,le,de),ie=new Gl(x),G=new qc,H=new su(x,le,y,G,de,ot,ie),ee=new Ol(_),oe=new Fl(_),ce=new Ll(x,de),$e=new Ul(x,le,ce,de),fe=new zl(x,ce,ie,$e),Me=new Xl(x,fe,ce,ie),Cn=new Wl(x,de,H),ge=new Nl(G),pe=new Yc(_,ee,oe,le,de,$e,ge),me=new hu(_,G),we=new Zc,Je=new tu(le,de),Re=new Pl(_,ee,oe,y,Me,h,c),Ae=new ru(_,Me,de),dt=new du(x,ie,de,y),Bt=new Dl(x,le,ie,de),Ln=new Hl(x,le,ie,de),ie.programs=pe.programs,_.capabilities=de,_.extensions=le,_.properties=G,_.renderLists=we,_.shadowMap=Ae,_.state=y,_.info=ie}be();const Se=new uu(_,x);function qe(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function yt(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const T=ie.autoReset,F=Ae.enabled,W=Ae.autoUpdate,$=Ae.needsUpdate,Y=Ae.type;be(),ie.autoReset=T,Ae.enabled=F,Ae.autoUpdate=W,Ae.needsUpdate=$,Ae.type=Y}function it(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function hr(T){const F=T.target;F.removeEventListener("dispose",hr),function(W){(function($){const Y=G.get($).programs;Y!==void 0&&(Y.forEach(function(ae){pe.releaseProgram(ae)}),$.isShaderMaterial&&pe.releaseShaderCache($))})(W),G.remove(W)}(F)}function Si(T,F,W){T.transparent===!0&&T.side===2&&T.forceSinglePass===!1?(T.side=ut,T.needsUpdate=!0,Ei(T,F,W),T.side=hn,T.needsUpdate=!0,Ei(T,F,W),T.side=2):Ei(T,F,W)}this.xr=Se,this.getContext=function(){return x},this.getContextAttributes=function(){return x.getContextAttributes()},this.forceContextLoss=function(){const T=le.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=le.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(T){T!==void 0&&(Z=T,this.setSize(te,ue,!1))},this.getSize=function(T){return T.set(te,ue)},this.setSize=function(T,F,W=!0){Se.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(te=T,ue=F,t.width=Math.floor(T*Z),t.height=Math.floor(F*Z),W===!0&&(t.style.width=T+"px",t.style.height=F+"px"),this.setViewport(0,0,T,F))},this.getDrawingBufferSize=function(T){return T.set(te*Z,ue*Z).floor()},this.setDrawingBufferSize=function(T,F,W){te=T,ue=F,Z=W,t.width=Math.floor(T*W),t.height=Math.floor(F*W),this.setViewport(0,0,T,F)},this.getCurrentViewport=function(T){return T.copy(N)},this.getViewport=function(T){return T.copy(O)},this.setViewport=function(T,F,W,$){T.isVector4?O.set(T.x,T.y,T.z,T.w):O.set(T,F,W,$),y.viewport(N.copy(O).multiplyScalar(Z).floor())},this.getScissor=function(T){return T.copy(j)},this.setScissor=function(T,F,W,$){T.isVector4?j.set(T.x,T.y,T.z,T.w):j.set(T,F,W,$),y.scissor(K.copy(j).multiplyScalar(Z).floor())},this.getScissorTest=function(){return se},this.setScissorTest=function(T){y.setScissorTest(se=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){q=T},this.getClearColor=function(T){return T.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor.apply(Re,arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha.apply(Re,arguments)},this.clear=function(T=!0,F=!0,W=!0){let $=0;if(T){let Y=!1;if(b!==null){const ae=b.texture.format;Y=ae===mo||ae===fo||ae===po}if(Y){const ae=b.texture.type,ve=ae===En||ae===ln||ae===ca||ae===yn||ae===uo||ae===ho,xe=Re.getClearColor(),Ce=Re.getClearAlpha(),Pe=xe.r,Ue=xe.g,De=xe.b;ve?(f[0]=Pe,f[1]=Ue,f[2]=De,f[3]=Ce,x.clearBufferuiv(x.COLOR,0,f)):(g[0]=Pe,g[1]=Ue,g[2]=De,g[3]=Ce,x.clearBufferiv(x.COLOR,0,g))}else $|=x.COLOR_BUFFER_BIT}F&&($|=x.DEPTH_BUFFER_BIT),W&&($|=x.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),x.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",qe,!1),t.removeEventListener("webglcontextrestored",yt,!1),t.removeEventListener("webglcontextcreationerror",it,!1),we.dispose(),Je.dispose(),G.dispose(),ee.dispose(),oe.dispose(),Me.dispose(),$e.dispose(),dt.dispose(),pe.dispose(),Se.dispose(),Se.removeEventListener("sessionstart",gt),Se.removeEventListener("sessionend",_t),V&&(V.dispose(),V=null),Tt.stop()},this.renderBufferDirect=function(T,F,W,$,Y,ae){F===null&&(F=J);const ve=Y.isMesh&&Y.matrixWorld.determinant()<0,xe=function(We,vt,lt,Ie,Ne){vt.isScene!==!0&&(vt=J),H.resetTextureUnits();const oi=vt.fog,dr=Ie.isMeshStandardMaterial?vt.environment:null,Ho=b===null?_.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Kt,yi=(Ie.isMeshStandardMaterial?oe:ee).get(Ie.envMap||dr),Go=Ie.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,Vo=!!lt.attributes.tangent&&(!!Ie.normalMap||Ie.anisotropy>0),ko=!!lt.morphAttributes.position,Wo=!!lt.morphAttributes.normal,Xo=!!lt.morphAttributes.color;let ya=un;Ie.toneMapped&&(b!==null&&b.isXRRenderTarget!==!0||(ya=_.toneMapping));const Ta=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,jo=Ta!==void 0?Ta.length:0,Oe=G.get(Ie),Yo=p.state.lights;if(E===!0&&(D===!0||We!==U)){const xt=We===U&&Ie.id===I;ge.setState(Ie,We,xt)}let wt=!1;Ie.version===Oe.__version?Oe.needsLights&&Oe.lightsStateVersion!==Yo.state.version||Oe.outputColorSpace!==Ho||Ne.isBatchedMesh&&Oe.batching===!1?wt=!0:Ne.isBatchedMesh||Oe.batching!==!0?Ne.isInstancedMesh&&Oe.instancing===!1?wt=!0:Ne.isInstancedMesh||Oe.instancing!==!0?Ne.isSkinnedMesh&&Oe.skinning===!1?wt=!0:Ne.isSkinnedMesh||Oe.skinning!==!0?Ne.isInstancedMesh&&Oe.instancingColor===!0&&Ne.instanceColor===null||Ne.isInstancedMesh&&Oe.instancingColor===!1&&Ne.instanceColor!==null||Oe.envMap!==yi||Ie.fog===!0&&Oe.fog!==oi?wt=!0:Oe.numClippingPlanes===void 0||Oe.numClippingPlanes===ge.numPlanes&&Oe.numIntersection===ge.numIntersection?(Oe.vertexAlphas!==Go||Oe.vertexTangents!==Vo||Oe.morphTargets!==ko||Oe.morphNormals!==Wo||Oe.morphColors!==Xo||Oe.toneMapping!==ya||de.isWebGL2===!0&&Oe.morphTargetsCount!==jo)&&(wt=!0):wt=!0:wt=!0:wt=!0:wt=!0:(wt=!0,Oe.__version=Ie.version);let fn=Oe.currentProgram;wt===!0&&(fn=Ei(Ie,vt,Ne));let ba=!1,li=!1,pr=!1;const et=fn.getUniforms(),mn=Oe.uniforms;if(y.useProgram(fn.program)&&(ba=!0,li=!0,pr=!0),Ie.id!==I&&(I=Ie.id,li=!0),ba||U!==We){et.setValue(x,"projectionMatrix",We.projectionMatrix),et.setValue(x,"viewMatrix",We.matrixWorldInverse);const xt=et.map.cameraPosition;xt!==void 0&&xt.setValue(x,Q.setFromMatrixPosition(We.matrixWorld)),de.logarithmicDepthBuffer&&et.setValue(x,"logDepthBufFC",2/(Math.log(We.far+1)/Math.LN2)),(Ie.isMeshPhongMaterial||Ie.isMeshToonMaterial||Ie.isMeshLambertMaterial||Ie.isMeshBasicMaterial||Ie.isMeshStandardMaterial||Ie.isShaderMaterial)&&et.setValue(x,"isOrthographic",We.isOrthographicCamera===!0),U!==We&&(U=We,li=!0,pr=!0)}if(Ne.isSkinnedMesh){et.setOptional(x,Ne,"bindMatrix"),et.setOptional(x,Ne,"bindMatrixInverse");const xt=Ne.skeleton;xt&&(de.floatVertexTextures?(xt.boneTexture===null&&xt.computeBoneTexture(),et.setValue(x,"boneTexture",xt.boneTexture,H)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Ne.isBatchedMesh&&(et.setOptional(x,Ne,"batchingTexture"),et.setValue(x,"batchingTexture",Ne._matricesTexture,H));const fr=lt.morphAttributes;(fr.position!==void 0||fr.normal!==void 0||fr.color!==void 0&&de.isWebGL2===!0)&&Cn.update(Ne,lt,fn),(li||Oe.receiveShadow!==Ne.receiveShadow)&&(Oe.receiveShadow=Ne.receiveShadow,et.setValue(x,"receiveShadow",Ne.receiveShadow)),Ie.isMeshGouraudMaterial&&Ie.envMap!==null&&(mn.envMap.value=yi,mn.flipEnvMap.value=yi.isCubeTexture&&yi.isRenderTargetTexture===!1?-1:1),li&&(et.setValue(x,"toneMappingExposure",_.toneMappingExposure),Oe.needsLights&&(At=pr,(It=mn).ambientLightColor.needsUpdate=At,It.lightProbe.needsUpdate=At,It.directionalLights.needsUpdate=At,It.directionalLightShadows.needsUpdate=At,It.pointLights.needsUpdate=At,It.pointLightShadows.needsUpdate=At,It.spotLights.needsUpdate=At,It.spotLightShadows.needsUpdate=At,It.rectAreaLights.needsUpdate=At,It.hemisphereLights.needsUpdate=At),oi&&Ie.fog===!0&&me.refreshFogUniforms(mn,oi),me.refreshMaterialUniforms(mn,Ie,Z,ue,V),Qi.upload(x,Sa(Oe),mn,H));var It,At;if(Ie.isShaderMaterial&&Ie.uniformsNeedUpdate===!0&&(Qi.upload(x,Sa(Oe),mn,H),Ie.uniformsNeedUpdate=!1),Ie.isSpriteMaterial&&et.setValue(x,"center",Ne.center),et.setValue(x,"modelViewMatrix",Ne.modelViewMatrix),et.setValue(x,"normalMatrix",Ne.normalMatrix),et.setValue(x,"modelMatrix",Ne.matrixWorld),Ie.isShaderMaterial||Ie.isRawShaderMaterial){const xt=Ie.uniformsGroups;for(let mr=0,qo=xt.length;mr<qo;mr++)if(de.isWebGL2){const wa=xt[mr];dt.update(wa,fn),dt.bind(wa,fn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return fn}(T,F,W,$,Y);y.setMaterial($,ve);let Ce=W.index,Pe=1;if($.wireframe===!0){if(Ce=fe.getWireframeAttribute(W),Ce===void 0)return;Pe=2}const Ue=W.drawRange,De=W.attributes.position;let ze=Ue.start*Pe,bt=(Ue.start+Ue.count)*Pe;ae!==null&&(ze=Math.max(ze,ae.start*Pe),bt=Math.min(bt,(ae.start+ae.count)*Pe)),Ce!==null?(ze=Math.max(ze,0),bt=Math.min(bt,Ce.count)):De!=null&&(ze=Math.max(ze,0),bt=Math.min(bt,De.count));const Ht=bt-ze;if(Ht<0||Ht===1/0)return;let pn;$e.setup(Y,$,xe,W,Ce);let He=Bt;if(Ce!==null&&(pn=ce.get(Ce),He=Ln,He.setIndex(pn)),Y.isMesh)$.wireframe===!0?(y.setLineWidth($.wireframeLinewidth*ne()),He.setMode(x.LINES)):He.setMode(x.TRIANGLES);else if(Y.isLine){let We=$.linewidth;We===void 0&&(We=1),y.setLineWidth(We*ne()),Y.isLineSegments?He.setMode(x.LINES):Y.isLineLoop?He.setMode(x.LINE_LOOP):He.setMode(x.LINE_STRIP)}else Y.isPoints?He.setMode(x.POINTS):Y.isSprite&&He.setMode(x.TRIANGLES);if(Y.isBatchedMesh)He.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else if(Y.isInstancedMesh)He.renderInstances(ze,Ht,Y.count);else if(W.isInstancedBufferGeometry){const We=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,vt=Math.min(W.instanceCount,We);He.renderInstances(ze,Ht,vt)}else He.render(ze,Ht)},this.compile=function(T,F,W=null){W===null&&(W=T),p=Je.get(W),p.init(),m.push(p),W.traverseVisible(function(Y){Y.isLight&&Y.layers.test(F.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),T!==W&&T.traverseVisible(function(Y){Y.isLight&&Y.layers.test(F.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights(_._useLegacyLights);const $=new Set;return T.traverse(function(Y){const ae=Y.material;if(ae)if(Array.isArray(ae))for(let ve=0;ve<ae.length;ve++){const xe=ae[ve];Si(xe,W,Y),$.add(xe)}else Si(ae,W,Y),$.add(ae)}),m.pop(),p=null,$},this.compileAsync=function(T,F,W=null){const $=this.compile(T,F,W);return new Promise(Y=>{function ae(){$.forEach(function(ve){G.get(ve).currentProgram.isReady()&&$.delete(ve)}),$.size!==0?setTimeout(ae,10):Y(T)}le.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Pn=null;function gt(){Tt.stop()}function _t(){Tt.start()}const Tt=new Ro;function Qt(T,F,W,$){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)W=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||S.intersectsSprite(T)){$&&Q.setFromMatrixPosition(T.matrixWorld).applyMatrix4(P);const ae=Me.update(T),ve=T.material;ve.visible&&v.push(T,ae,ve,W,Q.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||S.intersectsObject(T))){const ae=Me.update(T),ve=T.material;if($&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Q.copy(T.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),Q.copy(ae.boundingSphere.center)),Q.applyMatrix4(T.matrixWorld).applyMatrix4(P)),Array.isArray(ve)){const xe=ae.groups;for(let Ce=0,Pe=xe.length;Ce<Pe;Ce++){const Ue=xe[Ce],De=ve[Ue.materialIndex];De&&De.visible&&v.push(T,ae,De,W,Q.z,Ue)}}else ve.visible&&v.push(T,ae,ve,W,Q.z,null)}}const Y=T.children;for(let ae=0,ve=Y.length;ae<ve;ae++)Qt(Y[ae],F,W,$)}function $t(T,F,W,$){const Y=T.opaque,ae=T.transmissive,ve=T.transparent;p.setupLightsView(W),E===!0&&ge.setGlobalState(_.clippingPlanes,W),ae.length>0&&function(xe,Ce,Pe,Ue){if((Pe.isScene===!0?Pe.overrideMaterial:null)!==null)return;const ze=de.isWebGL2;V===null&&(V=new wn(1,1,{generateMipmaps:!0,type:le.has("EXT_color_buffer_half_float")?vi:En,minFilter:$i,samples:ze?4:0})),_.getDrawingBufferSize(k),ze?V.setSize(k.x,k.y):V.setSize(oa(k.x),oa(k.y));const bt=_.getRenderTarget();_.setRenderTarget(V),_.getClearColor(z),B=_.getClearAlpha(),B<1&&_.setClearColor(16777215,.5),_.clear();const Ht=_.toneMapping;_.toneMapping=un,zt(xe,Pe,Ue),H.updateMultisampleRenderTarget(V),H.updateRenderTargetMipmap(V);let pn=!1;for(let He=0,We=Ce.length;He<We;He++){const vt=Ce[He],lt=vt.object,Ie=vt.geometry,Ne=vt.material,oi=vt.group;if(Ne.side===2&&lt.layers.test(Ue.layers)){const dr=Ne.side;Ne.side=ut,Ne.needsUpdate=!0,Ma(lt,Pe,Ue,Ie,Ne,oi),Ne.side=dr,Ne.needsUpdate=!0,pn=!0}}pn===!0&&(H.updateMultisampleRenderTarget(V),H.updateRenderTargetMipmap(V)),_.setRenderTarget(bt),_.setClearColor(z,B),_.toneMapping=Ht}(Y,ae,F,W),$&&y.viewport(N.copy($)),Y.length>0&&zt(Y,F,W),ae.length>0&&zt(ae,F,W),ve.length>0&&zt(ve,F,W),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function zt(T,F,W){const $=F.isScene===!0?F.overrideMaterial:null;for(let Y=0,ae=T.length;Y<ae;Y++){const ve=T[Y],xe=ve.object,Ce=ve.geometry,Pe=$===null?ve.material:$,Ue=ve.group;xe.layers.test(W.layers)&&Ma(xe,F,W,Ce,Pe,Ue)}}function Ma(T,F,W,$,Y,ae){T.onBeforeRender(_,F,W,$,Y,ae),T.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),Y.onBeforeRender(_,F,W,$,T,ae),Y.transparent===!0&&Y.side===2&&Y.forceSinglePass===!1?(Y.side=ut,Y.needsUpdate=!0,_.renderBufferDirect(W,F,$,Y,T,ae),Y.side=hn,Y.needsUpdate=!0,_.renderBufferDirect(W,F,$,Y,T,ae),Y.side=2):_.renderBufferDirect(W,F,$,Y,T,ae),T.onAfterRender(_,F,W,$,Y,ae)}function Ei(T,F,W){F.isScene!==!0&&(F=J);const $=G.get(T),Y=p.state.lights,ae=p.state.shadowsArray,ve=Y.state.version,xe=pe.getParameters(T,Y.state,ae,F,W),Ce=pe.getProgramCacheKey(xe);let Pe=$.programs;$.environment=T.isMeshStandardMaterial?F.environment:null,$.fog=F.fog,$.envMap=(T.isMeshStandardMaterial?oe:ee).get(T.envMap||$.environment),Pe===void 0&&(T.addEventListener("dispose",hr),Pe=new Map,$.programs=Pe);let Ue=Pe.get(Ce);if(Ue!==void 0){if($.currentProgram===Ue&&$.lightsStateVersion===ve)return Ea(T,xe),Ue}else xe.uniforms=pe.getUniforms(T),T.onBuild(W,xe,_),T.onBeforeCompile(xe,_),Ue=pe.acquireProgram(xe,Ce),Pe.set(Ce,Ue),$.uniforms=xe.uniforms;const De=$.uniforms;return(T.isShaderMaterial||T.isRawShaderMaterial)&&T.clipping!==!0||(De.clippingPlanes=ge.uniform),Ea(T,xe),$.needsLights=function(ze){return ze.isMeshLambertMaterial||ze.isMeshToonMaterial||ze.isMeshPhongMaterial||ze.isMeshStandardMaterial||ze.isShadowMaterial||ze.isShaderMaterial&&ze.lights===!0}(T),$.lightsStateVersion=ve,$.needsLights&&(De.ambientLightColor.value=Y.state.ambient,De.lightProbe.value=Y.state.probe,De.directionalLights.value=Y.state.directional,De.directionalLightShadows.value=Y.state.directionalShadow,De.spotLights.value=Y.state.spot,De.spotLightShadows.value=Y.state.spotShadow,De.rectAreaLights.value=Y.state.rectArea,De.ltc_1.value=Y.state.rectAreaLTC1,De.ltc_2.value=Y.state.rectAreaLTC2,De.pointLights.value=Y.state.point,De.pointLightShadows.value=Y.state.pointShadow,De.hemisphereLights.value=Y.state.hemi,De.directionalShadowMap.value=Y.state.directionalShadowMap,De.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,De.spotShadowMap.value=Y.state.spotShadowMap,De.spotLightMatrix.value=Y.state.spotLightMatrix,De.spotLightMap.value=Y.state.spotLightMap,De.pointShadowMap.value=Y.state.pointShadowMap,De.pointShadowMatrix.value=Y.state.pointShadowMatrix),$.currentProgram=Ue,$.uniformsList=null,Ue}function Sa(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=Qi.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function Ea(T,F){const W=G.get(T);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}Tt.setAnimationLoop(function(T){Pn&&Pn(T)}),typeof self<"u"&&Tt.setContext(self),this.setAnimationLoop=function(T){Pn=T,Se.setAnimationLoop(T),T===null?Tt.stop():Tt.start()},Se.addEventListener("sessionstart",gt),Se.addEventListener("sessionend",_t),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(C===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Se.enabled===!0&&Se.isPresenting===!0&&(Se.cameraAutoUpdate===!0&&Se.updateCamera(F),F=Se.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,F,b),p=Je.get(T,m.length),p.init(),m.push(p),P.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),S.setFromProjectionMatrix(P),D=this.localClippingEnabled,E=ge.init(this.clippingPlanes,D),v=we.get(T,M.length),v.init(),M.push(v),Qt(T,F,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(X,q),this.info.render.frame++,E===!0&&ge.beginShadows();const W=p.state.shadowsArray;if(Ae.render(W,T,F),E===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),Re.render(v,T),p.setupLights(_._useLegacyLights),F.isArrayCamera){const $=F.cameras;for(let Y=0,ae=$.length;Y<ae;Y++){const ve=$[Y];$t(v,T,ve,ve.viewport)}}else $t(v,T,F);b!==null&&(H.updateMultisampleRenderTarget(b),H.updateRenderTargetMipmap(b)),T.isScene===!0&&T.onAfterRender(_,T,F),$e.resetDefaultState(),I=-1,U=null,m.pop(),p=m.length>0?m[m.length-1]:null,M.pop(),v=M.length>0?M[M.length-1]:null},this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(T,F,W){G.get(T.texture).__webglTexture=F,G.get(T.depthTexture).__webglTexture=W;const $=G.get(T);$.__hasExternalTextures=!0,$.__hasExternalTextures&&($.__autoAllocateDepthBuffer=W===void 0,$.__autoAllocateDepthBuffer||le.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,F){const W=G.get(T);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,W=0){b=T,L=F,w=W;let $=!0,Y=null,ae=!1,ve=!1;if(T){const xe=G.get(T);xe.__useDefaultFramebuffer!==void 0?(y.bindFramebuffer(x.FRAMEBUFFER,null),$=!1):xe.__webglFramebuffer===void 0?H.setupRenderTarget(T):xe.__hasExternalTextures&&H.rebindTextures(T,G.get(T.texture).__webglTexture,G.get(T.depthTexture).__webglTexture);const Ce=T.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(ve=!0);const Pe=G.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Y=Array.isArray(Pe[F])?Pe[F][W]:Pe[F],ae=!0):Y=de.isWebGL2&&T.samples>0&&H.useMultisampledRTT(T)===!1?G.get(T).__webglMultisampledFramebuffer:Array.isArray(Pe)?Pe[W]:Pe,N.copy(T.viewport),K.copy(T.scissor),R=T.scissorTest}else N.copy(O).multiplyScalar(Z).floor(),K.copy(j).multiplyScalar(Z).floor(),R=se;if(y.bindFramebuffer(x.FRAMEBUFFER,Y)&&de.drawBuffers&&$&&y.drawBuffers(T,Y),y.viewport(N),y.scissor(K),y.setScissorTest(R),ae){const xe=G.get(T.texture);x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_CUBE_MAP_POSITIVE_X+F,xe.__webglTexture,W)}else if(ve){const xe=G.get(T.texture),Ce=F||0;x.framebufferTextureLayer(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,xe.__webglTexture,W||0,Ce)}I=-1},this.readRenderTargetPixels=function(T,F,W,$,Y,ae,ve){if(!T||!T.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=G.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ve!==void 0&&(xe=xe[ve]),xe){y.bindFramebuffer(x.FRAMEBUFFER,xe);try{const Ce=T.texture,Pe=Ce.format,Ue=Ce.type;if(Pe!==Ot&&ot.convert(Pe)!==x.getParameter(x.IMPLEMENTATION_COLOR_READ_FORMAT))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");const De=Ue===vi&&(le.has("EXT_color_buffer_half_float")||de.isWebGL2&&le.has("EXT_color_buffer_float"));if(!(Ue===En||ot.convert(Ue)===x.getParameter(x.IMPLEMENTATION_COLOR_READ_TYPE)||Ue===cn&&(de.isWebGL2||le.has("OES_texture_float")||le.has("WEBGL_color_buffer_float"))||De))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");F>=0&&F<=T.width-$&&W>=0&&W<=T.height-Y&&x.readPixels(F,W,$,Y,ot.convert(Pe),ot.convert(Ue),ae)}finally{const Ce=b!==null?G.get(b).__webglFramebuffer:null;y.bindFramebuffer(x.FRAMEBUFFER,Ce)}}},this.copyFramebufferToTexture=function(T,F,W=0){const $=Math.pow(2,-W),Y=Math.floor(F.image.width*$),ae=Math.floor(F.image.height*$);H.setTexture2D(F,0),x.copyTexSubImage2D(x.TEXTURE_2D,W,0,0,T.x,T.y,Y,ae),y.unbindTexture()},this.copyTextureToTexture=function(T,F,W,$=0){const Y=F.image.width,ae=F.image.height,ve=ot.convert(W.format),xe=ot.convert(W.type);H.setTexture2D(W,0),x.pixelStorei(x.UNPACK_FLIP_Y_WEBGL,W.flipY),x.pixelStorei(x.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),x.pixelStorei(x.UNPACK_ALIGNMENT,W.unpackAlignment),F.isDataTexture?x.texSubImage2D(x.TEXTURE_2D,$,T.x,T.y,Y,ae,ve,xe,F.image.data):F.isCompressedTexture?x.compressedTexSubImage2D(x.TEXTURE_2D,$,T.x,T.y,F.mipmaps[0].width,F.mipmaps[0].height,ve,F.mipmaps[0].data):x.texSubImage2D(x.TEXTURE_2D,$,T.x,T.y,ve,xe,F.image),$===0&&W.generateMipmaps&&x.generateMipmap(x.TEXTURE_2D),y.unbindTexture()},this.copyTextureToTexture3D=function(T,F,W,$,Y=0){if(_.isWebGL1Renderer)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");const ae=T.max.x-T.min.x+1,ve=T.max.y-T.min.y+1,xe=T.max.z-T.min.z+1,Ce=ot.convert($.format),Pe=ot.convert($.type);let Ue;if($.isData3DTexture)H.setTexture3D($,0),Ue=x.TEXTURE_3D;else{if(!$.isDataArrayTexture&&!$.isCompressedArrayTexture)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");H.setTexture2DArray($,0),Ue=x.TEXTURE_2D_ARRAY}x.pixelStorei(x.UNPACK_FLIP_Y_WEBGL,$.flipY),x.pixelStorei(x.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),x.pixelStorei(x.UNPACK_ALIGNMENT,$.unpackAlignment);const De=x.getParameter(x.UNPACK_ROW_LENGTH),ze=x.getParameter(x.UNPACK_IMAGE_HEIGHT),bt=x.getParameter(x.UNPACK_SKIP_PIXELS),Ht=x.getParameter(x.UNPACK_SKIP_ROWS),pn=x.getParameter(x.UNPACK_SKIP_IMAGES),He=W.isCompressedTexture?W.mipmaps[Y]:W.image;x.pixelStorei(x.UNPACK_ROW_LENGTH,He.width),x.pixelStorei(x.UNPACK_IMAGE_HEIGHT,He.height),x.pixelStorei(x.UNPACK_SKIP_PIXELS,T.min.x),x.pixelStorei(x.UNPACK_SKIP_ROWS,T.min.y),x.pixelStorei(x.UNPACK_SKIP_IMAGES,T.min.z),W.isDataTexture||W.isData3DTexture?x.texSubImage3D(Ue,Y,F.x,F.y,F.z,ae,ve,xe,Ce,Pe,He.data):W.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),x.compressedTexSubImage3D(Ue,Y,F.x,F.y,F.z,ae,ve,xe,Ce,He.data)):x.texSubImage3D(Ue,Y,F.x,F.y,F.z,ae,ve,xe,Ce,Pe,He),x.pixelStorei(x.UNPACK_ROW_LENGTH,De),x.pixelStorei(x.UNPACK_IMAGE_HEIGHT,ze),x.pixelStorei(x.UNPACK_SKIP_PIXELS,bt),x.pixelStorei(x.UNPACK_SKIP_ROWS,Ht),x.pixelStorei(x.UNPACK_SKIP_IMAGES,pn),Y===0&&$.generateMipmaps&&x.generateMipmap(Ue),y.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?H.setTextureCube(T,0):T.isData3DTexture?H.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?H.setTexture2DArray(T,0):H.setTexture2D(T,0),y.unbindTexture()},this.resetState=function(){L=0,w=0,b=null,y.reset(),$e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ua?"display-p3":"srgb",t.unpackColorSpace=Fe.workingColorSpace===sr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Qe?bn:_o}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===bn?Qe:Kt}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class pu extends Oo{}pu.prototype.isWebGL1Renderer=!0;class fa{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ee(e),this.near=t,this.far=n}clone(){return new fa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class fu extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}new A;new A;new A;new A;new _e;new _e;new Te;new A;new A;new A;new _e;new _e;new _e;new A;new A;new A;new Ve;new Ve;new A;new Te;new A;new Jt;new Te;new Mi;new Te;new Te;class ks extends Dt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Zn=new Te,Ws=new Te,Yi=[],Xs=new Zt,mu=new Te,mi=new Ze,gi=new Jt;class js extends Ze{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ks(new Float32Array(16*n),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,mu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Zt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zn),Xs.copy(e.boundingBox).applyMatrix4(Zn),this.boundingBox.union(Xs)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zn),gi.copy(e.boundingSphere).applyMatrix4(Zn),this.boundingSphere.union(gi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,16*e)}raycast(e,t){const n=this.matrixWorld,i=this.count;if(mi.geometry=this.geometry,mi.material=this.material,mi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gi.copy(this.boundingSphere),gi.applyMatrix4(n),e.ray.intersectsSphere(gi)!==!1))for(let a=0;a<i;a++){this.getMatrixAt(a,Zn),Ws.multiplyMatrices(n,Zn),mi.matrixWorld=Ws,mi.raycast(e,Yi);for(let s=0,l=Yi.length;s<l;s++){const c=Yi[s];c.instanceId=a,c.object=this,t.push(c)}Yi.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ks(new Float32Array(3*this.instanceMatrix.count),3)),t.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,16*e)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}new Te;new Te;new Te;new Te;new lr;new Zt;new Jt;new A;new Ze;class ma extends ri{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ys=new A,qs=new A,Ks=new Te,Yr=new Mi,qi=new Jt;class Fo extends Xe{constructor(e=new ht,t=new ma){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,a=t.count;i<a;i++)Ys.fromBufferAttribute(t,i-1),qs.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ys.distanceTo(qs);e.setAttribute("lineDistance",new ke(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,a=e.params.Line.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qi.copy(n.boundingSphere),qi.applyMatrix4(i),qi.radius+=a,e.ray.intersectsSphere(qi)===!1)return;Ks.copy(i).invert(),Yr.copy(e.ray).applyMatrix4(Ks);const l=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,o=new A,u=new A,d=new A,h=new A,f=this.isLineSegments?2:1,g=n.index,v=n.attributes.position;if(g!==null)for(let p=Math.max(0,s.start),M=Math.min(g.count,s.start+s.count)-1;p<M;p+=f){const m=g.getX(p),_=g.getX(p+1);if(o.fromBufferAttribute(v,m),u.fromBufferAttribute(v,_),Yr.distanceSqToSegment(o,u,h,d)>c)continue;h.applyMatrix4(this.matrixWorld);const C=e.ray.origin.distanceTo(h);C<e.near||C>e.far||t.push({distance:C,point:d.clone().applyMatrix4(this.matrixWorld),index:p,face:null,faceIndex:null,object:this})}else for(let p=Math.max(0,s.start),M=Math.min(v.count,s.start+s.count)-1;p<M;p+=f){if(o.fromBufferAttribute(v,p),u.fromBufferAttribute(v,p+1),Yr.distanceSqToSegment(o,u,h,d)>c)continue;h.applyMatrix4(this.matrixWorld);const m=e.ray.origin.distanceTo(h);m<e.near||m>e.far||t.push({distance:m,point:d.clone().applyMatrix4(this.matrixWorld),index:p,face:null,faceIndex:null,object:this})}}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,a=n.length;i<a;i++){const s=n[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[s]=i}}}}}new A;new A;new Te;new Mi;new Jt;new A;new A;class ga extends ht{constructor(e=1,t=32,n=0,i=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const a=[],s=[],l=[],c=[],o=new A,u=new _e;s.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let d=0,h=3;d<=t;d++,h+=3){const f=n+d/t*i;o.x=e*Math.cos(f),o.y=e*Math.sin(f),s.push(o.x,o.y,o.z),l.push(0,0,1),u.x=(s[h]/e+1)/2,u.y=(s[h+1]/e+1)/2,c.push(u.x,u.y)}for(let d=1;d<=t;d++)a.push(d,d+1,0);this.setIndex(a),this.setAttribute("position",new ke(s,3)),this.setAttribute("normal",new ke(l,3)),this.setAttribute("uv",new ke(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ga(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ii extends ht{constructor(e=1,t=1,n=1,i=32,a=1,s=!1,l=0,c=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:l,thetaLength:c};const o=this;i=Math.floor(i),a=Math.floor(a);const u=[],d=[],h=[],f=[];let g=0;const v=[],p=n/2;let M=0;function m(_){const C=g,L=new _e,w=new A;let b=0;const I=_===!0?e:t,U=_===!0?1:-1;for(let K=1;K<=i;K++)d.push(0,p*U,0),h.push(0,U,0),f.push(.5,.5),g++;const N=g;for(let K=0;K<=i;K++){const R=K/i*c+l,z=Math.cos(R),B=Math.sin(R);w.x=I*B,w.y=p*U,w.z=I*z,d.push(w.x,w.y,w.z),h.push(0,U,0),L.x=.5*z+.5,L.y=.5*B*U+.5,f.push(L.x,L.y),g++}for(let K=0;K<i;K++){const R=C+K,z=N+K;_===!0?u.push(z,z+1,R):u.push(z+1,z,R),b+=3}o.addGroup(M,b,_===!0?1:2),M+=b}(function(){const _=new A,C=new A;let L=0;const w=(t-e)/n;for(let b=0;b<=a;b++){const I=[],U=b/a,N=U*(t-e)+e;for(let K=0;K<=i;K++){const R=K/i,z=R*c+l,B=Math.sin(z),te=Math.cos(z);C.x=N*B,C.y=-U*n+p,C.z=N*te,d.push(C.x,C.y,C.z),_.set(B,w,te).normalize(),h.push(_.x,_.y,_.z),f.push(R,1-U),I.push(g++)}v.push(I)}for(let b=0;b<i;b++)for(let I=0;I<a;I++){const U=v[I][b],N=v[I+1][b],K=v[I+1][b+1],R=v[I][b+1];u.push(U,N,R),u.push(N,K,R),L+=6}o.addGroup(M,L,0),M+=L})(),s===!1&&(e>0&&m(!0),t>0&&m(!1)),this.setIndex(u),this.setAttribute("position",new ke(d,3)),this.setAttribute("normal",new ke(h,3)),this.setAttribute("uv",new ke(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ii(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _a extends ii{constructor(e=1,t=1,n=32,i=1,a=!1,s=0,l=2*Math.PI){super(0,e,t,n,i,a,s,l),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:a,thetaStart:s,thetaLength:l}}static fromJSON(e){return new _a(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class va extends ht{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const a=[],s=[];function l(h,f,g,v){const p=v+1,M=[];for(let m=0;m<=p;m++){M[m]=[];const _=h.clone().lerp(g,m/p),C=f.clone().lerp(g,m/p),L=p-m;for(let w=0;w<=L;w++)M[m][w]=w===0&&m===p?_:_.clone().lerp(C,w/L)}for(let m=0;m<p;m++)for(let _=0;_<2*(p-m)-1;_++){const C=Math.floor(_/2);_%2==0?(c(M[m][C+1]),c(M[m+1][C]),c(M[m][C])):(c(M[m][C+1]),c(M[m+1][C+1]),c(M[m+1][C]))}}function c(h){a.push(h.x,h.y,h.z)}function o(h,f){const g=3*h;f.x=e[g+0],f.y=e[g+1],f.z=e[g+2]}function u(h,f,g,v){v<0&&h.x===1&&(s[f]=h.x-1),g.x===0&&g.z===0&&(s[f]=v/2/Math.PI+.5)}function d(h){return Math.atan2(h.z,-h.x)}(function(h){const f=new A,g=new A,v=new A;for(let p=0;p<t.length;p+=3)o(t[p+0],f),o(t[p+1],g),o(t[p+2],v),l(f,g,v,h)})(i),function(h){const f=new A;for(let g=0;g<a.length;g+=3)f.x=a[g+0],f.y=a[g+1],f.z=a[g+2],f.normalize().multiplyScalar(h),a[g+0]=f.x,a[g+1]=f.y,a[g+2]=f.z}(n),function(){const h=new A;for(let g=0;g<a.length;g+=3){h.x=a[g+0],h.y=a[g+1],h.z=a[g+2];const v=d(h)/2/Math.PI+.5,p=(f=h,Math.atan2(-f.y,Math.sqrt(f.x*f.x+f.z*f.z))/Math.PI+.5);s.push(v,1-p)}var f;(function(){const g=new A,v=new A,p=new A,M=new A,m=new _e,_=new _e,C=new _e;for(let L=0,w=0;L<a.length;L+=9,w+=6){g.set(a[L+0],a[L+1],a[L+2]),v.set(a[L+3],a[L+4],a[L+5]),p.set(a[L+6],a[L+7],a[L+8]),m.set(s[w+0],s[w+1]),_.set(s[w+2],s[w+3]),C.set(s[w+4],s[w+5]),M.copy(g).add(v).add(p).divideScalar(3);const b=d(M);u(m,w+0,g,b),u(_,w+2,v,b),u(C,w+4,p,b)}})(),function(){for(let g=0;g<s.length;g+=6){const v=s[g+0],p=s[g+2],M=s[g+4],m=Math.max(v,p,M),_=Math.min(v,p,M);m>.9&&_<.1&&(v<.2&&(s[g+0]+=1),p<.2&&(s[g+2]+=1),M<.2&&(s[g+4]+=1))}}()}(),this.setAttribute("position",new ke(a,3)),this.setAttribute("normal",new ke(a.slice(),3)),this.setAttribute("uv",new ke(s,2)),i===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new va(e.vertices,e.indices,e.radius,e.details)}}new A;new A;new A;new St;class xa extends va{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2;super([-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new xa(e.radius,e.detail)}}class sn extends ri{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Bo extends Xe{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ee(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class gu extends Bo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ee(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const qr=new Te,Zs=new A,Js=new A;class _u{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _e(512,512),this.map=null,this.mapPass=null,this.matrix=new Te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lr,this._frameExtents=new _e(1,1),this._viewportCount=1,this._viewports=[new Ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Zs.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zs),Js.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Js),t.updateMatrixWorld(),qr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}new Te;new A;new A;class vu extends _u{constructor(){super(new Co(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xu extends Bo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new vu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}new Te;new Te;new Te;new A;new A;new A;new A;new A;new A;const zo="\\[\\]\\.:\\/",Kr="[^"+zo+"]",Mu="[^"+zo.replace("\\.","")+"]";new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",Kr)+/(WCOD+)?/.source.replace("WCOD",Mu)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Kr)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Kr)+"$");class Qs{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(st(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}new _e;new A;new A;new A;new A;new Te;new Te;new A;new Ee;new Ee;new A;new A;new A;new A;new da;new Zt;const $s=new A;let Ki,Zr;class Su extends Xe{constructor(e=new A(0,0,1),t=new A(0,0,0),n=1,i=16776960,a=.2*n,s=.2*a){super(),this.type="ArrowHelper",Ki===void 0&&(Ki=new ht,Ki.setAttribute("position",new ke([0,0,0,0,1,0],3)),Zr=new ii(0,.5,1,5,1),Zr.translate(0,-.5,0)),this.position.copy(t),this.line=new Fo(Ki,new ma({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Ze(Zr,new ha({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,a,s)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{$s.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle($s,t)}}setLength(e,t=.2*e,n=.2*t){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Qr}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Qr);const eo={type:"change"},Jr={type:"start"},to={type:"end"},Zi=new Mi,no=new on,Eu=Math.cos(70*ol.DEG2RAD);class yu extends Rn{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Un.ROTATE,MIDDLE:Un.DOLLY,RIGHT:Un.PAN},this.touches={ONE:Dn.ROTATE,TWO:Dn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return l.phi},this.getAzimuthalAngle=function(){return l.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(x){x.addEventListener("keydown",Ae),this._domElementKeyEvents=x},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Ae),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(eo),n.update(),a=i.NONE},this.update=function(){const x=new A,he=new dn().setFromUnitVectors(e.up,new A(0,1,0)),be=he.clone().invert(),Se=new A,qe=new dn,yt=new A,it=2*Math.PI;return function(Si=null){const Pn=n.object.position;x.copy(Pn).sub(n.target),x.applyQuaternion(he),l.setFromVector3(x),n.autoRotate&&a===i.NONE&&R(N(Si)),n.enableDamping?(l.theta+=c.theta*n.dampingFactor,l.phi+=c.phi*n.dampingFactor):(l.theta+=c.theta,l.phi+=c.phi);let gt=n.minAzimuthAngle,_t=n.maxAzimuthAngle;isFinite(gt)&&isFinite(_t)&&(gt<-Math.PI?gt+=it:gt>Math.PI&&(gt-=it),_t<-Math.PI?_t+=it:_t>Math.PI&&(_t-=it),gt<=_t?l.theta=Math.max(gt,Math.min(_t,l.theta)):l.theta=l.theta>(gt+_t)/2?Math.max(gt,l.theta):Math.min(_t,l.theta)),l.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,l.phi)),l.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?l.radius=O(l.radius):l.radius=O(l.radius*o),x.setFromSpherical(l),x.applyQuaternion(be),Pn.copy(n.target).add(x),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),u.set(0,0,0));let Tt=!1;if(n.zoomToCursor&&w){let Qt=null;if(n.object.isPerspectiveCamera){const $t=x.length();Qt=O($t*o);const zt=$t-Qt;n.object.position.addScaledVector(C,zt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const $t=new A(L.x,L.y,0);$t.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/o)),n.object.updateProjectionMatrix(),Tt=!0;const zt=new A(L.x,L.y,0);zt.unproject(n.object),n.object.position.sub(zt).add($t),n.object.updateMatrixWorld(),Qt=x.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Qt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Qt).add(n.object.position):(Zi.origin.copy(n.object.position),Zi.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Zi.direction))<Eu?e.lookAt(n.target):(no.setFromNormalAndCoplanarPoint(n.object.up,n.target),Zi.intersectPlane(no,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/o)),n.object.updateProjectionMatrix(),Tt=!0);return o=1,w=!1,Tt||Se.distanceToSquared(n.object.position)>s||8*(1-qe.dot(n.object.quaternion))>s||yt.distanceToSquared(n.target)>0?(n.dispatchEvent(eo),Se.copy(n.object.position),qe.copy(n.object.quaternion),yt.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Bt),n.domElement.removeEventListener("pointerdown",oe),n.domElement.removeEventListener("pointercancel",fe),n.domElement.removeEventListener("wheel",me),n.domElement.removeEventListener("pointermove",ce),n.domElement.removeEventListener("pointerup",fe),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Ae),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let a=i.NONE;const s=1e-6,l=new Qs,c=new Qs;let o=1;const u=new A,d=new _e,h=new _e,f=new _e,g=new _e,v=new _e,p=new _e,M=new _e,m=new _e,_=new _e,C=new A,L=new _e;let w=!1;const b=[],I={};let U=!1;function N(x){return x!==null?2*Math.PI/60*n.autoRotateSpeed*x:2*Math.PI/60/60*n.autoRotateSpeed}function K(x){const he=Math.abs(x*.01);return Math.pow(.95,n.zoomSpeed*he)}function R(x){c.theta-=x}function z(x){c.phi-=x}const B=function(){const x=new A;return function(be,Se){x.setFromMatrixColumn(Se,0),x.multiplyScalar(-be),u.add(x)}}(),te=function(){const x=new A;return function(be,Se){n.screenSpacePanning===!0?x.setFromMatrixColumn(Se,1):(x.setFromMatrixColumn(Se,0),x.crossVectors(n.object.up,x)),x.multiplyScalar(be),u.add(x)}}(),ue=function(){const x=new A;return function(be,Se){const qe=n.domElement;if(n.object.isPerspectiveCamera){const yt=n.object.position;x.copy(yt).sub(n.target);let it=x.length();it*=Math.tan(n.object.fov/2*Math.PI/180),B(2*be*it/qe.clientHeight,n.object.matrix),te(2*Se*it/qe.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(B(be*(n.object.right-n.object.left)/n.object.zoom/qe.clientWidth,n.object.matrix),te(Se*(n.object.top-n.object.bottom)/n.object.zoom/qe.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Z(x){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?o/=x:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function X(x){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?o*=x:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(x,he){if(!n.zoomToCursor)return;w=!0;const be=n.domElement.getBoundingClientRect(),Se=x-be.left,qe=he-be.top,yt=be.width,it=be.height;L.x=Se/yt*2-1,L.y=-(qe/it)*2+1,C.set(L.x,L.y,1).unproject(n.object).sub(n.object.position).normalize()}function O(x){return Math.max(n.minDistance,Math.min(n.maxDistance,x))}function j(x){d.set(x.clientX,x.clientY)}function se(x){q(x.clientX,x.clientX),M.set(x.clientX,x.clientY)}function S(x){g.set(x.clientX,x.clientY)}function E(x){h.set(x.clientX,x.clientY),f.subVectors(h,d).multiplyScalar(n.rotateSpeed);const he=n.domElement;R(2*Math.PI*f.x/he.clientHeight),z(2*Math.PI*f.y/he.clientHeight),d.copy(h),n.update()}function D(x){m.set(x.clientX,x.clientY),_.subVectors(m,M),_.y>0?Z(K(_.y)):_.y<0&&X(K(_.y)),M.copy(m),n.update()}function V(x){v.set(x.clientX,x.clientY),p.subVectors(v,g).multiplyScalar(n.panSpeed),ue(p.x,p.y),g.copy(v),n.update()}function P(x){q(x.clientX,x.clientY),x.deltaY<0?X(K(x.deltaY)):x.deltaY>0&&Z(K(x.deltaY)),n.update()}function k(x){let he=!1;switch(x.code){case n.keys.UP:x.ctrlKey||x.metaKey||x.shiftKey?z(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ue(0,n.keyPanSpeed),he=!0;break;case n.keys.BOTTOM:x.ctrlKey||x.metaKey||x.shiftKey?z(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ue(0,-n.keyPanSpeed),he=!0;break;case n.keys.LEFT:x.ctrlKey||x.metaKey||x.shiftKey?R(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ue(n.keyPanSpeed,0),he=!0;break;case n.keys.RIGHT:x.ctrlKey||x.metaKey||x.shiftKey?R(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ue(-n.keyPanSpeed,0),he=!0;break}he&&(x.preventDefault(),n.update())}function Q(x){if(b.length===1)d.set(x.pageX,x.pageY);else{const he=dt(x),be=.5*(x.pageX+he.x),Se=.5*(x.pageY+he.y);d.set(be,Se)}}function J(x){if(b.length===1)g.set(x.pageX,x.pageY);else{const he=dt(x),be=.5*(x.pageX+he.x),Se=.5*(x.pageY+he.y);g.set(be,Se)}}function ne(x){const he=dt(x),be=x.pageX-he.x,Se=x.pageY-he.y,qe=Math.sqrt(be*be+Se*Se);M.set(0,qe)}function le(x){n.enableZoom&&ne(x),n.enablePan&&J(x)}function de(x){n.enableZoom&&ne(x),n.enableRotate&&Q(x)}function y(x){if(b.length==1)h.set(x.pageX,x.pageY);else{const be=dt(x),Se=.5*(x.pageX+be.x),qe=.5*(x.pageY+be.y);h.set(Se,qe)}f.subVectors(h,d).multiplyScalar(n.rotateSpeed);const he=n.domElement;R(2*Math.PI*f.x/he.clientHeight),z(2*Math.PI*f.y/he.clientHeight),d.copy(h)}function ie(x){if(b.length===1)v.set(x.pageX,x.pageY);else{const he=dt(x),be=.5*(x.pageX+he.x),Se=.5*(x.pageY+he.y);v.set(be,Se)}p.subVectors(v,g).multiplyScalar(n.panSpeed),ue(p.x,p.y),g.copy(v)}function G(x){const he=dt(x),be=x.pageX-he.x,Se=x.pageY-he.y,qe=Math.sqrt(be*be+Se*Se);m.set(0,qe),_.set(0,Math.pow(m.y/M.y,n.zoomSpeed)),Z(_.y),M.copy(m);const yt=(x.pageX+he.x)*.5,it=(x.pageY+he.y)*.5;q(yt,it)}function H(x){n.enableZoom&&G(x),n.enablePan&&ie(x)}function ee(x){n.enableZoom&&G(x),n.enableRotate&&y(x)}function oe(x){n.enabled!==!1&&(b.length===0&&(n.domElement.setPointerCapture(x.pointerId),n.domElement.addEventListener("pointermove",ce),n.domElement.addEventListener("pointerup",fe)),Ln(x),x.pointerType==="touch"?Re(x):Me(x))}function ce(x){n.enabled!==!1&&(x.pointerType==="touch"?Cn(x):pe(x))}function fe(x){ot(x),b.length===0&&(n.domElement.releasePointerCapture(x.pointerId),n.domElement.removeEventListener("pointermove",ce),n.domElement.removeEventListener("pointerup",fe)),n.dispatchEvent(to),a=i.NONE}function Me(x){let he;switch(x.button){case 0:he=n.mouseButtons.LEFT;break;case 1:he=n.mouseButtons.MIDDLE;break;case 2:he=n.mouseButtons.RIGHT;break;default:he=-1}switch(he){case Un.DOLLY:if(n.enableZoom===!1)return;se(x),a=i.DOLLY;break;case Un.ROTATE:if(x.ctrlKey||x.metaKey||x.shiftKey){if(n.enablePan===!1)return;S(x),a=i.PAN}else{if(n.enableRotate===!1)return;j(x),a=i.ROTATE}break;case Un.PAN:if(x.ctrlKey||x.metaKey||x.shiftKey){if(n.enableRotate===!1)return;j(x),a=i.ROTATE}else{if(n.enablePan===!1)return;S(x),a=i.PAN}break;default:a=i.NONE}a!==i.NONE&&n.dispatchEvent(Jr)}function pe(x){switch(a){case i.ROTATE:if(n.enableRotate===!1)return;E(x);break;case i.DOLLY:if(n.enableZoom===!1)return;D(x);break;case i.PAN:if(n.enablePan===!1)return;V(x);break}}function me(x){n.enabled===!1||n.enableZoom===!1||a!==i.NONE||(x.preventDefault(),n.dispatchEvent(Jr),P(we(x)),n.dispatchEvent(to))}function we(x){const he=x.deltaMode,be={clientX:x.clientX,clientY:x.clientY,deltaY:x.deltaY};switch(he){case 1:be.deltaY*=16;break;case 2:be.deltaY*=100;break}return x.ctrlKey&&!U&&(be.deltaY*=10),be}function Je(x){x.key==="Control"&&(U=!0,document.addEventListener("keyup",ge,{passive:!0,capture:!0}))}function ge(x){x.key==="Control"&&(U=!1,document.removeEventListener("keyup",ge,{passive:!0,capture:!0}))}function Ae(x){n.enabled===!1||n.enablePan===!1||k(x)}function Re(x){switch($e(x),b.length){case 1:switch(n.touches.ONE){case Dn.ROTATE:if(n.enableRotate===!1)return;Q(x),a=i.TOUCH_ROTATE;break;case Dn.PAN:if(n.enablePan===!1)return;J(x),a=i.TOUCH_PAN;break;default:a=i.NONE}break;case 2:switch(n.touches.TWO){case Dn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;le(x),a=i.TOUCH_DOLLY_PAN;break;case Dn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(x),a=i.TOUCH_DOLLY_ROTATE;break;default:a=i.NONE}break;default:a=i.NONE}a!==i.NONE&&n.dispatchEvent(Jr)}function Cn(x){switch($e(x),a){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;y(x),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;ie(x),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;H(x),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ee(x),n.update();break;default:a=i.NONE}}function Bt(x){n.enabled!==!1&&x.preventDefault()}function Ln(x){b.push(x.pointerId)}function ot(x){delete I[x.pointerId];for(let he=0;he<b.length;he++)if(b[he]==x.pointerId){b.splice(he,1);return}}function $e(x){let he=I[x.pointerId];he===void 0&&(he=new _e,I[x.pointerId]=he),he.set(x.pageX,x.pageY)}function dt(x){const he=x.pointerId===b[0]?b[1]:b[0];return I[he]}n.domElement.addEventListener("contextmenu",Bt),n.domElement.addEventListener("pointerdown",oe),n.domElement.addEventListener("pointercancel",fe),n.domElement.addEventListener("wheel",me,{passive:!1}),document.addEventListener("keydown",Je,{passive:!0,capture:!0}),this.update()}}const jt=96,io="#aecfe6",ro={aguacate:{trunk:2.2,radius:2.4,foliage:"#2b6e3a",shape:"arbol"},peral:{trunk:2,radius:1.9,foliage:"#3c7d45",shape:"arbol"},mora:{trunk:.6,radius:1.1,foliage:"#4a7c3f",shape:"arbusto"},arandano:{trunk:.3,radius:.75,foliage:"#5a8f5a",shape:"arbusto"},lavanda:{trunk:.2,radius:.45,foliage:"#8b7cc8",shape:"arbusto"},hortaliza:{trunk:.15,radius:.4,foliage:"#6aa84f",shape:"arbusto"},pasto:{trunk:.1,radius:.3,foliage:"#7cb342",shape:"arbusto"},otro:{trunk:1,radius:1,foliage:"#5f8f52",shape:"arbusto"}};class wu{constructor(e){this.container=e,this.exaggeration=3,this.showArrows=!0,this.colorBy="species",this.ocluidoAbajo=0,this.scene=new fu,this.scene.background=new Ee(io),this.scene.fog=new fa(io,200,560),this.camera=new Et(46,1,.5,2e3),this.renderer=new Oo({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=so,e.appendChild(this.renderer.domElement),this.controls=new yu(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.maxPolarAngle=Math.PI/2.15,this.controls.minDistance=25,this.controls.maxDistance=600,this.scene.add(new gu("#dff0ff","#6b6048",.85));const t=new xu("#fff4de",2);t.position.set(-90,120,60),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.near=10,t.shadow.camera.far=400;const n=130;Object.assign(t.shadow.camera,{left:-n,right:n,top:n,bottom:-n}),t.shadow.bias=-8e-4,this.sun=t,this.scene.add(t),this.scene.add(t.target),this.group=new Pt,this.scene.add(this.group),this._disposables=[],this._onResize=()=>this.resize(),addEventListener("resize",this._onResize),this._animate()}resize(){const e=this.container.clientWidth||1,t=this.container.clientHeight||1;this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}setOclusion(e){const t=Math.max(0,Math.min(.6,e||0));Math.abs(t-this.ocluidoAbajo)<.02||(this.ocluidoAbajo=t,this._encuadrado=!1,this.state&&this.render(this.state))}setExaggeration(e){this.exaggeration=e,this.state&&this.render(this.state)}setColorBy(e){this.colorBy=e,this.state&&this.render(this.state)}toggleArrows(e){this.showArrows=e,this.state&&this.render(this.state)}render(e){this.state=e,this._limpiar();const t=e.parcel.boundary,n=Ko(t),i=Aa(t),a=gr([i.minLat,i.minLng],n),s=gr([i.maxLat,i.maxLng],n),l=10,c=a.x-l,o=s.x+l,u=a.y-l,d=s.y+l,h=e.elevations.filter(C=>typeof C.elevationM=="number");if(!h.length)return;this.minElev=Math.min(...h.map(C=>C.elevationM)),this.maxElev=Math.max(...h.map(C=>C.elevationM));const f=(c+o)/2,g=(u+d)/2,v=([C,L])=>{const w=gr([C,L],n);return{x:w.x-f,z:w.y-g}},p=(C,L)=>(Ti([C,L],h)-this.minElev)*this.exaggeration,M=(C,L)=>{const b=111320*Math.cos(n[0]*Math.PI/180);return[n[0]+(L+g)/111320,n[1]+(C+f)/b]};this._local=v,this._height=p;const m=o-c,_=d-u;this.group.add(this._terreno(m,_,t,p,M)),this.group.add(this._borde(t,v,p,"#ffd84d",1,3));for(const C of e.sectors)this.group.add(this._borde(C.polygon,v,p,C.color,.6,2));this.group.add(this._plantas(e.plants,v,p)),this.group.add(this._infra(e.infra,v,p)),this.showArrows&&this.group.add(this._flechas(t,v,h)),this.sun.target.position.set(0,0,0),this.sun.target.updateMatrixWorld(),this.resize(),this._encuadrar(m,_,p(n[0],n[1]))}_encuadrar(e,t,n){const i=this.camera.fov*Math.PI/180,a=Math.hypot(e,t)/2,s=2*Math.atan(Math.tan(i/2)*this.camera.aspect),l=a/Math.tan(Math.min(i,s)/2)*(1.02+this.ocluidoAbajo*.55),c=Math.tan(i/2)*l*this.ocluidoAbajo*.5;if(this.controls.target.set(0,n*.4-c,0),!this._encuadrado){const o=new A(.62,.52,.58).normalize();this.camera.position.copy(o.multiplyScalar(l)).add(this.controls.target),this.camera.updateProjectionMatrix(),this.scene.fog.near=l*.85,this.scene.fog.far=l*2.6,this._encuadrado=!0}this.controls.update()}recentrar(){this._encuadrado=!1,this.state&&this.render(this.state)}_terreno(e,t,n,i,a){const s=new Pt,l=new cr(e,t,jt,jt);l.rotateX(-Math.PI/2);const c=l.attributes.position,o=[],u=new Ee("#3f7a45"),d=new Ee("#7e9b52"),h=new Ee("#c4b184"),f=new Ee("#6e7a63"),g=this.maxElev-this.minElev;for(let m=0;m<c.count;m++){const _=c.getX(m),C=c.getZ(m),[L,w]=a(_,C),b=i(L,w);c.setY(m,b);const I=g>0?b/this.exaggeration/g:0,U=I<.5?u.clone().lerp(d,I*2):d.clone().lerp(h,(I-.5)*2);Ra([L,w],n)||U.lerp(f,.55),o.push(U.r,U.g,U.b)}l.setAttribute("color",new ke(o,3)),l.computeVertexNormals();const v=new sn({vertexColors:!0,roughness:.95,metalness:0}),p=new Ze(l,v);p.receiveShadow=!0,s.add(p),this._disposables.push(l,v);const M=this._faldon(l,e,t);return s.add(M),s}_faldon(e,t,n){const i=e.attributes.position,a=jt+1,s=(h,f)=>f*a+h,l=-14,c=[],o=(h,f)=>{const g=i.getX(h),v=i.getY(h),p=i.getZ(h),M=i.getX(f),m=i.getY(f),_=i.getZ(f);c.push(g,v,p,M,m,_,M,l,_),c.push(g,v,p,M,l,_,g,l,p)};for(let h=0;h<jt;h++)o(s(h+1,0),s(h,0)),o(s(h,jt),s(h+1,jt));for(let h=0;h<jt;h++)o(s(0,h),s(0,h+1)),o(s(jt,h+1),s(jt,h));const u=new ht;u.setAttribute("position",new ke(c,3)),u.computeVertexNormals();const d=new sn({color:"#6b5842",roughness:1,metalness:0,side:Ca});return this._disposables.push(u,d),new Ze(u,d)}_borde(e,t,n,i,a,s){const l=e.map(([u,d])=>{const{x:h,z:f}=t([u,d]);return new A(h,n(u,d)+a,f)});l.push(l[0].clone());const c=new ht().setFromPoints(l),o=new ma({color:i,linewidth:s});return this._disposables.push(c,o),new Fo(c,o)}_plantas(e,t,n){const i=new Pt;if(!e.length)return i;const a=new Map;for(const d of e)d.status!=="muerto"&&(a.has(d.species)||a.set(d.species,[]),a.get(d.species).push(d));const s=new Te,l=new dn,c=new A,o=new A,u=new Ee;for(const[d,h]of a){const f=ro[d]||ro.otro,g=f.shape==="arbol",v=new ii(f.radius*.09,f.radius*.14,f.trunk,6);v.translate(0,f.trunk/2,0);const p=new sn({color:"#6b4f33",roughness:.9}),M=new xa(f.radius,g?1:0);M.scale(1,g?1.15:.8,1),M.translate(0,f.trunk+f.radius*(g?.75:.35),0);const m=new sn({roughness:.85,flatShading:!0}),_=new js(v,p,h.length),C=new js(M,m,h.length);_.castShadow=C.castShadow=!0,C.receiveShadow=!0,h.forEach((L,w)=>{const{x:b,z:I}=t([L.lat,L.lng]);o.set(b,n(L.lat,L.lng),I);const U=Tu(L.id),N=.85+U%30/100;c.set(N,N,N),l.setFromAxisAngle(new A(0,1,0),U%360*Math.PI/180),s.compose(o,l,c),_.setMatrixAt(w,s),C.setMatrixAt(w,s);const K=this.colorBy==="status"?Zo[L.status]||"#868e96":f.foliage;if(u.set(K),this.colorBy==="species"){const R=1+((U>>3)%16-8)/100;u.multiplyScalar(R)}C.setColorAt(w,u)}),_.instanceMatrix.needsUpdate=!0,C.instanceMatrix.needsUpdate=!0,C.instanceColor&&(C.instanceColor.needsUpdate=!0),f.trunk>.25&&i.add(_),i.add(C),this._disposables.push(v,p,M,m)}return i}_infra(e,t,n){const i=new Pt;for(const a of e){const{x:s,z:l}=t([a.lat,a.lng]),c=n(a.lat,a.lng),o=a.type==="reservorio"?this._reservorio(a):this._construccion(a.type);o.position.set(s,c,l),i.add(o)}return i}_reservorio(e){var d;const t=new Pt,n=Math.max(2.5,Math.cbrt((((d=e.props)==null?void 0:d.volumenM3)||80)*.35)),i=2.6,a=new ii(n,n,i,24,1,!0),s=new sn({color:"#b9b3a6",roughness:.9,side:Ca}),l=new Ze(a,s);l.position.y=i/2,l.castShadow=l.receiveShadow=!0,t.add(l);const c=new ga(n*.96,24);c.rotateX(-Math.PI/2);const o=new sn({color:"#2f86c9",roughness:.15,metalness:.35,transparent:!0,opacity:.9}),u=new Ze(c,o);return u.position.y=i*.78,t.add(u),this._disposables.push(a,s,c,o),t}_construccion(e){const t={casa:{w:7,d:6,h:3.2,techo:"#9c4a3c"},establo:{w:8,d:5,h:2.8,techo:"#7d6b52"},cuyera:{w:4,d:3,h:2,techo:"#8a7f6a"},bomba:{w:1.4,d:1.4,h:1.2,techo:"#5a6570"},filtro:{w:1.2,d:1.2,h:1.6,techo:"#5a6570"},válvula:{w:.8,d:.8,h:.8,techo:"#5a6570"}}[e]||{w:3,d:3,h:2.4,techo:"#7d6b52"},n=new Pt,i=new ai(t.w,t.h,t.d),a=new sn({color:"#e6ded0",roughness:.85}),s=new Ze(i,a);s.position.y=t.h/2,s.castShadow=s.receiveShadow=!0,n.add(s);const l=new _a(Math.max(t.w,t.d)*.78,t.h*.62,4),c=new sn({color:t.techo,roughness:.8}),o=new Ze(l,c);return o.position.y=t.h+t.h*.31,o.rotation.y=Math.PI/4,o.castShadow=!0,n.add(o),this._disposables.push(i,a,l,c),n}_flechas(e,t,n){const i=new Pt,a=Aa(e),s=10;for(let l=1;l<s;l++)for(let c=1;c<s;c++){const o=a.minLat+(a.maxLat-a.minLat)*l/s,u=a.minLng+(a.maxLng-a.minLng)*c/s;if(!Ra([o,u],e))continue;const d=4e-5,h=Ti([o,u],n),f=new A(-(Ti([o,u+d],n)-h),0,-(Ti([o+d,u],n)-h));if(f.lengthSq()===0)continue;f.normalize();const{x:g,z:v}=t([o,u]),p=new A(g,this._height(o,u)+1.2,v),M=new Su(f,p,6.5,"#2f86c9",2.4,1.6);M.line.material.transparent=!0,M.line.material.opacity=.75,i.add(M)}return i}_limpiar(){var e;for(const t of this._disposables)(e=t.dispose)==null||e.call(t);this._disposables=[],this.group.clear()}_animate(){this._raf=requestAnimationFrame(()=>this._animate()),this.controls.update(),this.renderer.render(this.scene,this.camera)}dispose(){cancelAnimationFrame(this._raf),removeEventListener("resize",this._onResize),this._limpiar(),this.renderer.dispose()}}function Tu(r){let e=0;for(let t=0;t<String(r).length;t++)e=e*31+String(r).charCodeAt(t)>>>0;return e}export{wu as Terrain3D};
