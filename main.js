/// <reference path="jquery-3.6.3.js"/>
$(() => {
    $(window).on("scroll", function () {
        var parallax = $(".parallax");
        var scrollPosition = $(this).scrollTop();
        parallax.css("transform", "translateY(" + scrollPosition * 0.5 + "px)");
    });

    let coins = [];
    var selectedCoins = [];
     let spinner = `<div class="spinner-border" id="spinner" style="width: 3rem; height: 3rem;" role="status">
    <span class="visually-hidden">Loading...</span>
     </div>`
    let toggleButton =  `<div id="toggle" class="form-check form-switch">
     <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
     <label class="form-check-label" for="flexSwitchCheckDefault"></label>
     </div>`;

    $("section").hide()
    $("#homeSection").show()
   

    $("a").on("click", function() {
        const dataSection = $(this).attr("data-section")
        $("section").hide()
        $("#" + dataSection).show()
    })

$("#homeSection").on("click", ".card > button", async function() {
    const contentDiv = $(this).next();
    if (contentDiv.html().length > 0) {
      contentDiv.html("");
      return;
    }
    const coinId = $(this).attr("id");
    $(this).next().html(spinner);
  
    let coin;
    const cachedCoin = localStorage.getItem(coinId);
    if (cachedCoin) {
      coin = JSON.parse(cachedCoin);
      const cachedTime = new Date(coin.cachedTime);
      const currentTime = new Date();
      const timeDiff = currentTime - cachedTime;
      if (timeDiff <= 2 * 60 * 1000) {
        const content = `<br>
        <p style="font-size: 15px; font-weight: 800"> Values: <p>
        USD $${coin.market_data.current_price.usd}  <br>
        EUR €${coin.market_data.current_price.eur}  <br>
        ILS ₪${coin.market_data.current_price.ils} 
        `;
        $(this).next().html(content);
      } else {
        coin = await getMoreInfo(coinId);
        coin.cachedTime = new Date();
        localStorage.setItem(coinId, JSON.stringify(coin));
        const content = `<br>
        <p style="font-size: 15px; font-weight: 800"> Values: <p>
        USD $${coin.market_data.current_price.usd}  <br>
        EUR €${coin.market_data.current_price.eur}  <br>
        ILS ₪${coin.market_data.current_price.ils} 
        `;
        $(this).next().html(content);
      }
    } else {
      coin = await getMoreInfo(coinId);
      coin.cachedTime = new Date();
      localStorage.setItem(coinId, JSON.stringify(coin));
      const content = `<br>
      <p style="font-size: 15px; font-weight: 800"> Values: <p>
      USD $${coin.market_data.current_price.usd}  <br>
      EUR €${coin.market_data.current_price.eur}  <br>
      ILS ₪${coin.market_data.current_price.ils} 
      `;
      $(this).next().html(content);
      
    }
  });

 
     $("input[type=search ]").on("keyup",function() {
        const textToSearch = $(this).val().toLowerCase()
        if(textToSearch === "")
            displayCoins(coins)
        else {
            const filteredCoins = coins?.filter(coin => coin.symbol.indexOf(textToSearch) >= 0)
            displayCoins(filteredCoins)
        }

     })

    handleCoins()

    async function handleCoins() {
        try {
            $("#homeSection").html(spinner)
            coins = await getJSON("https://api.coingecko.com/api/v3/coins/")
            console.log(coins)
            displayCoins(coins)
           
        }
        catch(err) {
            alert(err.message)
        }
    }

    function displayCoins(coins) {
        let content = ""
        for(const coin of coins) {
            const card = createCard(coin)
            content += card
        }
        $("#homeSection").html(content)
    }

        
        function createCard(coin) {
            const card = `
            <div class="wrapper">
            <div class="card-container" style="display: flex; flex-wrap: wrap; justify-content: space-between; width: 1000px;">
           
            <div class="card" style="width: 18rem; margin: 10px; "text-align: center;"">
            <img src="${coin.image.small}" class="card-img-top" alt="..."/><br>
            <h5 class="card-title"  style="display: flex; justify-content: center; color: rgba(246, 195, 26, 0.9);
        }  ">${coin.id} </h5>
            <p class="card-text">${coin.symbol}</p>
            <span style="text-align: center; display: flex; justify-content: center;">${toggleButton}</span>
           <br>
            <button class="btn btn-outline-dark" id=${coin.id}>More Info </button>
                <div> </div>
            </div>
            </div>
            </div>
            `;
            return card
        }
    

    //

   /* $("#toggle").on('click', function() {
        var coinId = $(this).data('coin.id');
        if ($(this).prop('checked')) {
            selectedCoins.push(coinId);
        } else {
    






        }*/

    //
    

    async function getMoreInfo(coinId) {
        const coin = await getJSON("https://api.coingecko.com/api/v3/coins/"+coinId)
        return coin
    }

    function getJSON(url) {
        return new Promise((resolve,reject)=>{
            $.ajax()

            $.ajax({
                url,
                success: data => {
                    resolve(data);
                },
                error: err => {
                    reject(err)
                }
            })
        })
    }

});
   











