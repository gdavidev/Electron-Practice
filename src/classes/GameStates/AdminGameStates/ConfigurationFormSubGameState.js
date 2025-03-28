import FormBuilder from "@classes/FormBuilder";
import Question from "../../../models/Question";
import ConfigurationItem from "../../../models/ConfigurationItem";

export default class ConfigurationFormSubGameState {
    constructor() {
        this.saveConfigurations = this.saveConfigurations.bind(this);

        this.adminConfigurationContainer = document.getElementById('admin-configuration-container');
        this.adminConfigurationsInputContainer = document.getElementById('admin-configurations-input-container')
        this.adminSaveConfigurationsBtn = document.getElementById('admin-save-configurations-btn')

        this.adminConfigurationContainer.style.display = 'none'
        this.adminSaveConfigurationsBtn.style.display = 'none'
        this.adminSaveConfigurationsBtn.onclick = () => this.saveConfigurations()
    }

    enter(from, data) {
        this.adminConfigurationContainer.style.display = 'block';
        this.adminSaveConfigurationsBtn.style.display = 'block'
        this.#loadConfigurations();
    }

    exit(to) {
        this.adminConfigurationContainer.style.display = 'none';
        this.adminSaveConfigurationsBtn.style.display = 'none'
    }

    saveConfigurations() {
        const configurations = this.#retrieveAllConfigurations();
        console.log(configurations);
        configurations.forEach(config => {
            window.bridge.configuration.update(config)
        })
    }

    #loadConfigurations() {
        this.#clearConfigurations()

        window.bridge.configuration.get()
            .then((res) => {
                console.log(res)
                res.forEach(config => {
                    this.adminConfigurationsInputContainer.appendChild(
                        FormBuilder.formItem(
                            config.propertyName,
                            config.value,
                            {labelName: config.name})
                    );
                })
            })
    }

    #retrieveAllConfigurations() {
        const formItems =
            this.adminConfigurationContainer.getElementsByClassName('form-item');
        const configurations = [];

        Array.from(formItems).forEach((formItem) => {
            configurations[configurations.length] = new ConfigurationItem(
                formItem.querySelector('label').textContent,
                formItem.querySelector('input').name,
                formItem.querySelector('input').value
            );
        });

        return configurations;
    }

    #clearConfigurations() {
        while (this.adminConfigurationsInputContainer.firstChild) {
            this.adminConfigurationsInputContainer.removeChild(this.adminConfigurationsInputContainer.firstChild);
        }
    }
}