export interface Participant {
    name: String;
    role: String;

    notify(data: any): void;
}