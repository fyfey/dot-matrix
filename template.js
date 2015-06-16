(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['font-edit.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <tr>\n            "
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n        </tr>\n";
},"2":function(depth0,helpers,partials,data) {
    return "<td>CELL</td>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"font-edit\">\n    <table>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rows : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </table>\n</div>\n";
},"useData":true});
templates['home.hbs'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h1>Home!</h1>\n";
},"useData":true});
})();