angular.module('app').controller('loginController', ['$rootScope', '$scope', 'utils', 'loginService', function ($rootScope, $scope, utils, loginService) {
    $scope.account = {
        userId: '',
        passWord: '',
        qrCode: '',
    };

    $scope.Versions={
        client_v:'',
        server_v:'',
        apk_url:'',
        apk_name:'',
        server_url:Config.server
    };
    //登录
    $scope.login = function () {

        loginService.Login($scope.account).then(function (response) {
            if (response.type != 1) {
                utils.$ionicPopup.alert({
                    title: '登录提示',
                    template: response.message
                });
            }
            else {
                $rootScope.user = response.value;
                utils.cache.set('user',response.value);
                utils.cache.set('userId', response.value.USER_CODE);
                $rootScope.go('home',{},{reload:true});
                utils.$timeout(function () {
                    $rootScope.isLogin = true;
                }, 500);

            }
            console.log(response);
        });
    };
    //切换用户
    $scope.changeLogin = function () {
        utils.cache.clear();
        $rootScope.isLogin = false;
    }
    //退出app
    $scope.exit_app = function () {
        navigator.app.exitApp();
    }
    //扫描二维码
    $scope.scanQR = function () {
        utils.$cordovaBarcodeScanner.scan().then(function (imageData) {
            $scope.account.qrCode = imageData.text;
            $scope.login();
        }, function (error) {

        });
    }
    $scope.$watch('$viewContentLoaded', function() {
        utils.$timeout(function () {
        //检测版本更新
        loginService.CheckVersion().then(function (response) {
            if(response.VERSION_CODE==''){
                return;
            }
            $scope.Versions.server_v=response.VERSION_CODE;
            $scope.Versions.apk_url=response.APP_URL;
            $scope.Versions.apk_name=response.APP_NAME;
            utils.$cordovaAppVersion.getVersionNumber()
                .then(function (version) {
                    $scope.Versions.client_v=version;
                    console.log($scope.Versions.client_v);
                    if($scope.Versions.server_v!=$scope.Versions.client_v){

                        var confirmPopup = utils.popup.confirm('发现新版本,是否更新?');
                        confirmPopup.then(function (res) {
                            if (res) {
                                utils.updateApp.initDownLoadDir();
                                utils.updateApp.updateAPK($scope.Versions.apk_url,$scope.Versions.apk_name);
                            }
                        });
                    }
                }, false)

            console.log(response);
        });
        }, 1000);
    });

}]);