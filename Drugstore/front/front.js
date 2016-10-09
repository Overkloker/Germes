var basket = JSON.parse(localStorage.getItem('basket')) || [];

if (location.href.indexOf("search") != -1) {
  $('.btn-in-basket').click(function () {
    var id = $(this).parents('.e-square-item').attr('data-id-goods');
    var price = $(this).parents('.e-square-item').find('.e-card-short-price').text();

    basket = JSON.parse(localStorage.getItem('basket')) || [];

    var pushItem = true;
    basket.forEach(function (item, i) {
      if (item.id == id) {
        pushItem = false;
      }
    });

    if (pushItem) {
      console.log("ok");
      basket.push({
        id: id,
        price: price,
        count: 1
      });
    }


    var basketData = JSON.stringify(basket);

    localStorage.setItem('basket', basketData);

    basketCalc();
  });
}

if (location.href.indexOf("card") != -1) {
  $('.btn-in-basket').click(function () {
    var id = $(this).parents('.b-card-short-info').attr('data-id-goods');
    var price = $(this).parents('.b-card-short-info').find('.e-card-short-price').text();

    basket = JSON.parse(localStorage.getItem('basket')) || [];

    basket.push({
      id: id,
      price: price,
      count: 1
    });

    var basketData = JSON.stringify(basket);

    localStorage.setItem('basket', basketData);

    basketCalc();
  });
}


var basketCalc = function () {
  var total = 0;
  basket.forEach(function (item) {
    total += parseInt(item.price.match(/\d*/)[0], 10)
  });
  document.getElementById("basket-price").innerHTML = total + '<span class="e-cart-currency">грн</span>';

  document.getElementById("count-goods").innerHTML = "(" + basket.length + " товаров)";
};
basketCalc();

$('.b-cart-footer').click(function () {
  if (basket.length != 0) {
    window.location.href = "basket-goods.html"
  } else {
    window.location.href = "basket-empty.html"
  }

});


//----------------------------------------------------------------------------------------------------
if (location.href.indexOf("basket-goods") != -1) {
  $(document).on('click', '.remove-goods-btn', function () {
    var b = basket;
    var id = $(this).parents('.e-square-item').attr('data-id-goods');
    b.forEach(function (item, i) {
      if (item.id == id) {
        b.splice(i, 1);
        localStorage.setItem('basket', JSON.stringify(b));
      }
    });
    $(".b-square-list").find(".e-square-item").detach();
    writeGoods();
  });

  var goods;

  var sendDataId = basket.map(function (obj) {
    return obj.id;
  });
  getGoods();

  function getGoods() {
    $.ajax({
      // method: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: "http://germes/front/goods.json",
      data: {sendDataId: sendDataId}
    }).done(function (response) {
      goods = response;
      writeGoods()
    });
  }

  function writeGoods() {
    goods.forEach(function (item) {
      var html = ' <li class="e-square-item col-lg-12" data-id-goods="' + item.id + '">'
        + '     <div class="b-square-catalog m-square-catalog-horizontal">'
        + '     <div class="e-square-catalog-photo" style="background-image: url(' + item.img + ')">'

        + '     </div>'
        + '     <div class="e-square-catalog-right">'
        + '     <div class="b-card-short-info">'
        + '     <div class="e-card-short-left">'
        + '     <p class="e-card-title">' + item.title + '</p>'
        + '   <p class="e-card-desc"><span class="e-card-bold">Категория:</span> спазмоанальгетик</p>'
        + '   <p class="e-card-desc"><span class="e-card-bold">Производитель:</span> Германия</p>'
        + '   <p class="e-card-desc"><span class="e-card-bold">Форма выпуска:</span> таблетки</p>'
        + '   </div>'
        + '   <div class="e-card-short-right">'
        + '     <div class="e-card-short-price-container">'
        + '     <div class="t">'
        + '     <div class="c">'
        + '     <p class="e-card-short-price">' + item.price + ' грн.</p>'
        + '   </div>'
        + '   </div>'
        + '   </div>'
        + '   <div class="e-card-container-quantity">'
        + '     <div class="e-card-quantity-left js-add">'
        + '     <button class="b-button m-button-square anim js-minus-num">'
        + '     <span class="e-button-mat" style="background-image: url(\'img/min.png\')"></span>'
        + '     </button>'
        + '     <div class="b-input-container m-input-container-short">'
        + '     <input type="text" name="num" class="b-input m-input-white js-input-num" value="1">'
        + '     </div>'
        + '     <button class="b-button m-button-square anim js-plus-num">'
        + '     <span class="e-button-mat" style="background-image: url(\'img/pl.png\')"></span>'
        + '     </button>'
        + '     </div>'
        + '     </div>'
        + '     </div>'
        + '     </div>'
        + '     </div>'
        + '     <button class="b-button m-button-cross anim remove-goods-btn">'
        + '     <span class="e-button-icon-container"><span class="t"><span class="c"><span class="b-icon"><span class="glyphicon glyphicon-remove"></span></span></span></span></span>'
        + '     </button>'
        + '     </div>'
        + '     </li>';

      $('.b-square-list').append(html)
    });
  }
}
if (location.href.indexOf("search") != -1) {
  $(document).on('click', '.js-plus-num', function () {
    var input = $(this).parents('.e-square-item').find('.b-input');
    inputVal = parseInt(input.val());
    var id = $(this).parents('.e-square-item').attr('data-id-goods');
    $.ajax({
      method: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: "/request/add/",
      data: {id: id, count: inputVal + 1}
    }).then(function (response) {
      if (response == true) {
        input.val(inputVal + 1);

        var bask = JSON.parse(localStorage.getItem('basket'));
        bask.forEach(function (item, i) {
          if (item.id == id) {
            item.count = item.count + 1;
            var b = basket;
            b.splice(i, 1, item);
            localStorage.setItem('basket', JSON.stringify(b));
          }
        })
      }
    });
  });

  $(document).on('click', '.js-minus-num', function () {
    var input = $(this).parents('.e-square-item').find('.b-input');
    inputVal = parseInt(input.val());
    var id = $(this).parents('.e-square-item').attr('data-id-goods');

    if (inputVal > 1) {
      input.val(inputVal - 1);
      var bask = JSON.parse(localStorage.getItem('basket'));
      bask.forEach(function (item, i) {
        if (item.id == id) {
          item.count = item.count - 1;
          var b = basket;
          b.splice(i, 1, item);
          localStorage.setItem('basket', JSON.stringify(b));
        }
      })
    }

  });
}

if (location.href.indexOf("card") != -1) {
  $(document).on('click', '.js-plus-num', function () {
    var input = $(this).parents('.b-card-short-info').find('.b-input');
    inputVal = parseInt(input.val());
    var id = $(this).parents('.b-card-short-info').attr('data-id-goods');
    $.ajax({
      method: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: "/request/add/",
      data: {id: id, count: inputVal + 1}
    }).then(function (response) {
      if (response == true) {
        input.val(inputVal + 1);

        var bask = JSON.parse(localStorage.getItem('basket'));
        bask.forEach(function (item, i) {
          if (item.id == id) {
            item.count = item.count + 1;
            var b = basket;
            b.splice(i, 1, item);
            localStorage.setItem('basket', JSON.stringify(b));
          }
        })
      }
    });
  });

  $(document).on('click', '.js-minus-num', function () {
    var input = $(this).parents('.b-card-short-info').find('.b-input');
    inputVal = parseInt(input.val());
    var id = $(this).parents('.b-card-short-info').attr('data-id-goods');

    if (inputVal > 1) {
      input.val(inputVal - 1);
      var bask = JSON.parse(localStorage.getItem('basket'));
      bask.forEach(function (item, i) {
        if (item.id == id) {
          item.count = item.count - 1;
          var b = basket;
          b.splice(i, 1, item);
          localStorage.setItem('basket', JSON.stringify(b));
        }
      })
    }

  });
}


$('#sendBasket').click(function () {
  var localBasket = JSON.parse(localStorage.getItem("basket"));
  console.log(localBasket);
  $.ajax({
    method: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: "/request/store/",
    data: {basket: localBasket}
  }).done(function (response) {
    if (response.response) {
      localStorage.setItem("code", JSON.stringify(response.code));
      window.location.href = "basket.html"
    } else {
      alert("Отправка прервана. Попробуйте еще раз")
    }
  });
});

