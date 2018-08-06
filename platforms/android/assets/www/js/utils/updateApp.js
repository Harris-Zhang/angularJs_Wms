angular.module('utils.updateApp', []).factory('updateApp', ['$rootScope', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', '$q', '$timeout', '$ionicLoading', '$ionicPopup',
    function ($rootScope, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $q, $timeout, $ionicLoading, $ionicPopup) {
        var downloadPath;
        return {

            initDownLoadDir: function () {
                /**
                 * cordova.file.dataDirectory 不同平台对应位置如下
                 *  android:'data/data/<app-id>/files/'
                 *  IOS:'/var/mobile/Applications/<UUID>/Library/NoCloud/'
                 */

                /**
                 * 因android平台,apk类型的文件放到cordova.file.dataDirectory下,将无法正常安装
                 * 因此,针对不同平台,使用不同的下载目录
                 */
                if (ionic.Platform.isAndroid()) {
                    // 初始化android平台的下载目录
                    downloadPath = cordova.file.externalRootDirectory + 'Download';
                    this.createDir(cordova.file.externalRootDirectory, 'Download')
                        .then(function (success) {
                            downloadPath = success.nativeURL;
                        }, false);
                } else {
                    // 初始化IOS平台的下载目录
                    downloadPath = cordova.file.dataDirectory + 'Download';

                    this.createDir(cordova.file.dataDirectory, 'Download')
                        .then(function (success) {
                            downloadPath = success.nativeURL;
                        }, false);
                }
            },
            /**
             * 创建目录
             * @param path 目录
             * @param directory 目录名称
             */
            createDir: function (path, directory) {
                var deferred = $q.defer();
                $cordovaFile.checkDir(path, directory)
                    .then(function (success) {
                        console.log('目录已存在');
                    }, function (error) {
                        console.log('目录不存在:' + angular.toJson(error));
                        $cordovaFile.createDir(path, directory, false)
                            .then(function (success) {
                                deferred.resolve(success);
                                console.log("目录创建成功!" + angular.toJson(success));
                            }, function (error) {
                                deferred.reject(error);
                                console.log("目录创建失败!" + angular.toJson(error));
                            });
                    });


                return deferred.promise;
            },
            /**
             * 文件下载
             * @param url 资源定位
             * @param targetPath 文件存储位置
             * @returns {Promise}
             */
            download: function (url, targetPath) {
                var deferred = $q.defer();

                // 允许所有安全证书
                var trustAllHosts = true;
                // 选项
                var options = {};

                //$ionicLoading.show({template: "已经下载0%"});
                $cordovaFileTransfer.download(url, targetPath, options, trustAllHosts)
                    .then(function (success) {
                        $ionicLoading.hide();
                        console.log("下载成功!" + angular.toJson(success));
                        deferred.resolve(success);
                    }, function (error) {
                        deferred.reject(error);
                        console.log("下载失败!" + angular.toJson(error));

                        var alertPopup = $ionicPopup.alert({
                            title: '系统提示',
                            template: '下载失败：' + angular.toJson(error)
                        });
                        $ionicLoading.hide();
                    }, function (progress) {
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({template: "已经下载" + Math.floor(downloadProgress) + "%"});

                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        });
                    });

                return deferred.promise;
            },

            /**
             * 更新apk
             */
            updateAPK: function (apk_url, apk_name) {
                var deferred = $q.defer();

                var targetPath = downloadPath + "/" + apk_name;
                apk_url = apk_url + apk_name;
                this.download(apk_url, targetPath)
                    .then(function () {
                        // 使用插件打开apk文件
                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive')
                            .then(function (success) {
                                console.log(angular.toJson(success));

                                deferred.resolve(success);
                            }, function (error) {
                                console.log(angular.toJson(error));

                                deferred.reject(error);
                            });
                    }, function (error) {
                        deferred.reject(error);
                    });
            }

        }
    }]);