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