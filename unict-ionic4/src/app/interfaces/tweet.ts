import { User } from './user';

export interface NewTweet {
    tweet: string;
   
}
export interface NewComment {
    tweet: string;
    parent_tweet : string;
}
export interface Tweet {
    created_at: string;
    _id: string;
    tweet: string;
    _author: User;
}
