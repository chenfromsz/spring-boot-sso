function getScrollTop() {
    try {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    } catch (e) {

    }
    return scrollTop;
}
function showWindowPop(state) {
    if (state === undefined) {
        state = true;
    }
    if (state) {
        var contentHeight = $(window).height() , top = getScrollTop() + (contentHeight - $('#windowTipBox').height()) / 2;
        $('#windowShadow').height($(document).height()).show();
        $('#windowTipBox').css('top', (top < 0 ? 36 : top) + 'px').show();
    } else {
        $('#windowTipBox').hide();
        $('#windowShadow').hide();
    }
}
$(function () {
    $('.columnLeftMenu h6').live('click', function () {
        var $this = $(this);
        $this.toggleClass('isOpen');
        if (!$this.hasClass('isOpen')) {
            $this.next('ul').slideDown('300');
        } else {
            $this.next('ul').slideUp('300');
        }
    });
    $('.selectMode').live("change", (function () {
        var $this = $(this) , val = $(this).find('option:selected').text();
        $this.siblings('input').val(val);
    }));
});

function isEmpty(obj){
	if (obj == undefined||obj ==null||obj =='') {
        return true;
    }
	return false;
}
