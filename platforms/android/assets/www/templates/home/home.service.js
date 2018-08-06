
angular.module('app').service('homeService', ["utils", "$q", function (utils, $q) {
    var apiUrl = Config.apiUrl + "admin/Login/";
    return {
        GetMenu: function (parms) {
            utils.http.url = apiUrl + "GetMobileMenuList";
            //utils.http.url = "api_json/home/menu.json";
            utils.http.parms = parms;
            utils.http.isPost = true;
            utils.http.config={caceh:false};
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        }
    };
}]);