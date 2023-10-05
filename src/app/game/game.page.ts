import { Component, OnInit } from '@angular/core';
import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { OpenTriviaService } from '../services/open-trivia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(private toastController: ToastController, 
    private alertController: AlertController,
    private openTriviaService: OpenTriviaService,
    private router: Router,
    private route: ActivatedRoute,
    private navController: NavController) { }

  
  toast: HTMLIonToastElement | undefined;
  username: string = '';
  selectedDifficulty: string = '';
  isAnswerClicked: boolean = false;
  alertButtons: string[] = ["OK", "Annuler"];
  questions: Question[] = [];
  questionsIndex: number = 0;
  currentQuestion: Question | undefined = this.questions[this.questionsIndex];
  currentAnswers: Answer[] = [];
  score: number = 0;
  hasGameEnded = false;
  

  ngOnInit() {
    this.username = this.route.snapshot.params["username"];
    this.selectedDifficulty = this.route.snapshot.params["difficulty"];
  }

  ionViewWillEnter(){
    try {
      this.getListQuestions();
    } catch (error) {
      console.log(error);
      this.navController.navigateBack('/home');
    }
    
    this.loadQuestionAndAnswers();
  }

  ionViewDidLeave() {
    this.questionsIndex = 0;
    this.hasGameEnded = false;
    this.isAnswerClicked = false;
  }

  getListQuestions() {
    // Récupération de la liste de questions
    this.openTriviaService.getQuestions(this.selectedDifficulty).subscribe({
      next: (result: any) => {
        if (result && result.response_code === 0 && result.results.length > 0) {
          // Parcours du résultat obtenu pour parser et créer une liste de "Question"
          result.results.forEach((element: any) => {
            // Création d'une liste de réponses dans laquelle on ajoute la bonne réponse ...
            let listAnswers = [{ label: element.correct_answer, isCorrect: true }];
            let correctAnswer: Answer = new Answer(element.correct_answer, true);
            let incorrectAnswers: Answer[] = [];
            element.incorrect_answers.forEach((response: any) => {
              incorrectAnswers.push({ label: response, isCorrect: false});
            });
            // ... puis les mauvaises réponses
            element.incorrect_answers.forEach((response: any) => {
              listAnswers.push({ label: response, isCorrect: false});
            });
            // Mélange des réponses
            listAnswers.sort((a, b) => 0.5 - Math.random());
            // Enfin on ajoute la liste de réponses à l'objet Question que l'on push dans le tableau
            this.questions.push({ question: element.question, correctAnswer: correctAnswer, incorrectAnswers: incorrectAnswers, category: element.category, type: element.type, difficulty: element.difficulty });
          });
          this.loadQuestionAndAnswers();
        } else {
          this.showToast('Impossible de récupérer la liste de questions. Vérifiez votre connexion internet !', 'warning');
        }
      }, error: (err) => {
        this.showToast(err, 'danger');
      }
    });
  }

  onScoreButtonClicked(){
    this.router.navigate(["/score", this.score]);
  }

  loadQuestionAndAnswers() {
    this.currentQuestion = this.questions[this.questionsIndex];
    if (this.currentQuestion) {
      this.currentAnswers = [];
      this.currentAnswers.push(this.currentQuestion.correctAnswer);
      for (let answer of this.currentQuestion.incorrectAnswers) {
        this.currentAnswers.push(answer);
      }
      this.currentAnswers = this.openTriviaService.shuffleAnswers(this.currentAnswers);
    }
  }

  async onAnswerButtonClicked(answer: Answer) {
    if(answer.isCorrect && this.isAnswerClicked == false) {
      this.score++;
      if(Boolean((await Preferences.get({key: "remember"})).value) == true){
        const savedScore = await Preferences.set({
          key: "score",
          value: String(this.score),
        });
      }
    }
    this.isAnswerClicked = true;
    console.log(this.score);
  }

  // async presentScoreToast() {
  //   const toast = await this.toastController.create({
  //     message: 'Votre score est de : ' + this.score,
  //     duration: 5000,
  //     position: "bottom",
  //   });

  //   await toast.present();
  // }

  loadNextQuestion(){
    if(this.questions.length != (this.questionsIndex +1)){
      this.questionsIndex++;
      this.loadQuestionAndAnswers();
      this.isAnswerClicked = false;
    } else {
      this.hasGameEnded = true;
    }
  }

  async showToast(text: string, colorBack: string = 'dark') {
    if (this.toast) {
      await this.toast.dismiss();
    }
    this.toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 4000,
      color: colorBack
    });
    this.toast.present();
  }

}
