export class Answer {
    label: string;
    isCorrect: boolean;
   
    constructor(label: string, isCorrect: boolean) {
        this.label = label;
        this.isCorrect = isCorrect;
    }
}
