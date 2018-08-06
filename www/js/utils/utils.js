angular.module('utils',[
	'utils.format',
	'utils.cache',
	'utils.http',
	'utils.service',
	'utils.security',
    'utils.interceptor',
    'utils.updateApp',
	'utils.popup'
]).factory('utils',[
	'format',
	'cache',
	'http',
    'security',
    'updateApp',
	'popup',

	'$ocLazyLoad',
	'$filter',
	'$state',
	'$stateParams',
	'$timeout',
	'$interval',
	'$location',
	'$compile',
	'$templateRequest',

	'$ionicPlatform',
	'$ionicHistory',
	'$ionicPosition',
	'$ionicScrollDelegate',
	'$ionicNavBarDelegate',
	'$ionicModal',
	'$ionicLoading',
	'$ionicPopup',
	'$ionicPopover',
	'$ionicViewSwitcher',
	'$ionicSlideBoxDelegate',
	'$ionicSideMenuDelegate',
	'$ionicNativeTransitions',

	'$cordovaAppVersion',
	'$cordovaBluetoothSerial',
    '$cordovaBarcodeScanner',
	'$cordovaKeyboard',
	'$cordovaToast',
	'$cordovaFileTransfer',
	'$cordovaNetwork',
	'$cordovaGeolocation',function(
		format,
		cache,
		http,
        security,
        updateApp,
        popup,

		$ocLazyLoad,
		$filter,
		$state,
		$stateParams,
		$timeout,
		$interval,
		$location,
		$compile,
		$templateRequest,

		$ionicPlatform,
		$ionicHistory,
		$ionicPosition,
		$ionicScrollDelegate,
		$ionicNavBarDelegate,
		$ionicModal,
		$ionicLoading,
		$ionicPopup,
		$ionicPopover,
		$ionicViewSwitcher,
		$ionicSlideBoxDelegate,
		$ionicSideMenuDelegate,
		$ionicNativeTransitions,

        $cordovaAppVersion,
        $cordovaBluetoothSerial,
        $cordovaBarcodeScanner,
        $cordovaKeyboard,
        $cordovaToast,
		$cordovaFileTransfer,
		$cordovaNetwork,
		$cordovaGeolocation){
	return {
		format:format,
		cache:cache,
		http:http,
		security:security,
        updateApp:updateApp,
        popup:popup,

		$ocLazyLoad:$ocLazyLoad,
		$filter:$filter,
		$state:$state,
		$stateParams:$stateParams,
		$timeout:$timeout,
		$interval:$interval,
		$location:$location,
		$compile:$compile,
		$templateRequest:$templateRequest,

		$ionicPlatform:$ionicPlatform,
		$ionicHistory:$ionicHistory,
		$ionicPosition:$ionicPosition,
		$ionicScrollDelegate:$ionicScrollDelegate,
		$ionicNavBarDelegate:$ionicNavBarDelegate,
		$ionicModal:$ionicModal,
		$ionicLoading:$ionicLoading,
		$ionicPopup:$ionicPopup,
		$ionicPopover:$ionicPopover,
		$ionicViewSwitcher:$ionicViewSwitcher,
		$ionicSlideBoxDelegate:$ionicSlideBoxDelegate,
		$ionicSideMenuDelegate:$ionicSideMenuDelegate,
		$ionicNativeTransitions:$ionicNativeTransitions,

        $cordovaAppVersion:$cordovaAppVersion,
        $cordovaBluetoothSerial:$cordovaBluetoothSerial,
        $cordovaBarcodeScanner:$cordovaBarcodeScanner,
        $cordovaKeyboard:$cordovaKeyboard,
        $cordovaToast:$cordovaToast,
		$cordovaFileTransfer:$cordovaFileTransfer,
		$cordovaNetwork:$cordovaNetwork,
		$cordovaGeolocation:$cordovaGeolocation
	};
}]);
