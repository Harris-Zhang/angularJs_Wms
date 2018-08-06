angular.module('app').directive('ngEnter', ['$compile',function($compile, utils) {
    return {
        scope: false, //默认值为 false 共享父作用域 值为true时共享父级作用域并创建指令自己的
        restrict: 'AE',
        link: function(scope, element, attr) {
            element.bind('keydown keypress',function(event){
               if(event.which==13){
                   scope.$apply(function () {
                       scope.$eval(attr.ngEnter);
                   });
                   event.preventDefault();
               }
            });
        }
    };
}]);