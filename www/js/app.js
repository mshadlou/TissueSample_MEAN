angular.module('Tissue_Sample_Project',[
	'ngRoute'
]);

angular.module('Tissue_Sample_Project')
	.controller('ApplicationCtrl', ["$scope", "$location", "$rootScope", function($scope,$location,$rootScope) {
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
	}])
angular.module('Tissue_Sample_Project')
	.controller('DashboardCtrl',["$scope", "DashboardSvc", "utils", function($scope,DashboardSvc,utils){
		// Memory allocation
		$scope.Show_CollectionForm = true;
		$scope.Show_SampleForm = false;
		$scope.Show_CollectionTables = true;
		$scope.Show_SampleTables = false; // default is False
		$scope.count_EditCollection = 0;
		$scope.temp_id_collection = 0;
		$scope.s_datain = {};// sample data in form
		$scope.c_datain = {};// collection data in form
		$scope.Collection_search_results = [];
		$scope.Sample_results = [];
		var default_box = "\u{2715}";
		$scope.Table_S = 0; // initial value for size of sample rows
		let search_box_activated = false; // default value

		$scope.Max_no_ids_per_page = 5;
		$scope.PageID = 1;
		$scope.Show_Pagination = false;
		$scope.Show_PagePrevious = false;
		$scope.Show_PageNext = false;

		///////////////////// Utils
		$scope.ResetView = function(){
			$scope.Show_CollectionForm = true;
			$scope.Show_SampleForm = false;
			$scope.Show_SampleTables = false;
		}

		// set the maximum number of rows per Table view for Collection table
		$scope.SetMaxRows = function(no){ 
			$scope.Max_no_ids_per_page = parseInt(no);
			$scope.PageID = 1; // reset PageID 
			$scope.pageloader($scope.PageID); // update view
			$scope.ResetView();
		}

		///////////////////// Page loading commands and paginations
		
		$scope.pageloader = function(p_id){
			let res = DashboardSvc.fetchCollections(p_id,$scope.Max_no_ids_per_page);
			if (!res.out){
				$scope.Warning_Snackbar(res.message);
			} else {
				$scope.Collection_search_results = []; // reset the collection result
				res.data.forEach((x,i)=>{ // set the collection result
					$scope.Collection_search_results.push({
						id: x.id,
						disease_term: x.disease_term,
						title: x.title,
						date: x.date,
						htmlcode: default_box
					})
				});
				if (res.count > $scope.Max_no_ids_per_page){
					$scope.Show_Pagination = true;
				}
				$scope.Show_PagePrevious = res.prev;
				$scope.Show_PageNext = res.next;
			}
		};

		$scope.nextPage = function(){
			++this.PageID;
			$scope.pageloader($scope.PageID);
			$scope.ResetView();
		}

		$scope.previousPage = function(){
			--this.PageID;
			$scope.pageloader($scope.PageID);
			$scope.ResetView();
		}

		$scope.pageloader($scope.PageID); // on page loading


		//////////////////// Search quert response
		$scope.CollectionSearch = function(){
			if ($scope.search_query.length >= 4){// length of the query will be more than 4 to check with server unless, local search is carried out
				search_box_activated = true;
				let res = DashboardSvc.searchCollections($scope.search_query);
				if (!res.out){
					$scope.Warning_Snackbar(res.message);
				} else {
					// $scope.Snackbar(res.message);
					$scope.Collection_search_results = []; // reset the collection result
					res.data.forEach((x,i)=>{ // set the collection result
						$scope.Collection_search_results.push({
							id: x.id,
							disease_term: x.disease_term,
							title: x.title,
							date: x.date,
							htmlcode: default_box
						})
					});

				}
			} else {
				if (search_box_activated){
					search_box_activated = false;
					$scope.pageloader($scope.PageID); // loading the page again
				} // else still local search is active
			}
		}

		////////////////////////////////////////////////////////////////////
		// Create or Update Collection and Sample documents on the user's request 
		$scope.Update_CollectionForm = function(c_datain){
			let command = 'create/update';
			DashboardSvc.CRUDcollection(c_datain, command)
			.then((val)=>{
				if (!val.out){
					$scope.Warning_Snackbar(val.message);
				} else {
					// $scope.Snackbar(val.message);
					if (val.create){
						$scope.Collection_search_results.push({
							id: val.data.id,
							disease_term: val.data.disease_term,
							title: val.data.title,
							date: val.data.date,
							htmlcode: default_box
						});
						if ($scope.Collection_search_results.length > $scope.Max_no_ids_per_page){
							++$scope.PageID;
							$scope.pageloader($scope.PageID);
						}
					} else { // update document
						$scope.Collection_search_results.forEach((x,i)=>{
							if (x.id == val.data.id){
								x.disease_term = val.data.disease_term;
								x.title = val.data.title;
							}
						})
					}
					utils.set_form_empty(c_datain);// reset the form
				}
			})
		}
		
		$scope.Update_SampleForm = function(){
			let command = 'create/update';
			DashboardSvc.CRUDsample($scope.s_datain, command)
			.then((val)=>{
				if (!val.out){
					$scope.Warning_Snackbar(val.message);
				} else {
					// $scope.Snackbar(val.message);
					if (val.create){ // new document
						$scope.Sample_results.push(val.data);
						++$scope.Table_S;
						$scope.Show_SampleTables = true;
					} else { // edit command
						$scope.Sample_results.forEach((x,i)=>{
							if (x.id == val.data.id){
								x.donor_count = val.data.donor_count;
								x.mat_type = val.data.mat_type;
							}
						})
					}
					
					//utils.set_form_empty(s_datain);// reset the form
					// set initial value for next try
					$scope.s_datain.id = 0;
					$scope.s_datain.donor_count = 0;
					$scope.s_datain.mat_type = "";
				}
			})	
		}

		//////////////////////////////////////////////////////////////////////
		// Display the table of samples when user select a Collection row
		$scope.DisplaySample = function(id){
			$scope.ResetView();
			$scope.Collection_search_results.forEach((x,i)=>{
				if (x.id == id && x.htmlcode == default_box){
					x.htmlcode = "\u{2713}";// 2705

					let res = DashboardSvc.searchSamples(x.id); //search for samples usinf collection id
					if (!res.out){
						$scope.Warning_Snackbar(res.message);
						$scope.Sample_results = []; // reset the collection result
						$scope.Table_S = 0; // reset
					} else {
						// $scope.Snackbar(res.message);
						$scope.Sample_results = []; // reset the collection result
						$scope.Sample_results = res.data;
						$scope.Table_S = res.data.length;
						$scope.Show_SampleTables = true; // show sample tables when we have some documents

						++$scope.count_EditCollection;
					}
					$scope.Show_SampleForm = true;
					$scope.Show_CollectionForm = false;
					$scope.s_datain = {id: 0, c_id: x.id, donor_count: 0, mat_type:""}; // set initial value

				} else {
					x.htmlcode = default_box;
				}
			});
		}

		/////////////////////////////////////////////////////////////////////
		// Even trigered when user wants to edit a row of Collections
		$scope.EditCollection = function(id){// I should not do anything else, it is enough
			$scope.Show_SampleTables = false;
			$scope.Show_SampleForm = false;
			if ($scope.count_EditCollection >= 1) { // switch on/off displaying collection edit form
				if ($scope.Show_CollectionForm){
					$scope.Show_CollectionForm = false;
				} else {
					$scope.Show_CollectionForm = true;
				}
			}
			if ($scope.temp_id_collection != id){
				$scope.temp_id_collection = id;
				$scope.Show_CollectionForm = true;
			}
			++$scope.count_EditCollection;

			$scope.Collection_search_results.forEach((x,i)=>{
				if (x.id == id){
					$scope.c_datain = {
						id: x.id, 
						disease_term : x.disease_term,
						title: x.title,
						htmlcode: default_box
					};
					$scope.Collection_search_results[i].htmlcode = default_box; // de-select the row
				}
			});
		}
		// Even trigered when user wants to edit a row of Samples
		$scope.EditSample = function(id){
			$scope.Sample_results.forEach((x,i)=>{
				if (x.id == id){
					$scope.s_datain = {
						id: x.id,
						c_id: x.c_id,
						donor_count: x.donor_count,
						mat_type: x.mat_type
					};
				}
			});
		}

		//////////////////////////////////////////////////////////////////////
		// Delete any row of Collections or Samples up on user's request and after verification by submiting a Modal warning
		$scope.DeleteCollection = function(id){
			$scope.ModalMessage = "This will delete both Collection and all associated Samples permanently!";
			utils.WarningModal((ev)=>{ // display the Warning Modal and wait for callback
				if (ev){
					$scope.Collection_search_results.forEach((x,i)=>{
						if (x.id == id){
							let value = {
								id: x.id, 
								disease_term : x.disease_term,
								title: x.title};
							DashboardSvc.CRUDcollection(value,'delete')
							.then((val)=>{
								if (!val.out){
									$scope.Warning_Snackbar(val.message);
								} else {
									$scope.Collection_search_results.splice(i, 1);
									if ($scope.Collection_search_results.length == 0 && $scope.PageID > 1){
										--$scope.PageID;
										$scope.pageloader($scope.PageID);
									}
								}
							})
						}
					});
				}
			})
		}

		$scope.DeleteSample = function(id){
			$scope.ModalMessage = "This will delete this Sample permanently!";
			utils.WarningModal((ev)=>{ // display the Warning Modal and wait for callback
				if (ev){
					let i = $scope.Sample_results.findIndex( x => x.id === id );
					if (i >= 0){
						DashboardSvc.CRUDsample({
							id:id,
							c_id:$scope.Sample_results[i].c_id,
							donor_count:$scope.Sample_results[i].donor_count,
							mat_type:$scope.Sample_results[i].mat_type
						},'delete')
						.then((val)=>{
							if (!val.out){
								$scope.Warning_Snackbar(val.message);
							} else {
								// $scope.Snackbar(val.message);
								$scope.Sample_results.splice(i, 1);
								--$scope.Table_S;								
							}
						})
					}
				}
			})
		}
}])
angular.module('Tissue_Sample_Project')
	.service('DashboardSvc',["$http", function($http){
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
}])
angular.module('Tissue_Sample_Project')
.filter('ShowDateDDMMYYY', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        let pdate = Date.parse(string)
        return moment(new Date(pdate)).format('DD/MM/YYYY')
    };
}])
 
.filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i=0; i<total; i++)
        input.push(i);
      return input;
    };
});
angular.module('Tissue_Sample_Project')
.service('authInterceptor', ["$q", "$location", function($q,$location) {	   
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
	
}])
angular.module('Tissue_Sample_Project')
.config(["$routeProvider", "$locationProvider", function($routeProvider,$locationProvider){
	//use the HTML5 History API	
	$locationProvider.html5Mode(true); // HTML5 Pushstate to remove /# from URL
	$routeProvider
		.when('/',{controller:'DashboardCtrl', templateUrl: 'dashboard.html'})
		.when('/404',{templateUrl: '404.html'}) // error 404
		.when('/403',{templateUrl: '403.html'}) // error 403
		.when('/500',{templateUrl: '404.html'}) // error 500

}])
//
.config(['$httpProvider', function($httpProvider) { // to control different kind of HTTP response as HTTP 401, 201, etc.
	$httpProvider.interceptors.push('authInterceptor'); // go to interceptor.svc.js    for its reference
}])
angular.module('Tissue_Sample_Project')
	.service('utils',function(){
        var svc = this;	

        svc.set_form_empty = function(obj) {
			var list = Object.keys(obj);
			list.forEach((x,i)=>{obj[""+x]=""});	
		}

		svc.DateReturn = function(pDate) {
			let dd = pDate.split("/")[0];
			let mm = pDate.split("/")[1]-1;
			let yyyy = pDate.split("/")[2];
			return new Date(yyyy, mm, dd);			
		}

		svc.WarningModal = function(cb){
			var WModal = document.getElementById('WarningModelStatic');
			var btnclose1 = document.getElementById('CloseModal1');
			var btnclose2 = document.getElementById('CloseModal2');
			var btnapprove = document.getElementById('ApproveModal');

			// Display the Modal
			WModal.style.display = "block";
			WModal.className="modal fade show"; 

			//hide the modal on btnclose1
			btnclose1.addEventListener('click', (e) => {
				WModal.style.display = "none";
				WModal.className="modal fade";
				cb(false);
			});

			//hide the modal on btnclose2
			btnclose2.addEventListener('click', (e) => {
				WModal.style.display = "none";
				WModal.className="modal fade";
				cb(false);
			});
			//hide the modal on btnapprove
			btnapprove.addEventListener('click', (e) => {
				WModal.style.display = "none";
				WModal.className="modal fade";
				cb(true);
			});
		}
    })