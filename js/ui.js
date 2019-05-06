//Ui-search 定义

$.fn.UiSearch = function() {
    var ui = $(this);

    $('.ui-search-selected', ui).on('click', function() {
        $('.ui-search-select-list').show();
        return false;
    });
    $('.ui-search-select-list a', ui).on('click', function() {

        $('.ui-search-selected').text($(this).text());
        $('.ui-search-select-list').hide();
        return false;
    })


    $('body').on('click', function() {
        $('.ui-search-select-list').hide();
    })

}

//ui-tab 定规	

/**
 * [UiTab description]
 * @param {string} header  TAB组件的选项卡切换部分className,里面有若干个 .item
 * @param {string} content  TAB组件的内容区域部分className,里面有若干个 .item
 */
$.fn.UiTab = function(header, content) {
    var ui = $(this);
    var tabs = $(header, ui);
    var cons = $(content, ui);

    tabs.on('click', function() {
        var index = $(this).index();

        tabs.removeClass('item_focus').eq(index).addClass('item_focus');
        cons.hide().eq(index).show();

        return false;
    })
}

//ui-backTap
$.fn.UiBackTop = function() {
    var ui = $(this);
    var el = $('<a class = "ui-backTop" href="0">up</a>');
    ui.append(el);

    var windowHeight = $(window).height();


    $(window).on('scroll', function() {
        var top = $('body').scrollTop();
        if (top > windowHeight) {
            el.show();
        } else {
            el.hide();
        }
    })
    el.on('click', function() {
        $(window).scrollTop(0);
    })
}


// ui-slidder
// 轮播图!!
$.fn.UiSlider = function() {
    var ui = $(this);

    var wrap = $('.ui-slider-wrap');

    var btn_prev = $('.ui-slidder-arrow .left', ui);
    var btn_next = $('.ui-slidder-arrow .right', ui);

    var items = $('.ui-slidder-wrap .item', ui);
    var tips = $('.ui-slidder-process .item', ui);

    // 预定义
    var index = 0;
    // 具体操作
    ui
        .on('move_prev', function() {

        })
        .on('move_next', function() {

        })
        .on('move_to', function(evt, index) {


        })


    //事件
    btn_prev.on('click', function() {
        wrap.triggerHandler('move_prev');
    })
    btn_next.on('click', function() {
        wrap.triggerHandler('move_next');
    });
    tips.on('click', function() {
        var index = $(this).index();
        wrap.triggerHandler('move_to', index);
    })
}

 




//页面的脚本逻辑

$(function() {
    $('.ui-search').UiSearch();
    $('.content-tab').UiTab('.caption>.item', '.block>.item');


    $('body').UiBackTop();
    $('.ui-slider').UiSlider();
});