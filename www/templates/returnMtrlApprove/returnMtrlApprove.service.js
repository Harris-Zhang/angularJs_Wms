angular.module('app').service('returnMtrlApproveService', ["utils", "$q", function (utils, $q) {
    var apiUrl = Config.apiUrl + "issueReturn/Return/";
    return {
        //获取待 确认物料明细
        GetReturnMtrlWaitCheck: function (parms) {
            utils.http.url = apiUrl + "GetReturnMtrlWaitCheck";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //获取待退物料 系统推荐储位
        GetWaitReturnItemLocDetail: function (parms) {
            utils.http.url = apiUrl + "GetWaitReturnItemLocDetail";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //确认退料到该储位
        CheckReturnMtrlLocator: function (parms) {
            utils.http.url = apiUrl + "CheckReturnMtrlLocator";
            utils.http.parms = parms;
            utils.http.isPost = true;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //更新退料单整体状态，同时抛送ERP审核
        UpdateCheckReturnConfirm: function (parms) {
            utils.http.url = apiUrl + "UpdateCheckReturnConfirm";
            utils.http.parms = parms;
            utils.http.isPost = true;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
    };
}]);