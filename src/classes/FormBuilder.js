export default class FormBuilder {
    static formItem(name, defaultValue, options) {
        const labelName = options && options.labelName;
        const safeName = name.replaceAll(' ', '-');

        const input = document.createElement('input')
        input.className = 'text-input';
        input.id = safeName;
        input.name = safeName;
        input.value = defaultValue;

        const label = document.createElement('label');
        label.textContent = (labelName ?? name) + ':';
        label.id = safeName + '-label';
        label.for = safeName;
        label.className = 'input-label';

        return FormBuilder.div(
            'form-item', [
                label,
                input
            ]);
    }

    static div(className, children) {
        const div = document.createElement('div');
        div.className = className;
        children.forEach(child => div.appendChild(child));

        return div;
    }
}