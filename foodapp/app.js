import { menuArray } from "./Menudata.js";

const menucontainer = document.getElementById("menusectioncontainer");
const cartcontainer = document.getElementById("cartsection");
const cartcon = document.getElementById("Odcartfood");
const carttotal = document.getElementById("carttotalprice");
const orderbtnEl = document.getElementById("orderbtn");
const carddetailsEl = document.getElementById("carddetails");
const formEls = document.getElementById("modalform");
const paybtnEl = document.getElementById("paybtn");
const messageEl = document.getElementById("messagesection");

orderbtnEl.addEventListener("click", ShowModal);
paybtnEl.addEventListener("click", Saveuserdata);

document.addEventListener("click", function (event) {
  if (event.target.dataset.menuid) {
    AddmenutoCart(event.target.dataset.menuid);
  }
  if (event.target.dataset.foodid) {
    RemoveItem(event.target.dataset.foodid, event);
  }
  if (event.target.dataset.increment) {
    IncrementfoodCount(event.target.dataset.increment);
  }
});

let OrderedFoodArray = [];

function AddmenutoCart(mid) {
  let menuinCart = OrderedFoodArray.find(
    (existmenu) => existmenu.id === parseInt(mid)
  );
  let foodcount = 1;
  if (menuinCart) {
    for (let i = 0; i < OrderedFoodArray.length; i++) {
      if (OrderedFoodArray[i].id === parseInt(mid)) {
        OrderedFoodArray[i].quantity += foodcount;
        let cc = OrderedFoodArray[i].price * OrderedFoodArray[i].quantity;
        OrderedFoodArray[i].Incprice = cc;
        break;
      }
    }
    foodcount++;
    console.log(OrderedFoodArray);
    RenderCartItem();
  } else {
    cartcontainer.style.display = "block";
    messageEl.style.display = "none";
    let filtereddata = menuArray.filter((sinlemenu) => {
      return parseInt(mid) === sinlemenu.id;
    })[0];

    OrderedFoodArray.push(filtereddata);
    RenderCartItem();
  }
}

// Calculate Total
function calculatetotal() {
  let total = 0;
  for (const odfoodprice of OrderedFoodArray) {
    total += odfoodprice.Incprice;
  }
  carttotal.textContent = total;
}

//RenderCart

function RenderCartItem() {
  cartcon.innerHTML = "";

  for (const orderedfood of OrderedFoodArray) {
    cartcon.innerHTML += `<div data-foodid='${orderedfood.id}'>
              <div class='cartcontainer'>
              <div class='cartfood'>
              ${orderedfood.name}     
             <button class='removebtn' data-foodid='${orderedfood.id}'>X</button>     
              </div>
              <div>${orderedfood.quantity}</div>                  
                 
                <div>${orderedfood.Incprice} </div>
              </div>
              </div>`;
  }
  calculatetotal();
}

// Remove Items fro Cart

function RemoveItem(fid, event) {
  let arrindex = OrderedFoodArray.findIndex((obj) => obj.id === parseInt(fid));
  if (OrderedFoodArray[arrindex].quantity === 1) {
    if (arrindex > -1) {
      OrderedFoodArray.splice(arrindex, 1);
    }
    let parentel = event.target.parentNode.parentNode.parentNode;
    parentel.remove();
    RenderCartItem();
  } else {
    OrderedFoodArray[arrindex].quantity--;
    console.log(OrderedFoodArray);
    let cc =
      OrderedFoodArray[arrindex].price * OrderedFoodArray[arrindex].quantity;
    OrderedFoodArray[arrindex].Incprice = cc;
    RenderCartItem();
  }
}

// Get Menuitems from Array

function GetmenufromArray() {
  for (const menu of menuArray) {
    menucontainer.innerHTML += `<div class='menucontainer'>
    <div class='imgcontainer'>${menu.emoji}</div>
    <div class='menudetails'>
      <h3>${menu.name}</h3>
      <p>${menu.ingredients}</p>
      <span>${menu.price}</span>
    </div>    
    <div class='btncontainer'>
    <button data-menuid='${menu.id}'>+</button>
    </div>
  </div> <hr>`;
  }
}

function ShowModal() {
  carddetailsEl.style.display = "flex";
}

function Saveuserdata(event) {
  event.preventDefault();
  const formdatas = new FormData(formEls);
  const name = formdatas.get("name");
  const card = formdatas.get("carddetails");
  const cvv = formdatas.get("cvv");
  const Userdata = { Name: name, Carddetails: card, CVV: cvv };
  console.log(Userdata);
  OrderedFoodArray = [];
  carddetailsEl.style.display = "none";
  messageEl.style.display = "block";
  cartcontainer.style.display = "none";
  let messagecontainer = document.createElement("div");
  messagecontainer.className = "messagecon";
  messageEl.appendChild(messagecontainer);
  let messagepara = document.createElement("p");
  messagepara.className = "";
  messagepara.textContent = `Thanks, ${Userdata.Name} Your order is on its way!`;
  messagecontainer.append(messagepara);
}

GetmenufromArray();
