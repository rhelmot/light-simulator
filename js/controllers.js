var simulator = angular.module("simulator", ["firebase", "angularLocalStorage",
                                             "simulator.lsview", "simulator.codeview"]);

var URL = "https://dpealight.firebaseio.com";

simulator.controller('SimCtrl', ['$scope', '$rootScope', '$firebase',
                                    '$firebaseSimpleLogin', 'storage', SimCtrl]);
function SimCtrl($scope, $rootScope, $firebase, $firebaseSimpleLogin, storage) {
    $scope.renderPoles = true;
    storage.bind($scope, 'designs', {defaultValue: {}});
    startWatch($scope);
    $scope.loginObj = $firebaseSimpleLogin(new Firebase(URL));
    $scope.pins = {};
    $scope.auth = {
        authenticated: false,
        user: null
    };

    $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
        $scope.auth = {
            authenticated: true,
            user: user.id.replace(',', '.')
        };
        var userRef = new Firebase(URL + "/" + user.uid);
        $firebase(userRef.child('designs')).$bind($scope, 'designs').then(function() {
            $scope.setDesign();
        });
    });
    $rootScope.$on("$firebaseSimpleLogin:logout", function(e) {
        $scope.auth = {
            authenticated: false,
            user: null
        };
        storage.bind($scope, 'designs');
        $scope.setDesign();
    });
}

function startWatch($scope) {
    $scope.removeDesign = function(design) {
        delete $scope.designs[design];
        if (len($scope.designs) == 0) {
            $scope.newDesign();
        } else {
            $scope.design = getFirstKey($scope.designs);
        }
    };
    $scope.newDesign = function() {
        $scope.designs["New Design"] = {name: "New Design", programs: {}, poles:
                                        [{rods: [{r: 0, theta: 0, height: 3, color: 'R'}], pos: [-2, -2]}]};
        $scope.design = "New Design";
    };
    $scope.setDesign = function(name) {
        if (typeof name !== 'undefined') {
            $scope.design = name;
        } else {
            if (len($scope.designs) == 0) {
                $scope.newDesign();
            } else {
                $scope.design = getFirstKey($scope.designs);
            }
        }
    };
    $scope.addPole = function() {
        var design = $scope.designs[$scope.design];
        design.poles.push({rods: [{r: 0, theta: 0, height: 3, color: 'R'}], pos: [-2, -2]});
    };
    $scope.deletePole = function(pole) {
        var poles = $scope.designs[$scope.design].poles;
        poles.splice(poles.indexOf(pole), 1);
    };
    $scope.addRod = function(pole) {
        pole.rods.push({r: 0, theta: 0, height: 3, color: 'R'});
    };
    $scope.deleteRod = function(pole, rod) {
        var poles = $scope.designs[$scope.design].poles,
            pole = poles[poles.indexOf(pole)];
        pole.rods.splice(pole.rods.indexOf(rod), 1);
    };
    $scope.setDesign();
    $scope.$watch("designs[design].name", function(n) {
        if (typeof n !== 'undefined' && $scope.design !== n) {
            $scope.designs[n] = $scope.designs[$scope.design];
            delete $scope.designs[$scope.design];
            $scope.design = n;
        }
    });
}

simulator.directive('parseFloat', function() { return { require: 'ngModel', link: parseFloatDir }; });
function parseFloatDir($scope, elem, attrs, modelCtrl) {
    var parseFloatOrZero = function(val) {
        var parsed = parseFloat(val);
        if (isNaN(parsed)) {
            return 0.0;
        } else {
            return parsed;
        }
    };
    modelCtrl.$parsers.push(parseFloatOrZero);
}

function len(o) {
    var count = 0;
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            count++;
        }
    }
    return count;
}

function getFirstKey(o) {
    for (var k in o) {
        if (o.hasOwnProperty(k) && k.charAt(0) != '$') {
            return k;
        }
    }
    return null;
}
