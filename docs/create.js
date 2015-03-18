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
                        comment.doc.params[key] = comment.doc.params[key].replace("optional", "_optional_");
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

    var output = "<!DOCTYPE html>\n<html>\n<head>\n<script type=\"text/javascript\" src=\"//highlightjs.org/static/highlight.pack.js\">\n</script>\n<script type=\"text/javascript\">\ndocument.addEventListener(\"DOMContentLoaded\", function(){hljs.initHighlightingOnLoad();});</script>\n<link rel=\"stylesheet\" href=\"//highlightjs.org/static/styles/github.css\" />\n<link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n";
    output += "<ul>\n";
    for(var section in docs){
        if(!docs.hasOwnProperty(section)){
            continue;
        }
        output += "<li><a href=\"#" + section + "\">" + section + "</a></li>\n";
    }
    output += "</ul>\n";

    for(var section in docs){
        if(!docs.hasOwnProperty(section)){
            continue;
        }
        methods = docs[section];

        output += "<section id=\"" + section + "\">\n";
        output += "<h2>" + section + "</h2>\n";
        for(var name in methods){
            if(!methods.hasOwnProperty(name)){
                continue;
            }
            doc = methods[name];

            var className = section + "-" + name;
            output += "<div class=\"function\" id=\"" + className + "\">\n";

            output += "<h3>" + name + "</h3>\n";
            output += "<div class=\"container\">\n";
            output += "<div class=\"doc\">\n";
            output += doc.comment;
            output += "<h4>Parameters:</h4>\n";
            for(var param in doc.params){
                if(!doc.params.hasOwnProperty(param)){
                    continue;
                }
                var comment = doc.params[param];
                output += "<h5>" + param + "</h5>\n";
                output += comment;
            }
            output += "</div>\n";

            output += "<div class=\"example\">\n";
            output += doc.example;
            output += "</div>\n";

            output += "</div>\n";
            output += "</div>\n";

        }
        output += "</section>\n";
    }
    output += "</body></html>";
    console.log(output);
});
