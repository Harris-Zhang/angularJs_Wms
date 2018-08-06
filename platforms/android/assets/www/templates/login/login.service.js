
angular.module('app').service('loginService', ["utils", "$q", function (utils, $q) {
    var apiUrl = Config.apiUrl + "admin/Login/";
    return { 
        Login: function (parms) {
            utils.http.url = apiUrl + "Login";
            //utils.http.url = "api_json/login/Login.json";
            utils.http.parms = parms;
            utils.http.isPost = true;
            utils.http.loadingMsg = "登录中";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },

        CheckVersion: function (parms) {
            utils.http.url = apiUrl + "GetAppVersion";
            //utils.http.url = "api_json/login/Version.json";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "检测版本";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        }
    };
}]);