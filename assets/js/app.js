$(function () {

    // ########## LEFT PANNEL ##########
    $('.leftpannel .project').on('click', function (e) {
        if (!$(this).hasClass('active')) {
            $('.leftpannel .project').removeClass('active')
            $(this).addClass('active')
        }
    });
});
