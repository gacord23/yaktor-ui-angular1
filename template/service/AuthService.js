var emitter = require('emitter-component');
var $ = require('$');
angular.module('views').factory('AuthService',
    [ '$browser','$rootScope', '$q', '$sessionStorage', function ($browser,$rootScope, $q, $sessionStorage) {
      var _authenticated = false;
      var _refreshing = false;
      var authEmitter = new emitter();

      var _isAuthenticated = function (refresh,toState,fromState) {
        var deferAuth = $q.defer();
        // look for stored token, return true/false
        // console.log("checking authentication");

        _getAuthToken().then(function (result) {
          var now = new Date()
          var issued = new Date(result.issued).getTime();
          var expires_in = result.expires_in;
          var expires = new Date(issued + expires_in);

          // expired are we?
          if (expires < now) {
            deferAuth.resolve(false);
          } else if (result.access_token) {
            if (refresh) {
              _refreshAuthToken(toState,fromState).then(function (result) {
                deferAuth.resolve(true);
              }, function () {
                deferAuth.resolve(false);
              });
            } else {
              deferAuth.resolve(true);
            }
          } else {
            deferAuth.resolve(false);
          }
        }, function (error) {
          deferAuth.resolve(false);
        });

        return deferAuth.promise;
      };

      var _getAuthToken = function () {
        var deferGetToken = $q.defer();
        var objToken = {};

        if (_refreshing) {
          // listen for "new token"
          authEmitter.once("token", function (objToken) {
            deferGetToken.resolve(objToken);
          });
        } else {
          // TODO: date diff it, refresh it
          if ($sessionStorage.careToken) {
            deferGetToken.resolve($sessionStorage.careToken);
          } else {
            authEmitter.once("token", function (objToken) {
              deferGetToken.resolve(objToken);
            });
          }
        }
        return deferGetToken.promise;
      };

      var _getIndividual = function () {
        var deferGetIndividual = $q.defer();

        _getAuthToken().then(function (response) {
          deferGetIndividual.resolve(response.individual);
        });

        return deferGetIndividual.promise;
      };

      var _getRefresh = function () {
        var deferGetRefresh = $q.defer();

        _getAuthToken().then(function (response) {
          deferGetRefresh.resolve(response.refresh_token);
        });

        return deferGetRefresh.promise;
      };

      var _getAccess = function () {
        var deferGetAccess = $q.defer();

        _getAuthToken().then(function (response) {
          deferGetAccess.resolve(response.access_token);
        });

        return deferGetAccess.promise;
      };

      var _refreshAuthToken = function (toState,fromState) {
        _refreshing = true;
        var deferRefresh = $q.defer();
        var data = {
          grant_type : "refresh_token",
          refresh_token : $sessionStorage.careToken.refresh_token,
          client_id : "0"
        };

        // Angular $http FAIL. $ WIN.
        // get a new token or die
        console.log("$$incOutstandingRequestCount")
        $browser.$$incOutstandingRequestCount();

        console.log(JSON.stringify(data))
        var funTimes = 1;
        var fun = function(){
          var def = {type:"POST",headers:{"x-to-state":toState?JSON.stringify(toState):"unknown","x-from-state":fromState?JSON.stringify(fromState):"unknown"};
          if(funTimes>0){
            def.timeout=1000;
          }
          $.ajax('/auth/token', def,contentType:"application/json",data:JSON.stringify(data), success:function (data) {
            $sessionStorage.careToken = {};
            console.log(JSON.stringify(data));
            $sessionStorage.careToken.access_token = data.access_token;
            $sessionStorage.careToken.refresh_token = data.refresh_token;
            $sessionStorage.careToken.issued = data.issued;
            $sessionStorage.careToken.expires_in = data.expires_in;
            
            _refreshing = false;
            // emit "new token"
            authEmitter.emit("token", data);
            deferRefresh.resolve($sessionStorage.careToken);
            
            console.log("$$completeOutstandingRequest")
            $browser.$$completeOutstandingRequest(angular.noop);
          }}).fail(function (jqXHR,status,error) {
            // do error type stuff;
            if(error == "timeout"){
              if(0<funTimes--){
                return fun();
              }
            }
            _refreshing = false;
            delete $sessionStorage.careToken;
            deferRefresh.reject({});
            console.log("$$completeOutstandingRequest")
            $browser.$$completeOutstandingRequest(angular.noop);
          });
        };
        fun();
        return deferRefresh.promise;
      };

      var _setAuthToken = function (objToken) {
        console.log("inside SetAuth with " + JSON.stringify(objToken));
        var deferSetToken = $q.defer();

        if (objToken.access_token) {
          authEmitter.emit("token", objToken);
          $sessionStorage.careToken = objToken;
          _authenticated = true;
          deferSetToken.resolve(objToken);
        } else {
          try {
            delete $sessionStorage.careToken;
            _authenticated = false;
            deferSetToken.resolve(objToken);
          } catch (err) {
            console.log(err);
          }
        }
        return deferSetToken.promise;
      };

      return {
        authenticated : _authenticated,
        getAuthToken : _getAuthToken,
        isAuthenticated : _isAuthenticated,
        setAuthToken : _setAuthToken,
        getIndividual : _getIndividual,
        getAccess : _getAccess,
        getRefresh : _getRefresh
      }
    } ]);