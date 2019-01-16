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
        // OUVRIR LE PANNEL DU BAS
        if (!$this.hasClass('active')) {
            $('.list-plan .plan').removeClass('active');
            $this.addClass('active');
            $('.footer').addClass('active').show();
            $('.footer .name').html(name);
            $('.footer .date').html(date);
        }
        // FERMER LE PANNEL DU BAS
        $('.close-data').on('click', function(e) {
            $('.footer').hide();
        })
    });

    const swalMadera = Swal.mixin({
        allowEnterKey: true,
        background: '',
        customClass: 'swal-modal',
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Valider',
        confirmButtonColor: '#535559',
        cancelButtonColor: '#535559'
    });

    $('.add-new-project').on('click', function(e) {
        swalMadera({
          title:'<div class="title">Ajouter un nouveau projet</div>',
           html:"<form>" +
           "<div><label for='title-proj'>Titre :</label><input type='text' id='title-proj' placeholder='Titre...'></div>" +
           "<div><label for='desc-proj'>Description :</label><textarea type='text' id='desc-proj' placeholder='Description...'></textarea></div>" +
           "</form>",
       }).then(function(isConfirm) {
            if (isConfirm.value === true) {
                let titre = $('#title-proj').val();
                let description = $('#desc-proj').val();
                console.log('Valider Formulaire + save en database ici')
            }
        })
    });
});
