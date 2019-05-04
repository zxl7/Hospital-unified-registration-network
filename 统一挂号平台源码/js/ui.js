// 搜索
$.fn.uiSearch = function(){
	var ui = $(this);
	$('.ui-search-selected',ui).on('click',function(){
		$('.ui-search-select-list').show();
		return false;
	});
	$('.ui-search-select-list a',ui).on('click',function(){
		$('.ui-search-selected',ui).text($(this).text());
		$('.ui-search-select-list',ui).hide();
		return false;
	});
	$('body').on('click',function(){
		$('.ui-search-select-list').hide();
	});
	$('.ui-search-select-list').hide();
};


//  选项卡切换

$.fn.uiTab  = function(tabs,cons,focus_prefix){

	var ui = $(this);
	var tabs = $(tabs,ui);
	var cons = $(cons,ui);
	var focus_prefix = focus_prefix || '';


	tabs.on('click',function(){
		var index = $(this).index();
		
		tabs.removeClass(focus_prefix+'item_focus').eq(index).addClass(focus_prefix+"item_focus");
		cons.hide().eq(index).show();
		return false;
	});


};


// 幻灯片切换
/*

根据已有的DOM结构

.ui-slider              <----- 最外层框架 
	.ui-slider-wrap     <----- 内容框架
		.item           <----- 每个内容
	.ui-slider-arrow    <----- 控制箭头
		.item.left
		.item.right
	.ui-slider-process   <----- 和内容一一对应
		.item


*/
$.fn.uiSlider  =function(){
	var wrap =  $('.ui-slider-wrap',this);
	var size = $('.item',wrap).size()-1;
	

	var goPrev = $('.ui-slider-arrow .left',this);
	var goNext = $('.ui-slider-arrow .right',this);

	var items = $('.item',wrap);
	var tips  = $('.ui-slider-process .item',this);
	var width =  items.eq(0).width();

	var currentIndex = 0;
	var autoMove = true;

	//	1.基本事件
	wrap
	.on('resetFocus',function(evt,isAutoMove){

		// if(autoMove === true &&)

		tips.removeClass('item_focus').eq(currentIndex).addClass('item_focus');
		wrap.animate({left:currentIndex*width*-1});
	})
	.on('nextFocus',function(){

		currentIndex = currentIndex+1 > size ? 0 : currentIndex+1;
		$(this).triggerHandler('resetFocus');

		// 4. 链式调用
		return $(this);

	})
	.on('prevFocus',function(){
		currentIndex = currentIndex-1 < 0 ? size : currentIndex-1;
		$(this).triggerHandler('resetFocus');

	})
	.on('autoMove',function(){
		// 2. 自动处理
		if(autoMove == true){
			setTimeout(function(){
				// 3. 闭包 && 链式调用
				wrap.triggerHandler('nextFocus').triggerHandler('autoMove');
			},5000);
		}
	}).triggerHandler('autoMove');


	goPrev.on('click',function(){
		wrap.triggerHandler('prevFocus');
		return false;
	});
	goNext.on('click',function(){
		wrap.triggerHandler('nextFocus');
		return false;
	});

	//	5.任务 BUG 排除（定时器BUG	）

}


//	从远程获得数据（一般在后台处理）
var getData = function(k,v){

	//	初始化获取所有城区
	if( k === undefined){
		return [{id:1,name:'东城区'},{id:2,name:'西城区'}];
	}
	//	根据城区获得下面的等级（不同城区相同等级的 id 不一样）
	if( k === 'area' ){
		var levelData = {
			1:[  {id:11,name:'一级医院'},{ id:12,name:'二级医院'} ],
			2:[  {id:22,name:'二级医院'} ]
		}
		return levelData[v] || [];
	}
	//	根据等级获取医院
	if( k === 'level'){
		var hospital = {
			11 : [  {id:1,name:'A1医院'},{id:2,name:'A2医院'} ],
			12 : [  {id:3,name:'B1医院'} ],
			22 : [  {id:4,name:'C1医院'},{id:5,name:'C2医院'} ]

		}

		return hospital[v] || [];

	}
	//	根据名称获取科室（科室都是依附在医院下面的）
	if( k === 'name'){
		var department = {
			1 : [  {id:1,name:'骨科'},{id:2,name:'内科'} ],
			2 : [  {id:3,name:'儿科'} ],
			3 : [  {id:4,name:'骨科'},{id:5,name:'内科'} ],
			4 : [  {id:6,name:'儿科'} ],
			5 : [  {id:7,name:'骨科'},{id:8,name:'内科'} ]

		}

		return department[v] || [];
	}
	return [];
}




$.fn.uiCascading = function(){

	//	每个select更新，就清理后面所有 select 为初始化状态
	//	并且根据当前 select 的值，获得下一个 select 的数据，并且更新
	var ui = $(this);
	var listSelect = $('select',this);


	//	每个select
	listSelect

		.on('updateOptions',function(evt,ajax){
			
			var select = $(this);

			select.find('option[value!=-1]').remove();
			if(ajax.data.length<1){
				return true;
			}
			for(var i=0,j=ajax.data.length;i<j;i++){
				var k = ajax.data[i].id;
				var v = ajax.data[i].name;
				select.append( $('<option>').attr('value',k).text(v) );
			}
			return true;
		})
		.on('change',function(){

			var changeIndex = listSelect.index(this);

			var k = $(this).attr('name');
			var v = $(this).val();

			var data  = getData(k,v);

			listSelect.eq(changeIndex+1).triggerHandler('updateOptions',{ data:data });
			
			ui.find('select:gt('+(changeIndex+1)+')').each(function(){
				$(this).triggerHandler('updateOptions',{ data:[] });	
			})
		})


		//	初始化
		listSelect.find('option:first').attr('value','-1');	//	特殊初始值标记

		listSelect.eq(0).triggerHandler('updateOptions',{ data:getData() }); // apply 传参


}


$(function () {

	$('.ui-search').uiSearch();

	$('.content-tab').uiTab('.caption > .item ' , '.block > .item');
	$('.content-tab .block .item').uiTab('.block-caption > a ' , '.block-wrap','block-capiton-');

	$(window).on('scroll',function(){
		if( $('body').scrollTop() > $(window).height() ){
			$('.go-top').show();
		}else{
			$('.go-top').hide();
		}
	});

	$('.ui-slider').uiSlider();

	$('.ui-cascading').uiCascading();
})