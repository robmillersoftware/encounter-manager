import { Participant } from './participant';

export class Message {
    public timestamp: Date;

    constructor(public contents: any, public from: Participant) {
        this.timestamp = new Date();
    }

    public getTimestamp(): String {
        let t = this.timestamp;
        let date = [ String(t.getMonth() + 1), String(t.getDate()), String(t.getFullYear())];
        let time = [ String(t.getHours()), String(t.getMinutes()), String(t.getSeconds())];

        for (let i of time) {
            if ( Number(i) < 10 ) {
                i = "0" + i;
            }
        }

        return date.join('/') + " " + time.join(':');
    }
}