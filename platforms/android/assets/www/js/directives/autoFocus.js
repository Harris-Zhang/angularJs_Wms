angular.module('app').directive('autoFocus', ['$timeout','$parse',function($timeout, $parse, utils) {
    return {
        // restrict: 'A',
        // scope: {
        //     focus: '='
        // },
        link: function(scope, element, attr) {
            var model = $parse(attr.autoFocus);
            scope.$watch(model, function(value) {
                // if(value === true) {
                //     $timeout(function() {
                //         element[0].select();
                //     });
                // }
                if (value) {
                    $timeout(function () {
                        element[0].focus();
                    })
                }
            });
        }
    };
}]);