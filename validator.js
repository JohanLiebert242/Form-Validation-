const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Validator(formSelector, options = {}) {

    var rulesPushed = {};

    //Hàm GetParent
    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;  
        }
    }

    //Form Rules
    var formRules = {  
        required(value) {
            return value ? undefined : 'Vui lòng nhập thông tin của bạn';
        },

        email(value) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(value) ? undefined : 'Vui lòng nhập email của bạn';
        },

        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự `;
            }
        }
    }

    //Handle rules
    handleEvent = function(e) {
        var rules = rulesPushed[e.target.name];
        var errorMessage;

        rules.some((rule) => {
            switch(input.type) {}
            errorMessage = rule(e.target.value);
            return errorMessage;
        })

        if(errorMessage) {
            var formGroup = getParent(e.target, '.form-group');
            if(formGroup) {
                formGroup.classList.add('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage) {
                    formMessage.innerText = errorMessage;
                }
            }
        }

        return !errorMessage;
    }
    
    //Handle xóa lỗi
    handleClearError = function(e) {
        var formGroup = getParent(e.target, '.form-group');
            if(formGroup) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage) {
                    formMessage.innerText = '';
                }
            }
    }

    //Handle FormSubmit
    handleFormSubmit = function(e) {
        e.preventDefault();

        var inputElement = formElement.querySelectorAll('[name][rules]');
        for(var input of inputElement) {

            var isValid = true;
            if(!handleEvent({target: input})) {
                isValid = false;
            }

            if(isValid) {
                if(typeof options.onSubmit === 'function') {
                    var enabledInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enabledInputs).reduce(function(values, input) {
                        values[input.name] = input.value;
                        return values;
                    },  {});
                    options.onSubmit(formValues);
                }
                else {
                    formElement.submit();
                }
            }
        }
    }

  

    //Logic 
    var formElement = $(formSelector);
    if(formElement) {
        var inputElement = formElement.querySelectorAll('[name][rules]');
        for(var input of inputElement) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {


                var ruleHasColon;
                var isColon = rule.includes(':');
                if(isColon) {
                    ruleHasColon = rule.split(':');
                    rule = ruleHasColon[0];
                }
                
                var ruleFunctions = formRules[rule];
                if(isColon) {
                    ruleFunctions = ruleFunctions(ruleHasColon[1]);
                }
                if(Array.isArray(rulesPushed[input.name])) {
                    rulesPushed[input.name].push(ruleFunctions);
                }   
                else {
                    rulesPushed[input.name] = [ruleFunctions];
                }
            }

            //Events
            input.onblur = handleEvent;
            input.oninput = handleClearError;
        }
        formElement.onsubmit = handleFormSubmit;           

    }
}