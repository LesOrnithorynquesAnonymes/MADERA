$(function () {
    // ########## DEFAULT GENERAL ##########
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

    // MENU
    $('.navbar-toggler').on('click', function (e) {
        const nav = $(this).closest('nav');

    });

    // FERMER LE FOOTER PANNEL
    $('.close-data').on('click', function (e) {
        $('.footer').hide();
    });

    // ########## LEFT PANNEL ##########
    // Gestion du Active
    $('.leftpannel li').on('click', function (e) {
        if (!$(this).hasClass('active')) {
            $('.leftpannel li').removeClass('active');
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
    });


    $('.add-new-project').on('click', function (e) {
        swalMadera({
            title: '<div class="title">Ajouter un nouveau projet</div>',
            html: "<form>" +
            "<div><label for='title-proj'>Titre :</label><input type='text' id='title-proj' placeholder='Titre...'></div>" +
            "<div><label for='desc-proj'>Description :</label><textarea type='text' id='desc-proj' placeholder='Description...'></textarea></div>" +
            "</form>",
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                let titre = $('#title-proj').val();
                let description = $('#desc-proj').val();
                console.log(titre + ' ' + description + ' //// Valider Formulaire + save en database ici')
            }
        })
    });

    // ##########  CLIENT PAGE ##########
    $('.add-new-client').on('click', function (e) {
        swalMadera({
            title: '<div class="title">Ajouter un nouveau client</div>',
            html: "<form>" +
            "<div><label for='nom-cli'>Nom :</label><input type='text' id='nom-cli' placeholder='Nom...'></div>" +
            "<div><label for='prenom-cli'>Prenom :</label><input type='text' id='prenom-cli' placeholder='Prenom...'/></div>" +
            "<div><label for='mail-cli'>Email :</label><input type='email' id='prenom-cli' placeholder='Email...'/></div>" +
            "<div><label for='tel-cli'>Téléphone :</label><input type='text' id='tel-cli' placeholder='Téléphone...'/></div>" +
            "<div><label for='ville-cli'>Ville :</label><input type='text' id='ville-cli' placeholder='Ville...'/></div>" +
            "</form>",
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                let nom = $('#nom-cli').val();
                let prenom = $('#prenom-cli').val();
                let mail = $('#mail-cli').val();
                let phone = $('#tel-cli').val();
                let city = $('#cville-cli').val();
                console.log(nom + ' ' + prenom + ' //// Valider Formulaire + save en database ici')
            }
        })
    });

    // ##########  DEVIS PAGE ##########

});
