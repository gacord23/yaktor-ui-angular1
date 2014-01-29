(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ngCookies', 'ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      
      $stateProvider
        
        {{#states}}
        .state('{{name}}', {
          url: '/{{url}}',
          templateUrl: 'partial/{{url}}.html',
          controller: '{{controller}}Ctrl'
        })
        {{/states}}
      
    });

})();