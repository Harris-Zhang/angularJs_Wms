angular.module('utils.interceptor', ['utils.cache']).factory('httpInterceptor', ['$q', '$rootScope', 'cache', function ($q, $rootScope, cache) {
    var isSessionTimeout = false;
    return {
        request: function (config) {
            // if(config.url.substr(0,9)!='template/'){
            // 	config.url = config.url + '?_='+Config.random;
            // }
            return config;
        },
        response: function (response) {
            //拦截器
            //后台返回格式{type:1,message:'调用成功',value:{}}
 
            if (Config.debug) {
                response.data = response.data;
            } else {
                response.data = eval('(' + app.utils.security.decrypt(response.data) + ')');
            }
            switch (response.data.type) {
                case '401':
                    if (!isSessionTimeout) {
                        if (response.config.url.indexOf('logout') == -1) {
                            alert('会话已超时，请重新登录！');
                        }
                        cache.setItem('session', '');
                        $rootScope.isLogin = false;
                        //$rootScope.go('login');
                        location.href = '';
                    }
                    isSessionTimeout = true;
                    break;
                default:
                    break;
            }


            return response;
        },
        requestError: function (request) {
            console.log('【请求异常】');
            return $q.reject(request);
        },
        responseError: function (response) {
            console.log('【响应异常】');
            console.log(response);
            return $q.reject(response);
        }
    };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);
