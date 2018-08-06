angular.module('app').controller('homeController', ['$rootScope', '$scope', 'utils','homeService', function ($rootScope, $scope, utils,homeService) {
    $scope.HomeMenus=[];
    $scope.vo = {
        slides: [{
            lbpicNum: 1,
            lbpicUrl: 'img/home/1.png'
        }, {
            lbpicNum: 2,
            lbpicUrl: 'img/home/2.png'
        }, {
            lbpicNum: 3,
            lbpicUrl: 'img/home/3.png'
        }]
    };

    homeService.GetMenu().then(function(response){
        $rootScope.menus=response.value;
        if($rootScope.menus){
            $.each(response.value,function(index,menu){
                $scope.HomeMenus.push(menu);
                // $.each(menu.children,function(ix,menu2){
                //     $scope.HomeMenus.push(menu2);
                // })
            })
        }
    });
$scope.btnClear_Click=function(){
    $rootScope.toast="条码不能为空123";
}
}]);