angular.module('app').service('issueMtrlCheckService', ["utils", "$q", function (utils, $q) {
    var apiUrl = Config.apiUrl + "issueReturn/Issue/";
    return {
        //获取待 确认物料明细
        GetIssueReceiptWaitCheck: function (parms) {
            utils.http.url = apiUrl + "GetIssueReceiptWaitCheck";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //确认提交，更新需求单数据和库存信息
        UpdateCheckIssueConfirm: function (parms) {
            utils.http.url = apiUrl + "UpdateCheckIssueConfirm";
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