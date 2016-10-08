var basket = JSON.parse(localStorage.getItem('basket')) || [];

$('.btn-in-basket').click(function () {
  var id = $(this).parents('.e-square-item').attr('data-id-goods');
  var title = $(this).parents('.e-square-item').find('.e-card-title').text();
  var price = $(this).parents('.e-square-item').find('.e-card-short-price').text();

  basket = JSON.parse(localStorage.getItem('basket')) || [];

  basket.push({
    id: id,
    title: title,
    price: price
  });

  var basketData = JSON.stringify(basket);

  localStorage.setItem('basket', basketData);

  basketCalc();
});

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
  window.location.href = "basket-goods.html"
});
