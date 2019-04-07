let Router = require('electron-router')
let router = Router('WINDOW')

//var $ = require('jQuery');

let moment = require('moment')


$(function () {
  var myStorage = window.localStorage;
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

    $('#edit-plan').on('click', function () {

      //Sauvegarde de l'actuel plan du local myStorage
      if(myStorage.getItem('3Drep') != 'null')
      {
        router.route('POST', 'plan/:id/update',{id:myStorage.getItem('id'),updated3D:myStorage.getItem('3Drep')}, function(err, res) {});
      }

      //Ajout du Plan dans localStorage
      var id_plan = $('li[id^=plan_].active').attr('id').replace('plan_','');

      router.route('GET', 'plan/:id/',{id:id_plan}, function(err, res) {
        if(!err){
          for(var key in res) {
            plan = res[key];

            //add to local storage plan.rep3D
            myStorage.setItem('id',plan.id);
            myStorage.setItem('name',plan.name);
            myStorage.setItem('description',plan.description);
            myStorage.setItem('3Drep',plan.rep3D);
          }
          document.location.href = "../plugin/plan/index.html";
        }
        else {
          console.log("error route geet plan by id");
        }
      });
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
        router.route('GET', 'project/:id/plans', {projet_id: id}, function(err, res) {

          if(!err) {

            $('#projects li').removeClass('active');
            $('#plans').html('');

            $this.addClass('active');
            for(var key in res) {
              plan = res[key];
              $('#plans').append('<li id="plan_' + plan.id + '" class="plan" data-date="' + moment(plan.created).fromNow() + '">' +
                '<i class="fa fa-home"></i>' +
                '<p class="label">' + plan.name + '</p></li>'
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
                router.route('POST','/project/add',{titre: titre, description: description}, function(err, res) {
                  //TODO add before nwe project button
                });

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
                var project_id = $('li[id^=project_].active').attr('id').replace('project_','');
                //console.log(project_id);
                router.route('POST','/plan/add',{titre: titre, description: description, projet_id: project_id}, function() {});

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
    $('#gen-devis').on('click',function(){
        //Dependecies JSPDF

        jsPDF = require('jspdf');
        require('jspdf-autotable');


        //Get all Plan in projet

        var project_id = $('li[id^=project_].active').attr('id').replace('project_','');
        router.route('GET', 'project/:id/plans', {projet_id: project_id}, function(err, res){
          var doc = new jsPDF();



                    //* * * * * * * PAGE DE GARDE * * * * * * *
                    doc.setFontSize(15);
                    doc.text('Devis MADERA', 40, 40); // Titre Proc
                    doc.setFontSize(13);
                    doc.text('{Client | Commercial }', 40, 48); // Cs Proc
                    doc.setFontSize(11);
                    doc.line(20, 25, 180, 25); // horizontal line //Séparteur

                    var today = new Date();
                    var dd = today.getDate();

                    var mm = today.getMonth()+1;
                    var yyyy = today.getFullYear();
                    if(dd<10)
                    {
                        dd='0'+dd;
                    }

                    if(mm<10)
                    {
                        mm='0'+mm;
                    }
                    today = dd+'/'+mm+'/'+yyyy;

                    doc.text('Devis généré : ' + today,135,270); // Date du jour de génération
                    doc.addPage();


          if(!err)
          {
            var totaldevis = 0;

            var allPlan = new Array();
            for(var key in res) {
              var totalperplan = 0;
              plan = res[key];
              doc.autoTable({
                theme: 'striped',
                margin:{left:25},
                styles:{fontSize: 8},
                head:[['Plan : ' + plan.name, 'Description : ' + plan.description, 'Création : ' + plan.created]],
                body:[

                ]
              });
              var murDuPlan = new Array();
              var jsonPlan = JSON.parse(plan.rep3D);
              var items = jsonPlan.floorplan;
              var walls = items.walls;
                for(var aWall in walls){
                  var img_link;

                  wall = walls[aWall];
                  var textures = wall.backTexture;
                  img_link = textures.url;

                  var corner1 = wall.corner1;

                  var corner2 = wall.corner2;

                  var x;
                  var y;
                  var xx;
                  var yy;

                  var corners = items.corners

                  for(var aCorner in corners){
                    corn = corners[aCorner];
                    if(String(corner1) == String(aCorner)){
                      x = corn.x;
                      y = corn.y;
                    }
                    if(String(corner2) == String(aCorner)){
                      xx = corn.x;
                      yy = corn.y;
                    }
                  }
                  var mur = new Array();
                  mur['x'] = x;
                  mur['y'] = y;
                  mur['xx'] = xx;
                  mur['yy'] = yy;
                  mur['url'] = img_link;
                  mur['distance'] = Math.sqrt(Math.pow((y-x),2)+Math.pow((yy-xx),2)) * 0.0254;

                  var split_url_by_slash = img_link.split("/");
                  var last_element = split_url_by_slash[split_url_by_slash.length-1];
                  var split_url_by_under = last_element.split("_");
                  mur['name'] = split_url_by_under[1] + ' ' + split_url_by_under[2];
                  if(split_url_by_under[0] != "wallmap.png")
                  {
                    mur['pu'] = split_url_by_under[0];
                    mur['couttotal'] = parseInt(split_url_by_under[0]) * mur['distance'];
                  }



                  if(!mur['name'].includes("undefined"))
                  {
                      murDuPlan.push(mur);
                  }

                }

                for(var key in murDuPlan)
                {
                  mur = murDuPlan[key];
                  totalperplan = totalperplan + Math.round(mur.couttotal * 100) / 100
                  doc.autoTable({
                    theme: 'plain',
                    margin:{left:30},
                    styles:{fontSize: 8},
                    head:[['Nom','distance','Prix Unitaire (M²)','Coût Total']],
                    body:[
                        [mur.name,mur.distance, mur.pu, Math.round(mur.couttotal * 100) / 100 + " €"],
                    ]
                  });
                }

                doc.autoTable({
                  theme:'grid',
                  margin:{left:35},
                  styles:{fontSize:8},
                  head:[['Cout du plan : ' + totalperplan + " €"]]
                });
                allPlan.push(murDuPlan);
                totaldevis = totaldevis + totalperplan;
              }

              console.log(allPlan);


            }
            doc.autoTable({
              theme:'grid',
              margin:{left:35},
              styles:{fontSize:12},
              head:[['Cout Total : ' + totaldevis + " €"]]
            });
          doc.save('devis.pdf');
        });

    });


});
