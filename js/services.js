(function(angular) {
    "use strict";
    var appServices = angular.module('simApp.services', []);

    appServices.factory('authManager', ['$rootScope', 'fbRef', 'angularFireAuth', authManager]);
    function authManager($rootScope, fbRef, angularFireAuth) {
        angularFireAuth.initialize(fbRef(), {
            scope: $rootScope,
            name: 'user'
        });

        return {
            login: function() {
                angularFireAuth.login('persona', { rememberMe: true, scope: 'email'});
            },
            logout: function() {
                angularFireAuth.logout();
            }
        };
    }
})(angular);
