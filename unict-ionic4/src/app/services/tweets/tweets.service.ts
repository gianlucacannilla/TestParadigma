import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tweet, NewTweet } from 'src/app/interfaces/tweet';
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


  // READ
  async getTweets() {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets`).toPromise();
  }
  
  async getPrincipalTweets(){
     this.principalTweets = [];
     this.allTweets = this.getTweets();
     this.allTweets.forEach(element => {
       if (element["parent_tweet"] == null) this.principalTweets.push(element);
     });
     return this.principalTweets;

  }
  async getCommentTweets(){
    this.commentTweets = [];
    this.allTweets = this.getTweets();
    this.allTweets.forEach(element => {
      if (element["parent_tweet"] != null) this.commentTweets.push(element);
    });
    return this.commentTweets;

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
