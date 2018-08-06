angular.module('utils.http', ['utils.security']).factory('http', ['$http','$ionicPopup', 'security','cache', '$ionicLoading','$q', function ($http,$ionicPopup, security,cache, $ionicLoading,$q) {
    return {
        url: "",
        parms: {},
        isPost: false,
        config: {},
        loadingMsg: "加载中",
        go: function () {
            if (this.url == "") {
                console.log("api地址URL不能为空");
                return this;
            }
             
            var defaultConfig = {
                type: 'GET',
                timeout: 50000,
                headers: {},
                transformRequest: [function (data) {
                    return angular.isObject(data) && String(data) !== '[object File]' ? formatParams(data) : data;
                }]
            };
            if(this.parms==null || this.parms==undefined)
                this.parms={USER_ID:cache.get('userId')};
            else
                this.parms.USER_ID=cache.get('userId');

            this.config = this.config ? angular.extend({}, defaultConfig, this.config) : defaultConfig;
            this.config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            var result;

            $ionicLoading.show({
                //{string=} template 指示器的html内容。
                //{ string=} templateUrl 一个加载html模板的url作为指示器的内容。
                //{ boolean=} noBackdrop 是否隐藏背景。默认情况下它会显示。
                //{ number=} delay 指示器延迟多少毫秒显示。默认为不延迟。
                //{ number=} duration 等待多少毫秒后自动隐藏指示器。默认情况下，指示器会一直显示，直到触发.hide() 。
                //duration: 10000,
                template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner><br/>' + this.loadingMsg
            });

            if (!this.isPost) {
                this.config.type = "GET";
                this.config.params = this.parms;
                //result= $http.get(this.url, this.config);
                result = $http.get(this.url, this.config).then(function (response) {
                    $ionicLoading.hide();
                    //console.log(response);
                    return response;
                }, function (error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: '系统提示',
                        template: '系统操作异常：'+JSON.stringify(error)
                    });

                    console.log(error);
                    return $q.reject(error);
                });
            }
            else {
                this.config.type = "POST";
                //this.config.params = this.parms;
                //var data = { userId: '',opt: Config.debug ? this.parms : security.encrypt(angular.toJson(this.parms)) }
                var data = this.parms;
                result = $http.post(this.url, data, this.config).then(function (response) {
                    $ionicLoading.hide();
                    //console.log(response);
                    return response;
                }, function (error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: '系统提示',
                        template: '系统操作异常：'+JSON.stringify(error)
                    });
                    console.log(error);
                    return $q.reject(error);
                }, function () { 
                });
            }

            return result;
        }
    }

    //return function(service,params,config){
    //	var url = service;
    //	console.log(service);
    //	if(typeof service == 'object'){
    //		url = service.url;
    //		if(!params){
    //			params = service.params;
    //		}
    //		if(!config){
    //			config = service.config;
    //		}
    //	}else if(typeof service == 'string'){
    //		url = service;
    //	}

    //	if(url.substr(0,4) != 'http' && url.substr(0,1)!='.'){
    //		url = Config.server + url;
    //	}

    //	var defaultConfig = {
    //		type:'POST',
    //		timeout:30000,
    //		headers:{},
    //		transformRequest:[ function(data) {
    //			return angular.isObject(data) && String(data) !== '[object File]' ? formatParams(data) : data;
    //		}]
    //	};
    //	config = config?angular.extend({},defaultConfig,config):defaultConfig;
    //	config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    //	console.log(params);
    //	var paramStr = angular.toJson(params);
    //	var promise;
    //	if('.json'==url.substr(url.length-5,5)){
    //		promise = $http.get(url,config);
    //	}else{
    //		console.log(config);
    //		promise = $http.post(url,{devId:'',userId:'',serviceId:params.serviceId,opt:Config.debug?paramStr:security.encrypt(angular.toJson(paramStr))},config);
    //	}
    //	return promise;
    //};
}]);

var formatParams = function (obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
            for (i = 0; i < value.length; i++) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += formatParams(innerObj) + '&';
            }
        } else if (value instanceof Object) {
            for (subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName
                    + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += formatParams(innerObj) + '&';
            }
        } else if (value !== undefined
            && value !== null) {
            query += encodeURIComponent(name) + '='
                + encodeURIComponent(value) + '&';
        }
    }
    return query.length ? query.substr(0, query.length - 1) : query;
};