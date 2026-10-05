const products=[
{id:1,name:"Wireless Headphones",price:1499,icon:"🎧"},
{id:2,name:"Smart Watch",price:2499,icon:"⌚"},
{id:3,name:"Running Shoes",price:2999,icon:"👟"},
{id:4,name:"Smartphone",price:18999,icon:"📱"},
{id:5,name:"Backpack",price:1299,icon:"🎒"},
{id:6,name:"Camera",price:24999,icon:"📷"},
{id:7,name:"Sunglasses",price:999,icon:"🕶️"},
{id:8,name:"Bluetooth Speaker",price:1999,icon:"🔊"}
];

let cart=JSON.parse(localStorage.getItem("cart")||"[]");
let orders=JSON.parse(localStorage.getItem("orders")||"[]");
let messages=JSON.parse(localStorage.getItem("messages")||"[]");
let customers=JSON.parse(localStorage.getItem("customers")||"[]");

function money(n){return "₹"+n.toLocaleString("en-IN")}
function save(){localStorage.setItem("cart",JSON.stringify(cart));localStorage.setItem("orders",JSON.stringify(orders));localStorage.setItem("messages",JSON.stringify(messages));localStorage.setItem("customers",JSON.stringify(customers))}
function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");if(id==="cart")renderCart();if(id==="checkout")renderCheckout();if(id==="crm")renderCRM();window.scrollTo(0,0)}
function renderProducts(){let q=(document.getElementById("search")?.value||"").toLowerCase();let list=products.filter(p=>p.name.toLowerCase().includes(q));document.getElementById("products").innerHTML=list.map(p=>`<div class="card"><div class="product-img">${p.icon}</div><h3>${p.name}</h3><div class="price">${money(p.price)}</div><button class="primary" onclick="addToCart(${p.id})">Add to Cart</button></div>`).join("")}
function addToCart(id){let p=products.find(x=>x.id===id);cart.push(p);save();updateCount();alert(p.name+" added to cart!")}
function updateCount(){document.getElementById("cartCount").textContent=cart.length}
function renderCart(){let box=document.getElementById("cartItems");if(!cart.length){box.innerHTML=`<div class="summary"><h3>Your cart is empty.</h3><button class="primary" onclick="showPage('shop')">Shop Now</button></div>`;document.getElementById("cartSummary").innerHTML="";return}box.innerHTML=cart.map((p,i)=>`<div class="cart-row"><span>${p.icon} <b>${p.name}</b></span><span>${money(p.price)} <button class="secondary" onclick="removeItem(${i})">Remove</button></span></div>`).join("");let total=cart.reduce((s,p)=>s+p.price,0);document.getElementById("cartSummary").innerHTML=`<h3>Total: ${money(total)}</h3><button class="primary" onclick="showPage('checkout')">Proceed to Checkout</button>`}
function removeItem(i){cart.splice(i,1);save();updateCount();renderCart()}
function renderCheckout(){let total=cart.reduce((s,p)=>s+p.price,0);document.getElementById("checkoutSummary").innerHTML=`<h3>Order Summary</h3>${cart.map(p=>`<p>${p.name} — ${money(p.price)}</p>`).join("")}<hr><h2>${money(total)}</h2>`}
function placeOrder(){let name=document.getElementById("customerName").value.trim(),email=document.getElementById("customerEmail").value.trim(),phone=document.getElementById("customerPhone").value.trim(),address=document.getElementById("customerAddress").value.trim();if(!name||!email||!phone||!address||!cart.length){alert("Please fill all details and add a product.");return}let total=cart.reduce((s,p)=>s+p.price,0),id="ORD"+String(100+orders.length+1);let order={id,name,email,phone,address,total,status:"Processing",date:new Date().toLocaleString()};orders.unshift(order);if(!customers.some(c=>c.email===email))customers.push({name,email,phone,orders:1,total});else{let c=customers.find(c=>c.email===email);c.orders++;c.total+=total}messages.unshift(`📧 Order confirmation sent to ${email}`);messages.unshift(`🛒 ${name} placed ${id} for ${money(total)}`);cart=[];save();updateCount();document.getElementById("confirmationText").innerHTML=`Thank you, <b>${name}</b>! Your order <b>${id}</b> worth <b>${money(total)}</b> has been created and synced to the CRM.`;showPage("confirmation")}
function renderCRM(){document.getElementById("statCustomers").textContent=customers.length;document.getElementById("statOrders").textContent=orders.length;document.getElementById("statRevenue").textContent=money(orders.reduce((s,o)=>s+o.total,0));document.getElementById("statMessages").textContent=messages.length;document.getElementById("ordersTable").innerHTML=orders.length?`<table class="table"><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr>${orders.map((o,i)=>`<tr><td>${o.id}</td><td>${o.name}</td><td>${money(o.total)}</td><td><span class="badge">${o.status}</span><br><button class="secondary" style="margin-top:7px;padding:6px 9px" onclick="advanceOrder(${i})">Update</button></td></tr>`).join("")}</table>`:"<p class='muted'>No orders yet. Place an order from the shop.</p>";document.getElementById("messages").innerHTML=messages.length?messages.slice(0,8).map(m=>`<div class="message">${m}</div>`).join(""):"<p class='muted'>No communication events yet.</p>";document.getElementById("customersTable").innerHTML=customers.length?`<table class="table"><tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th></tr>${customers.map(c=>`<tr><td>${c.name}</td><td>${c.email}</td><td>${c.orders}</td><td>${money(c.total)}</td></tr>`).join("")}</table>`:"<p class='muted'>No customers yet.</p>"}
function advanceOrder(i){let o=orders[i],states=["Processing","Confirmed","Shipped","Delivered"],n=states.indexOf(o.status);if(n<states.length-1){o.status=states[n+1];messages.unshift(`🔔 ${o.id} updated to ${o.status} — notification workflow triggered`);save();renderCRM()}else alert("Order is already delivered.")}
function resetDemo(){if(confirm("Reset all demo data?")){localStorage.clear();cart=[];orders=[];messages=[];customers=[];updateCount();renderCRM()}}
renderProducts();updateCount();
