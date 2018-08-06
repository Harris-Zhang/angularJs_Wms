angular.module('app').controller('issueMtrlApproveController', ['$rootScope', '$scope', 'utils', 'issueMtrlApproveService', function ($rootScope, $scope,  utils, issueMtrlApproveService) {
    $scope.toast = '';

    $scope.QrCode = '';
    $scope.QRCodeInputFocus = true;//自动获取焦点
    $scope.IssueHead = {};//单头信息
    $scope.IssueBody = [];//单身信息
    var interval1;//定时器

    //扫描二维码 回车事件
    $scope.btnInputQrCode_Enter = function (qr_code) {

        if (qr_code == '') {
            utils.popup.alert('条码不能为空');
            return;
        }
            $scope.GetIssueReceiptWaitCheck(qr_code);//获取发料单头和单身信息

        $scope.clearQRInput();
    }
    //获取待物料明细
    $scope.GetIssueReceiptWaitCheck = function (ticket_no) {
        var parms = {};
        parms.ticket_no = ticket_no;
        issueMtrlApproveService.GetIssueReceiptWaitCheck(parms).then(function (response) {
            if (response.type != 1) {
                utils.popup.alert(response.message);
                return;
            }
            $scope.IssueHead = response.value.head;
            $scope.IssueBody = response.value.body;
        });
    }

    //领料审核
    $scope.btnApproveIssueConfirm_Click = function () {
        if (!$scope.IssueHead.ISSUE_RECEIPT_NO) {
            utils.popup.alert('请先扫描发料单二维码，获取发料单信息');
            return;
        }
        if ($scope.IssueHead.READY_NUM != $scope.IssueHead.CHECK_NUM) {
            utils.popup.alert('领料人员还确认完，请确认完后再提交审核');
            return;
        }

        var confirmPopup = utils.popup.confirm('是否确认提交审核？');
        confirmPopup.then(function (res) {
            if (res) {
                var parms = {};
                parms.ticket_no = $scope.IssueHead.ISSUE_RECEIPT_NO;
                issueMtrlApproveService.UpdateApproveIssueConfirm(parms).then(function (response) {
                    // if (response.type != 1) {
                    //     utils.popup.alert(response.message);
                    //     return;
                    // }
                    utils.popup.alert(response.message);
                });
            }
        });


    }

    //设定备料完成时 项次颜色
    $scope.SetStyle = function (reserve_qty, ready_qty,check_qty) {
        if (reserve_qty == ready_qty && reserve_qty == check_qty) {//预约数量和确认数量和备料数量相等 绿色
            return {'background-color': '#66CD00'};
        } else {
            return {'background-color': 'none'};
        }
    }

    //清空所有控件
    $scope.btnClear_Click = function () {
        $scope.QrCode = '';
        $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;//自动获取焦点
        $scope.IssueHead = {};//单头信息
        $scope.IssueBody = [];//单身信息
    }

    //清空扫描框
    $scope.clearQRInput = function () {
        $scope.QrCode = '';
        $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
    }
    //重置焦点
    // interval1 = utils.$interval(function () {
    //
    //     $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
    // }, 1000);

}]);