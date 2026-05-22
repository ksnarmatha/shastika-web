const API_URL = "/chat";
const API_ROOT = "";
const API_QUOTE = "/quote-submit";

let USER_LANG = "en";
const SESSION_ID = "web-" + Math.random().toString(36);
/* ===============================
   CREATE WIDGET
================================ */

const bubble = document.createElement("div");
bubble.id = "ai-chat-bubble";
bubble.innerHTML = "💬";

const win = document.createElement("div");
win.id = "ai-chat-window";
win.style.position = "fixed";
win.style.bottom = "90px";
win.style.right = "20px";
win.style.width = "380px";
win.style.height = "520px";
win.style.background = "#fff";
win.style.borderRadius = "12px";
win.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
win.style.display = "none";
win.style.zIndex = "9999";
win.style.overflow = "hidden";

win.innerHTML = `
<iframe 
src="https://chatbot-e99e.onrender.com" 
width="100%" 
height="100%" 
style="border:none;">
</iframe>
`;

document.body.appendChild(win);


/* ===============================
   HEADER
================================ */

function header(){
  return `
  <div id="ai-header">
    <div id="ai-header-title">🌿 Shastika Assistant</div>
    <div id="ai-close" onclick="closeChat()">✕</div>
  </div>`;
}

function closeChat(){
  win.style.display="none";
}


/* ===============================
   LANGUAGE SCREEN
================================ */

function openLanguageScreen(){
  win.style.display="flex";
  win.innerHTML = header()+`<div id="ai-body"></div>`;

  addBot("Please select your language",[
    "English","French","German","Italian","Spanish",
    "Polish","Ukrainian","Romanian","Dutch","Chinese",
    "Hindi","Turkish","Indonesian","Portuguese","Arabic",
    "Vietnamese","Thai","Korean","Japanese","Russian"
  ], true);
}


/* ===============================
   START CHAT
================================ */

function startChat(label){

  const map = {
    English:"en", French:"fr", German:"de", Italian:"it", Spanish:"es",
    Polish:"pl", Ukrainian:"uk", Romanian:"ro", Dutch:"nl",
    Chinese:"zh", Hindi:"hi", Turkish:"tr", Indonesian:"id",
    Portuguese:"pt", Arabic:"ar", Vietnamese:"vi", Thai:"th",
    Korean:"ko", Japanese:"ja", Russian:"ru"
  };

  USER_LANG = map[label] || "en";

  win.innerHTML = header()+`
    <div id="ai-body"></div>
    <div id="ai-input-row">
      <input id="ai-input" placeholder="Type message...">
      <button id="ai-send">Send</button>
    </div>`;

  loadMenu();
}


/* ===============================
   MESSAGE HELPERS
================================ */

function now(){
  return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

function addBot(text, buttons=[], langButtons=false){

  const body=document.getElementById("ai-body");
  if(!body) return;

  const d=document.createElement("div");
  d.className="ai-msg ai-bot";
  d.innerHTML=text+`<div class="ai-time">${now()}</div>`;

  if(buttons.length){
    const wrap=document.createElement("div");
    wrap.className="ai-buttons";

    buttons.forEach(b=>{
      const btn=document.createElement("button");
      btn.className="ai-btn";
      btn.innerText=b;
      btn.onclick=()=> langButtons ? startChat(b) : send(b);
      wrap.appendChild(btn);
    });

    d.appendChild(wrap);
  }

  body.appendChild(d);
  body.scrollTop=body.scrollHeight;
}

function addUser(text){
  const body=document.getElementById("ai-body");
  if(!body) return;

  const d=document.createElement("div");
  d.className="ai-msg ai-user";
  d.innerHTML=text+`<div class="ai-time">${now()}</div>`;
  body.appendChild(d);
  body.scrollTop=body.scrollHeight;
  sendMessage(text)
}


/* ===============================
   TYPING
================================ */

function typing(){
  stopTyping();
  const body=document.getElementById("ai-body");
  if(!body) return;

  const t=document.createElement("div");
  t.id="typing";
  t.className="ai-typing";
  t.innerText="Assistant is typing...";
  body.appendChild(t);
}

function stopTyping(){
  const t=document.getElementById("typing");
  if(t) t.remove();
}


/* ===============================
   LOAD MENU
================================ */

async function loadMenu(){

  typing();

  // wait until backend ready
  for(let i=0;i<6;i++){
    try{
      const r = await fetch(API_ROOT + "/health");
      if(r.ok) break;
    } catch {}
    await new Promise(r=>setTimeout(r,1000));
  }

  try{
    const res = await fetch(API_ROOT + "/?lang=" + USER_LANG);
    const data = await res.json();
    stopTyping();
    addBot(data.welcome, data.options);
  }
  catch{
    stopTyping();
    addBot("Server starting — please wait a moment and try again.");
  }
}

/* ===============================
   QUOTE FORM UI
================================ */

function showQuoteForm(){

  if(document.getElementById("q_company")) return;

  const body=document.getElementById("ai-body");

  const wrap=document.createElement("div");
  wrap.className="ai-msg ai-bot";

  wrap.innerHTML=`
  <b>💰 Quotation Request — Shastika Global Impex</b><br><br>

  Company Name<br>
  <input id="q_company" class="ai-form"><br>

  Product<br>
  <select id="q_product" class="ai-form">
    <option>Tender Coconut</option>
    <option>Green Coconut</option>
    <option>Banana</option>
    <option>Watermelon</option>
    <option>Tomato</option>
    <option>Pumpkin</option>
    <option>Cucumber</option>
    <option>Coir</option>
    <option>Onion</option>
  </select><br>

  Quantity<br>
  <input id="q_quantity" class="ai-form"><br>

  Destination<br>
  <input id="q_destination" class="ai-form"><br>

  Phone<br>
  <input id="q_phone" class="ai-form"><br>

  WhatsApp<br>
  <input id="q_whatsapp" class="ai-form"><br><br>

  <button class="ai-btn" onclick="submitQuote()">Submit Request</button>
  `;

  body.appendChild(wrap);
  body.scrollTop=body.scrollHeight;
}


async function submitQuote(){

  const payload = {
    company: q_company.value,
    product: q_product.value,
    quantity: q_quantity.value,
    destination: q_destination.value,
    phone: q_phone.value,
    whatsapp: q_whatsapp.value
  };

  try {
    await fetch(API_QUOTE,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });

    addBot(
      "✅ Request received. Our export team will contact you shortly.",
      ["🏠 Main Menu"]
    );

  } catch {
    addBot("❌ Failed to submit request. Please try again.");
  }
}


/* ===============================
   EXPORT FORM UI (ADDED)
================================ */

function showExportForm(){

  if(document.getElementById("e_product")) return;

  const body=document.getElementById("ai-body");

  const wrap=document.createElement("div");
  wrap.className="ai-msg ai-bot";

  wrap.innerHTML=`
  <b>🌍 Export Enquiry — Shastika Global Impex</b><br><br>

  Product Name<br>
  <input id="e_product" class="ai-form"><br>

  Quantity<br>
  <input id="e_quantity" class="ai-form"><br>

  Destination Country<br>
  <input id="e_country" class="ai-form"><br>

  Destination Port<br>
  <input id="e_port" class="ai-form"><br>

  Company Name<br>
  <input id="e_company" class="ai-form"><br>

  Phone<br>
  <input id="e_phone" class="ai-form"><br><br>

  <button class="ai-btn" onclick="submitExport()">Submit Enquiry</button>
  `;

  body.appendChild(wrap);
  body.scrollTop=body.scrollHeight;
}


async function submitExport(){

  const payload = {
    product: e_product.value,
    quantity: e_quantity.value,
    country: e_country.value,
    port: e_port.value,
    company: e_company.value,
    phone: e_phone.value
  };

  console.log("EXPORT ENQUIRY:", payload);

  addBot(
    "✅ Export enquiry received. Our export team will contact you shortly.",
    ["🏠 Main Menu"]
  );
}

/* ===============================
   DOMESTIC SUPPLY FORM
================================ */

function showDomesticForm(){

  if(document.getElementById("d_product")) return;

  const body=document.getElementById("ai-body");

  const wrap=document.createElement("div");
  wrap.className="ai-msg ai-bot";

  wrap.innerHTML=`
  <b>🇮🇳 Domestic Supply Enquiry</b><br><br>

  Product Name<br>
  <input id="d_product" class="ai-form"><br>

  Quantity Required<br>
  <input id="d_quantity" class="ai-form"><br>

  Delivery Location (City / State)<br>
  <input id="d_location" class="ai-form"><br><br>

  <button class="ai-btn" onclick="submitDomestic()">Submit Enquiry</button>
  `;

  body.appendChild(wrap);
  body.scrollTop=body.scrollHeight;
}


function submitDomestic(){

  const payload = {
    product: d_product.value,
    quantity: d_quantity.value,
    location: d_location.value
  };

  console.log("DOMESTIC ENQUIRY:", payload);

  addBot(
    "✅ Domestic enquiry received. We will confirm availability & pricing shortly.",
    ["🏠 Main Menu"]
  );
}
/* ===============================
   BULK ORDER FORM
================================ */

function showBulkForm(){

  if(document.getElementById("b_company")) return;

  const body=document.getElementById("ai-body");

  const wrap=document.createElement("div");
  wrap.className="ai-msg ai-bot";

  wrap.innerHTML=`
  <b>🤝 Bulk / Long-Term Orders</b><br><br>

  Company Name<br>
  <input id="b_company" class="ai-form"><br>

  Product Requirements<br>
  <input id="b_products" class="ai-form"><br>

  Email ID<br>
  <input id="b_email" class="ai-form"><br>

  Phone Number<br>
  <input id="b_phone" class="ai-form"><br><br>

  <button class="ai-btn" onclick="submitBulk()">Submit Details</button>
  `;

  body.appendChild(wrap);
  body.scrollTop=body.scrollHeight;
}


function submitBulk(){

  const payload = {
    company: b_company.value,
    products: b_products.value,
    email: b_email.value,
    phone: b_phone.value
  };

  console.log("BULK ENQUIRY:", payload);

  addBot(
    "✅ Bulk enquiry received. Our sales team will contact you shortly.",
    ["🏠 Main Menu"]
  );
}
/* ===============================
   CONTACT FORM
================================ */

function showContactForm(){

  if(document.getElementById("c_name")) return;

  const body=document.getElementById("ai-body");

  const wrap=document.createElement("div");
  wrap.className="ai-msg ai-bot";

  wrap.innerHTML=`
  <b>📞 Contact Our Team</b><br><br>

  Name<br>
  <input id="c_name" class="ai-form"><br>

  Company Name<br>
  <input id="c_company" class="ai-form"><br>

  Phone No<br>
  <input id="c_phone" class="ai-form"><br>

  WhatsApp No<br>
  <input id="c_whatsapp" class="ai-form"><br>

  Email Address<br>
  <input id="c_email" class="ai-form"><br><br>

  <button class="ai-btn" onclick="submitContact()">Submit Details</button>
  `;

body.appendChild(wrap);
body.scrollTop=body.scrollHeight;

}
/* ===============================
   CONTACT FORM SUBMIT
================================ */

async function submitContact(){
console.log("🚀 submitContact triggered");

  const payload = {
    name: document.getElementById("c_name").value || "",
    company: document.getElementById("c_company").value || "",
    email: document.getElementById("c_email").value || "",
    phone: document.getElementById("c_phone").value || "",
    message: "contact enquiry from chatbot"
  };

  typing();

  try {

    const res = await fetch(API_ROOT + "/contact-submit?lang=" + USER_LANG,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });

    if(!res.ok){
      const t = await res.text();
      console.error("CONTACT ERROR:", t);
      throw new Error("submit failed");
    }

    const data = await res.json();

    stopTyping();

    // ✅ show backend thank-you message
  addBot(data.response || data.reply, data.options || []);

  } catch (err) {
    stopTyping();
    console.error(err);
    addBot("❌ Failed to submit contact details. Please try again.");
  }
}
/* ===============================
   SEND MESSAGE
================================ */

async function send(msg){

    addUser(msg);
    typing();

    try{

        const res = await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message: msg,
                lang: USER_LANG,
                session_id: SESSION_ID
            })
        });

        const data = await res.json();

        stopTyping();

        // normal reply
        addBot(data.response || data.reply || "Hello! How can I help you?");

        /* ===============================
           FORM TRIGGERS
        =============================== */

        if(data.reply === "SHOW_QUOTE_FORM"){
            showQuoteForm();
            return;
        }

        if(data.reply === "SHOW_EXPORT_FORM"){
            showExportForm();
            return;
        }

        if(data.reply === "SHOW_DOMESTIC_FORM"){
            showDomesticForm();
            return;
        }

        if(data.reply === "SHOW_BULK_FORM"){
            showBulkForm();
            return;
        }

        if(data.reply === "SHOW_CONTACT_FORM"){
            showContactForm();
            return;
        }

    }catch(err){

        stopTyping();
        console.error(err);

        addBot("Server error — please try again.");

    }

}


/* ===============================
   INPUT EVENTS
================================ */

document.addEventListener("click",e=>{

    if(e.target.id==="ai-send"){

        const input=document.getElementById("ai-input");

        const msg=input.value.trim();

        if(!msg) return;

        input.value="";

        send(msg);

    }

});


document.addEventListener("keydown",e=>{

    if(e.key==="Enter"){

        const input=document.getElementById("ai-input");

        if(!input) return;

        const msg=input.value.trim();

        if(!msg) return;

        input.value="";

        send(msg);

    }

});