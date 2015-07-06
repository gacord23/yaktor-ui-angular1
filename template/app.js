(function() {
  'use strict';
  
  require('angular');
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('ngStorage');
  require('uiBootstrap');
  require('ngGrid');
  require('ngTouch');
  require('uiGrid');
  require('uiSelect');
  require('ngSanitize');
  require('vcRecaptcha');

  angular.module('views', 
      ['ui.bootstrap',
      'ui.router',
      'pascalprecht.translate',
      'ngStorage',
      'ngGrid', 
      'ngResource',
      'ui.grid',
      'ui.grid.resizeColumns',
      'ui.grid.infiniteScroll',
      'ui.select',
      'checklist-model',
      'sharedModule',
      'utilities',
      'ngSanitize',
       <% _.each(moduleNames, function(moduleName, index){%>'<%- moduleName %>'<% if(index != moduleNames.length-1){%>,
         <% }}); %>]);


})();