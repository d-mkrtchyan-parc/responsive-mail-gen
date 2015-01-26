(function(){
	var userActions = $(document).stream('click, mousedown, mousemove, keydown, keyup'),
		inputs = $("input,select,textarea");


})();


(function(){
	var Storage  = {}

	if(localStorage.preset){
		Storage.preset = localStorage.preset
	}else{
		Storage.preset = 'preset-' + uuid();
		Storage.newPreset = true;
	}

	var preset = Storage[Storage.preset] = {};


	Storage.sync = function(block, data){

		Utils.each(data, function(value){
			preset[block.attr('id')][value.name] = value.value;
		});
	}


	window.Storage = Storage;
})();
