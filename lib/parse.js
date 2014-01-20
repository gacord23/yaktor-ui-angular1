(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js;
  
  parse = {};
  
  parse.fromStateMatrix = function(appname, matrix) {
    
    // Create an object with the project name
    var model = {};
    model['name'] = appname;
    model['states'] = {};
    
    for (var name in matrix) {
      var state = matrix[name];
      
      model.states[name] = {};
      
      // Each state contains an `ui` and `elements` tag.
      model.states[name]['ui'] = {
        tag: "div",
        title: new S(name).humanize().s
      };
      model.states[name]['elements'] = {};
      
      // Each state can transition to other states
      for (var key in state) {
        
        // Transition states are also described by a `ui` and `elements` key
        var obj = {
          ui: {
            tag: 'div',
            title: new S(key).humanize().s
          },
          elements: {}
        }
        model.states[name].elements[key] = obj;
        
        var type = state[key].type;
        if (type === undefined) {
          continue;
        }
        for (var prop in type.properties) {
          
          // TODO: Need function here that maps state matrix property definitions to UI model definitions
          obj.elements[prop] = type.properties[prop];
        }
      }
    }
    
    var f = fs.openSync(appname + "Model.json", 'w');
    fs.writeSync(f, beautify( JSON.stringify(model) ));
    fs.closeSync(f);
    
    return model;
  }
  
  module.exports = parse;
}());