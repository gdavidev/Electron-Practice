import QuestionDisplaySubGameState from "@classes/GameStates/AdminGameStates/QuestionsFormSubGameState";
import ConfigurationFormSubGameState from "@classes/GameStates/AdminGameStates/ConfigurationFormSubGameState";

export default class AdminMenuGameState {
    constructor(requestGameState, updateEnvironment) {
        this.requestAdminGameState = this.requestAdminGameState.bind(this);

        this.adminContainer = document.getElementById('admin-container');
        this.adminQuestionsBtn = document.getElementById('admin-questions-btn');
        this.adminConfigurationBtn = document.getElementById('admin-configuration-btn');
        this.adminExitBtn = document.getElementById('admin-exit-btn');
        this.exportPlayersInfoToCsvBtn = document.getElementById('export-players-info-to-csv-btn');

        this.#hideMenu();

        this.adminQuestionsBtn.onclick = () => this.requestAdminGameState('questions-form')
        this.adminConfigurationBtn.onclick = () => this.requestAdminGameState('configuration-form')
        this.adminExitBtn.onclick = () => {
            updateEnvironment().then(() => {
                requestGameState('main-menu');
            })
        }
        this.exportPlayersInfoToCsvBtn.onclick = () => this.#exportPlayersInfoToCSV()

        this.states = {
            'questions-form': new QuestionDisplaySubGameState(),
            'configuration-form': new ConfigurationFormSubGameState(this.requestAdminGameState),
            'main-menu' : { enter(from, data) { requestGameState('main-menu') } }
        }
    }

    enter(from) {
        this.#showMenu()

        this.currentState = 'questions-form'
        this.requestAdminGameState('questions-form')
    }

    exit(to) {
        this.#hideMenu()
    }

    requestAdminGameState(gameState, data) {
        console.log('admin: ' + this.currentState + ' -> ' + gameState);

        this.states[this.currentState].exit(gameState);
        this.states[gameState].enter(this.currentState, data);
        this.currentState = gameState;
    }

    #hideMenu() {
        this.adminContainer.classList.add('hidden')
        this.adminContainer.classList.remove('returning')
    }

    #showMenu() {
        this.adminContainer.classList.remove('hidden')
        this.adminContainer.classList.add('returning')
    }

    async #exportPlayersInfoToCSV() {
        const players = await window.bridge.players.get();
        console.log(players)
        let csvContent = "email,phone\n" + players.map(p => `${p.email},${p.phone}`).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "players.csv";
        a.click();
    }
}