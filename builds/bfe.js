/* bfe 2018-03-30 *//* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Define a module along with a payload
 * @param module a name for the payload
 * @param payload a function to call with (require, exports, module) params
 */

(function() {

var ACE_NAMESPACE = "bfe";

var global = (function() {
    return this;
})();


if (!ACE_NAMESPACE && typeof requirejs !== "undefined")
    return;


var _define = function(module, deps, payload) {
    if (typeof module !== 'string') {
        if (_define.original)
            _define.original.apply(window, arguments);
        else {
            console.error('dropping module because define wasn\'t a string.');
            console.trace();
        }
        return;
    }

    if (arguments.length == 2)
        payload = deps;

    if (!_define.modules) {
        _define.modules = {};
        _define.payloads = {};
    }
    
    _define.payloads[module] = payload;
    _define.modules[module] = null;
};

/**
 * Get at functionality define()ed using the function above
 */
var _require = function(parentId, module, callback) {
    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(parentId, module[i]);
            if (!dep && _require.original)
                return _require.original.apply(window, arguments);
            params.push(dep);
        }
        if (callback) {
            callback.apply(null, params);
        }
    }
    else if (typeof module === 'string') {
        var payload = lookup(parentId, module);
        if (!payload && _require.original)
            return _require.original.apply(window, arguments);

        if (callback) {
            callback();
        }

        return payload;
    }
    else {
        if (_require.original)
            return _require.original.apply(window, arguments);
    }
};

var normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = base + "/" + moduleName;

        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }

    return moduleName;
};

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(parentId, moduleName) {

    moduleName = normalizeModule(parentId, moduleName);

    var module = _define.modules[moduleName];
    if (!module) {
        module = _define.payloads[moduleName];
        if (typeof module === 'function') {
            var exports = {};
            var mod = {
                id: moduleName,
                uri: '',
                exports: exports,
                packaged: true
            };

            var req = function(module, callback) {
                return _require(moduleName, module, callback);
            };

            var returnValue = module(req, exports, mod);
            exports = returnValue || mod.exports;
            _define.modules[moduleName] = exports;
            delete _define.payloads[moduleName];
        }
        module = _define.modules[moduleName] = exports || module;
    }
    return module;
};

function exportAce(ns) {
    var require = function(module, callback) {
        return _require("", module, callback);
    };    

    var root = global;
    if (ns) {
        if (!global[ns])
            global[ns] = {};
        root = global[ns];
    }

    if (!root.define || !root.define.packaged) {
        _define.original = root.define;
        root.define = _define;
        root.define.packaged = true;
    }

    if (!root.require || !root.require.packaged) {
        _require.original = root.require;
        root.require = require;
        root.require.packaged = true;
    }
}

exportAce(ACE_NAMESPACE);

})();

bfe.define('src/bfe', ['require', 'exports', 'module' , 'src/lib/jquery-2.1.0.min', 'src/lib/json', 'src/lib/lodash.min', 'src/lib/bootstrap.min', 'src/lib/typeahead.jquery.min', 'src/bfestore', 'src/bfelogging', 'src/lookups/lcnames', 'src/lookups/lcsubjects', 'src/lookups/lcgenreforms', 'src/lookups/lcworks', 'src/lookups/lcinstances', 'src/lookups/lcorganizations', 'src/lookups/lccountries', 'src/lookups/lcgacs', 'src/lookups/lclanguages', 'src/lookups/lcidentifiers', 'src/lookups/lctargetaudiences', 'src/lookups/iso6391', 'src/lookups/iso6392', 'src/lookups/iso6395', 'src/lookups/rdacontenttypes', 'src/lookups/rdamediatypes', 'src/lookups/rdacarriers','src/lookups/rdamodeissue', 'src/lookups/lcrelators','src/lookups/lcperformanceMediums','src/lookups/rdamusnotation','src/lookups/rdaformatnotemus', 'src/lib/aceconfig'], function(require, exports, module) {
    require("src/lib/jquery-2.1.0.min");
    require("src/lib/json");
    require("src/lib/lodash.min"); // collection/object/array manipulation
    require("src/lib/bootstrap.min"); // modals
    require("src/lib/typeahead.jquery.min");
    // require("lib/rdf_store_min");
    
    var editorconfig = {};
    var bfestore = require("src/bfestore");
    var bfelog = require("src/bfelogging");
    //var store = new rdfstore.Store();
    var profiles = [];
    var resourceTemplates = [];
    var startingPoints = [];
    var formTemplates = [];
    //var lookups = [];
    
    var tabIndices = 1;
    
    var loadtemplates = [];
    var loadtemplatesANDlookupsCount = 0;
    var loadtemplatesANDlookupsCounter = 0;
    
    var lookupstore = [];
    var lookupcache = [];
    
    var editordiv;
    
    var forms = [];
    
    var lookups = {
        "http://id.loc.gov/authorities/names": {
            "name": "LCNAF",
            "load": require("src/lookups/lcnames")
        },
        "http://id.loc.gov/authorities/subjects": {
            "name": "LCSH",
            "load": require("src/lookups/lcsubjects")
        },
        "http://id.loc.gov/authorities/genreForms": {
            "name": "LCGFT",
            "load": require("src/lookups/lcgenreforms")
        },
        "http://id.loc.gov/resources/works": {
            "name": "LC-Works",
            "load": require("src/lookups/lcworks")
        },
        "http://id.loc.gov/resources/instances": {
            "name": "LC-Instances",
            "load": require("src/lookups/lcinstances")
        },
        "http://id.loc.gov/vocabulary/organizations": {
            "name": "Organizations",
            "load": require("src/lookups/lcorganizations")
        },
        "http://id.loc.gov/vocabulary/countries": {
            "name": "Countries",
            "load": require("src/lookups/lccountries")
        },
        "http://id.loc.gov/vocabulary/geographicAreas": {
            "name": "GeographicAreas",
            "load": require("src/lookups/lcgacs")
        },
        "http://id.loc.gov/vocabulary/languages": {
            "name": "Languages",
            "load": require("src/lookups/lclanguages")
        },
        "http://id.loc.gov/vocabulary/identifiers": {
            "name": "Identifiers",
            "load": require("src/lookups/lcidentifiers")
        },
        "http://id.loc.gov/vocabulary/targetAudiences": {
            "name": "Audiences",
            "load": require("src/lookups/lctargetaudiences")
        },
        "http://id.loc.gov/vocabulary/iso639-1": {
            "name": "ISO639-1",
            "load": require("src/lookups/iso6391")
        },
        "http://id.loc.gov/vocabulary/iso639-2": {
            "name": "ISO639-2",
            "load": require("src/lookups/iso6392")
        },
        "http://id.loc.gov/vocabulary/iso639-5": {
            "name": "ISO639-5",
            "load": require("src/lookups/iso6395")
        },
        "http://id.loc.gov/vocabulary/contentTypes": {
            "name": "RDA-Content-Types",
            "load": require("src/lookups/rdacontenttypes")
        },
        "http://id.loc.gov/vocabulary/mediaTypes": {
            "name": "RDA-Media-Types",
            "load": require("src/lookups/rdamediatypes")
        },
        "http://id.loc.gov/vocabulary/carriers": {
            "name": "RDA-Carriers",
            "load": require("src/lookups/rdacarriers")
        },
        "http://id.loc.gov/ml38281/vocabulary/rda/ModeIssue": {
            "name": "RDA-Mode-of-Issuance",
            "load": require("src/lookups/rdamodeissue")
        },
        "http://id.loc.gov/vocabulary/relators": {
            "name": "RDA-Relators",
            "load": require("src/lookups/lcrelators")
        },
        "http://id.loc.gov/authorities/performanceMediums": {
            "name": "Performance-Mediums",
            "load": require("src/lookups/lcperformanceMediums")
        },
        "http://id.loc.gov/ml38281/vocabulary/rda/MusNotation": {
            "name": "RDA-Form-Musical-Notation",
            "load": require("src/lookups/rdamusnotation")
        },
        "http://rdaregistry.info/termList/FormatNoteMus": {
            "name": "RDA-Format-Musical-Notation",
            "load": require("src/lookups/rdaformatnotemus")
        }

    };
    
    /*
    The following two bits of code come from the Ace Editor code base.
    Included here to make 'building' work correctly.  See:
    https://github.com/ajaxorg/ace/blob/master/lib/ace/ace.js
    */
    exports.aceconfig = require("src/lib/aceconfig");
    /**
    * Provides access to require in packed noconflict mode
    * @param {String} moduleName
    * @returns {Object}
    *
    **/
    exports.require = require;
    
    exports.setConfig = function(config) {
                    
        editorconfig = config;
        
        // Set up logging
        bfelog.init(editorconfig);
        
        for (var i=0; i < config.profiles.length; i++) {
            file = config.profiles[i];
            bfelog.addMsg(new Error(), "INFO", "Loading profile: " + config.profiles[i]);
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: file,
                success: function(data) {
                    $("#bfeditor-loader").width($("#bfeditor-loader").width()+5+"%");
                    profiles.push(data);
                    for (var rt=0; rt < data.Profile.resourceTemplates.length; rt++) {
                        resourceTemplates.push(data.Profile.resourceTemplates[rt]);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    bfelog.addMsg(new Error(), "ERROR", "FAILED to load profile: " + file);
                    bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
                }
            });
        }
        
        if (config.lookups !== undefined) {
            loadtemplatesANDlookupsCount = loadtemplatesANDlookupsCount + Object.keys(config.lookups).length;
            for (k in config.lookups) {
                var lu = config.lookups[k];
                bfelog.addMsg(new Error(), "INFO", "Loading lookup: " + lu.load);
                require([lu.load], function(r) {
                    setLookup(r);
                });
            }
        }
        if (editorconfig.baseURI === undefined) {
            editorconfig.baseURI = window.location.protocol + "//" + window.location.host + "/";
        }
        bfelog.addMsg(new Error(), "INFO", "baseURI is " + editorconfig.baseURI);
        
        if (config.load !== undefined) {
            loadtemplatesANDlookupsCount = loadtemplatesANDlookupsCount + config.load.length;
            config.load.forEach(function(l){
                var useguid = guid();
                var loadtemplate = {};
                var tempstore = [];
                loadtemplate.templateGUID = useguid;
                loadtemplate.resourceTemplateID = l.templateID;
                loadtemplate.resourceURI = l.defaulturi;
                loadtemplate.embedType = "page";
                loadtemplate.data = tempstore;
                loadtemplates.push(loadtemplate);
                if (l.source !== undefined && l.source.location !== undefined && l.source.requestType !== undefined) {
                    $.ajax({
                        url: l.source.location,
                        dataType: l.source.requestType,
                        success: function (data) {
                            bfelog.addMsg(new Error(), "INFO", "Fetched external source baseURI" + l.source.location);
                            bfelog.addMsg(new Error(), "DEBUG", "Source data", data);
                            /*
                                OK, so I would /like/ to just use rdfstore here
                                but it is treating literals identified using @value
                                within JSON objects as resources.  It gives them blank nodes.
                                This does not seem right and I don't have time to
                                investigate.
                                So, will parse the JSONLD myself, dagnabbit. 
                                NOTE: it totally expects JSONLD expanded form.
                            */
                            tempstore = bfestore.jsonld2store(data);
                            tempstore.forEach(function(t){
                                if (t.p == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" && t.otype == "uri" && t.s == l.defaulturi.replace('ml38281/', '')) {
                                    t.rtID = l.templateID;
                                }
                            });
                            loadtemplate.data = tempstore;
                            cbLoadTemplates();
                            /*
                            store.load('application/ld+json', data, function(success){
                                if (success) console.log("Loaded data for " + l.defaulturi);
                                var useguid = guid();
                                var loadtemplate = {};
                                var query = 'SELECT * WHERE { <' + l.defaulturi.replace('ml38281/', '') + '> ?p ?o}';
                                console.log("Query is " + query);
                                store.execute(query, function(success, results) {
                                    // process results
                                    if (success) {
                                        console.log(results);
                                        var tempstore = [];
                                        results.forEach(function(t){
                                            var tguid = guid();
                                            var triple = {};
                                            triple.guid = tguid;
                                            if (t.o.value == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                                                triple.rtID = rt.id;
                                            }
                                            triple.s = l.defaulturi.replace('ml38281/', '');
                                            triple.p = t.p.value;
                                            triple.o = t.o.value;
                                            if (t.o.token == "uri") {
                                                triple.otype = "uri";
                                            } else if (t.o.token == "blank") {
                                                triple.otype = "uri";
                                            } else {
                                                triple.otype = "literal";
                                                triple.olang = "en";
                                            }
                                            //console.log(triple);
                                            tempstore.push(triple);
                                        });
                                        loadtemplate.id = useguid;
                                        loadtemplate.rtID = l.templateID;
                                        loadtemplate.defaulturi = l.defaulturi.replace('ml38281/', '');
                                        loadtemplate.data = tempstore;
                                        loadtemplates.push(loadtemplate);
                                        console.log("finished query store");
                                        cbLoadTemplates();
                                    }
                                });
                            });
                            */
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            bfelog.addMsg(new Error(), "ERROR", "FAILED to load external source: " + l.source.location);
                            bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
                        }
                    });
                } else {
                    cbLoadTemplates();
                }
            });
        }

    }
    
    exports.fulleditor = function (config, id) {
        
        editordiv = document.getElementById(id);

        var $menudiv = $('<div>', {id: "bfeditor-menudiv", class: "col-md-2 sidebar"});
        var $formdiv = $('<div>', {id: "bfeditor-formdiv", class: "col-md-10 main"});
        //var optiondiv = $('<div>', {id: "bfeditor-optiondiv", class: "col-md-2"});
        var $rowdiv = $('<div>', {class: "row"});
        
        var $loader = $('<div><br /><br /><h2>Loading...</h2><div class="progress progress-striped active">\
                        <div class="progress-bar progress-bar-info" id="bfeditor-loader" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 20%">\
                            <span class="sr-only">80% Complete</span>\
                        </div>\
                    </div>');
        $formdiv.append($loader);
        $menudiv.append("<h3>Create Resource</h3");
        $rowdiv.append($menudiv);
        $formdiv.append("<h2>Dashboard</h2>", {class: "page-header"});
        $rowdiv.append($formdiv);
        //rowdiv.append(optiondiv);

        $(editordiv).append($rowdiv);
        
        this.setConfig(config);
        
        for (var h=0; h < config.startingPoints.length; h++) {
            var sp = config.startingPoints[h];
            var $menuul = $('<ul>', {class: "nav nav-sidebar"});
            var menuheadingul = null;
            if (typeof sp.menuGroup !== undefined && sp.menuGroup !== "") {
                $menuheading = $('<li><a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">' + sp.menuGroup + '<span class="caret"></span></a></li>');
                $menuheadingul = $('<ul class="dropdown-menu"></ul>');
                $menuheading.append($menuheadingul);
                $menuul.append($menuheading);
            }
            for (var i=0; i < sp.menuItems.length; i++) {
                var $li = $('<li>');
                var $a = $('<a>', {href: "#", id: "sp-" + h + "_" + i});
                $a.html(sp.menuItems[i].label);
                $a.click(function(){
                    menuSelect(this.id);
                });
                $li.append($a);
                if ( $menuheadingul !== null ) {
                    $menuheadingul.append($li);
                } else {
                    $menuul.append($li);
                }
            }
            $menudiv.append($menuul);
        }
    
        // Debug div
        if (editorconfig.logging !== undefined && editorconfig.logging.level !== undefined && editorconfig.logging.level == "DEBUG") {
            var $debugdiv = $('<div id="bfeditor-debugdiv" class="col-md-12 main panel-group">\
                         <div class="panel panel-default"><div class="panel-heading">\
                         <h3 class="panel-title"><a role="button" data-toggle="collapse" href="#debuginfo">Debug output</a></h3></div>\
                         <div class="panel-collapse collapse in" id="debuginfo"><div class="panel-body"><pre id="bfeditor-debug"></pre></div></div></div>\
                         </div>');
            $(editordiv).append($debugdiv);
            var $debugpre = $('#bfeditor-debug');
            $debugpre.html(JSON.stringify(profiles, undefined, " "));
        }
        
        var $footer = $('<footer>', {class: "footer"});
        $(editordiv).append($footer);
        
        if (loadtemplatesANDlookupsCount === 0) {
            // There was nothing to load, so we need to get rid of the loader.
            $formdiv.html("");
        }

        return {
            "profiles": profiles,
            "div": editordiv,
            "bfestore": bfestore,
            "bfelog": bfelog,
        };
    };
    
    exports.editor = function (config, id) {
        
        this.setConfig(config);
        
        editordiv = document.getElementById(id);
        
        var $formdiv = $('<div>', {id: "bfeditor-formdiv", class: "col-md-12"});
        
        //var optiondiv = $('<div>', {id: "bfeditor-optiondiv", class: "col-md-2"});
        
        var $rowdiv = $('<div>', {class: "row"});
        
        $rowdiv.append($formdiv);
        //rowdiv.append(optiondiv);

        $(editordiv).append($rowdiv);
    
        // Debug div
        if (editorconfig.logging !== undefined && editorconfig.logging.level !== undefined && editorconfig.logging.level == "DEBUG") {
            var $debugdiv = $('<div>', {class: "col-md-12"});
            $debugdiv.html("Debug output");
            var $debugpre = $('<pre>', {id: "bfeditor-debug"});
            $debugdiv.append($debugpre);
            $(editordiv).append($debugdiv);
            $debugpre.html(JSON.stringify(profiles, undefined, " "));
        }
        
        var $footer = $('<div>', {class: "col-md-12"});
        $(editordiv).append($footer);

        return {
            "profiles": profiles,
            "div": editordiv,
            "bfestore": bfestore,
            "bfelog": bfelog,
        };
    };
    
    function setLookup(r) {
        if (r.scheme !== undefined) {
            bfelog.addMsg(new Error(), "INFO", "Setting up scheme " + r.scheme);
            var lu = config.lookups[r.scheme];
            lookups[r.scheme] = {};
            lookups[r.scheme].name = lu.name;
            lookups[r.scheme].load = r;
        } else {
            bfelog.addMsg(new Error(), "WARN", "Loading lookup FAILED", r);
        }
        cbLoadTemplates();
    }
    

    // using jQuery
    function getCookie(name) {
        
        $.get("/api/");

        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        
        return cookieValue;
    }   
    
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function cbLoadTemplates() {
        $("#bfeditor-loader").width($("#bfeditor-loader").width()+5+"%");
        loadtemplatesANDlookupsCounter++;
        if (loadtemplatesANDlookupsCounter >= loadtemplatesANDlookupsCount) {
            $("#bfeditor-formdiv").html("");
            if (loadtemplates.length > 0) {
                bfelog.addMsg(new Error(), "DEBUG", "Loading selected template(s)", loadtemplates);
                var form = getForm(loadtemplates);
                $( ".typeahead", form.form ).each(function() {
                    setTypeahead(this);
                });
                var $exitButtonGroup = $('<div class="btn-group pull-right"> \
                    <button id="bfeditor-exitcancel" type="button" class="btn btn-default">Cancel</button> \
                    <button id="bfeditor-exitpreview" type="button" class="btn btn-primary">Preview</button> \
                </div>');
                form.form.append($exitButtonGroup);
                
                $("#bfeditor-exitcancel", form.form).click(function(){
                    $("#bfeditor > .row").remove();
                    $("#bfeditor > .footer").remove();
                    bfeditor = bfe.fulleditor(config, "bfeditor");
                    //cbLoadTemplates();
                });
                $("#bfeditor-exitcancel", form.form).attr("tabindex", tabIndices++);
                
                $("#bfeditor-exitpreview", form.form).click(function(){
                     var humanized = bfeditor.bfestore.store2text();
                     //var n3 = bfeditor.bfestore.store2n3();
                     var jsonld = bfeditor.bfestore.store2jsonldExpanded();
                     document.body.scrollTop = document.documentElement.scrollTop = 0;
                     var $saveButtonGroup = $('<div class="btn-group" id="save-btn"> \
                         <button id="bfeditor-exitback" type="button" class="btn btn-default">Back</button> \
                         <button id="bfeditor-exitsave" type="button" class="btn btn-primary">Save</button> \
                         </div>');

                     var $bfeditor = $('#bfeditor > .row');
                     var $preview = $('<div id="bfeditor-preview" class="col-md-10 main panel-group">\
                         <div class="panel panel-default"><div class="panel-heading">\
                         <h3 class="panel-title"><a role="button" data-toggle="collapse" href="#humanized">Preview</a></h3></div>\
                         <div class="panel-collapse collapse in" id="humanized"><div class="panel-body"><pre>' + humanized + '</pre></div></div>\
                         <div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a role="button" data-toggle="collapse" href="#jsonld">JSONLD-Expanded</a></h3></div>\
                         <div class="panel-collapse collapse in" id="jsonld"><div class="panel-body"><pre>' + JSON.stringify(jsonld, undefined, " ") + '</pre></div></div></div>\
                         </div>');

                     $bfeditor.append($saveButtonGroup);

                     $("#bfeditor-exitback").click(function(){
                        $('#save-btn').remove();
                        $('#bfeditor-preview').remove();
                        $('#bfeditor-formdiv').show();
                     });

                     $("#bfeditor-exitsave").click(function(){

                        if (editorconfig.save.callback !== undefined) {
                            editorconfig.save.callback(bfestore.store2jsonldExpanded(),getCookie('csrftoken') );
                        } else {
                            //save disabled
                           $("#bfeditor > .row").remove();
                           $("#bfeditor > .footer").remove();
                           $("#bfeditor-debugdiv").remove();
                           bfeditor = bfe.fulleditor(config, "bfeditor");
                           var $messagediv = $('<div>', {id: "bfeditor-messagediv"});
                           $messagediv.append('<span class="str"><h3>Save disabled</h3></span>');
                           $('#bfeditor-formdiv').append($messagediv);
                        }
                    });


                $('#bfeditor-formdiv').hide();
                $bfeditor.append($preview);

                });
                $("#bfeditor-exitpreview", form.form).attr("tabindex", tabIndices++);
                
                $("#bfeditor-formdiv").html("");
                $("#bfeditor-formdiv").append(form.form);
                $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
                $("#bfeditor-debug").html(JSON.stringify(bfelog.getLog(), undefined, " "));
            }
        }
    }
    
    function menuSelect (spid) {
        //store = new rdfstore.Store();
        spnums = spid.replace('sp-', '').split("_");
        spoints = editorconfig.startingPoints[spnums[0]].menuItems[spnums[1]];
        
        bfestore.store = [];
        loadtemplatesCounter = 0;
        loadtemplatesCount = spoints.useResourceTemplates.length;
        loadtemplates = [];

        spoints.useResourceTemplates.forEach(function(l){
            var useguid = guid();
            var loadtemplate = {};
            var tempstore = [];
            loadtemplate.templateGUID = useguid;
            loadtemplate.resourceTemplateID = l;
            //loadtemplate.resourceURI = whichrt(loadtemplate, editorconfig.baseURI) + loadTemplate.templateGUID;//editorconfig.baseURI + useguid;
            loadtemplate.embedType = "page";
            loadtemplate.data = tempstore;
            loadtemplates.push(loadtemplate);
            cbLoadTemplates();
        });
    }
    
    /*
    loadTemplates is an array of objects, each with this structure:
        {
            templateguid=guid,
            resourceTemplateID=resourceTemplateID,
            resourceuri="",
            embedType=modal|page
            data=bfestore
        }
    */
    function getForm (loadTemplates) {
        
        var rt;
        var property;
        
        // Create the form object.
        var fguid = guid();
        var fobject = {};
        fobject.id = fguid;
        fobject.store = [];
        fobject.resourceTemplates = [];
        fobject.resourceTemplateIDs = [];
        fobject.formTemplates = [];
        
        // Load up the requested templates, add seed data.
        for (var urt=0; urt < loadTemplates.length; urt++) {
            //console.log(loadTemplates[urt]);
            var rt = _.where(resourceTemplates, {"id": loadTemplates[urt].resourceTemplateID})
            if ( rt !== undefined && rt[0] !== undefined) {
                fobject.resourceTemplates[urt] = JSON.parse(JSON.stringify(rt[0]));
                //console.log(loadTemplates[urt].data);
                fobject.resourceTemplates[urt].data = loadTemplates[urt].data;
                fobject.resourceTemplates[urt].defaulturi = loadTemplates[urt].resourceURI;
                fobject.resourceTemplates[urt].useguid = loadTemplates[urt].templateGUID;
                fobject.resourceTemplates[urt].embedType = loadTemplates[urt].embedType;
                // We need to make sure this resourceTemplate has a defaulturi
                if (fobject.resourceTemplates[urt].defaulturi === undefined) {
                    fobject.resourceTemplates[urt].defaulturi = whichrt(fobject.resourceTemplates[urt], editorconfig.baseURI) + loadTemplates[urt].templateGUID;
                } else {
                    //fobject.resourceTemplates[urt].defaulturi = whichrt(fobject.resourceTemplates[urt], editorconfig.baseURI) + loadTemplates[urt].templateGUID;
                }
                
                fobject.resourceTemplateIDs[urt] = rt[0].id;
            } else {
                bfelog.addMsg(new Error(), "WARN", "Unable to locate resourceTemplate. Verify the resourceTemplate ID is correct.");
            }
        }

        // Let's create the form
        var form = $('<form>', {id: "bfeditor-form-" + fobject.id, class: "form-horizontal", role: "form"});
        var forEachFirst = true;
        fobject.resourceTemplates.forEach(function(rt) {
            bfelog.addMsg(new Error(), "DEBUG", "Creating form for: " + rt.id, rt);
            var $resourcediv = $('<div>', {id: rt.useguid, "data-uri": rt.defaulturi}); // is data-uri used?
            var $resourcedivheading = $('<h3>' + rt.resourceLabel + '</h3>');
            $resourcediv.append($resourcedivheading);
            rt.propertyTemplates.forEach(function(property) {
                
                // Each property needs to be uniquely identified, separate from
                // the resourceTemplate.
                var pguid = guid();
                property.guid = pguid;
                property.display = "true";
                
                var $formgroup = $('<div>', {class: "form-group row"});
                var $saves = $('<div class="form-group row"><div class="btn-toolbar col-sm-12" role="toolbar"></div></div></div>');
                if ((/^http/).test(property.remark))
                    var $label = $('<label for="' + property.guid + '" class="col-sm-3 control-label" title="'+ property.remark + '"><a href="'+property.remark +'" target="_blank">' + property.propertyLabel + '</a></label>');
                else
                    var $label = $('<label for="' + property.guid + '" class="col-sm-3 control-label" title="'+ property.remark + '">' + property.propertyLabel +'</label>');

                
                if (property.type == "literal") {
                    
                    var $input = $('<div class="col-sm-8"><input type="text" class="form-control" id="' + property.guid + '" placeholder="' + property.propertyLabel + '" tabindex="' + tabIndices++ + '"></div>');
        
                    $input.find("input").keyup(function(e) {
                        if (e.keyCode == 54 && e.ctrlKey && e.altKey){
                            var text = this.value;
                            this.value = text+"\u00A9";
                        } else if (e.keyCode == 53 && e.ctrlKey && e.altKey){
                            this.value = this.value + "\u2117";
                        }
                    });
                    
                    $button = $('<div class="btn-group btn-group-md span1"><button type="button" class="btn btn-default" tabindex="' + tabIndices++ + '">&#10133;</button></div>');

                    $button.click(function(){
                        setLiteral(fobject.id, rt.useguid, property.guid);                        
                    });
                    
                    var enterHandler = function(event){
                        if(event.keyCode == 13){
                            setLiteral(fobject.id, rt.useguid, property.guid);
                            if($("#"+property.guid).parent().parent().next().find("input:not('.tt-hint')").length){                                
                                $("#"+property.guid).parent().parent().next().find("input:not('.tt-hint')").focus();
                            } else {
                                $("[id^=bfeditor-modalSave]").focus();
                            }
                        }
                    };

                    $input.keyup(enterHandler);


                    $formgroup.append($label);
                    $input.append($saves);
                    $formgroup.append($input);
                    $formgroup.append($button);
                    //$formgroup.append($saves);
                }
                
                if (property.type == "resource") {
                    
                    if (_.has(property, "valueConstraint")) {
                        if (_.has(property.valueConstraint, "valueTemplateRefs") && !_.isEmpty(property.valueConstraint.valueTemplateRefs)) {
                            /*
                            *  The below gives you a form like Z produced.   Keep for time being.
                            */
                            /*
                            button = $('<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button></div>');
                            ul = $('<ul class="dropdown-menu" role="menu"></ul>');
                            vtRefs = property.valueConstraint.valueTemplateRefs;
                            for ( var v=0; v < vtRefs.length; v++) {
                                var vtrs = vtRefs[v];
                                valueTemplates = _.where(resourceTemplates, {"id": vtrs});
                                if (valueTemplates[0] !== undefined) {
                                    li = $('<li></li>');
                                    a = $('<a href="#">' + valueTemplates[0].resourceLabel + '</a>');
                                    $(a).click(function(){
                                        openModal(rt.guid, property.guid, valueTemplates[0]);
                                    });
                                    li.append(a);
                                    ul.append(li);
                                }
                            }
                            button.append(ul);
                            */
                            $buttondiv = $('<div class="col-sm-8" id="' + property.guid +'"></div>');
                            $buttongrp = $('<div class="btn-group btn-group-md"></div>');
                            var vtRefs = property.valueConstraint.valueTemplateRefs;
                            for ( var v=0; v < vtRefs.length; v++) {
                                var vtrs = vtRefs[v];
                                var valueTemplates = _.where(resourceTemplates, {"id": vtrs});
                                if (valueTemplates[0] !== undefined) {
                                    var vt = valueTemplates[0];
                                    //console.log(vt);
                                    var $b = $('<button type="button" class="btn btn-default" tabindex="' + tabIndices++ + '">' + vt.resourceLabel + '</button>');
                                    
                                    var fid = fobject.id;
                                    var rtid = rt.useguid;
                                    var pid = property.guid;
                                    //var newResourceURI = editorconfig.baseURI + guid();
                                    var newResourceURI = "_:bnode" + guid();
                                    $b.click({fobjectid: fid, newResourceURI: newResourceURI, propertyguid: pid, template: vt}, function(event){
                                        //console.log(event.data.template);
                                        var theNewResourceURI = "_:bnode" + guid();
                                        openModal(event.data.fobjectid, event.data.template, theNewResourceURI/*event.data.newResourceURI*/, event.data.propertyguid, []);
                                    });
                                    $buttongrp.append($b);
                                }
                            }
                            $buttondiv.append($buttongrp);
                            
                            $formgroup.append($label);
                            $buttondiv.append($saves);
                            $formgroup.append($buttondiv);
                            //$formgroup.append($saves);
                        } else if (_.has(property.valueConstraint, "useValuesFrom")) {
                            
                            // Let's supress the lookup unless it is in a modal for now.
                            if (rt.embedType != "modal" && forEachFirst && property.propertyLabel.match(/lookup/i)) {
                                forEachFirst = false;
                                return;
                            }
                                
                            var $inputdiv = $('<div class="col-sm-8"></div>');
                            var $input = $('<input type="text" class="typeahead form-control" data-propertyguid="' + property.guid + '" id="' + property.guid + '" placeholder="' + property.propertyLabel + '" tabindex="' + tabIndices++ + '">');
                            var $input_page = $('<input type="hidden" id="'+property.guid+'_page" class="typeaheadpage" value="1">')
                                
                            $inputdiv.append($input);
                            $inputdiv.append($input_page);


                            $input.on( 'focus', function() {
                            if($(this).val() === '') // you can also check for minLength
                                $(this).data().ttTypeahead.input.trigger('queryChanged', '');
                            });

                            $formgroup.append($label);
                            $inputdiv.append($saves);
                            $formgroup.append($inputdiv);
                            //formgroup.append(button);
                            //$formgroup.append($saves);
                            
                            
                            /*
                            // If the first conditional is active, is this even necessary?
                            if (rt.embedType == "modal" && forEachFirst && property.propertyLabel.match(/lookup/i)) {
                                // This is the first propertty *and* it is a look up.
                                // Let's treat it special-like.
                                var $saveLookup = $('<div class="modal-header" style="text-align: right;"><button type="button" class="btn btn-primary" id="bfeditor-modalSaveLookup-' + fobject.id + '" tabindex="' + tabIndices++ + '">Save changes</button></div>');
                                var $spacer = $('<div class="modal-header" style="text-align: center;"><h2>OR</h2></div>');
                                $formgroup.append($saveLookup);
                                $formgroup.append($spacer);
                            } else {
                                // let's suppress it
                                $input.prop("disabled", true);
                            }
                            */
                            
                            if (rt.embedType == "modal" && forEachFirst && property.propertyLabel.match(/lookup/i)) {
                                // This is the first propertty *and* it is a look up.
                                // Let's treat it special-like.
                                var $saveLookup = $('<div class="modal-header" style="text-align: right;"><button type="button" class="btn btn-primary" id="bfeditor-modalSaveLookup-' + fobject.id + '" tabindex="' + tabIndices++ + '">Save changes</button></div>');
                                var $spacer = $('<div class="modal-header" style="text-align: center;"><h2>OR</h2></div>');
                                $formgroup.append($saveLookup);
                                $formgroup.append($spacer);
                            }
                        
                            
                        } else {
                            // Type is resource, so should be a URI, but there is
                            // no "value template reference" or "use values from vocabularies" 
                            // reference for it so just create label field
                            var $input = $('<div class="col-sm-8"><input class="form-control" id="' + property.guid + '" placeholder="' + property.propertyLabel + '" tabindex="' + tabIndices++ + '"></div>');
                    
                            $button = $('<div class="col-sm-1"><button type="button" class="btn btn-default" tabindex="' + tabIndices++ + '">Set</button></div>');
                            $button.click(function(){
                                setResourceFromLabel(fobject.id, rt.useguid, property.guid);
                            });
                            
                            $formgroup.append($label);
                            $input.append($saves);
                            $formgroup.append($input);
                            $formgroup.append($button);
                            //$formgroup.append($saves);
                    
                        }
                    } else {
                        // Type is resource, so should be a URI, but there is
                        // no constraint for it so just create a label field.
                        var $input = $('<div class="col-sm-8"><input class="form-control" id="' + property.guid + '" placeholder="' + property.propertyLabel + '" tabindex="' + tabIndices++ + '"></div>');
                    
                        $button = $('<div class="col-sm-1"><button type="button" class="btn btn-default" tabindex="' + tabIndices++ + '">Set</button></div>');
                            $button.click(function(){
                                setResourceFromLabel(fobject.id, rt.useguid, property.guid);
                        });
                            
                        $formgroup.append($label);
                        $input.append($saves);
                        $formgroup.append($input);
                        $formgroup.append($button);
                        //$formgroup.append($saves);
                    }
                }
                
                $resourcediv.append($formgroup);
                forEachFirst = false;
            });
            form.append($resourcediv);
        });


        // OK now we need to populate the form with data, if appropriate.
        fobject.resourceTemplates.forEach(function(rt) {
            if (rt.data.length === 0) {
                // Assume a fresh form, no pre-loaded data.
                var id = guid();
                var uri;
                //var uri = editorconfig.baseURI + rt.useguid;
                if (rt.defaulturi !== undefined && rt.defaulturi !== "") {
                    uri = rt.defaulturi;
                } else {
                    uri = editorconfig.baseURI + rt.useguid;
                }
                var triple = {}
                triple.guid = rt.useguid;
                triple.rtID = rt.id;
                triple.s = uri;
                triple.p = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
                triple.o = rt.resourceURI;
                triple.otype = "uri";
                fobject.store.push(triple);
                bfestore.store.push(triple);
                rt.guid = rt.useguid;
                
                rt.propertyTemplates.forEach(function(property) {
                    if (_.has(property, "valueConstraint")) {
                        if (_.has(property.valueConstraint, "valueTemplateRefs") && !_.isEmpty(property.valueConstraint.valueTemplateRefs)) {
                            var vtRefs = property.valueConstraint.valueTemplateRefs;
                            for ( var v=0; v < vtRefs.length; v++) {
                                var vtrs = vtRefs[v];
                                //console.log(rt.resourceURI);
                                //console.log(property.propertyURI);
                                //console.log(vtrs);
                                /*
                                    The following will be true, for example, when two 
                                    profiles are to be rendered in one form.  Say that 
                                    this "property" is "instanceOf" and this "rt" is 
                                    an Instance (e.g. "rt:Instance:ElectronicBook").  
                                    Also a Work (e.g. "rt:Work:EricBook") is to be displayed.
                                    This litle piece of code associates the Instance
                                    with the Work in the store.
                                    Question: if the store is pre-loaded with data,
                                    how do we dedup at this time?
                                */
                                if ( fobject.resourceTemplateIDs.indexOf(vtrs) > -1 && vtrs != rt.id ) {
                                    var relatedTemplates = _.where(bfestore.store, {rtID: vtrs});
                                    triple = {}
                                    triple.guid = guid();
                                    triple.s = uri;
                                    triple.p = property.propertyURI;
                                    triple.o = relatedTemplates[0].s;
                                    triple.otype = "uri";
                                    fobject.store.push(triple);
                                    bfestore.store.push(triple);
                                    property.display = "false";
                                }
                            }
                        }
                    }
                });                
            } else {
                // This will likely be insufficient - we'll need the entire 
                // pre-loaded store in this 'first' form.
                rt.data.forEach(function(t) {
                    var triple = {}
                    triple = t;
                    if ( triple.guid === undefined ) {
                        triple.guid = guid();
                    }
                    fobject.store.push(triple);
                });
            }
            
            // Populate form with pre-loaded data.
            bfelog.addMsg(new Error(), "DEBUG", "Populating form with pre-loaded data, if any");
            rt.propertyTemplates.forEach(function(property) {
                var propsdata = _.where(bfestore.store, {"s": rt.defaulturi, "p": property.propertyURI});
                if (propsdata[0] !== undefined) {
                    // If this property exists for this resource in the pre-loaded data
                    // then we need to make it appear.
                    bfelog.addMsg(new Error(), "DEBUG", "Found pre-loaded data for " + property.propertyURI);
                    propsdata.forEach(function(pd) {
                        var $formgroup = $("#" + property.guid, form).closest(".form-group");
                        var $save = $formgroup.find(".btn-toolbar").eq(0);
                        //console.log(formgroup);
                        var displaydata = "";
                        var triples = [];
                        //console.log("pd.otype is " + pd.otype);
                        if (pd.otype == "uri") {
                            var triples = _.where(bfestore.store, {"s": pd.o});
                            displaydata = pd.o;
                            //console.log("displaydata is " + displaydata);
                            var rtype = "";
                            if (triples.length > 0) {
                                triples.forEach(function(t) {
                                    if ( rtype == "" && t.p == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                                        rtype = t.o;
                                    }
                                    // if "type" matches a resourceTemplate.resourceURI && one of the property.valueConstraint.templates equals that resource template id....
                                    var triplesResourceTemplateID = "";
                                    if ( rtype != "" ) {
                                        if (_.has(property, "valueConstraint")) {
                                            if (_.has(property.valueConstraint, "valueTemplateRefs") && !_.isEmpty(property.valueConstraint.valueTemplateRefs)) {
                                                var resourceTs = _.where(resourceTemplates, {"resourceURI": rtype });
                                                //console.log("Found resourcetemplates for " + rtype);
                                                //console.log(resourceTs);
                                                resourceTs.forEach(function(r) {
                                                    //console.log("Looking for a match with " + r.id);
                                                    if (triplesResourceTemplateID == "" && _.indexOf(property.valueConstraint.valueTemplateRefs, r.id) !== -1) {
                                                        bfelog.addMsg(new Error(), "DEBUG", "Assocating one resource with another from loaded templates");
                                                        //console.log("Found a match in");
                                                        //console.log(property.valueConstraint.valueTemplateRefs);
                                                        //console.log("Associating " + r.id);
                                                        triplesResourceTemplateID = r.id;
                                                        t.rtID = r.id;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    fobject.store.push(t);
                                    if (t.p.match(/label|authorizedAccessPoint/i)) {
                                        displaydata = t.o;
                                    }
                                });
                            }
                        } else {
                            displaydata = pd.o;
                        }
                        if (displaydata == "") {
                            displaydata = pd.s;
                        }
                        triples.push(pd);

                        var bgvars = { 
                            "tguid": pd.guid, 
                            "tlabelhover": displaydata,
                            "tlabel": displaydata,
                            "fobjectid": fobject.id,
                            "inputid": property.guid,
                            "triples": triples
                        };
                        var $buttongroup = editDeleteButtonGroup(bgvars);
                        
                        $save.append($buttongroup);
                        if (property.valueConstraint !== undefined && property.valueConstraint.repeatable !== undefined && property.valueConstraint.repeatable == "false") {
                            var $el = $("#" + property.guid, form);
                            if ($el.is("input")) {
                                $el.prop("disabled", true);
                            } else {
                                //console.log(property.propertyLabel);
                                var $buttons = $("div.btn-group", $el).find("button");
                                $buttons.each(function() {
                                    $( this ).prop("disabled", true);
                                });
                            }
                        }
                    });
                
                } else if (_.has(property, "valueConstraint")) {
                    // Otherwise - if the property is not found in the pre-loaded data
                    // then do we have a default value?
                    if (_.has(property.valueConstraint, "defaultURI") && !_.isEmpty(property.valueConstraint.defaultURI)) {
                        bfelog.addMsg(new Error(), "DEBUG", "Setting default data for " + property.propertyURI);
                        var data = property.valueConstraint.defaultURI;
                        // set the triples
                        var triple = {}
                        triple.guid = guid();
                        if (rt.defaulturi !== undefined && rt.defaulturi !== "") {
                            triple.s = rt.defaulturi;
                        } else {
                            triple.s = editorconfig.baseURI + rt.useguid;
                        }
                        triple.p = property.propertyURI;
                        triple.o = data;
                        triple.otype = "uri";
                        fobject.store.push(triple);
                        bfestore.store.push(triple);
                        
                        //set the label
                        var label = {}
                        label.s = triple.o //http://id.loc.gov/vocabulary/mediaTypes/n
                        label.otype = "literal";
                        label.p = "http://bibframe.org/vocab/label";
                        label.o =  property.valueConstraint.defaultLiteral
                        
                        fobject.store.push(label);
                        bfestore.store.push(label);

                        // set the form
                        var $formgroup = $("#" + property.guid, form).closest(".form-group");
                        var $save = $formgroup.find(".btn-toolbar").eq(0);
                        
                        var display = "";
                        if (_.has(property.valueConstraint, "defaultLiteral")) {
                            display = property.valueConstraint.defaultLiteral;
                        }
                        displaydata = display;
                        var editable = true;
                        if (property.valueConstraint.editable !== undefined && property.valueConstraint.editable === "false") {
                            editable = false;
                        }
                        var bgvars = {
                            "tguid": triple.guid , 
                            "tlabelhover": displaydata,
                            "tlabel": displaydata,
                            "fobjectid": fobject.id,
                            "inputid": property.guid,
                            "editable": editable,
                            "triples": [label]
                        };
                        var $buttongroup = editDeleteButtonGroup(bgvars);
                        $save.append($buttongroup);
                        
                        if (property.valueConstraint.repeatable !== undefined && property.valueConstraint.repeatable == "false") {
                            var $el = $("#" + property.guid, form);
                            if ($el.is("input")) {
                                $el.prop("disabled", true);
                            } else {
                                //console.log(property.propertyLabel);
                                var $buttons = $("div.btn-group", $el).find("button");
                                $buttons.each(function() {
                                    $( this ).prop("disabled", true);
                                });
                            }
                        }
                        
                    }
                }
            });
        });

        forms.push(fobject);

        bfelog.addMsg(new Error(), "DEBUG", "Newly created formobject.", fobject);
        return { formobject: fobject, form: form };
    }
    
    // callingformobjectid is as described
    // loadtemplate is the template objet to load.
    // resourceURI is the resourceURI to assign or to edit
    // inputID is the ID of hte DOM element within the loadtemplate form
    // triples is the base data.
    function openModal(callingformobjectid, loadtemplate, resourceURI, inputID, triples) {
        
        // Modals
        var modal = '<div class="modal fade" id="bfeditor-modal-modalID" tabindex="' + tabIndices++ + '" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
            <div class="modal-dialog"> \
                <div class="modal-content"> \
                    <div class="modal-header"> \
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                        <h4 class="modal-title" id="bfeditor-modaltitle-modalID">Modal title</h4> \
                    </div> \
                    <div class="modal-body" id="bfeditor-modalbody-modalID"></div> \
                    <div class="modal-footer"> \
                        <button type="button" class="btn btn-default" id="bfeditor-modalCancel-modalID" data-dismiss="modal">Cancel</button> \
                        <button type="button" class="btn btn-primary" id="bfeditor-modalSave-modalID">Save changes</button> \
                    </div> \
                </div> \
            </div> \
        </div> '
        
        bfelog.addMsg(new Error(), "DEBUG", "Opening modal for resourceURI " + resourceURI);
        bfelog.addMsg(new Error(), "DEBUG", "inputID of DOM element / property when opening modal: " + inputID);
        bfelog.addMsg(new Error(), "DEBUG", "callingformobjectid when opening modal: " + callingformobjectid);
        
        var useguid = guid();
        var triplespassed = [];
        if (triples.length === 0) {
            // This is a fresh Modal, so we need to seed the data.
            // This happens when one is *not* editing data; it is fresh.
            var callingformobject = _.where(forms, {"id": callingformobjectid});
            callingformobject = callingformobject[0];
            callingformobject.resourceTemplates.forEach(function(t) {
                var properties = _.where(t.propertyTemplates, {"guid": inputID})
                if ( properties[0] !== undefined ) {
                    var triplepassed = {};
                    triplepassed.s = t.defaulturi;
                    triplepassed.p = properties[0].propertyURI; //instanceOF
                    triplepassed.o = resourceURI;
                    triplepassed.otype = "uri";
                    triplespassed.push(triplepassed);
                    
                    triplepassed = {};
                    triplepassed.s = resourceURI;
                    triplepassed.rtID = loadtemplate.id;
                    triplepassed.p = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"; //rdf:type
                    triplepassed.o = loadtemplate.resourceURI;
                    triplepassed.otype = "uri";
                    triplespassed.push(triplepassed);
                }
            });
        } else {
            // Just pass the triples on....
            triplespassed = triples;
        }
        bfelog.addMsg(new Error(), "DEBUG", "triplespassed within modal", triplespassed);
        var form = getForm([{
            templateGUID: useguid,
            resourceTemplateID: loadtemplate.id,
            resourceURI: resourceURI,
            embedType: "modal",
            data: triplespassed
        }]);
        
        var m = modal.replace(/modalID/g, form.formobject.id);
        m = $(m);
        $(editordiv).append(m);

        $('#bfeditor-modalbody-' + form.formobject.id).append(form.form);
        $('#bfeditor-modaltitle-' + form.formobject.id).html(loadtemplate.resourceLabel);
            
        $('#bfeditor-modal-' + form.formobject.id).modal('show');
        $('#bfeditor-modalCancel-' + form.formobject.id).attr("tabindex", tabIndices++);
            
        $('#bfeditor-modalSave-' + form.formobject.id).click(function(){
            triples.forEach(function(triple) {
                removeTriple(callingformobjectid, inputID, null, triple);
            });
            if (form.formobject.store.length <= 2){
                $('#bfeditor-modalSave-' + form.formobject.id).off('click');
                $('#bfeditor-modal-' + form.formobject.id).modal('hide');
            } else {
                setResourceFromModal(callingformobjectid, form.formobject.id, resourceURI, inputID, form.formobject.store);
            }
        });
        $('#bfeditor-modalSave-' + form.formobject.id).attr("tabindex", tabIndices++);
        $('#bfeditor-modalSaveLookup-' + form.formobject.id).click(function(){
            triples.forEach(function(triple) {
                removeTriple(callingformobjectid, inputID, null, triple);
            });
            setResourceFromModal(callingformobjectid, form.formobject.id, resourceURI, inputID, form.formobject.store);
        });
        $('#bfeditor-modal-' + form.formobject.id).on("hide.bs.modal", function(e) {
            $(this).empty();
        });
        
        $( ".typeahead", form.form ).each(function() {
            setTypeahead(this);
        });
                    
        $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
        $("#bfeditor-modal-" + form.formobject.id + " input:not('.tt-hint'):first").focus()
    }
   
    function setResourceFromModal(formobjectID, modalformid, resourceID, propertyguid, data) {
        /*
        console.log("Setting resource from modal");
        console.log("guid of has oether edition: " + forms[0].resourceTemplates[0].propertyTemplates[13].guid);
        console.log("formobjectID is: " + formobjectID);
        console.log("modal form id is: " + modalformid);
        console.log("propertyguid is: " + propertyguid);
        console.log(forms);
        console.log(callingformobject);
        console.log(data);
        */
        bfelog.addMsg(new Error(), "DEBUG", "Setting resource from modal");
        bfelog.addMsg(new Error(), "DEBUG", "modal form id is: " + modalformid);
        var callingformobject = _.where(forms, {"id": formobjectID});
        callingformobject = callingformobject[0];
        callingformobject.resourceTemplates.forEach(function(t) {
            var properties = _.where(t.propertyTemplates, {"guid": propertyguid})
            if ( properties[0] !== undefined ) {

                bfelog.addMsg(new Error(), "DEBUG", "Data from modal: ", data);
                data.forEach(function(t) {
                    callingformobject.store.push(t);
                    bfestore.store.push(t);
                });
                
                bfestore.storeDedup();

                var $formgroup = $("#" + propertyguid, callingformobject.form).closest(".form-group");
                var save = $formgroup.find(".btn-toolbar")[0];
                //console.log(formgroup);
                
                bfelog.addMsg(new Error(), "DEBUG", "Selected property from calling form: " + properties[0].propertyURI);
                tlabel = _.find(data, function(t){ 
                    if (t.p.match(/label|authorizedAccessPoint|^title$|titleValue/i)){
                         return t.o; 
                    } 
                });
                //if there's a lable, use it. Otherwise, create a label fromt the literals, and if no literals, use the uri.
                if ( tlabel !== undefined) {
                    displaydata = tlabel.o;
                    displayuri = tlabel.s;
                } else {
                    for (i in data) {
                        var displaydata;
                        if (data[i].otype === "literal"){
                            if (displaydata === undefined) {
                                displaydata = "";
                            } 
                            displaydata += data[i].o + " ";
                        }
                    }
                    displayuri = data[0].s;
                    if (displaydata === undefined){
                        displaydata = data[0].s;
                    }
                        displaydata.trim();
                }
                
                var connector = _.where(data, {"p": properties[0].propertyURI})
                var bgvars = { 
                        "tguid": connector[0].guid, 
                        "tlabelhover": displaydata,
                        "tlabel": displaydata,
                        "tlabelURI":displayuri,
                        "fobjectid": formobjectID,
                        "inputid": propertyguid,
                        "triples": data
                    };
                var $buttongroup = editDeleteButtonGroup(bgvars);
                    
                $(save).append($buttongroup);
                //$("#" + propertyguid, callingformobject.form).val("");
                if (properties[0].repeatable !== undefined && properties[0].repeatable == "false") {
                    $("#" + propertyguid, callingformobject.form).attr("disabled", true);
                }
                    
            }
        });
        // Remove the form?
        //forms = _.without(forms, _.findWhere(forms, {"id": formobjectID}));
        $('#bfeditor-modalSave-' + modalformid).off('click');
        $('#bfeditor-modal-' + modalformid).modal('hide');
    
        $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
    }
    
    function editDeleteButtonGroup(bgvars) {
        /*
            vars should be an object, structured thusly:
            {
                "tguid": triple.guid,
                "tlabel": tlabel | data
                "fobjectid": formobject.id
                "inputid": inputid,
                triples: []
            }
        */
        
        var $buttongroup = $('<div>', {id: bgvars.tguid, class: "btn-group btn-group-xs"});
        if (!_.isUndefined(bgvars.tlabel)){
          if (bgvars.tlabel.length > 40) {
            display = bgvars.tlabel.substr(0,40) + "...";
          } else  {
            display = bgvars.tlabel;
          }
        } else {
            display = "example";
        }
        
        var $displaybutton = $('<button type="button" class="btn btn-default" title="' + bgvars.tlabelhover + '">'+display+'</button>')
        //check for non-blanknode
        if (bgvars.tlabelURI !== undefined && bgvars.tlabelURI.match("^!_:b")) {
            $displaybutton = $('<button type="button" class="btn btn-default" title="' + bgvars.tlabelhover + '"><a href="'+bgvars.tlabelURI+'">' + display +'</a></button>');
        }
        $buttongroup.append($displaybutton);
        
        if ( bgvars.editable === undefined || bgvars.editable === true ) {
            //var $editbutton = $('<button type="button" class="btn btn-warning">e</button>');
            var $editbutton = $('<button class="btn btn-warning" type="button"> <span class="glyphicon glyphicon-pencil"></span></button>');
            $editbutton.click(function(){
                if (bgvars.triples.length === 1) {
                    editTriple(bgvars.fobjectid, bgvars.inputid, bgvars.triples[0]);
                } else {
                    editTriples(bgvars.fobjectid, bgvars.inputid, bgvars.tguid, bgvars.triples);
                }
            });
            $buttongroup.append($editbutton);
         }
            var $delbutton = $('<button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-trash"></span> </button>');  
//          var $delbutton = $('<button type="button" class="btn btn-danger">x</button>');
            $delbutton.click(function(){
                if (bgvars.triples.length === 1) {
                    removeTriple(bgvars.fobjectid, bgvars.inputid, bgvars.tguid, bgvars.triples[0]);
                } else {
                    removeTriples(bgvars.fobjectid, bgvars.inputid, bgvars.tguid, bgvars.triples);
                }
            });
            $buttongroup.append($delbutton);
        
        
        return $buttongroup;
    }
    
    function setLiteral(formobjectID, resourceID, inputID) {
        var formobject = _.where(forms, {"id": formobjectID});
        formobject = formobject[0];
        //console.log(inputID);
        var data = $("#" + inputID, formobject.form).val();
        if (data !== undefined && data !== "") {
            var triple = {}
            triple.guid = guid();
            formobject.resourceTemplates.forEach(function(t) {
                var properties = _.where(t.propertyTemplates, {"guid": inputID})
                if ( properties[0] !== undefined ) {
                    if (t.defaulturi !== undefined && t.defaulturi !== "") {
                        triple.s = t.defaulturi;
                    } else {
                        triple.s = editorconfig.baseURI + resourceID;
                    }
                    triple.p = properties[0].propertyURI;
                    triple.o = data;
                    triple.otype = "literal";
                    //triple.olang = "";
                    
                    bfestore.store.push(triple);
                    formobject.store.push(triple);
                    
                    var formgroup = $("#" + inputID, formobject.form).closest(".form-group");
                    var save = $(formgroup).find(".btn-toolbar")[0];
                    
                    var bgvars = { 
                        "tguid": triple.guid, 
                        "tlabel": data,
                        "tlabelhover": data,
                        "fobjectid": formobjectID,
                        "inputid": inputID,
                        "triples": [triple]
                    };
                    var $buttongroup = editDeleteButtonGroup(bgvars);
                    
                    $(save).append($buttongroup);
                    $("#" + inputID, formobject.form).val("");
                    if (properties[0].repeatable !== undefined && properties[0].repeatable == "false") {
                        $("#" + inputID, formobject.form).attr("disabled", true);
                    }

                    
                }
            });
        }
        $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
    }
    
    function setResourceFromLabel(formobjectID, resourceID, inputID) {
        var formobject = _.where(forms, {"id": formobjectID});
        formobject = formobject[0];
        //console.log(inputID);
        var data = $("#" + inputID, formobject.form).val();
        if (data !== undefined && data !== "") {
            var triple = {}
            triple.guid = guid();
            formobject.resourceTemplates.forEach(function(t) {
                var properties = _.where(t.propertyTemplates, {"guid": inputID})
                if ( properties[0] !== undefined ) {
                    if (t.defaulturi !== undefined && t.defaulturi !== "") {
                        triple.s = t.defaulturi;
                    } else {
                        triple.s = editorconfig.baseURI + resourceID;
                    }
                    triple.p = properties[0].propertyURI;
                    triple.o = data;
                    triple.otype = "uri";
                    
                    bfestore.store.push(triple);
                    formobject.store.push(triple);
                    
                    var $formgroup = $("#" + inputID, formobject.form).closest(".form-group");
                    var save = $formgroup.find(".btn-toolbar")[0];
                                
                    var bgvars = { 
                        "tguid": triple.guid, 
                        "tlabel": triple.o,
                        "tlabelhover": triple.o,
                        "fobjectid": formobjectID,
                        "inputid": inputID,
                        "triples": [triple]
                    };
                    var $buttongroup = editDeleteButtonGroup(bgvars);
                    
                    $(save).append($buttongroup);
                    $("#" + inputID, formobject.form).val("");
                    if (properties[0].repeatable !== undefined && properties[0].repeatable == "false") {
                        $("#" + inputID, formobject.form).attr("disabled", true);
                    }
                    
                }
            });
        }
        $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
    }
    
    function setTypeahead(input) {
        var form = $(input).closest("form").eq(0);
        var formid = $(input).closest("form").eq(0).attr("id");
        var pageid = $(input).siblings(".typeaheadpage").attr("id");
        formid = formid.replace('bfeditor-form-', '');
        var formobject = _.where(forms, {"id": formid});
        formobject = formobject[0];
        if (typeof(pageid) != "undefined"){
            formobject.pageid = pageid;
        }
        //console.log(formid);
            
        var pguid = $(input).attr("data-propertyguid");
        var p;
        formobject.resourceTemplates.forEach(function(t) {
            var properties = _.where(t.propertyTemplates, {"guid": pguid});
            //console.log(properties);
            if ( properties[0] !== undefined ) {
                p = properties[0];
            }
        });

        var uvfs = p.valueConstraint.useValuesFrom;
        var dshashes = [];
        uvfs.forEach(function(uvf){
        // var lups = _.where(lookups, {"scheme": uvf});
            var lu = lookups[uvf];

            bfelog.addMsg(new Error(), "DEBUG", "Setting typeahead scheme: " + uvf);
            bfelog.addMsg(new Error(), "DEBUG", "Lookup is", lu);
                    
            var dshash = {};
            dshash.name = lu.name;
            dshash.source = function(query, process) {
                lu.load.source(query, process, formobject);
            };
            dshash.templates = { header: '<h3>' + lu.name + '</h3>', footer: '<div id="dropdown-footer" class=".col-sm-1"></div>'};
            dshash.displayKey = 'value';
            dshashes.push(dshash);
        });
        
        bfelog.addMsg(new Error(), "DEBUG", "Data source hashes", dshashes);
        var opts = {
            minLength: 0,
            highlight: true,
            displayKey: 'value'
        };
        if ( dshashes.length === 1) {
            $( input ).typeahead(
                opts,
                dshashes[0]
            );
        } else if ( dshashes.length === 2) {
            $( input ).typeahead(
                opts,
                dshashes[0],
                dshashes[1]
            );
        } else if ( dshashes.length === 3) {
            $( input ).typeahead(
                opts,
                dshashes[0],
                dshashes[1],
                dshashes[2]
            );
        } else if ( dshashes.length === 4) {
            $( input ).typeahead(
                opts,
                dshashes[0],
                dshashes[1],
                dshashes[2],
                dshashes[3]
            );
        } else if ( dshashes.length === 5) {
            $( input ).typeahead(
                opts,
                dshashes[0],
                dshashes[1],
                dshashes[2],
                dshashes[3],
                dshashes[4]
            );
        } else if ( dshashes.length === 6) {
            $( input ).typeahead(
                opts,
                dshashes[0],
                dshashes[1],
                dshashes[2],
                dshashes[3],
                dshashes[4],
                dshashes[5]
            );
        }
        // Need more than 6?  That's crazy talk, man, crazy talk.
        $( input ).on("typeahead:selected", function(event, suggestionobject, datasetname) {            
            bfelog.addMsg(new Error(), "DEBUG", "Typeahead selection made");
            var form = $("#" + event.target.id).closest("form").eq(0);
            var formid = $("#" + event.target.id).closest("form").eq(0).attr("id");
            formid = formid.replace('bfeditor-form-', '');
            //reset page
            $(input).parent().siblings(".typeaheadpage").val(1);
            var resourceid = $(form).children("div").eq(0).attr("id");
            var resourceURI = $(form).find("div[data-uri]").eq(0).attr("data-uri");
                
            var propertyguid = $("#" + event.target.id).attr("data-propertyguid");
            bfelog.addMsg(new Error(), "DEBUG", "propertyguid for typeahead input is " + propertyguid);
                
            var s = editorconfig.baseURI + resourceid;
            var p = "";
            var formobject = _.where(forms, {"id": formid});
            formobject = formobject[0];
            formobject.resourceTemplates.forEach(function(t) {
                var properties = _.where(t.propertyTemplates, {"guid": propertyguid});
                //console.log(properties);
                if ( properties[0] !== undefined ) {
                    p = properties[0];
                }
            });
                
            var lups = _.where(lookups, {"name": datasetname});
            var lu;
            if ( lups[0] !== undefined ) {
                bfelog.addMsg(new Error(), "DEBUG", "Found lookup for datasetname: " + datasetname, lups[0]);
                lu = lups[0].load;
            }
            lu.getResource(resourceURI, p.propertyURI, suggestionobject, function(returntriples) {
                bfelog.addMsg(new Error(), "DEBUG", "Triples returned from lookup's getResource func:", returntriples);
                returntriples.forEach(function(t){
                    if (t.guid === undefined) {
                        var tguid = guid();
                        t.guid = tguid;
                    }
                    formobject.store.push(t);
                    bfestore.store.push(t);
                    
                    // We only want to show those properties that relate to
                    // *this* resource.
                    if (t.s == resourceURI) {
                        formobject.resourceTemplates.forEach(function(rt) {
                            var properties = _.where(rt.propertyTemplates, {"propertyURI": t.p});
                            if ( properties[0] !== undefined ) {
                                var property = properties[0];
                                var pguid = property.guid;
                    
                                var $formgroup = $("#" + pguid, formobject.form).closest(".form-group");
                                var save = $formgroup.find(".btn-toolbar")[0];
                            
                                var tlabel = t.o;
                                if (t.otype == "uri") {
                                    var resourcedata = _.where(returntriples, {"s": t.o});
                                    var bnodes = _.filter(returntriples, function(obj){ return obj.s.match("^_:b")});
                                    resourcedata = resourcedata.concat(bnodes);
                                    var displaytriple = _.find(resourcedata, function(label) {
                                        return label.p.match(/label|^title$|titleValue/i);
                                    });
                                    //check for blanknodes
                                    if (displaytriple !== undefined && displaytriple.o !== undefined && displaytriple.o.match("^_:b")) {
                                        var labelresourcedata = _.where(returntriples, {"s": t.s});
                                        var displaytriple = _.find(labelresourcedata, function(label) {
                                            return label.p.match(/label|authorizedAccessPoint/i);
                                        });
                                        tlabel = displaytriple.o;
                                    } else if (displaytriple !== undefined && displaytriple.o !== undefined) {
                                        tlabel = displaytriple.o;
                                    }

                                }
                            
                                var setTriples = [t];
                                if (resourcedata !== undefined && resourcedata[0] !== undefined) {
                                    setTriples = resourcedata;
                                }
                        



                                var editable = true;
                                if (property.valueConstraint.editable !== undefined && property.valueConstraint.editable === "false") {
                                    editable = false;
                                }
                                var bgvars = { 
                                    "editable": editable,
                                    "tguid": t.guid, 
                                    "tlabel": tlabel,
                                    "tlabelhover": tlabel,
                                    "fobjectid": formobject.id,
                                    "inputid": pguid,
                                    "triples": setTriples
                                };
                                var $buttongroup = editDeleteButtonGroup(bgvars);
                            
                                $(save).append($buttongroup);
                    
                                $("#" + pguid, formobject.form).val("");
                                $("#" + pguid, formobject.form).typeahead('val', "");
                                $("#" + pguid, formobject.form).typeahead('close');
                    
                                if (property.valueConstraint !== undefined && property.valueConstraint.repeatable !== undefined && property.valueConstraint.repeatable == "false") {
                                    var $el = $("#" + pguid, formobject.form)
                                    if ($el.is("input")) {
                                        $el.prop("disabled", true);
                                        $el.css( "background-color", "#EEEEEE" );
                                    } else {
                                        var $buttons = $("div.btn-group", $el).find("button");
                                        $buttons.each(function() {
                                            $( this ).prop("disabled", true);
                                       });
                                    }
                                }
                            }
                        });
                    }
                });
                bfestore.storeDedup();
                $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
            });
        });
    }
    
    function editTriple(formobjectID, inputID, t) {
        var formobject = _.where(forms, {"id": formobjectID});
        formobject = formobject[0];
        bfelog.addMsg(new Error(), "DEBUG", "Editing triple: " + t.guid, t);
        $("#" + t.guid).empty();

        var $el = $("#" + inputID, formobject.form);
        if ($el.is("input") && $el.hasClass( "typeahead" )) {
            var $inputs = $("#" + inputID, formobject.form).parent().find("input[data-propertyguid='" + inputID +"']");
            // is this a hack because something is broken?
            $inputs.each(function() {
                $( this ).prop( "disabled", false );
                $( this ).removeAttr("disabled");
                $( this ).css( "background-color", "transparent" );
            });
        } else if ($el.is("input")) {
            $el.prop( "disabled", false );
            $el.removeAttr("disabled");
            //el.css( "background-color", "transparent" );
        } else {
            var $buttons = $("div.btn-group", $el).find("button");
            $buttons.each(function() {
                $( this ).prop( "disabled", false );
            });
        }

        if ($el.is("input") && t.otype == "literal") {
            $el.val(t.o);
        }
        formobject.store = _.without(formobject.store, _.findWhere(formobject.store, {guid: t.guid}));
        bfestore.store = _.without(bfestore.store, _.findWhere(bfestore.store, {guid: t.guid}));
        $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
    }
    
    function editTriples(formobjectID, inputID, tguid, triples) {
        bfelog.addMsg(new Error(), "DEBUG", "Editing triples", triples);
        var resourceTypes = _.where(triples, {"p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"});
        if (resourceTypes[0] == undefined){
        //try @type?
            resourceTypes = _.where(triples, {"p": "@type"});
        }
        bfelog.addMsg(new Error(), "DEBUG", "Triples represent these resourceTypes", resourceTypes);
        if (resourceTypes[0] !== undefined && typeof resourceTypes[0] !== undefined && resourceTypes[0].rtID !== undefined) {
            // function openModal(callingformobjectid, rtguid, propertyguid, template) {
            var callingformobject = _.where(forms, {"id": formobjectID});
            callingformobject = callingformobject[0];
            
            var templates = _.where(resourceTemplates, {"id": resourceTypes[0].rtID});
            if (templates[0] !== undefined) {
                // The subject of the resource matched with the "type"
                bfelog.addMsg(new Error(), "DEBUG", "Opening modal for editing", triples);
                openModal(callingformobject.id, templates[0], resourceTypes[0].s, inputID, triples);
            }
        } else {
            removeTriples(formobjectID, inputID, tguid, triples);
        }
        
    }
    
    function removeTriple(formobjectID, inputID, tguid, t) {
        var formobject = _.where(forms, {"id": formobjectID});
        formobject = formobject[0];
        if($("#" + t.guid).length && t !== undefined){
          bfelog.addMsg(new Error(), "DEBUG", "Removing triple: " + t.guid, t);
          //$("#" + t.guid).empty();
          $("#" + t.guid).remove();
        } else {
          bfelog.addMsg(new Error(), "DEBUG", "Removing triple: " + tguid);
          //$("#" + tguid).empty();
          $("#" + tguid).remove();
          formobject.store = _.without(formobject.store, _.findWhere(formobject.store, {guid: tguid}));
          bfestore.store = _.without(bfestore.store, _.findWhere(bfestore.store, {guid: tguid}));
        }

        var $el = $("#" + inputID, formobject.form);
        if ($el.is("input") && $el.hasClass( "typeahead" )) {
            var $inputs = $("#" + inputID, formobject.form).parent().find("input[data-propertyguid='" + inputID +"']");
            // is this a hack because something is broken?
            $inputs.each(function() {
                $( this ).prop( "disabled", false );
                $( this ).removeAttr("disabled");
                $( this ).css( "background-color", "transparent" );
            });
        } else if ($el.is("input")) {
            $el.prop( "disabled", false );
            $el.removeAttr("disabled");
            //el.css( "background-color", "transparent" );
        } else {
            var $buttons = $("div.btn-group", $el).find("button");
            $buttons.each(function() {
                $( this ).prop( "disabled", false );
            });
        }
        formobject.store = _.without(formobject.store, _.findWhere(formobject.store, {guid: t.guid}));
        bfestore.store = _.without(bfestore.store, _.findWhere(bfestore.store, {guid: t.guid}));
        $("#bfeditor-debug").html(JSON.stringify(bfestore.store, undefined, " "));
    }
    
    function removeTriples(formobjectID, inputID,tID, triples) {
        bfelog.addMsg(new Error(), "DEBUG", "Removing triples for formobjectID: " + formobjectID + " and inputID: " + inputID, triples);
        triples.forEach(function(triple) {
            removeTriple(formobjectID, inputID, tID, triple);
        });
    }

    /**
    * Generate string which matches python dirhash
    * @returns {String} the generated string
    * @example GCt1438871386
    *  
    */
    function guid() {
        function _randomChoice() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            for (var i = 0; i < 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        return _randomChoice() + _randomChoice() + _randomChoice() + parseInt(Date.now() / 1000);
    }

    function randomChoice() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        for (var i = 0; i < 1; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    function whichrt(rt, baseURI){
        //for resource templates, determine if they are works, instances, or other
        var returnval = "_:bnode";
        
        $.ajax({
            type: "GET",
            async: false,
            cache: true,
            dataType: "json",
            contentType: "application/json",
            url: rt.resourceURI + ".json",
            success: function(data) {
                data.some(function(resource){
                    if(resource["@id"] === rt.resourceURI){
                        if(resource["http://www.w3.org/2000/01/rdf-schema#subClassOf"][0]["@id"] === "http://bibframe.org/vocab/Work" || resource["@id"] === "http://bibframe.org/vocab/Work"){
                            returnval = baseURI + "resources/works/";
                            return returnval;
                        } else if (resource["http://www.w3.org/2000/01/rdf-schema#subClassOf"][0]["@id"] === "http://bibframe.org/vocab/Instance" || resource["@id"] === "http://bibframe.org/vocab/Instance") {
                            returnval = baseURI + "resources/instances/";
                            return returnval;
                        }
                    }
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                bfelog.addMsg(new Error(), "ERROR", "Request status: " + textStatus + "; Error msg: " + errorThrown);
            }
        });

        return returnval;

    }

    
});

bfe.define('src/bfestore', ['require', 'exports', 'module' , 'src/lib/lodash.min'], function(require, exports, module) {
    require("src/lib/lodash.min");

    exports.store = [];
    
    exports.storeDedup = function() {
        exports.store = _.uniq(exports.store, function(t) { 
            if (t.olang !== undefined) {
                return t.s + t.p + t.o + t.otype + t.olang
            } else if (t.odatatype !== undefined) {
                return t.s + t.p + t.o + t.otype + t.odatatype
            } else {
                return t.s + t.p + t.o + t.otype
            }
        });
        return exports.store;
    }
    
    exports.jsonld2store = function(jsonld) {
        jsonld.forEach(function(resource){
            var s = typeof resource["@id"] !== 'undefined' ? resource["@id"] : '_:b' + guid();
            for (var p in resource) {
                if (p !== "@id") {
                    resource[p].forEach(function(o) {
                        var tguid = guid();
                        var triple = {};
                        triple.guid = tguid;
                        triple.s = s;
                        triple.p = p;
                        if (o["@id"] !== undefined) {
                            triple.o = o["@id"];
                            triple.otype = "uri";
                        } else if (o["@value"] !== undefined) {
                            triple.o = o["@value"];
                            triple.otype = "literal";
                            if (o["@language"] !== undefined) {
                                triple.olang = o["@language"];
                            }
                        }
                        exports.store.push(triple);
                        });
                    }
                }
            // If a resource does not have a defined type, do we care?
        });
        return exports.store;
    }

    
    exports.store2jsonldExpanded = function() {
        var json = [];
        exports.storeDedup();
        groupedResources = _.groupBy(exports.store, function(t) { return t.s; });
        for (var resourceURI in groupedResources) {
            var j = {};
            j["@id"] = resourceURI;
            groupedProperties = _.groupBy(groupedResources[resourceURI], function(t) { return t.p; });
            for (var propertyURI in groupedProperties) {
                var prop = propertyURI;
                if (propertyURI == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                    prop = "@type";
                }
                j[prop] = [];
                groupedProperties[propertyURI].forEach(function(r) {
                    if (prop == "@type" && r.otype == "uri") {
                        j[prop].push(r.o);
                    } else if (r.otype == "uri") {
                        j[prop].push({"@id": r.o});
                    } else {
                        var o = {}
                        if (r.olang !== undefined && r.olang !== "") {
                            o["@language"] = r.olang;
                        }
                        if (r.p=="@type"){
                          o = r.o;
                        } else {
                           o["@value"] = r.o;
                        }
                        j[prop].push(o);
                    }
                });
            }
            json.push(j);
        };
        return json;
    }
    
    exports.store2text = function() {
        var nl = "\n";
        var nlindent = nl + "\t";
        var nlindentindent = nl + "\t\t";
        var predata = "";
        var json = exports.store2jsonldExpanded();
        json.forEach(function(resource) {
            predata += nl + "ID: " + resource["@id"];
            if (resource["@type"] !== undefined) {
                predata += nlindent + "Type(s)";
                resource["@type"].forEach(function(t) {
                    //predata += nlindentindent + t["@id"];
                    if(t["@value"] !== undefined){
                        predata += nlindentindent + t["@value"];
                    } else {
                        predata += nlindentindent + t;
                    }
                });
            }
            for (var t in resource) {
                if (t !== "@type" && t !== "@id") {
                    var prop = t.replace("http://bibframe.org/vocab/", "bf:");
                    prop = prop.replace("http://id.loc.gov/vocabulary/relators/", "relators:");
                    prop = prop.replace("http://bibframe.org/vocab2/", "bf2:");
                    prop = prop.replace("http://rdaregistry.info/termList/", "rda");
                    predata += nlindent + prop;
                    resource[t].forEach(function(o) {
                        if (o["@id"] !== undefined) {
                            predata += nlindentindent + o["@id"];
                        } else {
                            predata += nlindentindent + o["@value"];
                        }
                    });
                }
            }
            predata += nl + nl;
        });
        return predata;
    }
    
    /**
    * Generates a GUID string.
    * @returns {String} The generated GUID.
    * @example GCt1438871386
    */
    function guid() {
        function _randomChoice() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            for (var i = 0; i < 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        return _randomChoice() + _randomChoice() + _randomChoice() + parseInt(Date.now() / 1000);
    }

});
bfe.define('src/bfelogging', ['require', 'exports', 'module' ], function(require, exports, module) {

    var level = "INFO";
    var toConsole = true;
    var domain = window.location.protocol + "//" + window.location.host + "/";
    
    exports.log = [];
    
    exports.getLog = function() {
        return exports.log;
    }
    
    exports.init = function(config) {
        if (config.logging !== undefined) {
            if (config.logging.level !== undefined && config.logging.level == "DEBUG") {
                level = config.logging.level;
            }
            if (config.logging.toConsole !== undefined && !config.logging.toConsole) {
                toConsole = config.logging.toConsole;
            }
        }
        var msg = "Logging instantiated: level is " + level + "; log to console is set to " + toConsole;
        exports.addMsg(new Error(), "INFO", msg);
        exports.addMsg(new Error(), "INFO", domain);
    };
    
    // acceptable ltypes are:  INFO, DEBUG, WARN, ERROR
    exports.addMsg = function(error, ltype, data, obj) {
        if (error.lineNumber === undefined && error.fileName === undefined) {
            // Not firefox, so let's try and see if it is chrome
            try {
                var stack = error.stack.split("\n");
                var fileinfo = stack[1].substring(stack[1].indexOf("(") + 1);
                fileinfo = fileinfo.replace(domain, "");
                var infoparts = fileinfo.split(":");
                error.fileName = infoparts[0];
                error.lineNumber = infoparts[1]; 
            } catch(e) {
                // Probably IE.
                error.fileName = "unknown";
                error.lineNumber = "?";     
                
            }
        }
        error.fileName = error.fileName.replace(domain, "");
        if (level == "INFO" && ltype.match(/INFO|WARN|ERROR/)) {
            setMsg(ltype, data, error, obj);
            consoleOut(ltype, data, error, obj);
        } else if (level == "DEBUG")  {
            setMsg(ltype, data, error, obj);
            consoleOut(ltype, data, error, obj);
        }
    };
    
    function consoleOut(ltype, data, error, obj) {
        if (toConsole) {
            console.log(error.fileName + ":" + error.lineNumber + " -> " + data);
            if (typeof data==="object" || data instanceof Array) {
                console.log(data);
            }
            if (obj !== undefined && (typeof obj==="object" || obj instanceof Array)) {
                console.log(obj);
            }
        }
    }
    
    function setMsg(ltype, data, error, obj) {
        var dateTime = new Date();
        var locale = dateTime.toJSON();
        var localestr = dateTime.toLocaleString();
        var entry = {};
        entry.dt = dateTime;
        entry.dtLocaleSort = locale;
        entry.dtLocaleReadable = localestr;
        entry.type = ltype;
        entry.fileName = error.fileName;
        entry.lineNumber = error.lineNumber;
        if (typeof data==="object" || data instanceof Array) {
            entry.msg = JSON.stringify(data);
        } else {
            entry.msg = data;
        }
        if (obj !== undefined && (typeof obj==="object" || obj instanceof Array)) {
            entry.obj = JSON.stringify(obj);
        }
        exports.log.push(entry);
    }

});
bfe.define('src/lookups/lcnames', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    
    var cache = [];
    
    // This var is required because it is used as an identifier.
    exports.scheme = "http://id.loc.gov/authorities/names";

    exports.source = function(query, process, formobject) {
        
        //console.log(JSON.stringify(formobject.store));
        
        var triples = formobject.store;
        
        var type = "";
        var hits = _.where(triples, {"p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
        if ( hits[0] !== undefined ) {
                type = hits[0].o;
            }
        //console.log("type is " + type);
        
        var scheme = "http://id.loc.gov/authorities/names";
        hits = _.where(triples, {"p": "http://bibframe.org/vocab/authoritySource"})
        if ( hits[0] !== undefined ) {
                console.log(hits[0]);
                scheme = hits[0].o;
            }
        //console.log("scheme is " + scheme);
        
        var rdftype = "";
        if ( type == "http://bibframe.org/vocab/Person") {
            rdftype = "rdftype:PersonalName";
        } else if ( type == "http://bibframe.org/vocab/Topic") {
            rdftype = "(rdftype:Topic OR rdftype:ComplexSubject)";
        } else if ( type == "http://bibframe.org/vocab/Place") {
            rdftype = "rdftype:Geographic";
        } else if ( type == "http://bibframe.org/vocab/Organization") {
            rdftype = "rdftype:CorporateName";
        } else if ( type == "http://bibframe.org/vocab/Family") {
            //rdftype = "rdftype:FamilyName";
            rdftype = "rdftype:PersonalName";
        } else if ( type == "http://bibframe.org/vocab/Meeting") {
            rdftype = "rdftype:ConferenceName";
        } else if ( type == "http://bibframe.org/vocab/Jurisdiction") {
            rdftype = "rdftype:CorporateName";
        } else if ( type == "http://bibframe.org/vocab/GenreForm") {
            rdftype = "rdftype:GenreForm";
        }
                
        var q = "";
        if (scheme !== "" && rdftype !== "") {
            q = 'cs:' + scheme + ' AND ' + rdftype;
        } else if (rdftype !== "") {
            q = rdftype;
        } else if (scheme !== "") {
            q = 'cs:' + scheme;
        }
        if (q !== "") {
            q = q + ' AND (' + query + ' OR ' + query + '* OR *' + query + '*)';
        } else {
            q = '(' + query + ' OR ' + query + '* OR *' + query + '*)';
        }
        //console.log('q is ' + q);
        q = encodeURI(q);
        
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            clearTimeout(this.searching);
            process([]);
        }
                
        this.searching = setTimeout(function() {
            if ( query.length > 2 && query.substr(0,1)!='?') {
                suggestquery = query;
                if (rdftype !== "")
                    suggestquery += "&rdftype=" + rdftype.replace("rdftype:", "")

                u = exports.scheme + "/suggest/?q=" + suggestquery + "&count=50";

                //u = exports.scheme + "/suggest/?q=" + query;
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = lcshared.processSuggestions(data, query);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }
                });
            } else if (query.length > 2) {
                u = "http://id.loc.gov/search/?format=jsonp&start=1&count=50&q=" + q.replace("?", "");
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = lcshared.processATOM(data, query);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }
                });
            } else {
                return [];
            }
        }, 300); // 300 ms
        
    }
    
    /*
    
        subjecturi hasAuthority selected.uri
        subjecturi  bf:label selected.value
    */
    exports.getResource = lcshared.getResourceWithAAP;    

});
bfe.define('src/lookups/lcshared', ['require', 'exports', 'module' ], function(require, exports, module) {

    require('https://twitter.github.io/typeahead.js/releases/latest/typeahead.bundle.js');

    /*
        subjecturi propertyuri selected.uri
        selected.uri  bf:label selected.value
    */
    exports.getResource = function(subjecturi, propertyuri, selected, process) {
        var triples = [];

        var triple = {};
        triple.s = subjecturi
        triple.p = propertyuri;
        selected.uri = selected.uri;
        triple.o = selected.uri;
        triple.otype = "uri";
        triples.push(triple);

        triple = {};
        triple.s = selected.uri;
        triple.p = "http://bibframe.org/vocab/label";
        triple.o = selected.value;
        triple.otype = "literal";
        triple.olang = "en";
        triples.push(triple);

        return process(triples);
     }
    
    exports.getResourceWithAAP = function(subjecturi, propertyuri, selected, process) {
        var triples = [];
        
        var triple = {};
        triple.s = subjecturi
        triple.p = propertyuri;
        triple.o = selected.uri;
        triple.otype = "uri";
        triples.push(triple);
        
        triple = {};
        triple.s = subjecturi;
        triple.p = "http://bibframe.org/vocab/authorizedAccessPoint";
        triple.o = selected.value;
        triple.otype = "literal";
        triple.olang = "en";
        triples.push(triple);
        
        triple = {};
        triple.s = subjecturi;
        triple.p = "http://bibframe.org/vocab/label";
        triple.o = selected.value;
        triple.otype = "literal";
        triple.olang = "en";
        triples.push(triple);

        process(triples);    
    }
    
    exports.getResourceLabelLookup = function(subjecturi, propertyuri, selected, process) {
        var triples = [];
        
        var triple = {};
        triple.s = subjecturi
        triple.p = propertyuri;
        triple.o = selected.uri;
        triple.otype = "uri";
        triples.push(triple);
          //add label
        $.ajax({
            url: selected.uri + ".jsonp",
            dataType: "jsonp",
            success: function (data) {
                data.forEach(function(resource){
                    if (resource["@id"] === selected.uri){
                                var label = {};
                                label.s = selected.uri;
                                label.otype = "literal";
                                label.p = "http://bibframe.org/vocab/label";
                                label.o = resource["http://www.loc.gov/standards/mads/rdf/v1#authoritativeLabel"][0]["@value"];
                                triples.push(label);
                                return process(triples);
                    }
                });
            }
        });
    }

    exports.processJSONLDSuggestions = function (suggestions,query,scheme) {
        var typeahead_source = [];
        if (suggestions['@graph'] !== undefined) {
            for (var s = 0; s < suggestions['@graph'].length; s++) {
                if(suggestions['@graph'][s]['skos:inScheme'] !==undefined){
                    if (suggestions['@graph'][s]['@type'] === 'skos:Concept' && suggestions['@graph'][s]['skos:inScheme']['@id'] === scheme){
                        if (suggestions['@graph'][s]['skos:prefLabel'].length !== undefined){
                            for (var i = 0; i < suggestions['@graph'][s]['skos:prefLabel'].length; i++) {
                                if (suggestions['@graph'][s]['skos:prefLabel'][i]['@language'] === "en") {
                                    var l = suggestions['@graph'][s]['skos:prefLabel'][i]['@value'];
                                    break;
                                }
                            }
                        } else {
                            var l = suggestions['@graph'][s]['skos:prefLabel']['@value'];
                        }
                        var u = suggestions['@graph'][s]['@id'];
                        typeahead_source.push({
                            uri: u,
                            value: l
                        });
                    }
                }
            }
        }
        if (typeahead_source.length === 0) {
            typeahead_source[0] = {
                uri: "",
                value: "[No suggestions found for " + query + ".]"
            };
        }
            return typeahead_source;
    }
    
    exports.processSuggestions = function(suggestions, query) {
        var typeahead_source = [];
        if ( suggestions[1] !== undefined ) {
            for (var s=0; s < suggestions[1].length; s++) {
                var l = suggestions[1][s];
                var u = suggestions[3][s];
                typeahead_source.push({ uri: u, value: l });
            }
        }
        if (typeahead_source.length === 0) {
            typeahead_source[0] = { uri: "", value: "[No suggestions found for " + query + ".]" };
        }
        //console.log(typeahead_source);
        //$("#dropdown-footer").text('Total Results:' + suggestions.length);
        return typeahead_source;
    }
    
    exports.processATOM = function(atomjson, query) {
        var typeahead_source = [];
        for (var k in atomjson) {
            if (atomjson[k][0] == "atom:entry") {
                var t = "";
                var u = "";
                var source = "";
                for (var e in atomjson[k] ) {
                    if (atomjson[k][e][0] == "atom:title") {
                        t = atomjson[k][e][2];
                    }
                    if (atomjson[k][e][0] == "atom:link") {
                        u = atomjson[k][e][1].href;
                        source = u.substr(0, u.lastIndexOf('/'));
                    }
                    if ( t !== "" && u !== "") {
                        typeahead_source.push({ uri: u, source: source, value: t });
                        break;
                    }
                }
            }
        }
        if (typeahead_source.length === 0) {
            typeahead_source[0] = { uri: "", value: "[No suggestions found for " + query + ".]" };
        }
        //console.log(typeahead_source);
        return typeahead_source;
    }

    exports.simpleQuery=function(query, cache, scheme, process) {
        console.log('q is ' + query);
        q = encodeURI(query);
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            clearTimeout(this.searching);
            process([]);
        }
        this.searching = setTimeout(function() {
            
            if ( query === '' || query === ' ') {
                u = scheme + "/suggest/?count=100&q=";
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = exports.processSuggestions(data, "");
                        return process(parsedlist);
                    }
                });
            } else if ( query.length >= 1 ) {
                u = scheme + "/suggest/?q=" + q;
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = exports.processSuggestions(data, query);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }
                });
            } else {
                return [];
            }
        }, 300); // 300 ms

    }

});
bfe.define('src/lookups/lcsubjects', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    
    var cache = [];

    exports.scheme = "http://id.loc.gov/authorities/subjects";

    exports.source = function(query, process, formobject) {
        //console.log(JSON.stringify(formobject.store));
        
        var triples = formobject.store;
        
        var type = "";
        var hits = _.where(triples, {"p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
        if ( hits[0] !== undefined ) {
                type = hits[0].o;
            }
        //console.log("type is " + type);
        
        var scheme = "http://id.loc.gov/authorities/subjects";
        hits = _.where(triples, {"p": "http://bibframe.org/vocab/authoritySource"})
        if ( hits[0] !== undefined ) {
                //console.log(hits[0]);
                scheme = hits[0].o;
            }
        //console.log("scheme is " + scheme);
        
        var rdftype = "";
        if ( type == "http://bibframe.org/vocab/Person") {
            rdftype = "rdftype:PersonalName";
        } else if ( type == "http://bibframe.org/vocab/Topic") {
            rdftype = "(rdftype:Topic OR rdftype:ComplexSubject)";
        } else if ( type == "http://bibframe.org/vocab/Place") {
            rdftype = "rdftype:Geographic";
        } else if ( type == "http://bibframe.org/vocab/Organization") {
            rdftype = "rdftype:CorporateName";
        } else if ( type == "http://bibframe.org/vocab/Family") {
            //rdftype = "rdftype:FamilyName";
            rdftype="rdftype:PersonalName";
        } else if ( type == "http://bibframe.org/vocab/Meeting") {
            rdftype = "rdftype:ConferenceName";
        } else if ( type == "http://bibframe.org/vocab/Jurisdiction") {
            rdftype = "rdftype:CorporateName";
        } else if ( type == "http://bibframe.org/vocab/GenreForm") {
            rdftype = "rdftype:GenreForm";
        }
                
        var q = "";
        if (scheme !== "" && rdftype !== "") {
            q = 'cs:' + scheme + ' AND ' + rdftype;
        } else if (rdftype !== "") {
            q = rdftype;
        } else if (scheme !== "") {
            q = 'cs:' + scheme;
        }
        if (q !== "") {
            q = q + ' AND (' + query + ' OR ' + query + '* OR *' + query + '*)';
        } else {
            q = '(' + query + ' OR ' + query + '* OR *' + query + '*)';
        }
        //console.log('q is ' + q);
        q = encodeURI(q);
        
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            clearTimeout(this.searching);
            process([]);
        }
                
        this.searching = setTimeout(function() {
            if ( query.length > 2 && query.substr(0,1)!="?") {
                suggestquery = query;
                if (rdftype !== "")
                    suggestquery += "&rdftype=" + rdftype.replace("rdftype:", "")

                u = exports.scheme + "/suggest/?q=" + suggestquery;
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = lcshared.processSuggestions(data, query);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }
                });
            } else if (query.length > 2) {
                u = "http://id.loc.gov/search/?format=jsonp&start=1&count=10&q=" + q.replace("?", "");
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = lcshared.processATOM(data, query);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }
                });
            } else {
                return [];
            }
        }, 300); // 300 ms
        
    }
    
    /*
    
        subjecturi hasAuthority selected.uri
        subjecturi  bf:label selected.value
    */
    exports.getResource = lcshared.getResourceWithAAP;

});
bfe.define('src/lookups/lcgenreforms', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    
    var cache = [];

    exports.scheme = "http://id.loc.gov/authorities/genreForms";

    exports.source = function(query, process) {
        var scheme = "http://id.loc.gov/authorities/genreForms";
        var rdftype = "rdftype:GenreForm";
                
        var q = "";
        if (scheme !== "" && rdftype !== "") {
            q = 'cs:' + scheme + ' AND ' + rdftype;
        } else if (rdftype !== "") {
            q = rdftype;
        } else if (scheme !== "") {
            q = 'cs:' + scheme;
        }
        if (q !== "") {
            q = q + ' AND (' + query + ' OR ' + query + '* OR *' + query + '*)';
        } else {
            q = '(' + query + ' OR ' + query + '* OR *' + query + '*)';
        }
        console.log('q is ' + q);
        q = encodeURI(q);
        
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            console.log("searching defined");
            clearTimeout(this.searching);
            process([]);
        }
        //lcgft
        this.searching = setTimeout(function() {
            if ( query.length > 2 ) {
                suggestquery = query;
                if (rdftype !== "")
                    suggestquery += "&rdftype=" + rdftype.replace("rdftype:", "")

                u = scheme + "/suggest/?q=" + suggestquery;

                //u = "http://id.loc.gov/authorities/genreForms/suggest/?q=" + query;
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        parsedlist = lcshared.processSuggestions(data, query);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }

                });
            } else {
                return [];
            }
        }, 300); // 300 ms
        
    }
    
    exports.getResource = lcshared.getResourceWithAAP;

});
bfe.define('src/lookups/lcworks', ['require', 'exports', 'module' ], function(require, exports, module) {
    //require("staticjs/jquery-1.11.0.min");
    //require("lib/typeahead.jquery.min");

    // Using twitter's typeahead, store may be completely unnecessary
    var cache = [];
    
    exports.scheme = "http://id.loc.gov/resources/works";

    exports.source = function(query, process, formobject) {
        
        var pageobj =  $('#'+formobject.pageid);
        var page = pageobj.val() != undefined ? parseInt(pageobj.val()) : 1;
        var triples = formobject.store;
        
        var type = "";
        var hits = _.where(triples, {"p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
        if ( hits[0] !== undefined ) {
                type = hits[0].o;
            }
        //console.log("type is " + type);
        
        var scheme = "http://id.loc.gov/resources/works";
        hits = _.where(triples, {"p": "http://bibframe.org/vocab/authoritySource"})
        if ( hits[0] !== undefined ) {
                console.log(hits[0]);
                scheme = hits[0].o;
            }
        //console.log("scheme is " + scheme);
        
        //var rdftype = "rdftype:Instance";
        var rdftype = "";
                
        var q = "";
        if (scheme !== "" && rdftype !== "") {
            q = 'cs:' + scheme + '&q=' + rdftype;
        } else if (rdftype !== "") {
            q = rdftype;
        } else if (scheme !== "") {
            q = 'cs:' + scheme;
        }
        //q = query + " " + q;
        q = q + "&q=scheme:/bibframe&q="+query;
        //console.log('q is ' + q);
        q = encodeURI(q);
        
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            clearTimeout(this.searching);
            process([]);
        }
        
        this.searching = setTimeout(function(formobject) {
            if ( query.length > 2 ) {
                //u = "http://id.loc.gov/ml38281/search/?format=jsonp&start="+page+"&count=50&q=" + q;
                u = "http://id.loc.gov/ml38281/search/?format=jsonp&start=1&count=50&q="+q;
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        pageobj.val(page+10);
                        //console.log(data);
                        //alert(data);
                        parsedlist = processATOM(data, query);
                        // save result to cache, remove next line if you don't want to use cache
                        cache[q] = parsedlist;
                        // only search if stop typing for 300ms aka fast typers
                        //console.log(parsedlist);
                        //process(parsedlist);
                        return process(parsedlist);
                    }
                });
            } else {
                return [];
            }
        }, 300); // 300 ms
        //return searching;
        
    }
    
    /*
    
        subjecturi hasAuthority selected.uri
        subjecturi  bf:label selected.value
    */
    exports.getResource = function(subjecturi, propertyuri, selected, process) {
        var triples = [];
        
        var triple = {};
        triple.s = subjecturi;
        triple.p = propertyuri;
        triple.o = selected.uri;
        triple.otype = "uri";
        triples.push(triple);
        
        triple = {};
        triple.s = subjecturi
        triple.p = "http://bibframe.org/vocab/authorizedAccessPoint";
        triple.o = selected.value;
        triple.otype = "literal";
        triple.olang = "en";
        triples.push(triple);
        
        triple = {};
        triple.s = selected.uri;
        triple.p = "http://bibframe.org/vocab/label";
        triple.o = selected.value;
        triple.otype = "literal";
        triple.olang = "en";
        triples.push(triple);

//        process(triples);

        /*
        If you wanted/needed to make another call.
        */
        var u = selected.uri.replace(/gov\/resources/, 'gov/ml38281/resources') + ".bibframe_raw.jsonp";
        var primaryuri = "<" + selected.uri + ">";
        $.ajax({
            url: u,
            dataType: "jsonp",
            success: function (data) {
                data.forEach(function(resource){
                    var s = resource["@id"];
                    for (var p in resource) {
                        if (p !== "@id") {
                            resource[p].forEach(function(o) {
                                //if ( s !== selected.uri && p !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                                    var triple = {};
                                    triple.s = s;
                                    triple.p = p;
                                    if (o["@id"] !== undefined) {
                                        triple.o = o["@id"];
                                        triple.otype = "uri";
                                    } else if (o["@value"] !== undefined) {
                                        triple.o = o["@value"];
                                        triple.otype = "literal";
                                        if (o["@language"] !== undefined) {
                                            triple.olang = o["@language"];
                                        }
                                    } else {
                                        triple.o = o;
                                    }
                                    triples.push(triple);
                                //}
                            });
                        }
                    }
                });
                //console.log(triples);
                process(triples);
            }
        });
    }
    
    function processATOM(atomjson, query) {
        var typeahead_source = [];
        for (var k in atomjson) {
            if (atomjson[k][0] == "atom:entry") {
                var t = "";
                var u = "";
                var source = "";
                for (var e in atomjson[k] ) {
                    //alert(atomjson[k][e]);
                    if (atomjson[k][e][0] == "atom:title") {
                        //alert(atomjson[k][e][2]);
                        t = atomjson[k][e][2];
                    }
                    if (atomjson[k][e][0] == "atom:link") {
                        //alert(atomjson[k][e][2]);
                        u = atomjson[k][e][1].href;
                        source = u.substr(0, u.lastIndexOf('/'));
                    }
                    if ( t !== "" && u !== "") {
                        typeahead_source.push({ uri: u, source: source, value: t });
                        break;
                    }
                }
            }
        }
        //alert(suggestions);
        if (typeahead_source.length === 0) {
            typeahead_source[0] = { uri: "", value: "[No suggestions found for " + query + ".]" };
        }
        //console.log(typeahead_source);
        return typeahead_source;
    }

});//bfe.define("lcnames", [], function() {
bfe.define('src/lookups/lcinstances', ['require', 'exports', 'module' ], function(require, exports, module) {
    //require("staticjs/jquery-1.11.0.min");
    //require("lib/typeahead.jquery.min");

    // Using twitter's typeahead, store may be completely unnecessary
    var cache = [];
    
    exports.scheme = "http://id.loc.gov/resources/instances";

    exports.source = function(query, process, formobject) {

        var triples = formobject.store;
        
        var type = "";
        var hits = _.where(triples, {"p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
        if ( hits[0] !== undefined ) {
                console.log(hits[0]);
                type = hits[0].o;
            }
        //console.log("type is " + type);
        
        var scheme = "http://id.loc.gov/ml38281/resources/instances";
        hits = _.where(triples, {"p": "http://bibframe.org/vocab/authoritySource"})
        if ( hits[0] !== undefined ) {
                console.log(hits[0]);
                scheme = hits[0].o;
            }
        //console.log("scheme is " + scheme);
        
        //var rdftype = "rdftype:Instance";
        var rdftype = "";
                
        var q = "";
        if (scheme !== "" && rdftype !== "") {
            q = 'cs:' + scheme + '&q=' + rdftype;
        } else if (rdftype !== "") {
            q = rdftype;
        } else if (scheme !== "") {
            q = 'cs:' + scheme;
        }
        //q = q + " " + query
        q = q + "&q=scheme:/bibframe&q="+query;
        //console.log('q is ' + q);
        q = encodeURI(q);
        
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            clearTimeout(this.searching);
            process([]);
        }
                
        this.searching = setTimeout(function() {
            if ( query.length > 2 ) {
                u = "http://id.loc.gov/ml38281/search/?format=jsonp&start=1&count=10&q=" + q;
                $.ajax({
                    url: u,
                    dataType: "jsonp",
                    success: function (data) {
                        //console.log(data);
                        //alert(data);
                        parsedlist = processATOM(data, query);
                        // save result to cache, remove next line if you don't want to use cache
                        cache[q] = parsedlist;
                        // only search if stop typing for 300ms aka fast typers
                        //console.log(parsedlist);
                        return process(parsedlist);
                    }
                });
            } else {
                return [];
            }
        }, 300); // 300 ms
        
        //return searching;
        
    }
    
    /*
    
        subjecturi hasAuthority selected.uri
        subjecturi  bf:label selected.value
    */
    exports.getResource = function(subjecturi, propertyuri, selected, process) {
        var triples = [];
        
        var triple = {};
        triple.s = subjecturi
        triple.p = propertyuri;
        triple.o = selected.uri;
        triple.otype = "uri";
        triples.push(triple);
        
        triple = {};
        triple.s = subjecturi
        triple.p = "http://bibframe.org/vocab/authorizedAccessPoint";
        triple.o = selected.value;
        triple.otype = "literal";
        triple.olang = "en";
        triples.push(triple);
        
        /*
        If you wanted/needed to make another call.
        */
        var u = selected.uri.replace(/gov\/resources/, 'gov/ml38281/resources') + ".bibframe_raw.jsonp";
        var primaryuri = "<" + selected.uri + ">";
        $.ajax({
            url: u,
            dataType: "jsonp",
            success: function (data) {
                data.forEach(function(resource){
                    var s = resource["@id"];
                    for (var p in resource) {
                        if (p !== "@id") {
                            resource[p].forEach(function(o) {
                                //if ( s !== selected.uri && p !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                                    var triple = {};
                                    triple.s = s;
                                    triple.p = p;
                                    if (o["@id"] !== undefined) {
                                        triple.o = o["@id"];
                                        triple.otype = "uri";
                                    } else if (o["@value"] !== undefined) {
                                        triple.o = o["@value"];
                                        triple.otype = "literal";
                                        if (o["@language"] !== undefined) {
                                            triple.olang = o["@language"];
                                        }
                                    }
                                    triples.push(triple);
                                //}
                            });
                        }
                    }
                });
                console.log(triples);
                process(triples);
            }
        });
    }
    
    function processATOM(atomjson, query) {
        var typeahead_source = [];
        for (var k in atomjson) {
            if (atomjson[k][0] == "atom:entry") {
                var t = "";
                var u = "";
                var source = "";
                for (var e in atomjson[k] ) {
                    //alert(atomjson[k][e]);
                    if (atomjson[k][e][0] == "atom:title") {
                        //alert(atomjson[k][e][2]);
                        t = atomjson[k][e][2];
                    }
                    if (atomjson[k][e][0] == "atom:link") {
                        //alert(atomjson[k][e][2]);
                        u = atomjson[k][e][1].href;
                        source = u.substr(0, u.lastIndexOf('/'));
                    }
                    if ( t !== "" && u !== "") {
                        typeahead_source.push({ uri: u, source: source, value: t });
                        break;
                    }
                }
            }
        }
        //alert(suggestions);
        if (typeahead_source.length === 0) {
            typeahead_source[0] = { uri: "", value: "[No suggestions found for " + query + ".]" };
        }
        //console.log(typeahead_source);
        return typeahead_source;
    }

});
bfe.define('src/lookups/lcorganizations', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/organizations";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }
    
    exports.getResource = lcshared.getResourceWithAAP;

});
bfe.define('src/lookups/lccountries', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/countries";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/lcgacs', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/geographicAreas";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/lclanguages', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/languages";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/lcidentifiers', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/identifiers";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/lctargetaudiences', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/targetAudiences";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;
});
bfe.define('src/lookups/iso6391', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/iso639-1";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/iso6392', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/iso639-2";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/iso6395', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/iso639-5";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/rdacontenttypes', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/contentTypes";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/rdamediatypes', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/mediaTypes";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/rdacarriers', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/vocabulary/carriers";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }
    
    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/rdamodeissue', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];
    
    exports.scheme = "http://id.loc.gov/ml38281/vocabulary/rda/ModeIssue";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }    
//"[{"uri":"http://id.loc.gov/vocabulary/rda/ModeIssue/1004","value":"integrating resource"},{"uri":"http://id.loc.gov/vocabulary/rda/ModeIssue/1002","value":"multipart monograph"},{"uri":"http://id.loc.gov/vocabulary/rda/ModeIssue/1003","value":"serial"},{"uri":"http://id.loc.gov/vocabulary/rda/ModeIssue/1001","value":"single unit"}]"
    exports.getResource = function(subjecturi, propertyuri, selected, process) {
        selected.uri = selected.uri.replace("gov/", "gov/ml38281/");
        return lcshared.getResource(subjecturi,propertyuri,selected,process);
    }

});
bfe.define('src/lookups/rdamusnotation', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");

    var cache = [];

    exports.scheme = "http://id.loc.gov/ml38281/vocabulary/rda/MusNotation";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }

    exports.getResource = function(subjecturi, propertyuri, selected, process) {
        selected.uri = selected.uri.replace("gov/", "gov/ml38281/");
        return lcshared.getResource(subjecturi, propertyuri, selected, process);
    }

});
bfe.define('src/lookups/rdaformatnotemus', ['require', 'exports', 'module' , 'src/lookups/lcshared'], function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    var cache = [];
    exports.scheme = "http://rdaregistry.info/termList/FormatNoteMus";

    exports.source = function(query, process) {

        console.log('q is ' + query);
        q = encodeURI(query);
        if(cache[q]){
            process(cache[q]);
            return;
        }
        if( typeof this.searching != "undefined") {
            clearTimeout(this.searching);
            process([]);
        }

        this.searching = setTimeout(function() {
           if ( query === '' || query === ' ') {
                u = exports.scheme + ".json-ld";
                $.ajax({
                    url: u,
                    dataType: "json",
                    success: function (data) {
                        parsedlist = lcshared.processJSONLDSuggestions(data,query,exports.scheme);
                        return process(parsedlist);
                    }
                });
             } else if (query.length > 1) {
                u = exports.scheme + ".json-ld";
                console.log(u);
                $.ajax({
                    url: u,
                    dataType: "json",
                    success: function (data) {
                        parsedlist = lcshared.processJSONLDSuggestions(data,query,exports.scheme);
                        cache[q] = parsedlist;
                        return process(parsedlist);
                    }
                });
            } else {
                return [];
            }
        }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/lcrelators', ['require', 'exports', 'module' , 'src/lookups/lcshared'],function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    var cache = [];
    exports.scheme = "http://id.loc.gov/vocabulary/relators";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }

    exports.getResource = lcshared.getResource;

});
bfe.define('src/lookups/lcperformanceMediums', ['require', 'exports', 'module' , 'src/lookups/lcshared'],function(require, exports, module) {
    var lcshared = require("src/lookups/lcshared");
    var cache = [];
    exports.scheme = "http://id.loc.gov/authorities/performanceMediums";

    exports.source = function(query, process){
        return lcshared.simpleQuery(query, cache, exports.scheme, process);
    }

    exports.getResource = lcshared.getResource;

});

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
bfe.define('src/lib/aceconfig', ['require', 'exports', 'module' ], function(require, exports, module) {

var global = (function() {
    return this;
})();

var options = {
    packaged: false,
    workerPath: null,
    modePath: null,
    themePath: null,
    basePath: "",
    suffix: ".js",
    $moduleUrls: {}
};

exports.set = function(key, value) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown config key: " + key);

    options[key] = value;
};

// initialization
function init(packaged) {
    options.packaged = packaged || require.packaged || module.packaged || (global.define && define.packaged);

    if (!global.document)
        return "";

    var scriptOptions = {};
    var scriptUrl = "";

    var scripts = document.getElementsByTagName("script");
    for (var i=0; i<scripts.length; i++) {
        var script = scripts[i];

        var src = script.src || script.getAttribute("src");
        if (!src)
            continue;

        var attributes = script.attributes;
        for (var j=0, l=attributes.length; j < l; j++) {
            var attr = attributes[j];
            if (attr.name.indexOf("data-ace-") === 0) {
                scriptOptions[deHyphenate(attr.name.replace(/^data-ace-/, ""))] = attr.value;
            }
        }

        var m = src.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
        if (m)
            scriptUrl = m[1];
    }

    if (scriptUrl) {
        scriptOptions.base = scriptOptions.base || scriptUrl;
        scriptOptions.packaged = true;
    }

    scriptOptions.basePath = scriptOptions.base;
    scriptOptions.workerPath = scriptOptions.workerPath || scriptOptions.base;
    scriptOptions.modePath = scriptOptions.modePath || scriptOptions.base;
    scriptOptions.themePath = scriptOptions.themePath || scriptOptions.base;
    delete scriptOptions.base;

    for (var key in scriptOptions)
        if (typeof scriptOptions[key] !== "undefined")
            exports.set(key, scriptOptions[key]);
};

exports.init = init;

function deHyphenate(str) {
    return str.replace(/-(.)/g, function(m, m1) { return m1.toUpperCase(); });
}

});
/*
 * @deprecated v0.2.0
 */
(function() {
    bfe.require(["src/bfe"], function(a) {
        console.log(a);
        a && a.aceconfig.init();
        if (!window.bfe)
            window.bfe = {};
        for (var key in a) if (a.hasOwnProperty(key))
            bfe[key] = a[key];
    });
})();
