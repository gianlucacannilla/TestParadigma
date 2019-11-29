import { Component, OnInit , Input} from '@angular/core';
import {NavParams} from '@ionic/angular';
import { Tweet, NewTweet, NewComment, Like ,Favorite} from 'src/app/interfaces/tweet';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import { ModalController } from '@ionic/angular';
import { NewTweetPage } from '../new-tweet/new-tweet.page';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  commentTweets : Tweet [] = [];
  parentTweet : Tweet;
  newComment  = {} as NewComment;
  favorite = {} as Favorite;
  flag : boolean;
  like  = {} as Like;
  constructor(
    private navParams : NavParams,
    private tweetsService: TweetsService,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private uniLoader: UniLoaderService,
    private toastService: ToastService
  ){}

  async ngOnInit() {

    this.parentTweet = this.navParams.get('parentTweet');

    this.getComments();
    
  }



  getAuthor(tweet: Tweet): string {

    if (this.canEdit(tweet)) {
      return 'You';
    } else {
      return tweet._author.name + ' ' + tweet._author.surname;
    }

    /* ------- UNA FORMA PIÚ SINTETICA PER SCRIVERE STA FUNZIONE: -------

      return this.canEdit(tweet) ? 'You' : `${tweet._author.name} ${tweet._author.surname}`;

    */

  }



  async deleteTweet(tweet: Tweet) {

    try {

      // Mostro il loader
      await this.uniLoader.show();

      // Cancello il mio tweet
      await this.tweetsService.deleteTweet(tweet._id);

      // Riaggiorno la mia lista di tweets
      await this.getTweets();

      // Mostro un toast di conferma
      await this.toastService.show({
        message: 'Your tweet was deleted successfully!',
        type: ToastTypes.SUCCESS
      });

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }

    // Chiudo il loader
    await this.uniLoader.dismiss();

  }

  canEdit(tweet: Tweet): boolean {

    // Controllo che l'autore del tweet coincida col mio utente
    if (tweet._author) {
     
      return tweet._author._id === this.auth.me._id;
    }

    return false;

  }

  async createComment(){
    this.newComment.parent_tweet = this.parentTweet._id;
    

    try {

      // Avvio il loader
      await this.uniLoader.show();

      // Chiamo la createTweet se l'utente sta creando un nuovo tweet
      await this.tweetsService.createComment(this.newComment);
      
      
      // Chiudo la modal
      await this.dismiss();

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }

    // Chiudo il loader
    await this.uniLoader.dismiss();


  }

  editComment(){

  }


  async createOrEditTweet(tweet?: Tweet) {

    /*
        Creo una modal (assegnandola ad una variabile)
        per permettere all'utente di scrivere un nuovo tweet
    */
   
    const modal = await this.modalCtrl.create({
      component: NewTweetPage,
      componentProps: {
        tweet
      } // Passo il parametro tweet. Se non disponibile, rimane undefined.
    });

    /*
        Quando l'utente chiude la modal ( modal.onDidDismiss() ),
        aggiorno il mio array di tweets
    */
    modal.onDidDismiss()
    .then(async () => {

      // Aggiorno la mia lista di tweet, per importare le ultime modifiche apportate dall'utente
      await this.getTweets();

      // La chiamata è andata a buon fine, dunque rimuovo il loader
      await this.uniLoader.dismiss();

    });

    // Visualizzo la modal
    return await modal.present();

  } 

  async getTweets() {

    try {

      // Avvio il loader
      await this.uniLoader.show();

      // Popolo il mio array di oggetti 'Tweet' con quanto restituito dalla chiamata API
      this.commentTweets = await this.tweetsService.getTweets(); 

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
  async getComments() {

    try {

      // Avvio il loader
      await this.uniLoader.show();

      // Popolo il mio array di oggetti 'Tweet' con quanto restituito dalla chiamata API
      this.commentTweets = await this.tweetsService.getCommentTweets(this.parentTweet._id); 
     console.log(this.commentTweets);

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

  async putLike(tweet : Tweet){

    this.like.tweetId = tweet._id;
    this.like.userId = this.auth.me._id;

    try {

      await this.tweetsService.addLike(this.like);
      await this.getComments();

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
  }

  async removeLike(tweet : Tweet){

    this.like.tweetId = tweet._id;
    this.like.userId = this.auth.me._id;

    try {

      await this.tweetsService.deleteLike(this.like);
      await this.getComments();

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
  }
  
  async pressLike(tweet : Tweet){

    this.isLiked(tweet) ?  this.removeLike(tweet) : this.putLike(tweet);
    
    
  }
  
  isLiked(tweet: Tweet): boolean {
   
    this.flag = false;

   tweet.users_likes.forEach(element => {
      if (element == this.auth.me._id){
        this.flag = true;
        return;
      } 
   });

   return this.flag;
    
  }

  /// Gestione dei Preferiti ///

async putFavorite(tweet : Tweet){

  this.favorite.tweetId = tweet._id;
  this.favorite.userId = this.auth.me._id;

  try {

    await this.tweetsService.addFavorite(this.favorite);
    await this.getComments();

  } catch (err) {

    // Nel caso la chiamata vada in errore, mostro l'errore in un toast
    await this.toastService.show({
      message: err.message,
      type: ToastTypes.ERROR
    });

  }
}

async removeFavorite(tweet : Tweet){

  this.favorite.tweetId = tweet._id;
  this.favorite.userId = this.auth.me._id;

  try {

    await this.tweetsService.deleteFavorite(this.favorite);
    await this.getComments();

  } catch (err) {

    // Nel caso la chiamata vada in errore, mostro l'errore in un toast
    await this.toastService.show({
      message: err.message,
      type: ToastTypes.ERROR
    });

  }
}

async pressFavorite(tweet : Tweet){

  this.isFavorite(tweet) ?  this.removeFavorite(tweet) : this.putFavorite(tweet);
  
  
}

isFavorite(tweet: Tweet): boolean {
 
  this.flag = false;

 tweet.users_favorites.forEach(element => {
    if (element == this.auth.me._id){
      this.flag = true;
      return;
    } 
 });

 return this.flag;
  
}

}
