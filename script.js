
const API =
"https://script.google.com/macros/s/AKfycbzq08x-NGwfGhsmVRx1tNe9lbcNvwEBQPvWbMBdDCRZlw2HvNu6SprAdcE_kFu_vvuRJQ/exec";

const result=document.getElementById("result");

let scanning=true;

function onScanSuccess(decodedText){

if(!scanning)return;

scanning=false;

fetch(API+"?id="+encodeURIComponent(decodedText))

.then(r=>r.json())

.then(data=>{

if(data.success){

result.innerHTML=`

<h2>✅ PASS VERIFIED</h2>

<p><b>Pass:</b> ${data.pass}</p>

<p><b>Name:</b> ${data.fullname}</p>

<p><b>Slot:</b> ${data.slot}</p>

<p><b>Status:</b> ${data.status}</p>

<p><b>Expiry:</b> ${new Date(data.expiry).toLocaleDateString()}</p>

`;

}else{

result.innerHTML="<h2>❌ Pass Not Found</h2>";

}

})
.catch(()=>{

result.innerHTML="<h2>Server Error</h2>";

})

.finally(()=>{

setTimeout(()=>{

scanning=true;

},3000);

});

}

const qr=new Html5QrcodeScanner(

"reader",

{

fps:10,

qrbox:250

},

false

);

qr.render(onScanSuccess);
