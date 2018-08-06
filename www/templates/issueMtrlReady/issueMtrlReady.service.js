angular.module('app').service('issueMtrlReadyService', ["utils", "$q", function (utils, $q) {
    var apiUrl = Config.apiUrl + "issueReturn/Issue/";
    return {
        //获取发料单头和单身信息
        GetIssueReceiptHeadAndBody: function (parms) {
            utils.http.url = apiUrl + "GetIssueReceiptHeadAndBody";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //获取物料所在库存储位信息
        GetWaitIssueItemLocDetail: function (parms) {
            utils.http.url = apiUrl + "GetWaitIssueItemLocDetail";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //获取物料对应批次储位
        GetIssueItemInventory: function (parms) {
            utils.http.url = apiUrl + "GetIssueItemInventory";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
        //单批次备料提交，更新需求单数据和库存信息
        UpdateIssueSingleConfirm: function (parms) {
            utils.http.url = apiUrl + "UpdateIssueSingleConfirm";
            utils.http.parms = parms;
            utils.http.isPost = true;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },

        //拆分标签，生成蓝牙标签机数据
        BluetoothSplitStk: function (parms) {
            utils.http.url = apiUrl + "BlueToothSplitStk";
            utils.http.parms = parms;
            utils.http.isPost = false;
            utils.http.loadingMsg = "加载中...";
            return utils.http.go().then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data);
            })
        },
    };
}]);