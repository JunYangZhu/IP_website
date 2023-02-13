$(document).ready(function () {
    const APIKEY = "63df71883bc6b255ed0c4695";
    $("#login-container").hide();
    $("#update-account-container").hide();
    $("#add-update-pw").hide();
    $("#account-data").hide();
    $("#payment").hide();
    $("#complete").hide();
    $("#dropdown").hide();
    $("#card-payment").hide();
    createProfile();
  
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
                console.log(username);
        
                $(".details").html(content);
                console.log(content);
            }
        });
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

$("#hover").on("hover",function (e) {
    e.preventDefault();
    $("#dropdown").show();
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
    var quantity = document.getElementById('quantity');

    if (quantity.value > 1) {
        if (upordown == 'up'){++document.getElementById('quantity').value;}
        else if (upordown == 'down'){--document.getElementById('quantity').value;}}
    else if (quantity.value == 1) {
        if (upordown == 'up'){++document.getElementById('quantity').value;}}
    else
        {document.getElementById('quantity').value=1;}
}

function openNav() {
    document.getElementById("pop-up").style.width = "100%";
}

function closeNav() {
    document.getElementById("pop-up").style.width = "0%";
}