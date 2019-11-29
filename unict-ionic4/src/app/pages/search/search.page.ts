import { Component, OnInit , Input} from '@angular/core';
import {NavParams} from '@ionic/angular';
import { Tweet, NewTweet, NewComment, Like ,Favorite, Hashtag} from 'src/app/interfaces/tweet';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import { ModalController } from '@ionic/angular';
import { NewTweetPage } from '../new-tweet/new-tweet.page';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';
import { Hash } from 'crypto';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  hashtagTweets : Tweet [] = [];

  hashtag : string;
 
  constructor(
    private tweetsService: TweetsService,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private uniLoader: UniLoaderService,
    private toastService: ToastService
  ){}

  async ngOnInit() {
    
  }


  canEdit(tweet: Tweet): boolean {

    // Controllo che l'autore del tweet coincida col mio utente
    if (tweet._author) {
     
      return tweet._author._id === this.auth.me._id;
    }

    return false;

  }

  getAuthor(tweet: Tweet): string {

    if (this.canEdit(tweet)) {
      return 'You';
    } else {
      return tweet._author.name + ' ' + tweet._author.surname;
    }
  }

  async getHashtagTweets(hashtag : string) {
    try {

      // Avvio il loader
      await this.uniLoader.show();

      // Popolo il mio array di oggetti 'Tweet' con quanto restituito dalla chiamata API
      this.hashtagTweets = await this.tweetsService.getHashtagTweets(hashtag); 

      // La chiamata è andata a buon fine, dunque rimuovo il loader
      await this.uniLoader.dismiss();

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
  }
  
  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  

}
