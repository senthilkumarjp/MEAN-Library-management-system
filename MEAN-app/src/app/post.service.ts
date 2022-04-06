import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({providedIn:'root'})
export class PostsService{
private posts:Post[]=[];
private postsUpdate = new Subject<Post[]>();

constructor( private http:HttpClient){}

getPosts(postsperpage:number, currentPage:number){
  const queryParams = `?pagesize=${postsperpage}&page=${currentPage}`;
  this.http.get<{message:string, posts:any}>('http://localhost:3000/posts' + queryParams)
  .pipe(map((postData =>{
return postData.posts.map((post:any) =>{
  return {
    FullName:post.FullName,
    RegisterNo:post.RegisterNo,
    Department:post.Department,
    Year:post.Year,
    EnteringTime:post.EnteringTime,
    id:post._id
  }
})
  })))
  .subscribe((transformresult)=>{
    this.posts = transformresult;
    this.postsUpdate.next([...this.posts]);
  })
}

getPostsUpdateListener(){
  return this.postsUpdate.asObservable();
}

getpost(id:string){
  return this.http.get<{_id:string, FullName:string,RegisterNo:any, Department:string, Year:any,EnteringTime:any}>('http://localhost:3000/posts/' + id);
}

addposts(FullName:string, RegisterNo:any, Department:string, Year:string,EnteringTime:string ){
  const post:Post={id:null, FullName:FullName, RegisterNo:RegisterNo, Department:Department, Year:Year,EnteringTime:EnteringTime};
  this.http.post<{message:string, postId:string}>('http://localhost:3000/posts',post)
  .subscribe((response)=>{
    const id = response.postId;
    post.id = id
  })
  this.posts.push(post);
  this.postsUpdate.next([...this.posts]);
}

updatepost(id:string, FullName:string, RegisterNo:any, Department:string, Year:any,EnteringTime:any){
  const post:Post={id:id,FullName:FullName, RegisterNo:RegisterNo,Department:Department,Year:Year,EnteringTime:EnteringTime}
this.http.put('http://localhost:3000/posts/' + id,post)
.subscribe(response =>{
  const updatedPosts = [...this.posts];
  const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
  updatedPosts[oldPostIndex] = post;
  this.posts = updatedPosts;
  this.postsUpdate.next([...this.posts]);
});
}

deletePost(postId:string){
this.http.delete('http://localhost:3000/posts/' + postId)
.subscribe(()=>{
  const updatedPosts = this.posts.filter(post => post.id !== postId);
  this.posts = updatedPosts;
  this.postsUpdate.next([...this.posts]);
})
}
}
