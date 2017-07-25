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

      function save(data, csrf, bfelog){
          var $messagediv = $('<div>', {id: "bfeditor-messagediv", class:"col-md-10 main"});

          $.ajax({
             url: config.dataURL,
             type: "POST",
             data: JSON.stringify(data),
             csrf: csrf,
             dataType: "json",
	     headers: {
      		'Content-Type':'application/json'
   	     },
             contentType: "application/json; charset=utf-8"
          }).done(function (data) {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
              bfelog.addMsg(new Error(), "INFO", "Saved " + data.id);
              var $messagediv = $('<div>', {id: "bfeditor-messagediv"});
              $messagediv.append('<div class="alert alert-success"><strong>Record Created:</strong><a href='+config.dataURL+data.id+' target="_blank">'+data.name+'</a></div>');
              $('#bfeditor-formdiv').empty();
              $('#save-btn').remove();
              $messagediv.insertBefore('#bfeditor-previewPanel');
              $('#bfeditor-previewPanel').remove();
              bfeditor.bfestore.store = [];
          }).fail(function (XMLHttpRequest, textStatus, errorThrown){
              bfelog.addMsg(new Error(), "ERROR", "FAILED to save");
              bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
              $messagediv.append('<div class="alert _remark-danger"><strong>Save Failed:</strong>'+errorThrown+'</span>');
              $messagediv.insertBefore('#bfeditor-previewPanel');
          }).always(function(){
              $('#table_id').DataTable().ajax.reload();
          });
      }

      function retrieve(url, bfestore, bfelog, callback){
          $.ajax({
              url: url,
              dataType: "json",
              success: function (data) {
                  bfelog.addMsg(new Error(), "INFO", "Fetched external source: " + url);
                  bfelog.addMsg(new Error(), "DEBUG", "Source data", data);
                  bfestore.store = [];
                  bfestore.jsonld2store(data);
                  callback();
                  },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                  bfelog.addMsg(new Error(), "ERROR", "FAILED to load external source: " + url);
                  bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
              }
          });
      }

      function toTripleStore(id, csrf, bfelog){
        var exportUrl = config.toTripleStore.exportURL;
        var dataUrl = config.dataURL+id;
        var rdfData = [];

        $.getJSON(dataUrl, function(result) {
          bfelog.addMsg(new Error(), "INFO", "Got id:" + id + " json data");
          for(var key in result) {
            var value = result[key];
            if(typeof value == 'object') {
              if(value instanceof Array) {
                for(var i = 0; i < value.length; i++) {
                  var item = value[i];
                  rdfData.push(item);
                }
              } else {
                //nada
              }
            } else {
              //nada
            }
          }
        }).done(function() {
          var jsonData = JSON.stringify(rdfData);
	  $.ajax({
            type: 'POST',
            url: 'https://ld4p-loc-bfe-dev.stanford.edu/php/export/export.php',
	    data: {
		'exportUrl': exportUrl,
		'rdfData': jsonData,
		'id': id
	    },
 	    headers: {
		'Access-Control-Allow-Headers': 'x-requested-with',
		'Access-Control-Allow-Origin': '*',
  		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'contentType': 'application/x-www-form-urlencoded'
	    },
            success: function (data) {
              bfelog.addMsg(new Error(), "INFO", "ToTripleStore Result:\n"+ data);
      	      // if (data.indexOf("data modified") > 0) {
      		    //     alert("Successfully posted id " + id + " to triplestore");
      	      // } else {
      		    //     alert("Problem posting to triplestore. Check if you are connected to the Stanford VPN or contact your systems administrator.");
      	      // }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              bfelog.addMsg(new Error(), "ERROR", "FAILED to execute AJAX to export");
              bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
            }
          });
        })
      }

    function loadProfiles(bfelog, profileDir) {
	  	$.ajax({
	    	type: 'GET',
      		url: 'https://ld4p-loc-bfe-dev.stanford.edu/php/import/profiles.php',
 	    		data: {
						'profileDir': profileDir
	    		},
 	   			headers: {
						'Access-Control-Allow-Headers': 'x-requested-with',
						'Access-Control-Allow-Origin': '*',
  					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						'contentType': 'application/x-www-form-urlencoded'
	    		},
      		success: function (data) {
						bfelog.addMsg(new Error(), "INFO", data);
	    		}
    	});
    }

    function profileFiles(profileDir, bfelog) {
      var result;
      $.ajax({
        type: 'GET',
        async:false,
          url: 'https://ld4p-loc-bfe-dev.stanford.edu/php/import/profileFiles.php',
          data: {
            'profileDir': profileDir
          },
          dataType: "json",
          headers: {
            'Access-Control-Allow-Headers': 'x-requested-with',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'contentType': 'application/x-www-form-urlencoded'
          },
          success: function (data) {
            bfelog.addMsg(new Error(), "INFO", "success");
            result = data;
          }
      });
      return result;
    }

    function deleteId(id, csrf, bfelog){
        var url = config.dataURL + id;

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
          // "logging": {
          //     "level": "DEBUG",
          //     "toConsole": true
          // },
          "profileDir": "/opt/app/bibframe/bfe-dev/current/static/profiles/bibframe/",
          "dataURL": "https://ld4p-loc-bfe-dev.stanford.edu/verso/api/bfs/",
          "saveJsonProfile": "http://localhost:8000/bf/static/profiles/bibframe/BIBFRAME 2.0 Serial.json",
          "showLoadDiv":false,
          "baseURI": "http://id.loc.gov/",
          /*"profiles": [
            // e.g.
            "static/profiles/bibframe/BIBFRAME 2.0 Agents.json",
            // currently loaded via php script that reads 'static/profiles/bibframe' file directory
          ],*/
          "startingPoints": [
											{"menuGroup": "Monograph",
                      	"menuItems": [
                          {
                              label: "Instance",
                              useResourceTemplates: [ "profile:bf2:Monograph:Instance" ]
                          },
                          {
                              label: "Work",
                              useResourceTemplates: [ "profile:bf2:Monograph:Work"]
                              //useResourceTemplates: [ "profile:bf2:Monograph:Work", "profile:bf2:Monograph:Expression" ]
                          },
                          {
                              label: "Expression",
                              useResourceTemplates: [ "profile:bf2:Monograph:Expression" ]
                          },
                          {
                              label: "Work, Instance",
                              useResourceTemplates: [ "profile:bf2:Monograph:Work", "profile:bf2:Monograph:Instance" ]
                          },
                          {
                              label: "Work, Expression",
                              //useResourceTemplates: [ "profile:bf2:Monograph:Work", "profile:bf2:Monograph:Expression", "profile:bf2:Monograph:Instance" ]
                              useResourceTemplates: [ "profile:bf2:Monograph:Work", "profile:bf2:Monograph:Expression" ]
                          },
                          {
                              label: "Instance, Expression",
                              useResourceTemplates: [ "profile:bf2:Monograph:Expression", "profile:bf2:Monograph:Instance" ]
                          }
                      ]},
                      /*{"menuGroup": "Monograph",
                      "menuItems": [
                          {
                              label: "Instance",
                              useResourceTemplates: [ "profile:stf:bf:Instance:Monograph" ]
                          },
                          {
                              label: "Work",
                              useResourceTemplates: [ "profile:stf:bf:Work:Monograph", "profile:stf:bf:RDAExpression:Monograph" ]
                          },
                          {
                              label: "Work, Instance",
                              useResourceTemplates: [ "profile:stf:bf:Work:Monograph", "profile:stf:bf:RDAExpression:Monograph", "profile:stf:bf:Instance:Monograph" ]
                          }
                      ]},*/
											{"menuGroup": "Performed Music",
                      "menuItems": [
                          {
                              label: "Work, Instance",
                              type: ["http://id.loc.gov/ontologies/bibframe/Work","http://id.loc.gov/ontologies/bibframe/Instance"],
                              useResourceTemplates: [ "profile:stf:bf:Work:PerformedMusic", "profile:stf:bf:RDAExpression:PerformedMusic", "profile:stf:bf:Instance:PerformedMusic"]
                          },
                          {
                              label: "Event",
                              type: ["http://performedmusicontology.org/ontology/Performance"],
                              useResourceTemplates: ["profile:stf:bf:Performance"]
                          }

                      ]}/*,
                      {"menuGroup": "Notated Music",
                      "menuItems": [
                          {
                              label: "Instance",
                              type: ["http://id.loc.gov/ontologies/Instance"],
                              useResourceTemplates: [ "profile:bf:Instance:NotatedMusic" ]
                          },
                          {
                              label: "Work",
                              type: ["http://id.loc.gov/ontologies/bibframe/Work"],
                              useResourceTemplates: [ "profile:bf:Work:NotatedMusic" ]
                          },
                          {
                              label: "Work, Instance",
                              type: ["http://id.loc.gov/ontologies/bibframe/Work","http://id.loc.gov/ontologies/bibframe/Instance"],
                              useResourceTemplates: [ "profile:bf:Work:NotatedMusic", "profile:bf:RDAExpression:NotatedMusic", "profile:bf:Instance:NotatedMusic"]
                          }

                      ]},
                      {"menuGroup": "Serial",
                      "menuItems": [
                          {
                              label: "Instance",
                              useResourceTemplates: [ "profile:bf:Instance:Serial" ]
                          },
                          {
                              label: "Work",
                              useResourceTemplates: [ "profile:bf:Work:Serial", "profile:bf:RDAExpression:Serial" ]
                          },
                          {
                              label: "Work, Instance",
                              useResourceTemplates: [ "profile:bf:Work:Serial", "profile:bf:RDAExpression:Serial", "profile:bf:Instance:Serial" ]
                          }
                      ]}*/
          ],
          "save": {
              "callback": save
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
          // "load": [
          //     {
          //         "templateID": ["profile:bf:Work:Monograph", "profile:bf:Instance:Monograph", "profile:bf:Annotation:AdminMeta"],
          //         "defaulturi": "http://id.loc.gov/resources/bibs/5226",
          //         "_remark": "Source must be JSONLD expanded, so only jsonp and json are possible requestTypes",
          //         "source": {
          //             "location": "http://localhost:8000/rdf2.json",
          //             "requestType": "json",
          //             "data": "UNUSED, BUT REMEMBER IT"
          //         }
          //     }
          // ],
          "return": {
              "format": "jsonld-expanded",
              "callback": myCB
          },
	  			"loadProfiles": {
	    			"callback": loadProfiles
	  			},
          "profileFiles": {
            "callback": profileFiles
          },
          "toTripleStore": {
            "callback": toTripleStore,
          	"exportURL": "http://sul-ld4p-blazegraph-dev.stanford.edu/blazegraph/namespace/bfe/sparql"
          }
      }
      var bfeditor = bfe.fulleditor(config, "bfeditor");
