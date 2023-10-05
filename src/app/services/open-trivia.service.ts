import { Injectable } from '@angular/core';
import { Answer } from '../models/answer';
import { Question } from '../models/question';
import { HttpClient } from '@angular/common/http';
import { catchError, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenTriviaService {

  constructor(private http: HttpClient) { }

  baseUrl: string = "https://opentdb.com/api.php";
  amountQuestions: number = 10;

  questions: Question[] = [
    // {
    //  category: "Entertainment: Japanese Anime & Manga",
    //  type: "multiple",
    //  difficulty: "easy",
    //  question: "In 'Fairy Tail', what is the nickname of Natsu Dragneel?",
    //  correctAnswer: new Answer("The Salamander", true),
    //  incorrectAnswers: [new Answer("The Dragon Slayer", false), new Answer("The Dragon", false), new Answer("The Demon", false)]
    // },
    // {
    //  category: "Entertainment: Video Games",
    //  type: "boolean",
    //  difficulty: "medium",
    //  question: "'Return to Castle Wolfenstein' was the only game of the Wolfenstein series where you don't play as William 'B.J.' Blazkowicz",
    //  correctAnswer: new Answer("False", true),
    //  incorrectAnswers: [new Answer("True", false)]
    // },
  ]
  ;

  getQuestions(difficulty: string) {
    return this.http.get(this.baseUrl + '?amount=' + this.amountQuestions + '&difficulty=' + difficulty).pipe(retry(1), catchError(error => of('Erreur : impossible de récupérer la liste de questions !')));
  }

  shuffleAnswers = (array: Answer[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 
  }

