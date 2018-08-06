angular.module('app').controller('returnMtrlApproveController', ['$rootScope', '$scope', 'utils', 'returnMtrlApproveService',
    function ($rootScope, $scope, utils, returnMtrlApproveService) {

        $scope.QrCode = '';
        $scope.QRCodeInputFocus = true;//自动获取焦点
        $scope.ReturnHead = {};//单头信息
        $scope.ReturnBody = [];//单身信息
        $scope.selected = -1;//选中行
        var interval1;//定时器
        var interval2;//

        $scope.ItemLocHead = {};//储位退料 物料信息
        $scope.ItemLocBody = [];//储位退料 储位列表
        $scope.ItemDetailModal;//储位发料明细页面 模态窗口
        $scope.LocQrCode = '';//批次二维码
        $scope.LocQrCodeInputFocus = false;//批次二维码自动获取焦点

        //退料储位明细页面 模态窗口
        utils.$ionicModal.fromTemplateUrl('TransferLocDetail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.ItemDetailModal = modal;
        });

        //扫描二维码 回车事件
        $scope.btnInputQrCode_Enter = function (qr_code) {

            if (qr_code === '') {
                utils.popup.alert('条码不能为空');
                return;
            }
            if (qr_code.length === Config.ticketLength) {//刷入的是单据
                $scope.GetReturnMtrlWaitCheck(qr_code);//获取退料单头和单身信息
            } else {//刷入的是条码
                if (!$scope.ReturnHead.ISSUE_RECEIPT_NO) {
                    utils.popup.alert('请先扫描发料单二维码，获取发料单信息');
                    return;
                }
                var array_stk = qr_code.split(',');
                if (array_stk.length < Config.stkSplitCount) {
                    utils.popup.alert('刷入的批次条码格式不匹配');
                    return;
                }
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
                if ($scope.CheckIsRepeat(stk_id))
                    $scope.TransferItemDetailPage(stk_id);

            }
            $scope.clearQRInput();
        }
        //获取待退物料明细
        $scope.GetReturnMtrlWaitCheck = function (ticket_no) {
            var parms = {};
            parms.ticket_no = ticket_no;
            returnMtrlApproveService.GetReturnMtrlWaitCheck(parms).then(function (response) {
                if (response.type != 1) {
                    utils.popup.alert(response.message);
                    return;
                }
                $scope.ReturnHead = response.value;
                $scope.ReturnBody = response.value2;
            });
        }

        //判断物料是否符合确认
        $scope.CheckIsRepeat = function (stk_id) {

            var flag = false;
            for (var i = 0; i < $scope.ReturnBody.length; i++) {
                if ($scope.ReturnBody[i].STK_ID === stk_id) {
                    if ($scope.ReturnBody[i].STATUS === 'CHECKED') {
                        utils.popup.alert('批次已经被刷入过，请勿重复扫描');
                        return false;
                    }
                    flag = true;
                }
            }
            if (!flag) {
                utils.popup.alert('该批号不在对应的此发料单扫描清单中，请重新确认');
                return false;
            }
            return true;
        }

        //跳转物料明细页面
        $scope.TransferItemDetailPage = function (stk_id) {
            var ticket_no = $scope.ReturnHead.ISSUE_RECEIPT_NO;
            if (!ticket_no) {
                utils.popup.alert('数据异常，请重新先扫描发料单二维码');
                return;
            }

            //自动滚动到扫描位置
            for (var i = 0; i < $scope.ReturnBody.length; i++) {
                if ($scope.ReturnBody[i].STK_ID === stk_id) {
                    //自动滚动到扫描位置
                    //if (i < $scope.IssueBody.length-4) {
                    var y_postion = i * 98;
                    utils.$ionicScrollDelegate.$getByHandle('listIssueBody').scrollTo(0, y_postion, true);
                    //}
                    $scope.selected = i;
                }
            }

            $scope.ItemDetailModal.show();
            $("#txtLocQrCode").val('');
            $scope.StkQrInterval();//开启定时器，获取焦点
            $scope.GetWaitReturnItemLocDetail(stk_id);
        }

        //更新退料单整体状态，同时抛送ERP审核
        $scope.btnCheckReturnConfirm_Click = function () {
            if (!$scope.ReturnHead.ISSUE_RECEIPT_NO) {
                utils.popup.alert('请先扫描退料单二维码，获取退料单信息');
                return;
            }
            var flag = false;
            $.each($scope.ReturnBody, function (index, data) {
                if (data.STATUS != 'CHECKED') {
                    flag = true;
                    return false;
                }
            })
            if (flag) {
                utils.popup.alert('还有未确认到的行资料，请继续确认后再提交');
                return;
            }

            if ($scope.ReturnHead.STATUS === 'COMPLETE') {
                utils.popup.alert('该单号已完成，请勿重复提交');
                return;
            }
            //更新退料单整体状态，同时抛送ERP审核
            var confirmPopup = utils.popup.confirm('是否确认提交？');
            confirmPopup.then(function (res) {
                if (res) {
                    var parms = {};
                    parms.ticket_no = $scope.ReturnHead.ISSUE_RECEIPT_NO;
                    returnMtrlApproveService.UpdateCheckReturnConfirm(parms).then(function (response) {
                        // if (response.type != 1) {
                        //     utils.popup.alert(response.message);
                        //     return;
                        // }
                        utils.popup.alert(response.message);
                    });
                }
            });


        }

        //设定退料完成时 项次颜色
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
            $scope.ReturnHead = {};//单头信息
            $scope.ReturnBody = [];//单身信息
            $scope.selected=-1;
        }

        //清空扫描框
        $scope.clearQRInput = function () {
            $scope.QrCode = '';
            $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
        }
        //重置焦点
        // interval1 = utils.$interval(function () {
        //     if (!interval2)
        //         $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
        // }, 1000);

        ///********** 储位退料明细 模态窗口页面 方法 start*********//

        //获取待退物料 系统推荐储位
        $scope.GetWaitReturnItemLocDetail = function (stk_id) {
            var parms = {};
            parms.ticket_no = $scope.ReturnHead.ISSUE_RECEIPT_NO;
            parms.stk_id = stk_id;
            if (!parms.ticket_no || !parms.stk_id) {
                utils.popup.alert('数据异常，请重新先扫描发料单二维码');
                return;
            }
            //获取待退物料 系统推荐储位
            returnMtrlApproveService.GetWaitReturnItemLocDetail(parms).then(function (response) {
                if (response.type != 1) {
                    utils.popup.alert(response.message);
                    $scope.ItemDetailModal.hide();
                    return;
                }
                $scope.ItemLocHead = response.value;
                $scope.ItemLocBody = response.value2;
            });
        }

        //储位二维码扫描 回车事件
        $scope.btnInputLocQrCode_Enter = function (qr_code) {
            if (qr_code === '') {
                utils.popup.alert('条码不能为空');
                return;
            }
            var flag = false;
            $.each($scope.ItemLocBody, function (index, data) {
                if (data.LOCATOR_CODE === qr_code) {
                    flag = true;
                    return false;
                }
            })
            if (!flag) {
                utils.popup.alert('输入的储位不在列表内，请确认');
                return;
            }
            $scope.CheckReturnMtrlLocator(qr_code);
        }
        //扫描储位，提交确认该储位
        $scope.CheckReturnMtrlLocator = function (locator_code) {
            var parms = {};
            parms.ticket_no = $scope.ReturnHead.ISSUE_RECEIPT_NO;
            parms.item_code = $scope.ItemLocHead.ITEM_CODE;
            parms.stk_id = $scope.ItemLocHead.STK_ID;
            parms.locator_code = locator_code;
            returnMtrlApproveService.CheckReturnMtrlLocator(parms).then(function (response) {
                if (response.type != 1) {
                    utils.popup.alert(response.message);
                    return;
                }
                // for (var i = 0; i < $scope.ReturnBody.length; i++) {
                //     if ($scope.ReturnBody[i].ITEM_CODE === $scope.ItemLocHead.ITEM_CODE) {
                //         $scope.ReturnBody[i].STATUS = 'CHECKED';
                //     }
                // }
                $scope.ItemDetailModal.hide();

            });
        }


        $scope.SetLocStyle = function (desc) {
            if (desc === 'true') {
                return {'color:': '#EE0000'};
            } else {
                return {'display': 'none'};
            }
        }

        //模态窗口隐藏  刷新主页面数据
        $scope.$on('modal.hidden', function () {
            utils.$interval.cancel(interval2);//取消定时器
            interval2 = undefined;
            $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
            $scope.GetReturnMtrlWaitCheck($scope.ReturnHead.ISSUE_RECEIPT_NO);
        })

        $scope.clearStkLocData = function (dfd) {
            $("#txtLocQrCode").val('');
            $scope.LocQrCodeInputFocus = !$scope.LocQrCodeInputFocus;
        }

        //焦点
        $scope.StkQrInterval = function () {
            $scope.LocQrCodeInputFocus = !$scope.LocQrCodeInputFocus;
            // interval2 = utils.$interval(function () {
            //     $scope.LocQrCodeInputFocus = !$scope.LocQrCodeInputFocus;
            // }, 1000);
        }
        ///********* 储位退料明细 模态窗口页面 方法 end*********//

    }]);