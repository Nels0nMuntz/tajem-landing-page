
const handleForms = () => {
    const forms = document.forms;
    const message = {
        initial: '',
        loading: 'Loading...',
        success: 'Thanks for your message',
        postError: 'Error',
        inputError: 'Email is incorrect',
    };
    const typeError = {
        emptyField: 'emptyField',
        wrongEmail: 'wrongEmail',
    };

    for (let form of forms) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const submitButton = getSubmitButton(form);
            const mesaageArea = getMesaageArea(form);
            let result = verifyForm(form);
            if (!result.length) {                                               // если проверка вернула пустой массив - все поля правильно заполнены
                submitButton.setAttribute('type', 'button');
                mesaageArea.textContent = message.loading;
                postForm(form.action, form, submitButton, mesaageArea)
                    .then(response => {
                        console.log(response);
                        mesaageArea.textContent = message.success;
                    })
                    .catch(error => {
                        console.log(error);
                        mesaageArea.textContent = message.error;
                    })
                    .finally(() => {
                        submitButton.setAttribute('type', 'submit');
                        cleanFields(form);
                        setTimeout(() => {
                            mesaageArea.textContent = message.initial;
                        }, 3000);
                    })
            } else {
                result.forEach(item => {
                    switch (item.typeError) {
                        case typeError.emptyField:
                            item.element.classList.add('with_error');
                            item.element.setAttribute('data-origin-placeholder', item.element.placeholder);
                            item.element.placeholder = 'Field is required';
                            break;
                        case typeError.wrongEmail:
                            item.element.classList.add('with_error');
                            mesaageArea.textContent = message.inputError;
                        default:
                            break;
                    }
                });
            }
        })
    }

    for (let form of forms) {
        form.addEventListener('input', event => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                if (event.target.classList.contains('with_error')) {
                    event.target.classList.remove('with_error')
                }
            }
        })
    };

    const verifyForm = form => {
        const pattern = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;        
        const elementErorCreator = (element, typeError) => ({element, typeError});
        let elementsWithError = [];

        for (let element of form.elements) {
    
            if(element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'){                                   // если поле input или textarea
                if(element.value){                                                                               // если поле заполненное
                    if(element.type === 'email'){                                                                  // если тип поля email - дополнительная проверка
                        let email = element.value;
                        let result = pattern.test(email);
                        if(!result){                                                                             // если не соответствует паттерну - добавить в объект с неправильно
                            elementsWithError.push(elementErorCreator(element, typeError.wrongEmail));               // заполненными полями
                        }
                    }                       
                }else{                                                                                      // если поле пустое - добавить в объект с неправильно заполненными полями
                    elementsWithError.push(elementErorCreator(element, typeError.emptyField));
                }
            } 
        };
        return elementsWithError;
    };
    const postForm = async (url, form) => {
        const formData = new FormData(form);
        let response = await fetch(url, {
            method: 'POST',
            body: formData,
        })
        return await response.text();
    };

    const getSubmitButton = form => {
        for(element of form.elements){
            if(element.type === 'submit') return element;
        }
    };
    const getMesaageArea = form => {
        for(child of form.children){
            if(child.classList.contains('form-message')) return child;
        }
    };    
    const cleanFields = form => {
        for(let field of form.elements){
            field.value = '';
            if(field.dataset.originPlaceholder){
                field.placeholder = field.dataset.originPlaceholder;
                field.removeAttribute('data-origin-placeholder')
            }    
    
        }
    };   
};

