import { User } from './user';

export interface NewTweet {
    tweet: string;
   
}
export interface NewComment {
    tweet: string;
    parent_tweet : string;
    _id: string;
    _author: User;
  
}
export interface Tweet {
    created_at: string;
    _id: string;
    tweet: string;
    _author: User;
    parent_tweet : string;
    users_likes : Array<string>;
    users_favorites : Array<string>;
    hashtags : Array<string>;
    likes : number;
    favorites : number;
}

export interface Like {

    tweetId : string;
    userId: string;
}


export interface Hashtag {

    hashtag : string;
}


export interface Favorite {

    tweetId : string;
    userId: string;
}



