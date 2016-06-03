jQuery.validator
		.addMethod(
				"byPhone",
				function(value, element) {
					var phone = /^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
					return this.optional(element) || (phone.test(value));
				}, "例如:xxxx-6666666或13866668888");

jQuery.validator
		.addMethod(
				"byFacsimile",
				function(value, element) {
					var facsimile =/^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/;
					return this.optional(element) || (facsimile.test(value));
				}, "例如:xxxx-6666666");

jQuery.validator.addMethod("byZipCode", function(value, element) {
	var zipCode = /^[1-9][0-9]{5}$/;
	return this.optional(element) || (zipCode.test(value));
}, "邮编例如:518000");
