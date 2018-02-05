export interface Participant {
    name: string;
    role: string;

    notify(data: any): void;
}