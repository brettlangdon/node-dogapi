var path = require("path");

var docast = require("docast");
var glob = require("glob");
var marked = require("marked");
var yaml = require("js-yaml");

marked.setOptions({
    gfm: true,
    sanitize: true,
    pedantic: false
});

var above = path.resolve(__dirname, "../lib/");
var match = above + "/**/*.js";

var docs = {};
glob(match, function(er, files){
    files.forEach(function(file){
        var comments = docast.parse(file);
        for(var i = 0; i < comments.length; ++i){
            var comment = comments[i];
            try{
                comment.doc = yaml.safeLoad(comment.doc);
                if(!comment.doc.hasOwnProperty("section")){
                    continue;
                }
                if(!docs[comment.doc.section]){
                    docs[comment.doc.section] = {};
                }

                for(var key in comment.doc.params){
                    if(comment.doc.params.hasOwnProperty(key)){
                        comment.doc.params[key] = comment.doc.params[key].replace(/optional/g, "_optional_");
                        comment.doc.params[key] = marked(comment.doc.params[key]);
                    }
                }
                if(comment.doc.hasOwnProperty("example")){
                    comment.doc.example = marked(comment.doc.example);
                } else {
                    comment.doc.example = "";
                }

                if(comment.doc.hasOwnProperty("comment")){
                    comment.doc.comment = marked(comment.doc.comment);
                } else {
                    comment.doc.comment = "";
                }

                docs[comment.doc.section][comment.name] = comment.doc;
            } catch(e){}
        }
    });

    var output = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
    output += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n";
    output += "<script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js\">\n</script>\n<script type=\"text/javascript\">\ndocument.addEventListener(\"DOMContentLoaded\", function(){hljs.initHighlightingOnLoad();});</script>\n";
    output += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css\" />\n";
    output += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css\" />\n";
    output += "</head>\n<body>\n";
    output += "<a class=\"btn btn-default\" href=\"#top\" style=\"position:fixed;bottom:1rem;right:1rem;z-index:100000;color:#000\">Jump To Top</a>\n";
    output += "<div id=\"top\" class=\"container-fluid\">\n";
    output += "<div class=\"row\">\n";
    output += "<div class=\"col-sm-12\">\n";
    output += "<h1>Node Dogapi</h1>\n";
    output += "<ul class=\"nav nav-pills\">\n";
    for(var section in docs){
        if(!docs.hasOwnProperty(section)){
            continue;
        }
        output += "<li role=\"\"><a href=\"#" + section + "\">" + section + "</a>\n";
        output += "</li>\n";
    }
    output += "</ul>\n</div>\n</div>\n";

    for(var section in docs){
        if(!docs.hasOwnProperty(section)){
            continue;
        }
        methods = docs[section];

        output += "<section id=\"" + section + "\" class=\"col-sm-12\">\n";
        output += "<div class=\"row\">\n<h2 class=\"bg-primary\" style=\"text-indent:1rem\">" + section + "</h2></div>\n";

        output += "<ul class=\"nav nav-pills\">\n";
        for(var name in methods){
            if(!methods.hasOwnProperty(name)){
                continue;
            }
            output += "<li role\"presentation\"><a href=\"#" + section + "-" + name + "\">" + name + "</a></li>\n";
        }

        output += "</ul>\n";

        for(var name in methods){
            if(!methods.hasOwnProperty(name)){
                continue;
            }
            doc = methods[name];

            var className = section + "-" + name;
            output += "<div class=\"function row\" id=\"" + className + "\">\n";

            var definition = name + "(";
            if(doc.params && typeof doc.params === "object"){
                definition += Object.keys(doc.params).join(", ");
            }
            definition += ")";

            output += "<h3 class=\"bg-info\" style=\"text-indent:.5rem;padding:.5rem;margin-top:.5rem\">" + definition + "</h3>\n";
            output += "<div class=\"col-md-6\">\n";
            output += doc.comment;
            if(doc.params){
                output += "<h4>Parameters:</h4>\n";
                output += "<dl>\n";
                for(var param in doc.params){
                    if(!doc.params.hasOwnProperty(param)){
                        continue;
                    }
                    var comment = doc.params[param];
                    output += "<dt>" + param + "</dt>\n";
                    output += "<dd>" + comment + "</dd>\n";
                }
                output += "</dl>\n";
            }
            output += "</div>\n";

            output += "<div class=\"col-md-6\">\n";
            output += doc.example;
            output += "</div>\n";

            output += "</div>\n";
        }
        output += "</section>\n";
    }
    output += "</div>\n";
    output += "<a href=\"https://github.com/brettlangdon/node-dogapi\"><img style=\"position: absolute; top: 0; right: 0; border: 0;\" src=\"https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67\" alt=\"Fork me on GitHub\" data-canonical-src=\"https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png\"></a>";
    output += "</body></html>";
    console.log(output);
});
