$(function () {

    // ################## MENU ##################
    // trick pour poser le active du menu sur la bonne page
    let origin = window.location.origin;
    let url = window.location.pathname;
    let urlSplitted = url.split('/')[3];
    $('nav li a[href="' + urlSplitted + '"]').addClass('active');

    // ########## LEFT PANNEL ##########
    $('.leftpannel .project').on('click', function (e) {
        if (!$(this).hasClass('active')) {
            $('.leftpannel .project').removeClass('active')
            $(this).addClass('active')
        }
    });

    // ########## HOME PAGE PLAN ##########
    $('.list-plan .plan').on('click', function (e) {
        let $this = $(this);
        let name = e.currentTarget.innerText;
        let date = $this.data('date');
        if (!$this.hasClass('active')) {
            $('.list-plan .plan').removeClass('active');
            $this.addClass('active');
            $('.footer').addClass('active').show();
            $('.footer .name').html(name);
            $('.footer .date').html(date);
        }

        $('.close-data').on('click', function(e) {
            $('.footer').hide();
        })
    });
});
