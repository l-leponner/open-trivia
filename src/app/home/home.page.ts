import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { OpenTriviaService } from '../services/open-trivia.service';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router) {}

  async ngOnInit(): Promise<void> {
    const savedUsername = await Preferences.get({key: "username"}); 
    if(savedUsername.value) {
      this.username = savedUsername.value;
      this.selectedDifficulty = (await Preferences.get({key: "selectedDifficulty"})).value!;
      this.score = Number((await Preferences.get({key: "score"})).value);
      this.remember = Boolean((await Preferences.get({key: "remember"})).value);
    }
  }

  title: string = 'Open Trivia';
  toast: HTMLIonToastElement | undefined;
  difficulties: string[] = ['easy', 'medium', 'hard'];
  selectedDifficulty = 'easy';
  username: string = '';
  isUsernameValid: boolean = true;
  remember: boolean = false;
  alertButtons: string[] = ["OK", "Annuler"];
  score: number | undefined;

  async onStartButtonClicked(username: string, selectedDifficulty: string, remember: boolean){
    if(username.length < 3) {
      this.presentAlert();
    } else if(remember) {
      const savedRemember = await Preferences.set({
        key: "remember",
        value: "true",
      });
      const savedUsername = await Preferences.set({
        key: "username",
        value: username,
      });
      const savedDifficulty = await Preferences.set({
        key: "selectedDifficulty",
        value: selectedDifficulty,
      });
      const savedScore = await Preferences.set({
        key: "score",
        value: String(this.score) ?? "0",
      });
      this.router.navigate(["/game", username, selectedDifficulty])
    } else {
      const savedRemember = await Preferences.remove({
        key: "remember",
      });
      const savedUsername = await Preferences.remove({
        key: "username",
      });
      const savedDifficulty = await Preferences.remove({
        key: "selectedDifficulty",
      });
      const savedScore = await Preferences.remove({
        key: "score",
      });
      this.router.navigate(["/game", username, selectedDifficulty])
    }
  }

  async presentAlert(){
    const alert = await this.alertController.create({
      header: "Information Manquante",
      message: "Pseudonyme non-valide, la longueur doit être supérieure à 3 !",
      buttons: this.alertButtons
    });
  }

}
