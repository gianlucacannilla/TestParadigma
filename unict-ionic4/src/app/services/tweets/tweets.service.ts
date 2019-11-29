import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tweet, NewTweet, NewComment, Like, Favorite,Hashtag } from 'src/app/interfaces/tweet';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  principalTweets : Array<Tweet>;
  commentTweets : Array<Tweet>;
  allTweets : any;
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // CREATE
  async createTweet(newTweet: NewTweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<Tweet>(`${environment.API_URL}/tweets/`, newTweet, {
      headers: headerOptions
    }).toPromise();
  }

  async createComment(newTweet: NewComment) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<Tweet>(`${environment.API_URL}/tweets/createcomment/`, newTweet, {
      headers: headerOptions
    }).toPromise();
  }

  async addLike ( like : Like){
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/addlike/${like.tweetId}/${like.userId}`, like, {
      headers: headerOptions
    }).toPromise();
  }

  async deleteLike(like : Like){
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/removelike/${like.tweetId}/${like.userId}`, like, {
      headers: headerOptions
    }).toPromise();
  }

  async addFavorite ( favorite : Favorite){
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/addfavorite/${favorite.tweetId}/${favorite.userId}`,favorite, {
      headers: headerOptions
    }).toPromise();
  }

  async deleteFavorite(favorite : Favorite){
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/removefavorite/${favorite.tweetId}/${favorite.userId}`,favorite, {
      headers: headerOptions
    }).toPromise();
  }

  // READ
  async getTweets() {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets`).toPromise();
  }
  
   // READ
   async getHashtagTweets(hashtag : string) {
   
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets/showtweetsbytag/${hashtag}`).toPromise();

  }

  // READ
  async getFavoritesTweets() {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets/myfavorites/${this.auth.me._id}`).toPromise();
  }
 
  async getCommentTweets(parentTweet : string){
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets/showcomments/${parentTweet}`).toPromise();
   }
  // UPDATE
  async editTweet(tweet: Tweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/${tweet._id}`, tweet, {
      headers: headerOptions
    }).toPromise();
  }

  // DELETE
  async deleteTweet(tweetId: string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/tweets/${tweetId}`, {
      headers: headerOptions
    }).toPromise();
  }

}
