angular.module('Tissue_Sample_Project')
.config(function($routeProvider,$locationProvider){
	//use the HTML5 History API	
	$locationProvider.html5Mode(true); // HTML5 Pushstate to remove /# from URL
	$routeProvider
		.when('/',{controller:'DashboardCtrl', templateUrl: 'dashboard.html'})
		.when('/404',{templateUrl: '404.html'}) // error 404
		.when('/403',{templateUrl: '403.html'}) // error 403
		.when('/500',{templateUrl: '404.html'}) // error 500

})
//
.config(['$httpProvider', function($httpProvider) { // to control different kind of HTTP response as HTTP 401, 201, etc.
	$httpProvider.interceptors.push('authInterceptor'); // go to interceptor.svc.js    for its reference
}])