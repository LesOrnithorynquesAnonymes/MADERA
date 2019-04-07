let Router = require('electron-router')
let router = Router('WINDOW')
/*
 * Camera Buttons
 */
let moment = require('moment')

var CameraButtons = function (blueprint3d) {

    var orbitControls = blueprint3d.three.controls;
    var three = blueprint3d.three;

    var panSpeed = 30;
    var directions = {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    }

    function init() {
        // Camera controls
        $("#zoom-in").click(zoomIn);
        $("#zoom-out").click(zoomOut);
        $("#zoom-in").dblclick(preventDefault);
        $("#zoom-out").dblclick(preventDefault);

        $("#reset-view").click(three.centerCamera)

        $("#move-left").click(function () {
            pan(directions.LEFT)
        })
        $("#move-right").click(function () {
            pan(directions.RIGHT)
        })
        $("#move-up").click(function () {
            pan(directions.UP)
        })
        $("#move-down").click(function () {
            pan(directions.DOWN)
        })

        $("#move-left").dblclick(preventDefault);
        $("#move-right").dblclick(preventDefault);
        $("#move-up").dblclick(preventDefault);
        $("#move-down").dblclick(preventDefault);
    }

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function pan(direction) {
        switch (direction) {
            case directions.UP:
                orbitControls.panXY(0, panSpeed);
                break;
            case directions.DOWN:
                orbitControls.panXY(0, -panSpeed);
                break;
            case directions.LEFT:
                orbitControls.panXY(panSpeed, 0);
                break;
            case directions.RIGHT:
                orbitControls.panXY(-panSpeed, 0);
                break;
        }
    }

    function zoomIn(e) {
        e.preventDefault();
        orbitControls.dollyIn(1.1);
        orbitControls.update();
    }

    function zoomOut(e) {
        e.preventDefault;
        orbitControls.dollyOut(1.1);
        orbitControls.update();
    }

    init();
}

/*
 * Context menu for selected item
 */

var ContextMenu = function (blueprint3d) {

    var scope = this;
    var selectedItem;
    var three = blueprint3d.three;

    function init() {
        $("#context-menu-delete").click(function (event) {
            selectedItem.remove();
        });

        three.itemSelectedCallbacks.add(itemSelected);
        three.itemUnselectedCallbacks.add(itemUnselected);

        initResize();

        $("#fixed").click(function () {
            var checked = $(this).prop('checked');
            selectedItem.setFixed(checked);
        });
    }

    function cmToIn(cm) {
        return cm / 2.54;
    }

    function inToCm(inches) {
        return inches * 2.54;
    }

    function itemSelected(item) {
        selectedItem = item;

        $("#context-menu-name").text(item.metadata.itemName);

        $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
        $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
        $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));

        $("#context-menu").show();

        $("#fixed").prop('checked', item.fixed);
    }

    function resize() {
        selectedItem.resize(
            inToCm($("#item-height").val()),
            inToCm($("#item-width").val()),
            inToCm($("#item-depth").val())
        );
    }

    function initResize() {
        $("#item-height").change(resize);
        $("#item-width").change(resize);
        $("#item-depth").change(resize);
    }

    function itemUnselected() {
        selectedItem = null;
        $("#context-menu").hide();
    }

    init();
}

/*
 * Loading modal for items
 */

var ModalEffects = function (blueprint3d) {

    var scope = this;
    var blueprint3d = blueprint3d;
    var itemsLoading = 0;

    this.setActiveItem = function (active) {
        itemSelected = active;
        update();
    }

    function update() {
        if (itemsLoading > 0) {
            $("#loading-modal").show();
        } else {
            $("#loading-modal").hide();
        }
    }

    function init() {
        blueprint3d.model.scene.itemLoadingCallbacks.add(function () {
            itemsLoading += 1;
            update();
        });

        blueprint3d.model.scene.itemLoadedCallbacks.add(function () {
            itemsLoading -= 1;
            update();
        });

        update();
    }

    init();
}

/*
 * Side menu
 */

var SideMenu = function (blueprint3d, floorplanControls, modalEffects) {
    var blueprint3d = blueprint3d;
    var floorplanControls = floorplanControls;
    var modalEffects = modalEffects;

    var ACTIVE_CLASS = "active";

    var tabs = {
        "FLOORPLAN": $("#floorplan_tab"),
        "SHOP": $("#items_tab"),
        "DESIGN": $("#design_tab")
    }

    var scope = this;
    this.stateChangeCallbacks = $.Callbacks();

    this.states = {
        "DEFAULT": {
            "div": $("#viewer"),
            "tab": tabs.DESIGN
        },
        "FLOORPLAN": {
            "div": $("#floorplanner"),
            "tab": tabs.FLOORPLAN
        },
        "SHOP": {
            "div": $("#add-items"),
            "tab": tabs.SHOP
        }
    }

    // sidebar state
    var currentState = scope.states.FLOORPLAN;

    function init() {
        for (var tab in tabs) {
            var elem = tabs[tab];
            elem.click(tabClicked(elem));
        }

        $("#update-floorplan").click(floorplanUpdate);

        initLeftMenu();

        blueprint3d.three.updateWindowSize();
        handleWindowResize();

        initItems();

        setCurrentState(scope.states.DEFAULT);
    }

    function floorplanUpdate() {
        setCurrentState(scope.states.DEFAULT);
    }

    function tabClicked(tab) {
        return function () {
            // Stop three from spinning
            blueprint3d.three.stopSpin();

            // Selected a new tab
            for (var key in scope.states) {
                var state = scope.states[key];
                if (state.tab == tab) {
                    setCurrentState(state);
                    break;
                }
            }
        }
    }

    function setCurrentState(newState) {

        if (currentState == newState) {
            return;
        }

        // show the right tab as active
        if (currentState.tab !== newState.tab) {
            if (currentState.tab != null) {
                currentState.tab.removeClass(ACTIVE_CLASS);
            }
            if (newState.tab != null) {
                newState.tab.addClass(ACTIVE_CLASS);
            }
        }

        // set item unselected
        blueprint3d.three.getController().setSelectedObject(null);

        // show and hide the right divs
        currentState.div.hide()
        newState.div.show()

        // custom actions
        if (newState == scope.states.FLOORPLAN) {
            floorplanControls.updateFloorplanView();
            floorplanControls.handleWindowResize();
        }

        if (currentState == scope.states.FLOORPLAN) {
            blueprint3d.model.floorplan.update();
        }

        if (newState == scope.states.DEFAULT) {
            blueprint3d.three.updateWindowSize();
        }

        // set new state
        handleWindowResize();
        currentState = newState;

        scope.stateChangeCallbacks.fire(newState);
    }

    function initLeftMenu() {
        $(window).resize(handleWindowResize);
        handleWindowResize();
    }

    function handleWindowResize() {
        $(".sidebar").height(window.innerHeight);
        $("#add-items").height(window.innerHeight);

    };

    // TODO: this doesn't really belong here
    function initItems() {
        $("#add-items").find(".add-item").mousedown(function (e) {
            var modelUrl = $(this).attr("model-url");
            var itemType = parseInt($(this).attr("model-type"));
            var metadata = {
                itemName: $(this).attr("model-name"),
                resizable: true,
                modelUrl: modelUrl,
                itemType: itemType
            }

            blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
            setCurrentState(scope.states.DEFAULT);
        });
    }

    init();

}

/*
 * Change floor and wall textures
 */

var TextureSelector = function (blueprint3d, sideMenu) {

    var scope = this;
    var three = blueprint3d.three;
    var isAdmin = isAdmin;

    var currentTarget = null;

    function initTextureSelectors() {
        $(".texture-select-thumbnail").click(function (e) {
            var textureUrl = $(this).attr("texture-url");
            var textureStretch = ($(this).attr("texture-stretch") == "true");
            var textureScale = parseInt($(this).attr("texture-scale"));
            currentTarget.setTexture(textureUrl, textureStretch, textureScale);

            e.preventDefault();
        });
    }

    function init() {
        three.wallClicked.add(wallClicked);
        three.floorClicked.add(floorClicked);
        three.itemSelectedCallbacks.add(reset);
        three.nothingClicked.add(reset);
        sideMenu.stateChangeCallbacks.add(reset);
        initTextureSelectors();
    }

    function wallClicked(halfEdge) {
        currentTarget = halfEdge;
        $("#floorTexturesDiv").hide();
        $("#wallTextures").show();
    }

    function floorClicked(room) {
        currentTarget = room;
        $("#wallTextures").hide();
        $("#floorTexturesDiv").show();
    }

    function reset() {
        $("#wallTextures").hide();
        $("#floorTexturesDiv").hide();
    }

    init();
}

/*
 * Floorplanner controls
 */

var ViewerFloorplanner = function (blueprint3d) {

    var canvasWrapper = '#floorplanner';

    // buttons
    var move = '#move';
    var remove = '#delete';
    var draw = '#draw';

    var activeStlye = 'btn-primary disabled';

    this.floorplanner = blueprint3d.floorplanner;

    var scope = this;

    function init() {

        $(window).resize(scope.handleWindowResize);
        scope.handleWindowResize();

        // mode buttons
        scope.floorplanner.modeResetCallbacks.add(function (mode) {
            $(draw).removeClass(activeStlye);
            $(remove).removeClass(activeStlye);
            $(move).removeClass(activeStlye);
            if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
                $(move).addClass(activeStlye);
            } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
                $(draw).addClass(activeStlye);
            } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
                $(remove).addClass(activeStlye);
            }

            if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
                $("#draw-walls-hint").show();
                scope.handleWindowResize();
            } else {
                $("#draw-walls-hint").hide();
            }
        });

        $(move).click(function () {
            scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
        });

        $(draw).click(function () {
            scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        });

        $(remove).click(function () {
            scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
        });
    }

    this.updateFloorplanView = function () {
        scope.floorplanner.reset();
    }

    this.handleWindowResize = function () {
        $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
        scope.floorplanner.resizeView();
    };

    init();
};

var mainControls = function (blueprint3d) {
    // var blueprint3d = blueprint3d;

  function newDesign() {
    blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  }
  function loadDesign() {
      console.log("go charger");
  }
  function saveDesign() {
      var myStorage = window.localStorage;
      myStorage.setItem('3Drep',blueprint3d.model.exportSerialized());
  }

  function genereView() {
    $("#main-controls").hide();
    $("#camera-controls").hide();
    console.log("generation des views 2D");
    $("#floorplanner-controls").hide();
    html2canvas(document.querySelector('#floorplanner-canvas')).then(canvas => {
      image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var link = document.createElement('a');
      link.download = "view-projet.png";
      link.href = image;
      link.click();
      $("#floorplanner-controls").show();
    });
    $("#main-controls").show();
    $("#camera-controls").show();
    /*
    console.log("generation des views");
    $("#main-controls").hide();
    $("#camera-controls").hide();
    html2canvas(document.querySelector('#viewer')).then(canvas => {
      image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let fs = require('fs');
      let path = require('path');
      var FileSaver = require('file-saver');
      fs.writeFile(path.join(__dirname, '../../assets/files/views3D/' + moment().format('X') + ''), image, function (err) {
          if (err) {
              return console.log(err);
          }
          console.log("Le blueprint a été sauvegardé !");
      });
      //var link = document.createElement('a');
      //link.download = "view-projet.png";
      //link.href = image;
      //link.click();
      $("#main-controls").show();
      $("#camera-controls").show();

    });
    //Init Saver

      let fs = require('fs');
      let path = require('path');
      var FileSaver = require('file-saver');
      //FileSaver.saveAs(blob,"myfuckin.design3D");
      var data = blueprint3d.model.exportSerialized();
      var blob = new Blob([data], {type: 'text'});
      var blueprint = window.URL.createObjectURL(blob);
      var random = Math.floor((Math.random() * 1000) + 1);
      fs.writeFile(path.join(__dirname, '../../assets/files/blueprints/' + moment().format('X') + ''), data, function (err) {
          if (err) {
              return console.log(err);
          }
          console.log("Le blueprint a été sauvegardé !");
      });
      // var a = window.document.createElement('a');
      // a.href = window.URL.createObjectURL(blob);
      // a.download = 'design.blueprint3d';
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      */
  }
  function genereView2D(){
    console.log("generation des views 2D");
    $("#floorplanner-controls").hide();
    html2canvas(document.querySelector('#floorplanner-canvas')).then(canvas => {
      image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var link = document.createElement('a');
      link.download = "view-projet.png";
      link.href = image;
      link.click();
      $("#floorplanner-controls").show();
    });
  }

  function init() {
    $("#new").click(newDesign);
    $("#loadFile").click(loadDesign);
    $("#saveFile").click(saveDesign);
    $("#generateView").click(genereView);
    $("#generateView2D").click(genereView2D);
  }

  init();
}

/*
 * Initialize!
 */

$(document).ready(function () {


  var myStorage = window.localStorage;
  //var ok = myStorage.getItem('client');
  //console.log(ok);

    // main setup
    var opts = {
        floorplannerElement: 'floorplanner-canvas',
        threeElement: '#viewer',
        threeCanvasElement: 'three-canvas',
        textureDir: "models/textures/",
        widget: false
    }
    var blueprint3d = new BP3D.Blueprint3d(opts);

    var modalEffects = new ModalEffects(blueprint3d);
    var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
    var contextMenu = new ContextMenu(blueprint3d);
    var sideMenu = new SideMenu(blueprint3d, viewerFloorplanner, modalEffects);
    var textureSelector = new TextureSelector(blueprint3d, sideMenu);
    var cameraButtons = new CameraButtons(blueprint3d);
    mainControls(blueprint3d);

    // This serialization format needs work
    // Load a simple rectangle room


    //Setup Gammes
    router.route('GET', '/gamme', function(err, res) {

      if(!err) {
        $('#select-gamme').append($('<option>', {
              value: "",
              text: ""
        }));
        for(var key in res) {
          gamme = res[key];
          $('#select-gamme').append($('<option>', {
                value: gamme.id,
                text: gamme.name
          }));
        }
      }

    });
    //Setup modules
    $('#select-gamme').change(function() {
      $('#select-module').empty();
      $('#component').empty();
      $('#alink_1').attr("texture-url", "");
      $('#thumblink_1').attr("src","");
      $('#alink_2').attr("texture-url", "");
      $('#thumblink_2').attr("src","");
      if($(this).val() != "null")
      {

        router.route('GET', '/gamme/:id/modules', {gamme_id: parseInt($(this).val())}, function(err, res) {
          if(!err){
            $('#select-module').append($('<option>',{
              value: "",
              text: ""
            }));
            for(var key in res) {
              mod = res[key];
              console.log(mod.name);
              $('#select-module').append($('<option>',{
                value: mod.id,
                text: mod.name
              }));
            }
          }
        });
      }
    });

     $('#select-module').change(function(){
      $('#alink_1').attr("texture-url", "");
      $('#thumblink_1').attr("src","");
      $('#alink_2').attr("texture-url", "");
      $('#thumblink_2').attr("src","");
      router.route('GET', '/modules/:id/components', {module_id: parseInt($(this).val())}, function(err, res) {
        if(!err){
          var i = 0
          for(var key in res) {
            comp = res[key];
            console.log(comp.img_link);
            if(i == 0)
            {
              $('#alink_1').attr("texture-url", comp.img_link);
              $('#thumblink_1').attr("src",comp.img_thumbnail);
            }
            else
            {
              if(i == 1)
              {
                $('#alink_2').attr("texture-url", comp.img_link);
                $('#thumblink_2').attr("src",comp.img_thumbnail);
              }
            }
            i++;

            //console.log(comp.nom);
            //console.log("<div class=\"col-sm-6\" style=\"padding: 3px\"><a href=\"#\" class=\"thumbnail texture-select-thumbnail\" texture-url=\""+comp.img_link+"\" texture-stretch=\"false\" texture-scale=\"300\"><img alt=\"Thumbnail Laine de Verre\" src=\""+comp.img_thumbnail+"\"/></a></div>");
            //$('#gamme-content').append("<div class=\"col-sm-6\" style=\"padding: 3px\"><a href=\"#\" class=\"thumbnail texture-select-thumbnail\" texture-url=\""+comp.img_link+"\" texture-stretch=\"true\" texture-scale=\"300\"><img src=\""+comp.img_thumbnail+"\"/></a></div>")
          }
        }
      });
    });


    if(myStorage.getItem("3Drep") != 'null')
    {
      blueprint3d.model.loadSerialized(myStorage.getItem('3Drep'));
    }
    else
    {
        blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
    }



});
