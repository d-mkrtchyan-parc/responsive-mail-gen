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

	var list = $(".gen-content ul#sortable"),
		table = $("table.main"),
		anchor = $("#replacement"),
		cached = $(".gen-demo").html();

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

			anchor.append(template);
		});

	});

	$("#sanitize").click(function(e){
		e.preventDefault();
		anchor.before(anchor.html()).remove();

		var data = {};
		$("#vars").serializeArray().forEach(function(e){
			data[e.name] = e.value
		})
		
		var email = $(".gen-demo").html(),
			res = interpolate(email, data);

		$("#code").val(res);
		$(".gen-demo").html(res);
	});
});