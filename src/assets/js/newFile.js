$(document).ready(function () {
  $("#menu_bar").click(function () {
    $(".leftMenu").toggleClass("side-nav");
  });


  $(".mobile-menu").click(function () {
    $(".bg-blur").removeClass("nav-show");
  });

  $("#menu-btn").click(function () {
    $(".bg-blur").toggleClass("nav-show");
  });
  $(".smily").click(function () {
    $(".emoji-main").slideToggle();
  });

  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  $("#filter-icon").click(function () {
    $(".check-main-inner").slideToggle();
    $(this).toggleClass("fill-bg");
  });
  $("#filter-icon2").click(function () {
    $(".check-main-inner").slideToggle();
    $(this).toggleClass("fill-bg");
  });
  $(".item-main").click(function () {
    // Remove 'test' class from all elements within '.d-flex align-items-center li a'
    $(".filter-list ul li a").removeClass("test");

    // Toggle 'test' class on the clicked '.dropdown-item'
    $(this).toggleClass("test");

    // Toggle 'test' class on the corresponding element within '.d-flex align-items-center li a'
    var index = $(this).parent().index();
    $(".filter-list ul li:eq(" + index + ") a").toggleClass("test");

    // Add any other actions you want to perform on the individual elements here
  });
  $(".drop-item2").click(function () {
    // Remove 'test' class from all elements within '.d-flex align-items-center li a'
    $(".filter2 ul li a").removeClass("test");

    // Toggle 'test' class on the clicked '.dropdown-item'
    $(this).toggleClass("test");

    // Toggle 'test' class on the corresponding element within '.d-flex align-items-center li a'
    var index = $(this).parent().index();
    $(".filter2 ul li:eq(" + index + ") a").toggleClass("test");

    // Add any other actions you want to perform on the individual elements here
  });

  //-----JS for Price Range slider-----
  $(function () {
    $("#price-range").slider({
      range: "min",
      min: 0,
      max: 1000,
      value: 500,
      slide: function (event, ui) {
        // Update the displayed minimum value as the slider is moved
        $("#min-price").text("$" + ui.value);
      }
    });

    // Display initial value
    $("#min-price").text("$" + $("#price-range").slider("value"));
  });

  $(function () {
    $("#price-range2").slider({
      range: "min",
      min: 0,
      max: 7550,
      value: 2550,
      slide: function (event, ui) {
        // Update the displayed minimum value as the slider is moved
        $("#min-price2").text("$" + ui.value);
      }
    });

    // Display initial value
    $("#min-price2").text("$" + $("#price-range2").slider("value"));
  });
  $(function () {
    $("#price-range3").slider({
      range: "min",
      min: 0,
      max: 2000,
      value: 550,
      slide: function (event, ui) {
        // Update the displayed minimum value as the slider is moved
        $("#min-price3").text("$" + ui.value);
      }
    });

    // Display initial value
    $("#min-price3").text("$" + $("#price-range3").slider("value"));
  });

  $("#cross").click(function () {
    $(".hand-rank").removeClass("box-show");
  });
  $(".gif-show li a").click(function () {
    $(".puke").addClass("puke-show");
  });
  $(".emojis-list li a").click(function () {
    $(".react-img").addClass("d-block");
    $(".react-emoji-main").removeClass("d-block");
  });
  $(".quesion").click(function () {
    $(".hand-main-inner").addClass("add-before");
    $(".buy-hero").addClass("z-ind2");
    $(".buy-cross6").addClass("cross-show");
    // $(".hand-rank").toggleClass("box-show");
    // $(".hand-rank-mbl").toggleClass("d-flex");
    $(".hand-rank-mbl").toggleClass("box-show");
    $(".fold-main").addClass("fold-main-hide");
    $(".cards-main-inner").addClass("fold-main-hide");
  });
  $(".buy-cross4").click(function () {
    $(".emoji-main-inner").addClass("remove-after");
    $(".emoji-main").addClass("d-none");
    $(".buy-cross4").addClass("d-none");
  });

  $(".buy-cross6").click(function () {
    $(".hand-main-inner").addClass("remove-before2");
    $(".camera-setting-main").addClass("test");
    $(".buy-cross6").addClass("cross-hide");
    $(".header-2").addClass("z-ind3");
  });

  $(".smily").click(function () {
    $(".emoji-main-inner").addClass("add-after");
  });

  $(".fold-btn, .buy-cross3").click(function () {
    $(".camera-setting-main").toggleClass("d-block");
  });
  $(".buy-cross7, .quesion").click(function () {
    $(".hand-rank-mbl").toggleClass("d-flex");
  });
  $(".buy-cross7, .quesion").click(function () {
    $(".hand-rank-mbl").toggleClass("box-show");
  });
  $(".video-icon").click(function () {
    $(".react-video").addClass("d-block");
  });
  $('.emojis-list li a').on('click', function () {
    $("react-img").addClass('playing').delay(3000);
  });

  $('.emojis-list li a').on('click', function () {
    $(function () {
      setTimeout(function () { $(".react-img").addClass('playing').delay(3000); }, 5000);

    });
  });

  $(function () {
    setTimeout(function () { $(".puke").addClass('playing2').delay(9000); }, 9000);

  });
  $(function () {
    setTimeout(function () { $(".react-video").addClass('playing2').delay(9000); }, 9000);

  });
});
