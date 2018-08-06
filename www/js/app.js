var Config = {
    // server: 'http://localhost:2010',
    // apiUrl: 'http://localhost:2010/api/',
    server: 'http://172.17.7.207:8888',
    apiUrl: 'http://172.17.7.207:8888/api/',
    debug: true,
    key: 'ed26d4cd99aa11e5b8a4c89cdc776729',
    random: ('' + Math.random()).substr(2),
    ticketLength:18,
    stkSplitCount:5,
};
var app = angular.module('app', ['ionic', 'oc.lazyLoad', 'app.route', 'ngCordova', 'ionic-native-transitions', 'utils']);
angular.module('app.route', []).config(['$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider', function ($urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
    //设置跨域
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise('/login');//跳转默认路由

    $ocLazyLoadProvider.config({
        modules: [{
            name: 'animate',
            files: [
                'css/animate.min.css'//动画
            ]
        }]
    });
}]);

app.config(['$ionicConfigProvider', '$ionicNativeTransitionsProvider', function ($ionicConfigProvider, $ionicNativeTransitionsProvider) {
    //http://ionic-china.com/doc/V1/javascript/$ionicConfigProvider.html
    $ionicConfigProvider.navBar.alignTitle('center');//导航栏标题的对齐方式，默认：center（居中）.
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.maxCache(5);//在DOM中缓存的视图最大数量
    $ionicConfigProvider.views.forwardCache(true);//设置这个配置为 true 则将有缓存而且在视图加载时不重置
    $ionicConfigProvider.form.checkbox('circle');//多选框的样式。 Android默认为square，iOS默认为circle。
    $ionicConfigProvider.form.toggle('large');//切换开关的样式。 Android默认为小，iOS默认为大。
    $ionicConfigProvider.spinner.icon('bubbles');//多种旋转加载的动画图标
    // $ionicConfigProvider.scrolling.jsScrolling(true);

    //https://www.npmjs.com/package/ionic-native-transitions
    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 200, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });

    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });
}]).run(['$rootScope', '$ionicPlatform', '$state', 'utils', function ($rootScope, $ionicPlatform, $state, utils) {
    utils.$ionicPlatform.ready(function () {
        // Wechat.share({
        //     message: {
        //         title:'pdf',
        //         description:'pdf文件',
        //         mediaTagName: "TEST-TAG-001",
        //         thumb:'www/images/head.jpg',
        //         media: {
        //             type: Wechat.Type.FILE,
        //             file: 'www/ES6-in-depth.pdf'
        //         }
        //     },
        //     scene: Wechat.Scene.SESSION
        // }, function (result) {
        //     console.log(result);
        // }, function (reason) {
        //     console.log(reason);
        // });

        if (window.StatusBar) {//定状态栏是否可见
            window.StatusBar.backgroundColorByHexString("#C0C0C0");
        }

        if (screen.lockOrientation) {//锁定屏幕为竖屏模式，不能设备如何旋转，屏幕都不会切换到横屏模式
            screen.lockOrientation('portrait');//landscape
        }
        // 监听手机网络在线事件
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $rootScope.toast = '已连接至' + navigator.connection.type + '网络';
        });
        // 监听手机网络离线事件
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $rootScope.toast = '未检测到网络';
        });

        var exitState = ['home', 'login'];

        utils.$ionicPlatform.registerBackButtonAction(function (e) {
            //阻止默认的行为  
            e.preventDefault();
            if (exitState.indexOf($state.current.name) != -1 && !$rootScope.settingLock) {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $rootScope.toast = '再按一次退出系统';
                    utils.$timeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            } else if (utils.$ionicHistory.backView()) {
                if (utils.$cordovaKeyboard.isVisible()) {
                    utils.$cordovaKeyboard.close();
                } else {
                    utils.$ionicHistory.goBack();
                }

            } else {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                }
                $rootScope.backButtonPressedOnceToExit = true;
                $rootScope.toast = '再按一次退出系统';
                utils.$timeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }

            return false;
        }, 100);

        //推动服务
        //var getRegistrationID = function () {
        //    window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
        //};

        //var onGetRegistrationID = function (data) {
        //    try {
        //        console.log("JPushPlugin:registrationID is " + data);

        //        if (data.length == 0) {
        //            var t1 = window.setTimeout(getRegistrationID, 1000);
        //        }
        //        $("#registrationId").html(data);
        //    } catch (exception) {
        //        console.log(exception);
        //    }
        //};

        //var onOpenNotification = function (event) {
        //    try {
        //        var alertContent;
        //        if (device.platform == "Android") {
        //            alertContent = event.alert;
        //        } else {
        //            alertContent = event.aps.alert;
        //        }
        //        console.log(event);
        //        if (event.extras.state) {
        //            utils.$state.go(event.extras.state);
        //        }
        //    } catch (exception) {
        //        console.log("JPushPlugin:onOpenNotification" + exception);
        //    }
        //};

        //var initiateUI = function () {
        //    try {
        //        window.plugins.jPushPlugin.init();
        //        window.setTimeout(getRegistrationID, 1000);
        //        if (device.platform != "Android") {
        //            window.plugins.jPushPlugin.setDebugModeFromIos();
        //            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        //        } else {
        //            window.plugins.jPushPlugin.setDebugMode(true);
        //            window.plugins.jPushPlugin.setStatisticsOpen(true);
        //        }
        //    } catch (exception) {
        //        console.log(exception);
        //    }
        //};

        // document.addEventListener("jpush.openNotification", onOpenNotification, false);
        // window.plugins.jPushPlugin.setAlias('chenjia');
        // initiateUI();

        //热更新
        if (window.chcp) {
            return;
            chcp.isUpdateAvailableForInstallation(function (error, data) {
                console.log(error);
                console.log(data);
                if (error) {
                    console.log('No update was loaded => nothing to install');
                    chcp.fetchUpdate(function (error, data) {
                        if (error) {
                            console.log('Failed to load the update with error code: ' + error.code);
                            console.log(error.description);
                            return;
                        }
                        console.log('Update is loaded');
                    });
                    return;
                }
                console.log('Current version: ' + data.currentVersion);
                console.log('About to install: ' + data.readyToInstallVersion);
                chcp.installUpdate(function (error) {
                    if (error) {
                        console.log('Failed to install the update with error code: ' + error.code);
                        console.log(error.description);
                    } else {
                        console.log('Update installed!');
                    }
                });
            });
        }
    });
}]).controller('rootController', ['$rootScope', '$scope', 'utils', function ($rootScope, $scope, utils) {

    $rootScope.toggleMenu = function (menu) {
        if ($rootScope.isMenuShown(menu)) {
            $rootScope.shownMenu = null;
        } else {
            $rootScope.shownMenu = menu;
        }
    };
    $rootScope.isMenuShown = function (menu) {
        return $rootScope.shownMenu === menu;
    };
    //菜单列表
    $rootScope.menus = [];

    $rootScope.server = Config.server;

    if(utils.cache.get('user')){
        $rootScope.user=utils.cache.get('user');
        $rootScope.isLogin = true;
    }



    var timer = utils.$interval(function () {
        $rootScope.screenWidth = document.documentElement.clientWidth;
        $rootScope.screenHeight = document.documentElement.clientHeight;
        utils.$ionicSideMenuDelegate.$getByHandle('menuHandle').canDragContent(false);
        if ($rootScope.screenHeight != 0) {
            utils.$interval.cancel(timer);
        }
    }, 1000);

    $rootScope.go = function (state, params) {
        if (state == -1) {
            utils.$ionicHistory.goBack();
        } else if (typeof state == 'string' && state.substr(0, 1) == '#') {
            utils.$location.path(state.substr(1));
        } else {
            utils.$state.go(state, params);
        }
    };

    $rootScope.logout = function () {
        utils.cache.put('session', '');
        utils.$state.go('login');
    };

    var safeState = [
        'home', 'login', 'demo'
    ];

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!$rootScope.state && toState.name == 'customerList.tab') {
            event.preventDefault();
            $rootScope.go('customerList.tabs', { type: 'pre' });
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        $rootScope.state = toState;
        if (utils.$ionicSideMenuDelegate.isOpenLeft()) {
            utils.$ionicSideMenuDelegate.toggleLeft(false);
        }
    });

    $rootScope.showPatternLock = function (flag) {
        $rootScope.patternLockFlag = flag;
        utils.$ionicModal.fromTemplateUrl('modules/sample/views/patternLock.html', {
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            modal.show();
            $rootScope.modalHeight = $('.modal').height();
            $rootScope.hidePatternLock = function () {
                modal.hide();
            };
            $rootScope.patternLockModal = modal;
        });
    };

    $scope.ready = (function () {
        utils.$ocLazyLoad.load([
            'mobiscroll',
            'rating',
            'mfb-menu',
            'echarts',
            'patternLock',
            'animate'
        ]);
        utils.$timeout(function () {
            $rootScope.init = 1;
        }, 500);
        utils.$timeout(function () {
            $rootScope.init = 2;
        }, 1000);
    })();
}]);