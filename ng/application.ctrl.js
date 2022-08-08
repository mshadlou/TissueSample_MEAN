angular.module('Tissue_Sample_Project')
	.controller('ApplicationCtrl', function($scope,$location,$rootScope) {
		///////////////////////// Main part  
		$scope.isLogOut = true;
		$scope.ServerURL = HostName;	
		$scope.isNotHome = false;
		document.getElementById("PageName").innerHTML = "";
		if ($location.url() !== '/'){
			$scope.isNotHome = true;
		}
		 
		$scope.closeNav = function() {
			document.getElementById("mySidenav").style.width = "0";
			document.getElementById("myDarkBack").style.width = "0";
		}	
		 
		$scope.Snackbar = function(message){
			var x = document.getElementById("snackbar");
			x.innerHTML = message;
			x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);			
		}
		
		$scope.Warning_Snackbar = function(message){
			var x = document.getElementById("warning_snackbar");
			x.innerHTML = message;
			x.className = "showWS";
			setTimeout(function(){ x.className = x.className.replace("showWS", ""); }, 4000);			
		}	

		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			$scope.isNotHome = false;
			if (($location.url() === '/') ||  ($location.url() === '/403')){
				$location.replace();
			} else{
				$scope.isNotHome = true;
			}
					
		});
	})