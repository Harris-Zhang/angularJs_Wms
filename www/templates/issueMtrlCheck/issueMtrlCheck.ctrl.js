angular.module('app').controller('issueMtrlCheckController', ['$rootScope', '$scope', 'utils', 'issueMtrlCheckService', function ($rootScope, $scope, utils, issueMtrlCheckService) {

    $scope.QrCode = '';
    $scope.QRCodeInputFocus = true;//自动获取焦点
    $scope.IssueHead = {};//单头信息
    $scope.IssueBody = [];//单身信息
    $scope.IssueCheck = {};//判断批次是否已刷过
    $scope.IssueSelect = {};//显示当前正在刷入的物料信息
    $scope.selected = -1;//选中行
    var interval1;//定时器

    //扫描二维码 回车事件
    $scope.btnInputQrCode_Enter = function (qr_code) {

        if (qr_code == '') {
            utils.popup.alert('条码不能为空');
            return;
        }
        if (qr_code.length == Config.ticketLength) {//刷入的是单据
            $scope.GetIssueReceiptWaitCheck(qr_code);//获取发料单头和单身信息
        } else {//刷入的是条码
            if (!$scope.IssueHead.ISSUE_RECEIPT_NO) {
                utils.popup.alert('请先扫描发料单二维码，获取发料单信息');
                return;
            }
            var array_stk = qr_code.split(',');
            if (array_stk.length < Config.stkSplitCount) {
                utils.popup.alert('刷入的批次条码格式不匹配');
                return;
            }

            $scope.CheckIssue(array_stk);

        }
        $scope.clearQRInput();
    }
    //获取待 确认物料明细
    $scope.GetIssueReceiptWaitCheck = function (ticket_no) {
        var parms = {};
        parms.ticket_no = ticket_no;
        issueMtrlCheckService.GetIssueReceiptWaitCheck(parms).then(function (response) {
            if (response.type != 1) {
                utils.popup.alert(response.message);
                return;
            }
            $scope.IssueHead = response.value.head;
            $scope.IssueBody = response.value.body;
            $scope.IssueCheck = response.value.stk;


        });
    }
    //判断物料是否符合确认
    $scope.CheckIssue = function (array_stk) {
        var stk_id = '';
        if (array_stk.length >= 5) {
            if (array_stk[4].split('-').length > 2) {
                stk_id = array_stk[4];
            } else {
                stk_id = array_stk[4].split('-')[0];
            }
        } else {
            stk_id = array_stk[0];
        }
        var flag = false;
        for (var i = 0; i < $scope.IssueCheck.length; i++) {
            if ($scope.IssueCheck[i].STK_ID === stk_id) {
                if ($scope.IssueCheck[i].STK_STATUS === 'CHECKED') {
                    utils.popup.alert('批次已经被刷入过，请勿重复扫描');
                    return;
                }

                for (var j = 0; j < $scope.IssueBody.length; j++) {
                    if ($scope.IssueCheck[i].ITEM_CODE === $scope.IssueBody[j].ITEM_CODE) {
                        if ($scope.IssueBody[j].READY_QTY != $scope.IssueBody[j].ISSUE_RECEIPT_QTY) {
                            utils.popup.alert('仓管还未备料完成，无法确认，请找仓库核实');
                            return;
                        }
                        //自动滚动到扫描位置
                        //if (i < $scope.IssueBody.length-4) {
                        var y_postion = j * 98;
                        utils.$ionicScrollDelegate.$getByHandle('listIssueBody').scrollTo(0, y_postion, true);
                        $scope.selected = j;
                        //}
                        //确认数量累加
                        $scope.IssueBody[j].CHECK_QTY += $scope.IssueCheck[i].QTY;
                        //判断确认数量是否和备料数量相等
                        if ($scope.IssueBody[j].CHECK_QTY === $scope.IssueBody[j].READY_QTY) {
                            //完成数+1
                            $scope.IssueHead.CHECK_NUM += 1;
                        }
                        //改变批次状态
                        $scope.IssueCheck[i].STK_STATUS = 'CHECKED';
                        //更新当前显示的物料信息
                        $scope.IssueSelect = $scope.IssueBody[j];
                        break;
                    }
                }

                flag = true;
                break;
            }
        }
        if (!flag) {
            utils.popup.alert('该批号不在对应的此发料单扫描清单中，请重新确认');
            return;
        }
    }

    //领料确认
    $scope.btnCheckIssueConfirm_Click = function () {
        if (!$scope.IssueHead.ISSUE_RECEIPT_NO) {
            utils.popup.alert('请先扫描发料单二维码，获取发料单信息');
            return;
        }
        if ($scope.IssueHead.READY_NUM != $scope.IssueHead.CHECK_NUM) {
            utils.popup.alert('还有未完确认到的行资料，请继续确认后再提交');
            return;
        }

        var confirmPopup = utils.popup.confirm('是否确认提交？');
        confirmPopup.then(function (res) {
            if (res) {
                var parms = {};
                parms.ticket_no = $scope.IssueHead.ISSUE_RECEIPT_NO;
                issueMtrlCheckService.UpdateCheckIssueConfirm(parms).then(function (response) {
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
    $scope.SetStyle = function (QTY, ACTUAL_QTY) {
        if (QTY === ACTUAL_QTY) {//确认数量和备料数量相等 绿色
            return {'background-color': '#66CD00'};
        } else if (ACTUAL_QTY != 0 && ACTUAL_QTY < QTY) {
            return {'background-color': '#FFF68F'};
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
        $scope.IssueCheck = {};//判断批次是否已刷过
        $scope.IssueSelect = {};//显示当前正在刷入的物料信息
        $scope.selected=-1;
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