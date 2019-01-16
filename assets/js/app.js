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
        // FERMER LE PANNEL DU BAS
    });
        $('.close-data').on('click', function (e) {
            $('.footer').hide();
        })

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
            "<div><label for='prenom-cli'>Prenom :</label><textarea type='text' id='prenom-cli' placeholder='Prenom...'></textarea></div>" +
            "</form>",
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                let nom = $('#nom-cli').val();
                let prenom = $('#prenom-cli').val();
                console.log(nom + ' ' + prenom + ' //// Valider Formulaire + save en database ici')
            }
        })
    });
});
