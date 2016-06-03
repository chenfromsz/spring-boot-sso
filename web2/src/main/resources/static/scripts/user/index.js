$(function () {
    $('#searchBtn').click(function(){
        showdetail();
    });
    getuserinfo();
});

var user = null;
function getuserinfo(){
    $.get('./resource/user',{ts:new Date().getTime()},function(data){
        user = data;
        var $list = $('#tbodyContent').empty();
            var html = "" ;
            html += '<tr> ' +
                '<td>'+ (data.id==null?'':data.id) +'</td>' +
                '<td>'+ (data.name==null?'':data.name) +'</td>' +
                '<td>'+ (data.email==null?'':data.email) +'</td>' +
                '<td>'+ (data.department==null?'' :data.department) +'</td>' +
                '<td>'+ (data.createdate==null?'': getSmpFormatDateByLong(data.createdate,true)) +'</td>';
            html +='</tr>' ;

            $list.append($(html));
    });
}
var artdialog;
function showdetail(){
    $.get("./show?ts="+new Date().getTime(),{id:user.id,name:user.name,email:user.email,department:user.department,
        createdate:getSmpFormatDateByLong(user.createdate,true)},function(data){
        art.dialog({
            lock:true,
            opacity:0.3,
            title: "查看信息",
            width:'750px',
            height: 'auto',
            left: '50%',
            top: '50%',
            content:data,
            esc: true,
            init: function(){
                artdialog = this;
            },
            close: function(){
                artdialog = null;
            }
        });
    });
}

function closeDialog() {
    artdialog.close();
}

