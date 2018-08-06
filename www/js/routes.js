angular.module('app.route').config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home', {
        url:'/home',
        controller:'homeController',
        templateUrl:function(){
            return 'templates/home/home.html';
        },
        cache:false,
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'js/directives/toast.js',
                    'templates/home/home.ctrl.js',
                    'templates/home/home.service.js'
                ]);
            }]
        }
    }).state('login', {
        url:'/login',
        cache:false,
        controller:'loginController',
        templateUrl:function(){
            return 'templates/login/login.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/login/login.ctrl.js',
                    'templates/login/login.service.js',
                ]);
            }]
        }
    }).state('list', {
        url:'/list/:index',
        cache:false,
        controller:'listController',
        templateUrl:function(){
            return 'templates/list/list.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/list/list.ctrl.js'
                ]);
            }]
        }
    }).state('issueMtrlReady', {
        url:'/issueMtrlReady',
        cache:false,
        controller:'issueMtrlReadyController',
        templateUrl:function(){
            return 'templates/issueMtrlReady/issueMtrlReady.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/issueMtrlReady/issueMtrlReady.ctrl.js',
                    'templates/issueMtrlReady/issueMtrlReady.service.js',
                ]);
            }]
        }
    }).state('issueMtrlCheck', {
        url:'/issueMtrlCheck',
        cache:false,
        controller:'issueMtrlCheckController',
        templateUrl:function(){
            return 'templates/issueMtrlCheck/issueMtrlCheck.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/issueMtrlCheck/issueMtrlCheck.ctrl.js',
                    'templates/issueMtrlCheck/issueMtrlCheck.service.js',
                ]);
            }]
        }
    }).state('issueMtrlApprove', {
        url:'/issueMtrlApprove',
        cache:false,
        controller:'issueMtrlApproveController',
        templateUrl:function(){
            return 'templates/issueMtrlApprove/issueMtrlApprove.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/issueMtrlApprove/issueMtrlApprove.ctrl.js',
                    'templates/issueMtrlApprove/issueMtrlApprove.service.js',
                ]);
            }]
        }
    }).state('returnMtrlApprove', {
        url:'/returnMtrlApprove',
        cache:false,
        controller:'returnMtrlApproveController',
        templateUrl:function(){
            return 'templates/returnMtrlApprove/returnMtrlApprove.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/returnMtrlApprove/returnMtrlApprove.ctrl.js',
                    'templates/returnMtrlApprove/returnMtrlApprove.service.js',
                ]);
            }]
        }
    }).state('test', {
        url:'/test',
        cache:false,
        controller:'testController',
        templateUrl:function(){
            return 'templates/test/test.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/test/test.ctrl.js',
                ]);
            }]
        }
    }).state('test2', {
        url:'/test2',
        cache:false,
        controller:'test2Controller',
        templateUrl:function(){
            return 'templates/test2/test2.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/test2/test2.ctrl.js',
                ]);
            }]
        }
    }).state('setBluetooth', {
        url:'/setBluetooth',
        cache:false,
        controller:'setBluetoothController',
        templateUrl:function(){
            return 'templates/setBluetooth/setBluetooth.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'templates/setBluetooth/setBluetooth.ctrl.js',
                ]);
            }]
        }
    }).state('contacts', {
        url:'/contacts',
        cache:false,
        controller:'contactsController',
        templateUrl:function(){
            return 'modules/sample/views/contacts.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'modules/sample/controllers/contactsController.js'
                ]);
            }]
        }
    }).state('chart', {
        url:'/chart',
        cache:false,
        controller:'chartController',
        templateUrl:function(){
            return 'modules/sample/views/chart.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'echarts',
                    'modules/sample/controllers/chartController.js'
                ]);
            }]
        }
    }).state('form', {
        url:'/form',
        cache:false,
        controller:'formController',
        templateUrl:function(){
            return 'modules/sample/views/form.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'rating',
                    'modules/base/directives/input-datetime.js',
                    'modules/base/directives/input-select.js',
                    'modules/base/directives/input-sfz.js',
                    'modules/base/directives/input-treelist.js',
                    'modules/base/directives/input-color.js',
                    'modules/base/directives/toast.js',
                    'modules/sample/controllers/formController.js'
                ]);
            }]
        }
    }).state('tab', {
        url:'/tab',
        cache:false,
        controller:'tabController',
        templateUrl:function(){
            return 'modules/sample/views/tab.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'modules/sample/controllers/tabController.js'
                ]);
            }]
        }
    }).state('loading', {
        url:'/loading',
        cache:false,
        controller:'loadingController',
        templateUrl:function(){
            return 'modules/sample/views/loading.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'modules/sample/controllers/loadingController.js'
                ]);
            }]
        }
    }).state('live', {
        url:'/live',
        cache:false,
        controller:'liveController',
        templateUrl:function(){
            return 'modules/sample/views/live.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'modules/sample/controllers/liveController.js'
                ]);
            }]
        }
    }).state('calendar', {
        url:'/calendar',
        cache:false,
        controller:'calendarController',
        templateUrl:function(){
            return 'modules/sample/views/calendar.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'mobiscroll',
                    'modules/sample/controllers/calendarController.js'
                ]);
            }]
        }
    }).state('map', {
        url:'/map',
        cache:false,
        controller:'mapController',
        templateUrl:function(){
            return 'modules/sample/views/map.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'modules/sample/controllers/mapController.js'
                ]);
            }]
        }
    }).state('customerList', {
        url:'/customer/list',
        cache:false,
        abstract:true,
        controller:'customerController',
        templateUrl:function(){
            return 'modules/sample/views/customerList.html';
        },
        resolve:{
            load:['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'modules/sample/controllers/customerController.js'
                ]);
            }]
        }
    }).state('customerList.tabs', {
        url:'/tabs/:type',
        cache:false,
        views:{
            'customer':{
                controllerProvider:['$stateParams',function($stateParams){
                    return $stateParams.type+'CustomerController';
                }],
                templateUrl:function(){
                    return 'modules/sample/views/tabsCustomerList.html';
                },
                resolve:{
                    load:['$ocLazyLoad','$stateParams',function ($ocLazyLoad,$stateParams) {
                        return $ocLazyLoad.load([
                            'modules/sample/controllers/'+$stateParams.type+'CustomerController.js'
                        ]);
                    }]
                }
            }
        }
    }).state('customerList.tab', {
        url:'/tab/:type',
        cache:false,
        nativeTransitions:null,
        views:{
            'customer':{
                controllerProvider:['$stateParams',function($stateParams){
                    return $stateParams.type+'CustomerController';
                }],
                templateUrl:function(params){
                    return 'modules/sample/views/'+params.type+'CustomerList.html';
                },
                resolve:{
                    load:['$ocLazyLoad','$stateParams', function ($ocLazyLoad,$stateParams) {
                        return $ocLazyLoad.load([
                            'modules/sample/controllers/'+$stateParams.type+'CustomerController.js'
                        ]);
                    }]
                }
            }
        }
    });
}]);