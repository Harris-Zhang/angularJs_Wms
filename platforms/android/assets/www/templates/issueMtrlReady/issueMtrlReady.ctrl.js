angular.module('app').controller('issueMtrlReadyController', ['$rootScope', '$scope', 'utils', 'issueMtrlReadyService', function ($rootScope, $scope, utils, issueMtrlReadyService) {
    $scope.toast = '';

    $scope.QrCode = '';
    $scope.QRCodeInputFocus = true;//自动获取焦点
    $scope.IssueHead = {};//单头信息
    $scope.IssueBody = [];//单身信息
    $scope.selected=-1;//选中行
    var interval1;//定时器
    var interval2;//


    $scope.ItemLocHead = {};//储位发料 物料信息
    $scope.ItemLocBody = [];//储位发料 储位列表
    $scope.CheckItemLocBody = [];//验证物料储位明细用
    $scope.ItemDetailModal;//储位发料明细页面 模态窗口
    $scope.StkQrCode = '';//批次二维码
    $scope.StkQrCodeInputFocus = false;//批次二维码自动获取焦点

    //储位发料明细页面 模态窗口
    utils.$ionicModal.fromTemplateUrl('TransferItemDetail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.ItemDetailModal = modal;
    });

    //扫描二维码 回车事件
    $scope.btnInputQrCode_Enter = function (qr_code) {

        if (qr_code == '') {
            utils.popup.alert('条码不能为空');
            return;
        }
        if (qr_code.length == Config.ticketLength) {//刷入的是单据
            $scope.GetIssueReceiptHeadAndBody(qr_code);//获取发料单头和单身信息
        } else {
            if (!$scope.IssueHead.ISSUE_RECEIPT_NO) {
                utils.popup.alert('请先扫描发料单二维码，获取发料单信息');
                return;
            }
            var array_stk = qr_code.split(',');
            if (array_stk.length < Config.stkSplitCount) {
                utils.popup.alert('刷入的批次条码格式不匹配');
                return;
            }

            var item_code = array_stk[2];
            $scope.TransferItemDetailPage(item_code);

        }
        $scope.clearQRInput();
    }
    //获取发料单头和单身信息
    $scope.GetIssueReceiptHeadAndBody = function (ticket_no) {
        var parms = {};
        parms.ticket_no = ticket_no;
        issueMtrlReadyService.GetIssueReceiptHeadAndBody(parms).then(function (response) {
            if (response.type != 1) {
                utils.popup.alert(response.message);
                return;
            }
            $scope.IssueHead = response.value;
            $scope.IssueBody = response.value2;

        });
    }
    //跳转物料明细页面
    $scope.TransferItemDetailPage = function (item_code) {
        var ticket_no = $scope.IssueHead.ISSUE_RECEIPT_NO;
        if (!ticket_no) {
            utils.popup.alert('数据异常，请重新先扫描发料单二维码');
            return;
        }
        //自动滚动到扫描位置
        for(var i=0;i<$scope.IssueBody.length;i++){
            if($scope.IssueBody[i].ITEM_CODE===item_code){
                //自动滚动到扫描位置
                //if (i < $scope.IssueBody.length-4) {
                    var y_postion = i * 98;
                    utils.$ionicScrollDelegate.$getByHandle('listIssueBody').scrollTo(0, y_postion, true);
                //}
                $scope.selected=i;
            }
        }

        $scope.ItemDetailModal.show();
        $("#txtStkQrCode").val('');
        $scope.StkQrInterval();//开启定时器，获取焦点
        $scope.GetWaitIssueItemLocDetail(item_code);
    }


    //设定备料完成时 项次颜色
    $scope.SetStyle = function (QTY, ACTUAL_QTY) {
        if (QTY === ACTUAL_QTY) {//预约数量和备料数量相等 绿色
            return {'background-color': '#66CD00'};
        } else if (ACTUAL_QTY != 0 && ACTUAL_QTY < QTY) {
            return {'background-color': '#FFF68F'};
        } else {
            return {'background-color': 'none'};
        }
    }

    //清空控件
    $scope.clearQRInput = function () {
        $scope.QrCode = '';
        $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
    }
    //重置焦点
    // interval1 = utils.$interval(function () {
    //     if (!interval2)
    //         $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
    // }, 1000);


    ///********** 储位发料明细 模态窗口页面 方法 *********//

    $scope.GetWaitIssueItemLocDetail = function (item_code) {
        var parms = {};
        parms.ticket_no = $scope.IssueHead.ISSUE_RECEIPT_NO;
        parms.item_code = item_code;
        if (!parms.ticket_no || !parms.item_code) {
            $scope.ItemDetailModal.hide();
            utils.popup.alert('数据异常，请重新先扫描发料单二维码');
            return;
        }

        issueMtrlReadyService.GetWaitIssueItemLocDetail(parms).then(function (response) {
            if (response.type != 1) {
                $scope.ItemDetailModal.hide();
                utils.popup.alert(response.message);

                return;
            }
            $scope.ItemLocHead = response.value;
            $scope.ItemLocBody = response.value2;
        });

    }

    $scope.btnInputStkQrCode_Enter = function (qr_code) {
        if (qr_code == '') {
            utils.popup.alert('批次条码不能为空');
            return;
        }
        var parms = {};
        parms.ticket_no = $scope.IssueHead.ISSUE_RECEIPT_NO;
        parms.stk_qrCode = qr_code.replace(/%/g, ",");

        issueMtrlReadyService.GetIssueItemInventory(parms).then(function (response) {
            if (response.type != 1) {
                utils.popup.alert(response.message);
                return;
            }
            if (!$scope.CheckIsRepeat(response.value)) {
                return;
            }
            //需求数量= 总需求-已备
            var need_qty = response.value.RESERVE_QTY - response.value.ISSUED_QTY;
            if (need_qty < response.value.STK_QTY) {//需求数量<批次数量，拆批
                var confirmPopup = utils.popup.confirm('批次数量:' + response.value.STK_QTY + '大于需求数量:' + need_qty + ',是否确认拆批');
                confirmPopup.then(function (res) {
                    if (res) {
                        $scope.BluetoothSplitStk(need_qty, response.value.STK_ID);
                    }
                })
            } else {
                for (var i = 0; i < $scope.ItemLocBody.length; i++) {
                    if ($scope.ItemLocBody[i].LOCATOR_CODE === response.value.LOCATOR_CODE) {
                        // 捡料料数量+已备料数量+当前条码数量
                        var tmp_qty = $scope.ItemLocBody[i].ISSUED_QTY + $scope.ItemLocHead.ACTUAL_ISSUE_RECEIPT_QTY + response.value.STK_QTY;
                        if (tmp_qty > $scope.ItemLocHead.ISSUE_RECEIPT_QTY) {
                            utils.popup.alert('捡料料数量+已备料数量不可大于需求数量');
                            return;
                        }
                        $scope.ItemLocBody[i].ISSUED_QTY += response.value.STK_QTY;
                        $scope.IssueHead.ACTUAL_ISSUE_RECEIPT_QTY += response.value.STK_QTY;
                        $scope.CheckItemLocBody.push(response.value);

                        //单批次备料提交，更新需求单数据和库存信息
                        $scope.UpdateIssueSingleConfirm(response.value);
                        break;
                    }
                }
            }

        });
        //$scope.clearStkLocData();
    }
    //单批次备料提交，更新需求单数据和库存信息
    $scope.UpdateIssueSingleConfirm = function (item) {
        var parms = {};
        parms.TICKET_NO = item.ISSUE_RECEIPT_NO;
        parms.ITEM_CODE = item.ITEM_CODE;
        parms.STK_ID = item.STK_ID;
        parms.STK_QTY = item.STK_QTY;
        issueMtrlReadyService.UpdateIssueSingleConfirm(parms).then(function (response) {
            $scope.CheckItemLocBody = [];
            if (response.type != 1) {
                utils.popup.alert(response.message);
                return;
            }

            if (response.value <= 0) {

                $scope.clearStkLocData();
                $scope.ItemDetailModal.hide();
                $rootScope.toast='已全部备料完成';
                //utils.popup.alert('已全部备料完成');
            }
            else {

                var go_back = true;
                $.each($scope.ItemLocBody, function (index, data) {
                    //判断该物料是否全部备料
                    if (data.ISSUED_QTY != data.RESERVE_QTY) {
                        go_back = false;
                        return false;
                    }
                })
                if (go_back) {
                    $scope.clearStkLocData();
                    $scope.ItemDetailModal.hide();
                }
            }
        })

    }

    //判断物料是否重复扫描
    $scope.CheckIsRepeat = function (stk) {
        if (stk.ITEM_CODE != $scope.ItemLocHead.ITEM_CODE) {
            utils.popup.alert('刷入的批次品号：' + stk.ITEM_CODE + ',与待备品号：' + $scope.ItemLocHead.ITEM_CODE + '不符');
            return false;
        }
        $.each($scope.CheckItemLocBody, function (index, data) {
            if (data.STK_ID === stk.STK_ID) {
                utils.popup.alert('请勿重复扫描物料标签');
                return false;
            }
        })
        return true;
    }

    //拆分标签，生成蓝牙标签机数据
    $scope.BluetoothSplitStk = function (need_qty, stk_id) {
        var parms = {};
        parms.stk_id = stk_id;
        parms.need_qty = need_qty;
        issueMtrlReadyService.BluetoothSplitStk(parms).then(function (response) {
            if (response.type != 1) {
                utils.popup.alert(response.message);
                return;
            }
            console.log(response);
            $scope.BluetoothPrinterLabel(response.value);
            $scope.BluetoothPrinterLabel(response.value2);
        });
    }
    //发送数据给蓝牙设备 打印标签
    $scope.BluetoothPrinterLabel = function (label) {
        if ($rootScope.Bluetooth) {
            utils.$cordovaBluetoothSerial.write(label.split(' ')).then(function () {
                //utils.popup.alert('标签列印成功');
                $rootScope.toast='标签列印成功';
            }, function (error) {
                utils.popup.alert('列印失败：' + error);
            });
        }
        else {
            $state.go('setBluetooth', {}, {animation: 'silde-in-left'});
        }

    }

    //模态窗口隐藏  刷新主页面数据
    $scope.$on('modal.hidden', function () {
        // utils.$interval.cancel(interval2);//取消定时器
        // interval2 = undefined;
        $scope.QRCodeInputFocus = !$scope.QRCodeInputFocus;
        $scope.GetIssueReceiptHeadAndBody($scope.IssueHead.ISSUE_RECEIPT_NO);//获取发料单头和单身信息
    })

    $scope.clearStkLocData = function () {
        $("#txtStkQrCode").val('');
        //$scope.StkQrCodeInputFocus = !$scope.StkQrCodeInputFocus;
    }

    //焦点
    $scope.StkQrInterval = function () {
        $scope.StkQrCodeInputFocus = !$scope.StkQrCodeInputFocus;
        // interval2 = utils.$interval(function () {
        //     $scope.StkQrCodeInputFocus = !$scope.StkQrCodeInputFocus;
        // }, 1000);
    }

    ///********* 储位发料明细 模态窗口页面 方法 end*********//


}]);