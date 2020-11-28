const GettersSetters = require('../../shared/components/utils/short').GetterSetters

export class Input extends GettersSetters{
    onChange;
    placeholder; 
    type; 
    value;
    constructor(onChange, placeholder, type, value){
        super(['onChange', 'placeholder', 'type', 'value'],[onChange, placeholder, type, value])
        this.onChange = onChange;
        this.placeholder = placeholder;
        this.type = type;
        this.value = value;
        return this;
    }
}

export class Button extends GettersSetters{
    onClick;
    name;
    dynamicStyles;
    status;
    constructor(onClick, name, dynamicStyles, status){
        super(['onClick', 'name', 'dynamicStyles', 'status'],[onClick, name, dynamicStyles, status])
        this.onClick = onClick
        this.name = name
        this.dynamicStyles = dynamicStyles
        this.status = status;
    }
}

export class Link extends GettersSetters{
    onClick;
    value;
    constructor(onClick, value){
        super(['onClick', 'value'],[onClick, value])
        this.onClick = onClick;
        this.value = value;
    }
}

export class Notification extends GettersSetters{
    status;
    message;
    type;
    constructor(status, message, type){
        super(['status', 'message', 'type'],[status, message, type])
        this.status = status;
        this.message = message;
        this.type = type;
    }
}