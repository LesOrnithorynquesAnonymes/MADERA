let Router = require('electron-router')
let router = Router('WINDOW')


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

    router.send('ready');

    $('#project_1').on('click', function() {

      console.log('yes');
      router.route('POST', '/projects', function(err, res) {
          console.log(res);
      });

    })
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

    router.route('GET', '/projects', function(err, res) {
      $('#projects').html('');
      console.log(res, err);

      if(!err){
        for(var key in res) {
          project = res.key;
          $('#projects').append('<li id="project_' + project.id + '" class="project">' + project.name + '</li>');
        }
      }

    });

    $('.add-new-project').on('click', function (e) {
        swalMadera({
            title: '<div class="title">Ajouter un nouveau projet</div>',
            html: "<form>" +
            "<div><label for='title-proj'>Titre :</label><input type='text' id='title-proj' placeholder='Titre...'></div>" +
            "<div><label for='desc-proj'>Description :</label><textarea type='text' id='desc-proj' placeholder='Description...'></textarea></div>" +
            "<div><label for='client-proj'>Nom client :</label><textarea type='text' id='client-proj' placeholder='Nom du client...'></textarea></div>" +
            "</form>",
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                let titre = $('#title-proj').val();
                let description = $('#desc-proj').val();
                //console.log($('.add-new-project').data());
                router.route('POST','/project/add',{titre: titre, description: description}, function() {});

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
                let city = $('#ville-cli').val();
                //console.log(nom + ' ' + prenom + ' //// Valider Formulaire + save en database ici');
                router.route('POST','/client/add',{nom: nom, prenom: prenom, mail: mail, phone: phone, city: city}, function() {});
            }
        })
    });

    // ##########  DEVIS PAGE ##########

});
