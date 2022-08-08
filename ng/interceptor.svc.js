angular.module('Tissue_Sample_Project')
.service('authInterceptor', function($q,$location) {	   
    var service = this;
	var ServerURL = HostName;
	  
    service.responseError = function(response) {
        if (response.status === 401){
			$location.path('/').replace();
        }
        if (response.status === 403){ // forbidden request
			$location.path('/403').replace();
        }		
        if (response.status === 404){ // page not found
			$location.path('/404').replace(); 
        }
        if (response.status === 500){// internal server error
			$location.path('/500').replace();
        }		
		
        return $q.reject(response);
    };
	
})