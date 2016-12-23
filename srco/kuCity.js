(function($){
    var regEx=/^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\d+)$/i,
	    regExChiese=/([\u4E00-\u9FA5\uf900-\ufa2d]+)/,
		reg_ah=/^[a-h]$/i,reg_ip=/^[i-p]/i,
		reg_qz=/^[q-z]/i;
	var city={hot:{},ABCDEFGH:{},IJKLMNOP:{},QRSTUVWXYZ:{}};
	    (function(){
		    for(var i=0,len=allCities.length;i<len;i++){  //part[0]=郑州|zhengzhou|2 ...
				var part=regEx.exec(allCities[i]),        //郑州|zhengzhou|2,郑州,zhengzhou,2  ....
					en=part[1],                           //en=郑州
					letter=part[2],                       //letter=zhengzhou ...
					cityid=part[3],                       //cityid=2  ...
					first=letter[0].toUpperCase(),        //每个城市首字母大写
					ltPart;
				if(reg_ah.test(first)){
					ltPart='ABCDEFGH';
				}else if(reg_ip.test(first)){
					ltPart='IJKLMNOP';
				}else if(reg_qz.test(first)){
					ltPart='QRSTUVWXYZ';
				}
				city[ltPart][first]?city[ltPart][first][cityid]=en:(city[ltPart][first]=[],city[ltPart][first][cityid]=en);
                if(i<16){
					city.hot['hot']?city.hot['hot'][cityid]=part[1]:(city.hot['hot']=[],city.hot['hot'][cityid]=part[1]);
				}					  
			}
		})();
	    /*
		  var city{
				    hot:{hot:[2: "郑州", 6: "开封", ...,54: "北海市"]},
				    ABCDEFGH:{A:[85: "安阳"],...,B[27: "白城",54: "北海市",82: "亳州"]},
				    IJKLMNOP:{K:[...],L:[...],N[...],P:[...]},
					QRSTUVWXYZ:{Q:[...],S:[..],Z:[..]}
		          }
	   */
	var KuCity=function(target){
		this.target=target;
		this.container=null;
		this.isContainerExit=false;
	};
	KuCity.prototype={
		   constructor:KuCity,
		   init:function(){
				this.creatItem();
				this.tabChange();
				this.citySelect();
				this.stopPropagation();
		   },
		   creatItem:function(){
				if(this.isContainerExit)return;
				var template='<div class="kucity"><div class="citybox"><h3 class="kucity_header">热门城市(支持汉字/拼音搜索)</h3><ul class="kucity_nav"><li class="active">热门城市</li><li>ABCDEFGH</li><li>IJKLMNOP</li><li>QRSTUVWXYZ</li></ul><div class="kucity_body"></div></div><ul class="result"></ul></div>';
				$('body').append(template);
				this.container=$('.kucity');
			
				for(var group in city){    //group=hot,ABCDEFGH,IJKLMNOP,..
					var itemKey=[];        //itemKey存的是["hot"],["B", "C", "D", "A", "F"]["K", "N", "P", "L"],["Z", "X", "S", "Q", "Y"]
					for(var item in city[group]){
						    itemKey.push(item);    //console.log(city["itemKey"]);
					}                              //console.log(city["hot"]["hot"]["2"]);//郑州                                             
					itemKey.sort();                //console.log(city["ABCDEFGH"]["A"]["85"]);//安阳
					var itembox=$('<div class="kucity_item">');
					itembox.addClass(group);
					for(var i=0,iLen=itemKey.length;i<iLen;i++){
						var dl=$('<dl>'),
						dt='<dt>'+(itemKey[i]=='hot'?'':itemKey[i])+'</dt>',
						dd=$('<dd>'),
						str='';
						for(var j in city[group][itemKey[i]]){
                            str+='<span data-id='+j+'>'+ city[group][itemKey[i]][j]+'</span>'
                        }
						dd.append(str);
						dl.append(dt).append(dd);
						itembox.append(dl);
					}
					$('.kucity_body').append(itembox);
					this.container.find('.hot').addClass('active');
				}
                this.isContainerExit=true;
		   },
          
		   tabChange:function(){
		        $('.kucity_nav').on('click','li',function(e){
					var current=$(e.target),
					    index=current.index();
					current.addClass('active').siblings().removeClass('active');
					$('.kucity_item').eq(index).addClass('active').siblings().removeClass('active');
				})
		   },
		   citySelect:function(){
				var self=this;
				$('.kucity_item dd').on('click','span',function(e){
					if($(e.target).text()!=self.target.val()){
						/*if(get_shop($(e.target).text())){
								self.target.val($(e.target).text());		
						}else return false;*/
						var city_id=$(this).attr('data-id');
						$('.choose_city').val($(e.target).text());
						get_shop(city_id);
					}                                                                                
                    self.container.hide();
				})
		   },
          //阻止事件冒泡
	       stopPropagation:function(){
		        var self=this;
				this.container.on('click',stopPropagation);
				this.target.on('click',stopPropagation);
				$(document).on('click',function(){
				    self.container.hide();
				})
				function stopPropagation(e){
					e.stopPropagation();
				}
		   }
	};
    /*原型结束*/
	var kucity=null;
	$.fn.kuCity=function(options){
		var target=$(this);           //console.log(target);  id=take_city的dom元素
		target.on('focus',function(e){
			var top=$(this).offset().top+ $(this).outerHeight(),
			    left=$(this).offset().left;
			kucity=kucity?kucity:new KuCity(target);//递归调用直到实例化成功
			kucity.target=$(e.target);
			kucity.init();
			kucity.container.show().offset({'top':top+ 7,'left':left});
		
		})
        return this;
	};
})(jQuery)