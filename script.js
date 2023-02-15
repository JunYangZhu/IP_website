$(document).ready(function () {
    const APIKEY = "63df71883bc6b255ed0c4695";
    $("#login-container").hide();
    $("#update-account-container").hide();
    $("#add-update-pw").hide();
    $("#account-data").hide();
    $("#payment").hide();
    $("#error").hide();
    $("#dropdown").hide();
    $("#card-payment").hide();
    createProfile();
    cartList();
    checkoutList();
    wishList();
    recentList();
  
    //Function to add new account to api database
    $("#account-submit").on("click", function (e) {
        e.preventDefault();
        localStorage.clear();
    
        let accountName = $("#account-name").val();
        let accountEmail = $("#account-email").val();
        let accountPassword = $("#account-pw").val();
    
        let jsondata = {
            "name": accountName,
            "email": accountEmail,
            "pw": accountPassword
        };
  
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/account",
            "method": "POST",
            "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(jsondata),
        }
  
        //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
        $.ajax(settings).done(function (response) {
            console.log(response);
        
            let accountStorage = localStorage.getItem("account-name")
                ? JSON.parse(localStorage.getItem("account-name"))
                :[];
            accountStorage.push(accountName);
            localStorage.setItem("account-name", JSON.stringify(accountStorage));

            alert("Account succesfully created");
            window.location="home.html";
        });
    });
    
    //Function to switch signup form to login form
    $("#open-login").on("click",function (e) {
        e.preventDefault();
        $("#add-container").hide();
        $("#login-container").show();
    })

    //Function to switch login form to signup form
    $("#back-btn").on("click",function (e) {
        e.preventDefault();
        $("#login-container").hide();
        $("#add-container").show();
    })

    //Function to check if users input matches an existing account
    $("#login-submit").on("click",function (e) {
        e.preventDefault();
        localStorage.clear();
        let inputName = $("#login-account-name").val();
        let inputPassword = $("#login-account-pw").val();
        
    
        validateForm(inputName,inputPassword);
    })
    
    function validateForm(inputName,inputPassword,limit=10){
    
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/account",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function (response) {
      
            for (var i = 0; i < response.length && i < limit; i++) {
                if (inputName === `${response[i].name}` && inputPassword === `${response[i].pw}`){
                    let accountStorage = localStorage.getItem("account-name")
                        ? JSON.parse(localStorage.getItem("account-name"))
                        :[];
                    accountStorage.push(inputName);
                    localStorage.setItem("account-name", JSON.stringify(accountStorage));

                    alert("You have successfully logged in.");
                    window.location="home.html";
                    break;
                } 
            }
        });
    }
    
    //Function to save login information in localStorage and display information on profile page
    function createProfile(limit = 10) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/account",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function(response) {
    
            content = ""
        
            for (var i = 0; i < response.length && i < limit; i++) {
                username = localStorage.getItem("account-name")
                username = username.replace('["', '')
                username = username.replace('"]', '')
                if (username === `${response[i].name}`) {
                content = `<h2 class='account-name'>${response[i].name}</h2>
                <h2 class='membership-rank'>BRONZE</h2>
                <p class='account-email'>${response[i].email}</p>`;
                }
        
                $(".details").html(content);
            }
        });
    }

    //Function to load up product details and save to recently view using local storage
    $(".pdt").on("click", function(e) {
        e.preventDefault();
        var text = $(e.target).text();
        let recentStorage = localStorage.getItem("recent")
            ? JSON.parse(localStorage.getItem("recent"))
            :[];
        recentStorage.push(text);
        localStorage.setItem("recent", JSON.stringify(recentStorage));
        formPdt(text);
      
    })

    function formPdt(text, limit=50) {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/products",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function (response) {
            
            for (var i = 0; i < response.length && i < limit; i++){
                if (text === `${response[i].pdt}`){
                    let content = "";
                    sizes = "";
                    colours = "";
    
                    front = `<div class="pdt-img"><img src="${response[i].img}"></div>
                    <div class="pdt-form"><form>
                    <h4 id="pdt-name">${response[i].pdt}</h4>
                    <div class="form-group" id="size-option"><div>`
                    
                    if (`${response[i].size}`!= "undefined") {
                        
                        sizes += `<input type="radio" name="size" id="${response[i].size}">${response[i].size}`

                    }
                    sizeEnd = `</div></div><div class="form-group" id="colour-option"><div>`
    
                    if (`${response[i].size}`!= "undefined") {
                        
                        colours += `<input type="radio" name="colour" id="${response[i].colour}">${response[i].colour}`

                    }
    
                    end = `</div></div><div class="form-group" id="qty-option">Quantity:<span id="quantity-field">
                    <button type="button" id="up" onclick="setQuantity('up');">+</button>
                    <input type="text" id="pdt-quantity" value="1">
                    <button type="button" id="down" onclick="setQuantity('down');">-</button></span>
                    <p class="pdt-price">$${response[i].price}</p></div>
                    <div class="form-end"><input type="button" id="pdt-submit" value="ADD TO CART">
                    <a class="add-wish"><i class="fa-solid fa-star"></i></a></div></form></div>`
    
                    content = front + sizes + sizeEnd + colours + end
                    $(".pdt-container").html(content);
                    document.getElementById("pop-up").style.width = "100%";
    
                }
            }
        })
    }

    //Function to add product to wishlist using local storage
    $(".add-wish").on("click", function(e) {
        e.preventDefault();
        var text = $(e.target).text();
        let wishStorage = localStorage.getItem("wish")
            ? JSON.parse(localStorage.getItem("wish"))
            :[];
        wishStorage.push(text);
        localStorage.setItem("wish", JSON.stringify(recentStorage));
      
    })

    //Function to close overlay
    $(".close-btn").on("click", function(e) {
        e.preventDefault();
        document.getElementById("pop-up").style.width = "0%";

    })

    //Function to upload product details to cart api
    $("#pdt-submit").on("click", function (e) { 
        e.preventDefault();
        console.log("submit")
        let pdtName = $("#pdt-name").val();
        let pdtImg = $(".pdt-img").val();
        let pdtQty = $("#pdt-quantity").val();
        let pdtPrice =$("#pdt-price").val();

        console.log(pdtName);
        console.log(pdtImg);
        console.log(pdtQty);
        console.log(pdtPrice);

    
        let jsondata = {
            "pdt": pdtName,
            "img": pdtImg,
            "qty": pdtQty,
            "price": pdtPrice,
        };

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/cart",
            "method": "POST",
            "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(jsondata),
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
        })
    });

    //Function to load cart api items to cart
    function cartList(limit = 15) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/cart",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function(response) {
    
            content = "";

            for (var i = 0; i < response.length && i < limit; i++) {
                
                front = `<div class="item-cart" id="${response[i].id}" >
                <div class="img"><img src="${response[i].img}"></div>
                <div class="info"><p>${response[i].pdt}</p>`

                if ((`${response[i].size}` != "undefined") && (`${response[i].colour}` != "undefined")) {
                    details = `<p class="cart-details>${response[i].size},${response[i].colour}</p>`
                } else if (`${response[i].size}` != "undefined") {
                    details = `<p class="cart-details>${response[i].size}</p>`
                } else if (`${response[i].colour}` != "undefined") {
                    details = `<p class="cart-details>${response[i].colour}</p>`
                } else {
                    details = `<p class="cart-details></p>`
                }

                end = `<div class="order-option">Quantity:
                <span id="quantity-field" id="${response[i].id}"><button id="${response[i].id}" class="up" onclick="setQuantity('up');">+</button>
                <input type="text" class="cart-quantity" id="${response[i].id}" value="${response[i].qty}"><button id="${response[i].id}" class="down" onclick="setQuantity('down');">-</button>
                </span><p class="cart-price">$${response[i].total}</p></div></div></div>`

                cartItem = front + details + end
                content += cartItem
            }
            $(".list").html(content);
        })
    }

    //Function to load cart api items for checkout
    function checkoutList(limit = 15) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/cart",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function(response) {
    
            content = "";

            for (var i = 0; i < response.length && i < limit; i++) {
                
                front = `<div class="checkout-item">
                <div><img class="checkout-img" src="${response[i].img}"></div>
                <div class="checkout-info"><p>${response[i].qty}x ${response[i].pdt} `

                if ((`${response[i].size}` != "") && (`${response[i].colour}` != "")) {
                    details = `- ${response[i].size} (${response[i].colour})</p>`
                } else if (`${response[i].size}` != "") {
                    details = `- ${response[i].size}</p>`
                } else if (`${response[i].colour}` != "") {
                    details = `(${response[i].colour})</p>`
                } else {
                    details = `</p>`
                }

                end = `<p class"checkout-price">$${response[i].total}</p></div></div>`

                checkoutItem = front + details + end
                console.log(checkoutItem)
                content += checkoutItem
            }
            $(".order-list").html(content);
        })
    }

    //Function to load out recently viewed
    function recentList(limit = 50) {
        recents = localStorage.getItem("recent")
        recents = recents.replace(/[^\w ,]/g, '')
        recent = recents.split(",")
        recent = recent.reverse()
        console.log(recent);
        

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/product",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function(response) {
    
            content = ""
        
            for (var i = 0; i < response.length && i < limit; i++) {
                
                for (var a = 0; a< response.length && a < 4; a++) {
                    if (recent[a] === `${response[i].pdt}`) {
                        content += `<div class="box-2">
                        <img class="box-img" src="${response[i].img}">
                        <p class="box-price"$>${response[i].price}</p></div>`
                    }
                }
            }
            
            $("#recent").html(content);
        })
    }

    //Function to load out wishlist
    function wishList(limit = 50) {
        wish = localStorage.getItem("wish")
        wish = wish.replace(/[^\w ,]/g, '')
        wishlist = wish.split(",")
        wishlist = wishlist.reverse()
        console.log(wishlist);
        

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://catnapaccounts-4ec8.restdb.io/rest/product",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
    
        $.ajax(settings).done(function(response) {
    
            content = ""
        
            for (var i = 0; i < response.length && i < limit; i++) {
                
                for (var a = 0; a< response.length && a < 4; a++) {
                    if (wishlist[a] === `${response[i].pdt}`) {
                        content += `<div class="box-2">
                        <img class="box-img" src="${response[i].img}">
                        <p class="box-price"$>${response[i].price}</p></div>`
                    }
                }
            }
            
            $("#wish").html(content);
        })
    }
});

//Functions to switch forms in checkout
$("#next-button").on("click",function (e) {
    e.preventDefault();
    $("#checkout").hide();
    $("#payment").show();
})

$("#checkout-submit").on("click",function (e) {
    e.preventDefault();
    $("#payment").hide();
    $("#error").show();
})

//Function to pop out form to enter card information
$("#card").on("click",function (e) {
    e.preventDefault();
    $("#card-payment").show();
})

//Functions to remove card info form
$("#grab").on("click",function (e) {
    e.preventDefault();
    $("#card-payment").hide();
})

$("#apple").on("click",function (e) {
    e.preventDefault();
    $("#card-payment").hide();
})

//Function to exit page and logout
$("#logout").on("click",function (e) {
    e.preventDefault();
    window.location="index.html";
})

//Function for quantity button
function setQuantity(upordown) {
    var quantity = document.getElementById('pdt-quantity');

    if (quantity.value > 1) {
        if (upordown == 'up'){++document.getElementById('pdt-quantity').value;}
        else if (upordown == 'down'){--document.getElementById('pdt-quantity').value;}}
    else if (quantity.value == 1) {
        if (upordown == 'up'){++document.getElementById('pdt-quantity').value;}}
    else
        {document.getElementById('pdt-quantity').value=1;}
}
