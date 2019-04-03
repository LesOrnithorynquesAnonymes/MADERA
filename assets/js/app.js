let Router = require('electron-router')
let router = Router('WINDOW')
let moment = require('moment')

$(function () {

  moment.locale('fr')
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
    $(document).on('click', '#plans .plan', function (e) {
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

      if(!err){
        for(var key in res) {
          project = res[key];
          $('#projects').append('<li id="project_' + project.id + '" class="project">' + project.name + '</li>');
        }
      }
      else {
        $('#projects').html('<li class="project">Une erreur est survenue</li>');
      }
    });

    $(document).on('click', 'li[id^=project_]:not(.active)', function() {
      var $this = $(this);

        var id = $this.attr('id').replace('project_', '');
        console.log(id);
        router.route('GET', 'project/:id/plans', {project_id: id}, function(err, res) {

          if(!err) {

            $('#projects li').removeClass('active');
            $('#plans').html('');

            $this.addClass('active');
            for(var key in res) {
              plan = res[key];
              $('#plans').append('<li id="plan_' + plan.id + '" class="plan" data-date="' + moment(plan.created).fromNow() + '">' +
                '<i class="fa fa-home"></i>' +
                '<p class="label">Plan 1</p></li>'
              );
            }

            $('#plans').append('<li class="new-plan" data-date="05/16/2018">' +
              '<i class="fa fa-plus"></i>' +
              '<p class="label">Nouveau...</p></li>'
            );
          }

        });
    });

    $('.add-new-project').on('click', function () {
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

    $(document).on('click', '.new-plan', function () {
        swalMadera({
            title: '<div class="title">Ajouter un nouveau plan</div>',
            html: "<form>" +
            "<div><label for='title-plan'>Nom du plan :</label><input type='text' id='title-plan' placeholder='Titre...'></div>" +
            "<div><label for='desc-plan'>Description du plan :</label><textarea type='text' id='desc-plan' placeholder='Description...'></textarea></div>" +
            "</form>",
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                let titre = $('#title-plan').val();
                let description = $('#desc-plan').val();
                var project_id = $('li[id^=project_] .active').attr('id').replace('project_','');
                router.route('POST','/plan/add',{titre: titre, description: description, project_id: project_id}, function() {});

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


    // ##########  Click PLAN OPEN FloorPlanEditor ######### //
    $('#edit-plan').on('click', function(){
        var plan_active = $("li.plan :has(.active)");

          console.log(plan_active);

    });
    // ##########  DEVIS PAGE ##########

});
