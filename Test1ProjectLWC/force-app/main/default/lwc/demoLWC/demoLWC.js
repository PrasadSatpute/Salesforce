import { LightningElement, track} from 'lwc';

export default class DemoLWC extends LightningElement {
    @track time;

    connectedCallback() {
        this.updateTime();
        // Update the time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const now = new Date();
        // Format time as HH:MM:SS
        this.time = now.toLocaleTimeString();
    }
}
