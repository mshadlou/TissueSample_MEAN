angular.module('Tissue_Sample_Project')
	.service('DashboardSvc',function($http){
		var svc = this;		
		var ServerURL = HostName;

		svc.fetchCollections = function(p_id,max_page){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open('GET', ServerURL+'/pro/getCollection/'+p_id+'/'+max_page,false);
			httpRequest.send();
			return JSON.parse(httpRequest.responseText);
		}

		svc.searchCollections = function(querytext){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open('GET', ServerURL+'/pro/searchCollection/'+querytext,false);
			httpRequest.send();
			return JSON.parse(httpRequest.responseText);
		}

		this.CRUDcollection = function(collection,command){
			return $http.post(ServerURL+'/pro/CRUDcollection',{data:collection, com:command})
			.then ( (response) => {
				return response.data;
			})
		}

		svc.searchSamples = function(querytext){
			var httpRequest = new XMLHttpRequest();
			httpRequest.open('GET', ServerURL+'/pro/searchSample/'+querytext,false);
			httpRequest.send();
			return JSON.parse(httpRequest.responseText);
		}

		this.CRUDsample = function(collection,command){
			return $http.post(ServerURL+'/pro/CRUDsample',{data:collection, com:command})
			.then ( (response) => {
				return response.data;
			})
		}
})