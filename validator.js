//hàm 
function Validator(options) {

    var selectorRules = {};

    //ham xác thực khi de trong 
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector) //tim dc đích thị thẻ con muốn cảnh báo
        //console.log(inputElement.parentElement.querySelector('.form-message'))
        // blur tu the input lay ra the cha cua no => tu the cha tim the con .form-message
        var errorMessage;

        // lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];
        // lap qa tung rule (check)
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break //co loi thi break check
        }


        if (errorMessage) { //neu co errorMessage = co loi
            errorElement.innerText = errorMessage; //canh bao 
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = '' // 
            inputElement.parentElement.classList.remove('invalid')
        }

        return errorMessage
    }

    //Xu ly truong hop khi nguoi dang dung nhap vao input ->  xoa message error
    function userText(inputElement) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector) //tim dc đích thị thẻ con muốn cảnh báo
        errorElement.innerText = '' //  khi nguoi dung nhap input thi xoa message loi~ 
        inputElement.parentElement.classList.remove('invalid')
    }

    //lay element cua form can validate input
    var formElement = document.querySelector(options.form)
    if (formElement) {

        //khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault() // loai bo submit mac dinh

            var isFormValid = true;

            options.rules.forEach(function (rule) { // lap qua tung rule va validate
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if (isValid) {
                    isFormValid = false
                }
            })



            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])') //select tat ca co attribute la name va khong co disabled
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {})

                    options.onSubmit(formValues)
                }
            }

        }




        //lap qua moi rules cho moi input
        options.rules.forEach(function (rule) {

            //Luu cac rules cua input/ 1 input co nhieu rules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }


            var inputElement = formElement.querySelector(rule.selector)
            if (inputElement) {
                //Xu ly truong hop blur/de trong khoi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                //Xu ly truong hop khi nguoi dang dung nhap vao input ->  xoa message error
                inputElement.oninput = function () {
                    userText(inputElement)
                }
            }
        })

        //console.log(selectorRules)
    }

}


//Define rules
//Nguyen tac rules:
//1. khi co loi~ => tra ra message error 
//2. khi ko loi` => ko tra ra / undefiend
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập đầy đủ' //trim() loai bo khoang trong
            // khi có value thi tra ve undef, khi ko co tra ve 'Vui lòng nhập đầy đủ'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //check @gmail.com
            return regex.test(value) ? undefined : message || 'Vui lòng nhập Email' // toan tu 3 ngoi, 
            //neu value la email thi tra ve undefined
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự` // toan tu 3 ngoi, 
            //neu value.length >= tham so min thi tra ve undefiend, tra ve loi~
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Không chính xác!!!'
        }
    }
}