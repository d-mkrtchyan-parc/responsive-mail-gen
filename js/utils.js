function exist(x){
	return typeof x != "undefined" && x !== null;
}

function replace(o, c){
	if(c=='1'){
		o.html(o.html().replace('Акция', 'Акции').replace('Премьера', 'Премьеры'));
	}else{
		o.html(o.html().replace('Акции', 'Акция').replace('Премьеры', 'Премьера'));
	}
}

function getData(item){
	return ({
		actions0 : {
			width : 192,
			height : 36,
			number : 5,
			alt : 'Акция недели',
			name : 'Акция недели'
		},
		actions1 : {
			width : 192,
			height : 35,
			number : 7,
			alt : 'Акции недели',
			name : 'Акции недели'
		},			
		news : {
			width: 232,
			height: 36,
			number: 1,
			alt: 'Новинки недели',
			name: 'Новинки недели'

		},
		couple : {
			height: 35,
			width: 160,
			number: 9,
			alt: 'Для двоих' ,
			name: 'Для Двоих'
		},
		premiers0 : {
			width: 224,
			height: 36,
			number: 2,
			alt: 'Премьера недели',
			name: 'Премьера недели'
		},
		premiers1 : {
			width: 228,
			height: 35,
			number: 6,
			alt: 'Премьеры недели',
			name: 'Премьеры недели'
		},
		bestsellers : {
			width: 256,
			height: 35,
			number : 4,
			alt: 'Бестселлеры недели',
			name: 'Бестселлеры недели'
		}
	})[item];		
}

function interpolate(str){
  var data = {},
    argc = arguments.length,
    argv = Array.prototype.slice.call(arguments),
    reg = /{{\s*[\w\.]+\s*}}/g;

  if(argc==2 && typeof argv[1] === 'object'){
    data = argv[1];
  }else{
    argv.slice(1, argc).forEach(function(e, i){
      data[i] = e;
    });
  }       

  return str.replace(reg, function(i){
    var arg = data[i.slice(2,-2)] || "";
    if(typeof arg === 'object'){
      arg=JSON.stringify(arg);
    }
    return arg;
  });
}

function uuid(){
	return [1,2,3].map(function(){ return (Math.random()*1000)>>0}).join('-');
}