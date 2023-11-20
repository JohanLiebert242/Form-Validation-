function Validator(formSelector) {
    var formArrayRules = {};

    //Tạo ra các rules
    var formRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },

        email: function(value) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        }
    }

    //Lấy ra thẻ form
    var formElement = document.querySelector(formSelector);

    if(formElement) {
        //Lấy ra tất cả thẻ inputs
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs) {

            // Tách các rules có dấu | thành mảng
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {
                var isColon = rule.includes(':');

                //Kiểm tra xem có dấu : hay không
                if(isColon) {
                    var ruleContainingColon = rule.split(':');
                    rule = ruleContainingColon[0];
                }  
                
                var ruleFunction = formRules[rule];
                if(isColon) {
                    ruleFunction = ruleFunction(ruleContainingColon[1]);
                }

                //Đẩy các phần tử vào mảng trống
                if(Array.isArray(formArrayRules[input.name])) {
                    formArrayRules[input.name].push(ruleFunction);
                }
                else {
                    formArrayRules[input.name] = [ruleFunction];
                }

            }
            
            
        }
    }
    console.log(formArrayRules);
}

