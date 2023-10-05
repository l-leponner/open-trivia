import { Answer } from "./answer";

export class Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correctAnswer: Answer;
    incorrectAnswers: Answer[];

    constructor(category: string,
        type: string,
        difficulty: string,
        question: string,
        correctAnswer: Answer,
        incorrectAnswers: Answer[]) {
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.incorrectAnswers = incorrectAnswers;
    }
}

enum QuestionDifficulty {
    easy, medium, hard
}

enum QuestionType {
    multiple, boolean
}
