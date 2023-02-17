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
    loadFig();
  
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

            window.location="loading.html";
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

                    window.location="loading.html";
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
                if (username != null) {
                    username = username.replace('["', '')
                    username = username.replace('"]', '')
                }
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
        formPdt(text);
        let recentStorage = localStorage.getItem("recent")
            ? JSON.parse(localStorage.getItem("recent"))
            :[];
        recentStorage.push(text);
        localStorage.setItem("recent", JSON.stringify(recentStorage));
    
        console.log(localStorage.getItem("recent"));
    })

    function formPdt(text, limit=50) {
    
        $.getJSON("products.json", function (response) {
            response = response.products;

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
                    <button type="button" class="value" id="${response[i]._id}-up">+</button>
                    <input type="text" class="pdt-quantity" id="${response[i]._id}" value="1">
                    <button type="button" class="value" id="${response[i]._id}-down">-</button></span>
                    <p class="pdt-price">$${response[i].price}</p></div>
                    <div class="form-end"><input id="${response[i].img}" type="button" class="pdt-submit" value="ADD TO CART">
                    <a href="javascript:void(0);" id="${response[i].pdt}" class="add-wish"><i class="fa-solid fa-star"></i></a></div></form></div>`
    
                    content = front + sizes + sizeEnd + colours + end
                    $(".pdt-container").html(content);
                    document.getElementById("pop-up").style.width = "100%";
    
                }
            }
        })
    }

    //Function to add product to wishlist using local storage
    $(".pdt-container").on("click", ".add-wish", function(e) {
        e.preventDefault();
        var text = e.currentTarget.id;
        let wishStorage = localStorage.getItem("wish")
            ? JSON.parse(localStorage.getItem("wish"))
            :[];
        wishStorage.push(text);
        localStorage.setItem("wish", JSON.stringify(wishStorage));
      
    })

    //Function to close overlay
    $("#pdt-close").on("click", function(e) {
        e.preventDefault();
        document.getElementById("pop-up").style.width = "0%";

    })

    //Function to change order quantity
    $(".pdt-container").on("click", ".value", function(e) {
        e.preventDefault();
        quantity = this.id;
        Id = quantity.replace("-up","")
        Id = Id.replace("-down","")
        qty = document.getElementById(Id).value;
        quantity = quantity.replace(Id,"")

        if (quantity == '-up') {
            ++document.getElementById(Id).value;
            qty = qty + 1
        } else if (quantity == '-down' && qty > 1){
            --document.getElementById(Id).value;
            qty = qty - 1
        } else {
        }
    })

    //Function to upload product details to cart api
    $(".pdt-container").on("click", ".pdt-submit" ,function (e) {
        e.preventDefault();
        let pdtName = $("#pdt-name").text();
        let pdtImg = this.id;
        let pdtQty = $(".pdt-quantity").val();
        let pdtPrice =$(".pdt-price").text();
        pdtPrice = pdtPrice.replace("$","");
        pdtQty = Number(pdtQty)  
        pdtPrice = Number(pdtPrice)

        var jsondata = {
            "pdt": pdtName,
            "img": pdtImg,
            "qty": pdtQty,
            "price": pdtPrice,
            "size": "",
            "colour": ""
        };

        var settings = {
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
            document.getElementById("pop-up").style.width = "0%";
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
        
                front = `<div class="item-cart">
                        <div class="cart-img"><img src="${response[i].img}"></div>
                        <div class="cart-info"><h4>${response[i].pdt}</h4>`
        
                if ((`${response[i].size}` != "") && (`${response[i].colour}` != "")) {
                details = `<p class="cart-details">${response[i].size},${response[i].colour}</p>`
                } else if (`${response[i].size}` != "") {
                details = `<p class="cart-details">${response[i].size}</p>`
                } else if (`${response[i].colour}` != "") {
                details = `<p class="cart-details">${response[i].colour}</p>`
                } else {
                details = `<p class="cart-details"></p>`
                }
        
                end = `<div class="order-option"> Quantity:
                        <span id="quantity-field"><button id="${response[i]._id}-up" class="value">+</button>
                        <input type="text" class="cart-quantity" id="${response[i]._id}" value="${response[i].qty}"><button id="${response[i]._id}-down" class="value" >-</button>
                        </span></div><p class="cart-price">$${response[i].total}</p></div><div class="cart-end"><button type="button" class="cart-remove" id="${response[i]._id}-remove">Remove</button></div></div>`
        
                cartItem = front + details + end
                content += cartItem
            }
            $(".list").html(content);
        })
    }

    //Function to remove cart items
    $(".cart-remove").on("click", function(e) {
        e.preventDefault();
        cartID = this.id
        cartID = cartID("-remove","");

        cartDelete(cartID);
    })

    function cartDelete(cartID) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://catnapaccounts-4ec8.restdb.io/rest/cart/${cartID}`,
            "method": "DELETE",
            "headers": {
              "content-type": "application/json",
              "x-apikey": "<your CORS apikey here>",
              "cache-control": "no-cache"
            }
          }
          
          $.ajax(settings).done(function (response) {
            cartList();
          });
    }

    //Function to edit cart item quantity
    $(".item-cart").on("click", ".value", function(e) {
        e.preventDefault();
        quantity = this.id;
        Id = quantity.replace("-up", "")
        Id = Id.replace("-down", "")
        qty = document.getElementById(Id);
        qty = qty.value
        qty = Number(qty)
        quantity = quantity.replace(Id, "")
    
        if (quantity == '-up') {
          ++document.getElementById(Id).value;
          qty = qty + 1
          updatePrice(Id, qty);
        }
        else if (quantity == '-down' && qty > 1) {
          --document.getElementById(Id).value;
          qty = qty - 1
          updatePrice(Id, qty);
        } else {
        }
      })

    //Function to update total price after changing quantity
    function updatePrice(Id,qty) {
        console.log(Id)
        console.log(qty)
        var jsondata = { "qty": qty };
        var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://catnapaccounts-4ec8.restdb.io/rest/cart/${Id}`,
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
        }

        $.ajax(settings).done(function (response) {
        console.log(response);
        
        cartList();
        }); 
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
            retail = 0

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

                retail += response[i].total

                end = `<p class"checkout-price">$${response[i].total}</p></div></div>`

                checkoutItem = front + details + end
                content += checkoutItem
            }
            subtotal = retail +10
            retail = "$" + retail
            subtotal = "$" + subtotal
            
            $(".order-list").html(content);
            $("#retail").html(retail);
            $("#subtotal").html(subtotal);
            $("#total").html(subtotal);
        })
    }

    //Function to load out recently viewed
    function recentList(limit = 50) {
        recents = localStorage.getItem("recent")
        if (recents != null) {
            recents = recents.replace(/[^\w ,]/g, '')
            recent = recents.split(",")
            recent = recent.reverse()

            $.getJSON("products.json", function (response) {
                response = response.products;
                content = ""

                for (var a = 0; a < 4; a++) {
                    
                    front = `<div class="box-2">`

                    for (var i = 0; i < response.length && i < limit; i++){
                        if (recent[a] === `${response[i].pdt}`) {
                            item = `<img class="box-img" src="${response[i].img}">
                            <p class="box-price"$>$${response[i].price}</p>`
                            break;
                        } else {item = ""}

                    }
                    end = `</div>`

                    box = front + item + end
                    content += box
                }
                
                $("#recentbox").html(content);
            })
        }
        
    }

    //Function to load out wishlist
    function wishList(limit = 50) {
        wish = localStorage.getItem("wish")
        if (wish != null) {
            wish = wish.replace(/[^\w ,]/g, '')
            wishlist = wish.split(",")
            wishlist = wishlist.reverse()
            console.log(wishlist);

            $.getJSON("products.json", function (response) {
                response = response.products;
                content = ""
            
                for (var a = 0; a < 4; a++) {
                    
                    front = `<div class="box-2">`

                    for (var i = 0; i < response.length && i < limit; i++){
                        if (wishlist[a] === `${response[i].pdt}`) {
                            item = `<img class="box-img" src="${response[i].img}">
                            <p class="box-price"$>$${response[i].price}</p>`
                            break;
                        } else {item = ""}

                    }
                    end = `</div>`

                    box = front + item + end
                    content += box
                }
                
                $("#wishbox").html(content);
            })
        }
        
    }

    //Function to load out figure details
    function loadFig() {
        load = localStorage.getItem("fig")
        if (load != null) {
            load = load.replace('["',"")
            load = load.replace('"]',"")
        }
        if (load == "fig1") {
            content = "",
            content = `<div class="model-fig"><div class="slideshow-container">
                <div class="mySlides fade"><div class="numbertext">1 / 4</div><img src="img/fig1-front.png" style="width:100%"></div>
                <div class="mySlides fade"><div class="numbertext">2 / 4</div><img src="img/fig1-right.png" style="width:100%"></div>
                <div class="mySlides fade"><div class="numbertext">3 / 4</div><img src="img/fig1-left.png" style="width:100%"></div>
                <div class="mySlides fade"><div class="numbertext">4 / 4</div><div class="sketchfab-embed-wrapper"> 
                <iframe style="width: 450px; height: 450px;" title="Cat figurine" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/759b8497018e41bfa44a87a3f8d27fde/embed?ui_theme=dark"></iframe> 
                <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
                <a href="https://sketchfab.com/3d-models/cat-figurine-759b8497018e41bfa44a87a3f8d27fde?utm_medium=embed&utm_campaign=share-popup&utm_content=759b8497018e41bfa44a87a3f8d27fde" target="_blank" style="font-weight: bold; color: #1CAAD9;"> Cat figurine </a> by <a href="https://sketchfab.com/junyang_zhu?utm_medium=embed&utm_campaign=share-popup&utm_content=759b8497018e41bfa44a87a3f8d27fde" target="_blank" style="font-weight: bold; color: #1CAAD9;"> junyang_zhu </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=759b8497018e41bfa44a87a3f8d27fde" target="_blank" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div></div>
                <a class="prev" onclick="plusSlides(-1)">❮</a><a class="next" onclick="plusSlides(1)">❯</a></div><br>
                <div style="text-align:center"><span class="dot" onclick="currentSlide(1)"></span> <span class="dot" onclick="currentSlide(2)"></span> <span class="dot" onclick="currentSlide(3)"></span> <span class="dot" onclick="currentSlide(4)"></span> </div></div>
                <div class="fig-details"><h4>Cat in a pot</h4><p class="fig-detail"></p>
                <p href="javascript:void(0)" id="insufficient" class="fig-price">750 points</p></div>`
            $(".fig-container").html(content);
            
        } else if (load == "fig2") {
            content = "",
            content = `<div class="model-fig"><div class="slideshow-container">
                <div class="mySlides fade"><div class="numbertext">1 / 4</div><img src="img/fig2-front.png" style="width:100%"></div>
                <div class="mySlides fade"><div class="numbertext">2 / 4</div><img src="img/fig2-right.png" style="width:100%"></div>
                <div class="mySlides fade"><div class="numbertext">3 / 4</div><img src="img/fig2-left.png" style="width:100%"></div>
                <div class="mySlides fade"><div class="numbertext">4 / 4</div><div class="sketchfab-embed-wrapper"> 
                <iframe style="width: 450px; height: 450px;" title="3DF IP Cat" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/fa8991a6bd174ba2ac163d62facb2cd1/embed"> </iframe> 
                <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;"> 
                <a href="https://sketchfab.com/3d-models/3df-ip-cat-fa8991a6bd174ba2ac163d62facb2cd1?utm_medium=embed&utm_campaign=share-popup&utm_content=fa8991a6bd174ba2ac163d62facb2cd1" target="_blank" style="font-weight: bold; color: #1CAAD9;"> 3DF IP Cat </a> by <a href="https://sketchfab.com/iizabelle?utm_medium=embed&utm_campaign=share-popup&utm_content=fa8991a6bd174ba2ac163d62facb2cd1" target="_blank" style="font-weight: bold; color: #1CAAD9;"> iizabelle </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=fa8991a6bd174ba2ac163d62facb2cd1" target="_blank" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div></div>
                <a class="prev" onclick="plusSlides(-1)">❮</a><a class="next" onclick="plusSlides(1)">❯</a></div><br>
                <div style="text-align:center"><span class="dot" onclick="currentSlide(1)"></span> <span class="dot" onclick="currentSlide(2)"></span> <span class="dot" onclick="currentSlide(3)"></span> <span class="dot" onclick="currentSlide(4)"></span> </div></div>
                <div class="fig-details"><h4>Cat in a pot</h4><p class="fig-detail"></p>
                <p href="javascript:void(0)" id="insufficient" class="fig-price">750 points</p></div>`
            $(".fig-container").html(content);
        }
    }
    //Functions to switch forms in checkout
    $("#next-button").on("click",function (e) {
        e.preventDefault();
        localStorage.clear("price")
        total = document.getElementById("total").innerHTML
        retail = document.getElementById("retail").innerHTML
        subtotal = document.getElementById("subtotal").innerHTML
        shipping = document.getElementById("shipping").innerHTML
        shipGuarantee = document.getElementById("ship-guarantee").innerHTML
        content = total + "," + retail + "," + subtotal + ", " + shipping + "," + shipGuarantee
        let priceStorage = localStorage.getItem("price")
            ? JSON.parse(localStorage.getItem("price"))
                :[];
            priceStorage.push(content);
            localStorage.setItem("price", JSON.stringify(priceStorage));

        $("#checkout").hide();
        $("#payment").show();
        prices = localStorage.getItem("price")
        prices = prices.replace('["',"")
        prices = prices.replace('"]',"")
        prices = prices.split(",")
        $("#final-total").html(prices[0])
    })

    $("#back-checkout").on("click",function (e) {
        $("#payment").hide();
        $("#checkout").show();
        prices = localStorage.getItem("price")
        prices = prices.replace('["',"")
        prices = prices.replace('"]',"")
        prices = prices.split(",")
        $("#total").html(prices[0])
        $("#retail").html(prices[1])
        $("#subtotal").html(prices[2])
        $("#shipping").html(prices[3])
        $("#ship-guarantee").html(prices[4])
    })

    $("#checkout-submit").on("click",function (e) {
        e.preventDefault();
        $("#payment").hide();
        $("#error").show();
    })

    //Function to pop out form to enter card information
    $("#card").on("click",function (e) {
        $("#card-payment").show();
    })

    //Functions to remove card info form
    $("#grab").on("click",function (e) {
        $("#card-payment").hide();
    })

    $("#apple").on("click",function (e) {
        $("#card-payment").hide();
    })

    //Function to exit page and logout
    $("#logout").on("click",function (e) {
        e.preventDefault();
        window.location="index.html";
    })

    //Function to bring out overlay
    $(".item").on("click", "#insufficient", function(e) {
        e.preventDefault();
        document.getElementById("pop-up").style.width = "100%";
    })

    //Function to open figure details
    $(".item").on("click", function (e) {
        localStorage.clear("fig")
        call = this.id
        if (call == "fig1" || call == "fig2") {
            let figStorage = localStorage.getItem("fig")
            ? JSON.parse(localStorage.getItem("fig"))
                :[];
            figStorage.push(this.id);
            localStorage.setItem("fig", JSON.stringify(figStorage));

            window.location = "figure.html";
        }

    })

    $("#voucher").on("click", function(e) {
        e.preventDefault();
        if (this.value == "") {
            this.value = "CATNAP3429A"
            total = document.getElementById("total").innerHTML
            total = total.replace("$","")
            discount = total - total/20
            content = "(Discounted) $" + discount
            index = content.indexOf(".")
            index = index + 3
            content = content.slice(0,index)

            $("#total").html(content)
        } else if (this.value == "CATNAP3429A") {
            this.value = ""
            total = document.getElementById("total").innerHTML
            total = total.replace("(Discounted) $","")
            discount = total/19*20
            content = "$" + discount
            index = content.indexOf(".")
            index = index + 3
            content = content.slice(0,index)

            $("#total").html(content)
        }
    })

    //Function for shipping method
    $("#standard").on("click", function (e) {
        value = "$1"
        if (document.getElementById("shipping").innerHTML != 0) {
            remove = document.getElementById("shipping").innerHTML
            remove = remove.replace("$","")
        } else if (document.getElementById("ship-guarantee").innerHTML != 0) {
            remove = document.getElementById("ship-guarantee").innerHTML
            remove = remove.replace("$","")
        } else {remove = 0}
        cancel = "0"
        total = document.getElementById("total").innerHTML
        total = total.replace("$","")
        total = Number(total) + 1.00 - Number(remove)
        total = "$" + total
        index = total.indexOf(".")
        index = index + 3
        total = total.slice(0,index)
        $("#shipping").html(value);
        $("#ship-guarantee").html(cancel);
        $("#total").html(total);
    })

    $("#express").on("click", function (e) {
        value = "$5"
        if (document.getElementById("shipping").innerHTML != 0) {
            remove = document.getElementById("shipping").innerHTML
            remove = remove.replace("$","")
        } else if (document.getElementById("ship-guarantee").innerHTML != 0) {
            remove = document.getElementById("ship-guarantee").innerHTML
            remove = remove.replace("$","")
        } else {remove = 0}
        cancel = "0"
        total = document.getElementById("total").innerHTML
        total = total.replace("$","")
        total = Number(total) + 5.00 - Number(remove)
        total = "$" + total
        index = total.indexOf(".")
        index = index + 3
        total = total.slice(0,index)
        $("#shipping").html(value);
        $("#ship-guarantee").html(cancel);
        $("#total").html(total);
    })

    $("#guarantee").on("click", function (e) {
        value = "$2.50"
        if (document.getElementById("shipping").innerHTML != 0) {
            remove = document.getElementById("shipping").innerHTML
            remove = remove.replace("$","")
        } else if (document.getElementById("ship-guarantee").innerHTML != 0) {
            remove = document.getElementById("ship-guarantee").innerHTML
            remove = remove.replace("$","")
        } else {remove = 0}
        cancel = "0"
        total = document.getElementById("total").innerHTML
        total = total.replace("$","")
        total = Number(total) + 2.50 - Number(remove)
        total = "$" + total
        index = total.indexOf(".")
        index = index + 3
        total = total.slice(0,index)
        $("#shipping").html(cancel);
        $("#ship-guarantee").html(value);
        $("#total").html(total);
    })
});



//Functions for slideshow
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}


