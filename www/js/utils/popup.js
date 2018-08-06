angular.module('utils.popup', []).factory('popup', ['$ionicPopup', '$q', function ($ionicPopup, $q) {
    return {
        alert: function (msg) {
            var alertPopup = $ionicPopup.alert({
                title: '系统提示',
                template: msg
            });
            return alertPopup;
        },

        confirm:function(msg){
            var confirmPopup=$ionicPopup.confirm({
                title:'系统提示',
                template:msg,
                okText: '确认',
                cancelText: '取消'
            })
            return confirmPopup;
        }
    }

}]);