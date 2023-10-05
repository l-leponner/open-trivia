import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {

  constructor(private route: ActivatedRoute,
    private navController: NavController,) { }

  score: number = 0;

  ngOnInit() {
    this.score = this.route.snapshot.params['score'];
  }

  async ionViewDidLeave() {
    this.score = 0;
    if(Boolean((await Preferences.get({key: "remember"})).value) == true){
      const savedScore = await Preferences.set({
        key: "score",
        value: String(this.score),
      });
    }
  }

  onRestartButtonClicked() {
    this.navController.navigateBack("home");
  }

}
