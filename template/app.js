(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      
      $stateProvider
        
        {{#states}}
        .state('{{&name}}', {
          templateUrl: 'partial/{{controller}}.html',
          controller: '{{controller}}Ctrl'
        })
        {{#actionables}}
        .state('{{&name}}.{{actionableName}}', {
          url: '{{&url}}/{{actionableName}}',
          templateUrl: 'partial/{{controller}}.{{actionableName}}.html'
        })
        {{/actionables}}
        {{/states}}
      
    });

})();