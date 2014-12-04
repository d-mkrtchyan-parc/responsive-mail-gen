$(function(){
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
				height : 35,
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
        var arg = data[i.slice(2,-2)] || i;
        if(typeof arg === 'object'){
          arg=JSON.stringify(arg);
        }
        return arg;
      });
    }

    function uuid(){
    	return [1,2,3].map(function(){ return (Math.random()*1000)>>0}).join('-');
    }

	var list = $(".gen-content ul#sortable"),
		table = $("table.main"),
		anchor = $("#replacement"),
		cached = $(".gen-demo").html(),
		conjunctions = {};





	list.sortable();

	$(".gen-item").each(function(){
		var $this = $(this);

		if(exist($this.attr("data-repeatable"))){
			$(this).append("<span class='ball add'></span>")
		}

		if(exist($this.attr("data-quantitable"))){
			$(this).append("<span class='ball quantity'></span>")
		}
	});


	conjunctions['default'] = {
		urlimg : {
			a_url : 'http://pudra.ru',
			img_url : 'http://placehold.it/688x288.png'
		},
		text : {
			text : 'Некий текст'
		},
		table : {
			prod1_img_link : 'http://pudra.ru',
			prod1_img_src : 'http://placehold.it/210x210.png',
			prod1_brand: 'Brand',
			prod1_name: 'Name',
			prod1_category: 'Категория', 
			prod1_price : 'Цена',

			prod2_img_link : 'http://pudra.ru',
			prod2_img_src : 'http://placehold.it/210x210.png',
			prod2_brand: 'Brand',
			prod2_name: 'Name',
			prod2_category: 'Категория', 
			prod2_price : 'Цена',
			
			prod3_img_link : 'http://pudra.ru',
			prod3_img_src : 'http://placehold.it/210x210.png',
			prod3_brand: 'Brand',
			prod3_name: 'Name',
			prod3_category: 'Категория', 
			prod3_price : 'Цена'
		}
	}


	/* EVENTS */

	$(document).delegate('.gen-item .add', 'click', function(event){
		event.preventDefault();
		var item = $(this).parent();
		item.after(item.clone());
	}).
	delegate('.gen-item .remove', 'click', function(event){
		var item = $(this).parent(),
			isRepeatable = exist(item.attr('data-repeatable')),
			repeatables = $("[type='"+item.attr('type')+"'][data-repeatable]").length;

		$(this).toggleClass('inactive');

		if(isRepeatable && repeatables > 1){
			item.remove();
		}else{
			item.toggleClass('disabled');
		}
	}).
	delegate('.gen-item .quantity', 'click', function(event){
		var item = $(this).parent();

		if(item.attr('plural')=="0"){
			$(this).addClass('plural');	
			item.attr('plural', "1");
		}else{
			$(this).removeClass('plural');	
			item.attr('plural', "0");
		}

		replace(item, item.attr('plural'));
	}).
	delegate('.gen-item a:not(#save):not(#cancle)', 'click', function(e){
		e.preventDefault();
		var $this = $(this),
			item = $this.parent(),
			chain = item.attr('chain'),
			tmpl = $("script#params-" + chain).html(),
			id = false;

		$('.params').remove();

		if(!$this.hasClass('open')){
			$(this).after(tmpl);	
			
			if(!exist(item.attr('conjuncted'))){
				$('.params').find('form').attr('for', id = uuid());
				item.attr('conjuncted', id);
			}else{
				id = item.attr('conjuncted');
				$('.params').find('form').attr('for', id);
				$('.params form input, .params form select, .params form textarea').each(function(){
					var val = conjunctions[id] && conjunctions[id][$(this).attr('name')];
					$(this).val(val || "");
				});
			}
		}else{
			$('.params').remove();			
		}

		$this.toggleClass('open');		
	}).delegate('.gen-item a#save', 'click', function(e){
		e.preventDefault();

		var data = {},
			form = $('.params').find('form');
		
		form.serializeArray().forEach(function(e){
			data[e.name] = e.value;
		});

		conjunctions[form.attr('for')] = data;
		$('.gen-item a.open').removeClass('open');
		$('.params').remove();
	}).
	delegate('.gen-item a#cancle', 'click', function(e){
		e.preventDefault();
		$('.params').remove();
	});

	$("#width").change(function(){
		var cw = table.width(),
			bw = parseInt($(this).val()),
			brw =table.find('.gen-demo').width();

		table.width(cw - brw + bw);
		table.find('.gen-demo').width(bw);
	});

	$("#compile").click(function(e){
		e.preventDefault();
		$('.gen-demo').html(cached);
		anchor = $("#replacement");
		anchor.html('');

		$("#sortable li").each(function(index){
			var tmpl = $(this).attr('use'),
				template, data;

			if($(this).hasClass('disabled')){
				return 0;
			}

			if(tmpl.indexOf('ribbon')>=0){
				template = $("script#ribbon").html();
				data = getData(tmpl.match(/\[(.+)\]/).pop() + ($(this).attr('plural')||""));
				template = interpolate(template, data);
			}else{
				template = $("script#"+tmpl).html();
			}

			if(exist($(this).attr("chain"))){
				data = conjunctions[$(this).attr("conjuncted")] || conjunctions['default'][$(this).attr('chain')];
				template = interpolate(template, data);
			}

			anchor.append(template);
		});

	});

	$("#sanitize").click(function(e){
		e.preventDefault();
		var str = $("#code").val();

		if(str.length){
			str.replace('width="688"', '').replace('height="288"', "").replace("width:999px", "width:100%");
		}else{
			anchor.before(anchor.html()).remove();

			var data = {};
			$("#vars").serializeArray().forEach(function(e){
				data[e.name] = e.value
			})
			
			var email = $(".gen-demo").html(),
				res = interpolate(email, data);

			$("#code").val(res);
			$(".gen-demo").html(res);
		}
	});
});