// Đối tượng Validtor
function Validator(options){
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            } 
            element = element.parentElement;
        }
    }
    // Lưu mảng các rule
    var selectorRules = {};
    // Xử lý validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.erormessage);
        var errorMessage;
        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i< rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage; // Convert sang boolean
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {

        // Lắng nghe sự kiện onsubmit
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            // Lặp qua từng rule và validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            }); 
                    // Chọn các thẻ có fied bằng name và không disable (k ấn vào được)

            
            if(isFormValid){
                console.log("Không có lỗi")
                if (typeof options.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]');
                    console.log(enableInputs);
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        values[input.name] == input.value
                        return values;
                    }, {});

                    options.onSubmit(formValues);
                } 
                // Trường hợp submit với hành vi mặc đinh // không nhập dữ liệu mà submit
                else {
                    formElement.submit();
                }
            } else {
                console.log("Có lỗi")
            }
        }
        // Xử lý lặp qua mỗi rules và xử lý
         options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = inputElement.parentElement.querySelector(options.erormessage);
            
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            if (inputElement) {
                // Xử lý khi blur khỏi input
                inputElement.onblur = function (){
                    validate(inputElement, rule);
                }

                // Xử lý trường hợp khi người dùng đang nhập => xóa message lỗi
                inputElement.oninput = function () {
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
         });
         console.log(selectorRules);
    }

}

// Định nghĩa các rules
// Nguyên tắc của các rules
// 1. Khi có lỗi ==> Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)

Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function (value) {
            var regax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regax.test(value)  ? undefined: 'Vui lòng nhập đúng định dạng email'
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value == getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}

// Mong muốn khi nhập form
Validator({
    form:'#form-1',
    formGroupSelector: '.form-group',
    erormessage: '.form-message',
    rules: [
        Validator.isRequired('#fullname', 'Vui lòng nhập tên đầy đủ của bạn'),
        Validator.isRequired('#email', 'Vui lòng nhập email của bạn'),
        Validator.isEmail('#email'),
        Validator.isRequired('#password', 'Vui lòng nhập mật khẩu của bạn'),
        Validator.minLength('#password', 6),
        Validator.isRequired('#repassword', 'Vui lòng nhập lại mật khẩu của bạn'),
        Validator.isConfirmed('#repassword', function () {
            return document.querySelector('#form-1 #password').value;
        }, 'Mật khẩu nhập lại không chính xác'),
        Validator.isRequired('input[name="gender"]'), "Vui lòng chọn giới tính"
    ],
    onSubmit: function(data) {
        console.log(data);
    }
});