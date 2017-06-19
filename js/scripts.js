$(function () {
    $(window).scroll(function (e) {
        $(window).scrollTop() >= 56 ? $('body').addClass('fixed') : $('body').removeClass('fixed')
    });
    $('.footer-box').on('click tapone', 'h4', function () {
        $(this).nextAll('ul').toggleClass('show');
    });
});

