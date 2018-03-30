var ie = (function(){
  var undef,
  v = 3,
  div = document.createElement('div'),
  all = div.getElementsByTagName('i');
  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  );
  return v > 4 ? v : undef;
}());
if (ie < 10) {
  $("#iealert").addClass("alert alert-danger");
  $("#iealert").html("Sorry, but the BIBFRAME Editor will not work in IE8 or IE9.")
}
function myCB(data) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getCSRF(){
  //eventually you'll have to login
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      var name = "csrftoken";
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function setCSRF(xhr, settings, csrf) {
  if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
    xhr.setRequestHeader("X-CSRFToken", csrf);
  }
}

function save(data, csrf, bfelog, callback){
  var $messagediv = $('<div>', {id: "bfeditor-messagediv", class:"col-md-10 main"});

  var url = "/verso/api/bfs/upsertWithWhere?where=%7B%22name%22%3A%20%22"+data.name+"%22%7D";

  $.ajax({
    url: url,
    type: "POST",
    data:JSON.stringify(data),
    csrf: csrf,
    dataType: "json",
    contentType: "application/json; charset=utf-8"
  }).done(function (data) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    bfelog.addMsg(new Error(), "INFO", "Saved " + data.id);
    var $messagediv = $('<div>', {id: "bfeditor-messagediv"});
    var decimaltranslator = window.ShortUUID("0123456789");
    var resourceName = "e" + decimaltranslator.fromUUID(data.name);
    $messagediv.append('<div class="alert alert-info"><strong>Description saved:</strong><a href='+data.url+'>'+resourceName+'</a></div>')
    $('#bfeditor-formdiv').empty();
    $('#save-btn').remove();
    $messagediv.insertBefore('.nav-tabs');
    $('#bfeditor-previewPanel').remove();
    $('.nav-tabs a[href="#browse"]').tab('show')
    bfeditor.bfestore.store = [];
    window.location.hash = "";
    callback(true, data.name);
  }).fail(function (XMLHttpRequest, textStatus, errorThrown){
    bfelog.addMsg(new Error(), "ERROR", "FAILED to save");
    bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
    $messagediv.append('<div class="alert alert-danger"><strong>Save Failed:</strong>'+errorThrown+'</span>');
    $messagediv.insertBefore('.nav-tabs');
  }).always(function(){
    $('#table_id').DataTable().ajax.reload();
  });
}

function publish(data, rdfxml, savename, bfelog, callback){
  var $messagediv = $('<div>', {id: "bfeditor-messagediv", class:"col-md-10 main"});

  //var url = "http://mlvlp04.loc.gov:8201/bibrecs/bfe2mets.xqy";
  var url = config.profiles + "/profile-edit/server/publish";
  var saveurl = "/verso/api/bfs/upsertWithWhere?where=%7B%22name%22%3A%20%22"+savename+"%22%7D";

  var savedata = {};
  savedata.name = savename;
  savedata.profile = data.profile;
  savedata.url = data.url;
  savedata.created = data.created;
  savedata.modified = data.modified;
  savedata.status = data.status;
  savedata.rdf = data.rdf;

  data.rdfxml = JSON.stringify(rdfxml);

  $.when(
    $.ajax({
      url: saveurl,
      type: "POST",
      data:JSON.stringify(savedata),
      dataType: "json",
      contentType: "application/json; charset=utf-8"
    }),
    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json; charset=utf-8"
    })).done(function (savedata, publishdata) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      bfelog.addMsg(new Error(), "INFO", "Published " + publishdata[0].name);
      var $messagediv = $('<div>', {id: "bfeditor-messagediv"});
      $messagediv.append('<div class="alert alert-info"><strong>Description submitted for posting:</strong><a href=' + config.basedbURI + "/" + publishdata[0].objid+'>'+publishdata[0].lccn+'</a></div>');
      $('#bfeditor-formdiv').empty();
      $('#save-btn').remove();
      $messagediv.insertBefore('.nav-tabs');
      $('#bfeditor-previewPanel').remove();
      $('.nav-tabs a[href="#browse"]').tab('show')
      bfeditor.bfestore.store = [];
      window.location.hash = "";
      callback(true, data.name);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown){
      bfelog.addMsg(new Error(), "ERROR", "FAILED to save");
      bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
      $messagediv.append('<div class="alert alert-danger"><strong>Save Failed:</strong>'+errorThrown+'</span>');
      $messagediv.insertBefore('#bfeditor-previewPanel');
    }).always(function(){
      $('#table_id').DataTable().ajax.reload();
    });
  }

  function retrieve(uri, bfestore, loadtemplates, bfelog, callback){

    var url = config.profiles + "/profile-edit/server/whichrt";

    $.ajax({
      dataType: "json",
      type: "GET",
      async: false,
      data: { uri: uri},
      url: url,
      success: function (data) {
        bfelog.addMsg(new Error(), "INFO", "Fetched external source baseURI" + url);
        bfelog.addMsg(new Error(), "DEBUG", "Source data", data);
        bfestore.store = bfestore.jsonldcompacted2store(data, function(expanded) {
          bfestore.store = [];
          tempstore = bfestore.jsonld2store(expanded);
          callback(loadtemplates);
        });
        //bfestore.n32store(data, url, tempstore, callback);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        bfelog.addMsg(new Error(), "ERROR", "FAILED to load external source: " + url);
        bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
      }
    });
  }

  function retrieveLDS(uri, bfestore, loadtemplates, bfelog, callback){

    var url = config.profiles + "/profile-edit/server/retrieveLDS";

    $.ajax({
      dataType: "json",
      type: "GET",
      async: false,
      data: { uri: uri},
      url: url,
      success: function (data) {
        bfelog.addMsg(new Error(), "INFO", "Fetched external source baseURI" + url);
        bfelog.addMsg(new Error(), "DEBUG", "Source data", data);
        bfestore.store = bfestore.jsonldcompacted2store(data, function(expanded) {
          bfestore.store = [];
          tempstore = bfestore.jsonld2store(expanded);
          callback(loadtemplates);
        });
        //bfestore.n32store(data, url, tempstore, callback);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        bfelog.addMsg(new Error(), "ERROR", "FAILED to load external source: " + url);
        bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
      }
    });
  }

  function deleteId(id, csrf, bfelog){
    var url = config.url + "/verso/api/bfs/" + id;

    //$.ajaxSetup({
    //    beforeSend: function(xhr, settings){getCSRF(xhr, settings, csrf);}
    //});

    $.ajax({
      type: "DELETE",
      url: url,
      dataType: "json",
      csrf: csrf,
      success: function (data) {
        bfelog.addMsg(new Error(), "INFO", "Deleted " + id);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        bfelog.addMsg(new Error(), "ERROR", "FAILED to delete: " + url);
        bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
      }
    });
  }

  var config = {
    /*            "logging": {
    "level": "DEBUG",
    "toConsole": true
  },*/
  "url" : "http://localhost:3000",
  "baseURI": "http://ld4p.stanford.edu/",
  "basedbURI": "http://mlvlp04.loc.gov:8230",
  "resourceURI": "http://mlvlp04.loc.gov:8230/resources",
  "profiles": [
    "static/profiles/bibframe/BIBFRAME 2.0 Load.json",
    "static/profiles/bibframe/BIBFRAME 2.0 IBC.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Agents Contribution.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Agents.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Agents Primary Contributor.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Aspect Ratio.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Base material and applied material.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Capture information.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Carrier type.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Classification LCC.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Classification Other.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Colour Content.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Content Accessibilitly.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Content Type.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Details of Color.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Digital characteristics.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Extent Statement.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Form.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Frequency.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Geographic Coverage.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Identifiers.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Illustrative Content for Text.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Illustrative Content.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Intended Audience.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Language.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Media type.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Modes of issuance.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Monograph.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Music Distributor Number.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Note, Summary, Contents, Supplementary content.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Place.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Production Method.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Publication, Distribution, Manufacturer, Production Activity.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 RWO.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Script.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Serial.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Series.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Series Lookup.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Sound Content.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Source.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 sSystem requirement.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Status.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 System Requirement.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Title Information.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Try It Out.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Usage and Access Policy.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Video characteristic.json",
    "static/profiles/bibframe/Stanford BIBFRAME 2.0 Video.json",
    "static/profiles/bibframe/PMO Agents Contribution.json",
    "static/profiles/bibframe/PMO Dramatic role, Music part.json",
    "static/profiles/bibframe/PMO Events.json",
    "static/profiles/bibframe/PMO Key and mode, Mode, Tonal Center.json",
    "static/profiles/bibframe/PMO LC Audio CD.json",
    "static/profiles/bibframe/PMO Medium of Performance.json",
    "static/profiles/bibframe/PMO Music mode.json",
    "static/profiles/bibframe/PMO Opus statement.json",
    "static/profiles/bibframe/PMO Pitch center.json",
    "static/profiles/bibframe/PMO Sound characteristics.json",
    "static/profiles/bibframe/PMO Sound Recording.json",
    "static/profiles/bibframe/PMO Tempo.json",
    "static/profiles/bibframe/PMO Thematic Catalog Statement.json"
  ],
  "startingPoints": [
    { "menuGroup": "Monograph",
    "menuItems": [
      {
        label: "Work",
        type: ["http://id.loc.gov/ontologies/bibframe/Work"],
        useResourceTemplates: [ "profile:Stanford:bf2:Monograph:Work"]
      },
      {
        label: "Expression",
        type: ["http://id.loc.gov/ontologies/bibframe/BookFormat"],
        useResourceTemplates: [ "profile:Stanford:bf2:Monograph:Expression" ]
      },
      {
        label: "Instance",
        type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
        useResourceTemplates: [ "profile:Stanford:bf2:Monograph:Instance" ]
      },
      {
        label: "Work, Expression, Instance",
        useResourceTemplates: [ "profile:Stanford:bf2:Monograph:Work", "profile:Stanford:bf2:Monograph:Expression", "profile:Stanford:bf2:Monograph:Instance" ]
      }
    ]
  },
  { "menuGroup": "Notated Music",
  "menuItems": [
      {
        label: "Work",
        type: ["http://id.loc.gov/ontologies/bibframe/Work"],
        useResourceTemplates: [ "profile:bf2:NotatedMusic:Work"]
      },
      {
        label: "Expression",
        type: ["http://id.loc.gov/ontologies/bibframe/MusicNotation"],
        useResourceTemplates: [ "profile:bf2:NotatedMusic:Expression" ]
      },
      {
        label: "Instance",
        type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
        useResourceTemplates: [ "profile:bf2:NotatedMusic:Instance" ]
      },
      {
        label: "Work, Expression, Instance",
        useResourceTemplates: [ "profile:bf2:NotatedMusic:Work", "profile:bf2:NotatedMusic:Expression", "profile:bf2:NotatedMusic:Instance" ]
      }
    ]
  },
  { "menuGroup": "Serial",
  "menuItems": [
      {
        label: "Work",
        type: ["http://id.loc.gov/ontologies/bibframe/Work"],
        useResourceTemplates: [ "profile:Stanford:bf2:Serial:Work" ]
      },
      {
        label: "Expression",
        type: ["http://id.loc.gov/ontologies/bibframe/Serial"],
        useResourceTemplates: [ "profile:Stanford:bf2:Serial:Expression" ]
      },
      {
        label: "Instance",
        type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
        useResourceTemplates: [ "profile:Stanford:bf2:Serial:Instance" ]
      },
      {
        label: "Work, Expression, Instance",
        useResourceTemplates: [ "profile:Stanford:bf2:Serial:Work", "profile:Stanford:bf2:Serial:Expression", "profile:Stanford:bf2:Serial:Instance" ]
      }
    ]
  },
  { "menuGroup": "Video",
  "menuItems": [
      {
        label: "Work",
        type: ["http://id.loc.gov/ontologies/bibframe/Work"],
        useResourceTemplates: [ "profile:bf2:Video:Work" ]
      },
      {
        label: "Expression",
        type: ["http://id.loc.gov/ontologies/bibframe/MovingImage"],
        useResourceTemplates: [ "profile:bf2:Video:Expression" ]
      },
      {
        label: "Instance",
        type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
        useResourceTemplates: [ "profile:bf2:Video:Instance" ]
      },
      {
        label: "Work, Expression, Instance",
        useResourceTemplates: [ "profile:bf2:Video:Work", "profile:bf2:Video:Expression", "profile:bf2:Video:Instance" ]
      }
    ]
  },
  { "menuGroup": "PMO Sound Recording",
  "menuItems": [
      {
        label: "Performance",
        useResourceTemplates: [ "profile:PMO:Event:Performance" ]
      },
      {
        label: "Work",
        type: ["http://id.loc.gov/ontologies/bibframe/Work"],
        useResourceTemplates: [ "profile:PMO:Work" ]
      },
      {
        label: "Expression",
        type: ["http://id.loc.gov/ontologies/bibframe/Audio"],
        useResourceTemplates: [ "profile:PMO:SoundRecording:Expression" ]
      },
      {
        label: "Instance",
        type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
        useResourceTemplates: [ "profile:PMO:SoundRecording:Instance" ]
      },
      {
        label: "Performance, Work, Expression, Instance",
        useResourceTemplates: [ "profile:PMO:Event:Performance", "profile:PMO:Work", "profile:PMO:SoundRecording:Expression", "profile:PMO:SoundRecording:Instance" ]
      }
    ]
  }
],
"save": {
  "callback": save
},
"publish": {
  "callback": publish
},
"retrieveLDS": {
  "callback":retrieveLDS
},
"retrieve": {
  "callback": retrieve
},
"deleteId": {
  "callback": deleteId
},
"getCSRF":{
  "callback": getCSRF
},
/*"load": [
{
"templateID": ["profile:bf:Work:Monograph", "profile:bf:Instance:Monograph", "profile:bf:Annotation:AdminMeta"],
"defaulturi": "http://id.loc.gov/resources/bibs/5226",
"_remark": "Source must be JSONLD expanded, so only jsonp and json are possible requestTypes",
"source": {
"location": "http://id.loc.gov/resources/bibs/5226.bibframe_raw.jsonp",
"requestType": "jsonp",
"data": "UNUSED, BUT REMEMBER IT"
}
}
],*/
"return": {
  "format": "jsonld-expanded",
  "callback": myCB
}
}

var bfeditor = bfe.fulleditor(config, "bfeditor");
