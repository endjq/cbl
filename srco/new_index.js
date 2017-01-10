
$(".on-xuan").mouseover(function(){
	 $(this).addClass("on-xuan");
     $(this).siblings().removeClass("on-xuan");
     $(".youhui").hide();
 $(".duanzu").show();
 });
 $(".on-xuan").siblings().mouseover(function(){
	 $(this).addClass("on-xuan")
	 $(this).siblings().removeClass("on-xuan")
	 $(".duanzu").hide();
	 $(".youhui").show();
});
/*
str=<li>8:30</li>
<li>9:00</li><li>9:30</li>
<li>10:00</li><li>10:30</li>
<li>11:00</li><li>11:30</li>
<li>12:00</li><li>12:30</li>
<li>13:00</li><li>13:30</li>
<li>14:00</li><li>14:30</li>
<li>15:00</li><li>15:30</li>
<li>16:00</li><li>16:30</li>
<li>17:00</li><li>17:30</li>
<li>18:00</li>
*/
//period=9:00-20:00
function online_period(period,label){
     var start,end,i=0,str='';
	 var per=period.split("-");//per=["8:30", "18:00"]
	 if(per){
			 start=per[0].split(":");//start=["8", "30"]  console.log(start);
			 end=per[1].split(":");  //end=["18", "00"]
			 for(i=parseInt(start[0]);i<=parseInt(end[0]);i++){
				 if(i==parseInt(start[0])&&start[1]=='30'){
					 str+='<'+label+'>'+per[0]+'</'+label+'>';
					 continue;
				 }
				 if(i==parseInt(end[0])&&end[1]=='00'){
					str+='<'+label+'>'+per[1]+'</'+label+'>';
					break;
				 }
				 str+='<'+label+'>'+i+':00</'+label+'><'+label+'>'+i+':30</'+label+'>';
			 };
	 }
     return str;
}


choose_shop();

/*时间*/
if($('.sz_time').length>0){
	$('.choose_time').click(function(){
	    $('ol.sz_time').hide();
		$(this).next('ol').toggle();
	});
	$('.sz_time').on('click','li',function(){
	    var obj=$(this).parent();
	    obj.prev().val($(this).html());
		obj.hide('fast');
	});
}
/*时间*/

/*发送Ajax(基于jquery的)*/
function get_shop(city_id){ 
	
$.ajax({
		//type:"POST",
		async:true,
		url:'http://cbl.xinyejq.com/srco/datas.js',//必须要有的
		//data:"city_id="+city_id,
		dataType:'json',//必须要有的
		success:function(jso){
			var str='';
			for(var k in jso){  
				var arry=jso[k];
				if(city_id==k){
				  for(var i in arry){
					  var shop="";
					  var shoplist=arry[i]['shop'];
					  for(var j in shoplist){
						  shop+='<dd><b data_id="'+shoplist[j]["id"]+'">'+shoplist[j]["name"]+'</b><p>'+shoplist[j]["address"]+'<br />营业时间：<span>'+shoplist[j]["online_time"]+'</span></p></dd>';
					  }
					  str+='<li><a href="javascript:;">'+arry[i]['name']+'</a> <div class="clear"><dl class="clear">'+shop+'</dl></div></li>';
				  }
				  break;
				}
		    }
			if($('.shop_list').length<=0){
			   $('body').append('<div class="shop_list"></div>');
			}
			$('.shop_list').html('<ul class="clear">'+str+'</ul>');
			$("input[name='shopid']").val($('.shop_list b').eq(0).attr('data_id'));
			$(".choose_join").val($('.shop_list b').eq(0).html());
			$(".sz_time").html(online_period($('.shop_list span').eq(0).text(),'li'));
			choose_shop();
		}
	  })
}


/*发送Ajax(基于ajax.js的)*/
/*
function get_shop(city_id){  
   $$.myAjax('http://localhost/qianduan/cblzc/srco/kucity.html',function(e){
      var jso=JSON.parse(e)
	  var str='';
	  for(var k in jso){  
	    var arry=jso[k];
	    if(city_id==k){
		    for(var i in arry){
				var shop="";
				var shoplist=arry[i]['shop'];
				for(var j in shoplist){
			       shop+='<dd><b data_id="'+shoplist[j]["id"]+'">'+shoplist[j]["name"]+'</b><p>'+shoplist[j]["address"]+'<br />营业时间：<span>'+shoplist[j]["online_time"]+'</span></p></dd>';
			    }
				str+='<li><a href="javascript:;">'+arry[i]['name']+'</a> <div class="clear"><dl class="clear">'+shop+'</dl></div></li>';
			 }
		 break;
	    }
      }
	  if($('.shop_list').length<=0){
		 $('body').append('<div class="shop_list"></div>');
	  }
	  $('.shop_list').html('<ul class="clear">'+str+'</ul>');
	  $("input[name='shopid']").val($('.shop_list b').eq(0).attr('data_id'));
	  $(".choose_join").val($('.shop_list b').eq(0).html());
	  $(".sz_time").html(online_period($('.shop_list span').eq(0).text(),'li'));
	  choose_shop();
    });
}
*/



/*取车地点 所在门店input框*/
function choose_shop(){
	$("input[name='return_shop_name'],input[name='return_city_name']").click(function(){
		layer.tips('暂不支持异地还车',this);
	});
	/*点击门店input框，显示所有门店*/
	$("#choose_join").click(function(){
		if($('.shop_list').find('dd').length>0){
		   $(".shop_list").show();
		}else layer.tips('该城市门店正在筹备中，敬请期待',this);
	});
	/*点击所有门店所在区或县城*/
	$(".shop_list ul li").on('click','a',function(e){
		$(".shop_list div").hide();
	    $(".shop_list a").css({background:'none',color:'#44a12f'});
		$(this).css({background:'#44a12f',color:'#fff'}).next('div').show();
		$(this).next('div').find('dd').eq(0).find('p').show();
	});
	/*点击所有门店所在区或县城下面的路店或送车点*/
    $(".shop_list ul li div dl dd").on('mouseover','b',function(e){
	    $(".shop_list p").hide();
        $(this).next('p').show();
    });
    $(".shop_list ul li div dl dd").on('click','b',function(e){
        $(".shop_list").hide();
	    $("input[name='shopid']").val($(this).attr('data_id'));
	    $(".choose_join").val($(this).html());
	    $(".sz_time").html(online_period($(this).parent().find('span').text(),'li'));
    });
    $(document).mouseup(function(e){
        var _con=$('.shop_list,.sz_time');
        if(!_con.is(e.target)&&_con.has(e.target).length===0){_con.hide();}
    });
}
