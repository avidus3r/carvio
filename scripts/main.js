var elem, instance;
document.addEventListener('DOMContentLoaded', function() {
  var options = {};
  elem = document.querySelectorAll('.carousel');
  instance = M.Carousel.init(elem, options);
  var nextBtn = document.querySelector('.next');
  nextBtn.addEventListener('click', () => {
    var instance = M.Carousel.getInstance(document.querySelectorAll('.carousel'));
    instance[0].next();
  });
});