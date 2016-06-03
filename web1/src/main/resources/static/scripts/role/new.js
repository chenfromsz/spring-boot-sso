$(function(){
	$('#saveForm').validate({
		rules: {
            name       :{required:true}
		},messages:{
            name :{required:"必填"}
        }
 	});
$('.saveBtn').click(function(){
	 if($('#saveForm').valid()){
         $.ajax({
             type: "POST",
             url: "./save",
             data: $("#saveForm").serialize(),
             headers: {"Content-type": "application/x-www-form-urlencoded;charset=UTF-8"},
             success: function (data) {
                 if (data == 1) {
                     alert("保存成功");
                     pageaction();
                     closeDialog();
                 } else {
                     alert(data);
                 }
             }
         });
		 }else{
			 alert('数据验证失败，请检查！');
		 }
	});
});

