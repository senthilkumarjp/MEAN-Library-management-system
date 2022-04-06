import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/post.model';
import { PostsService } from 'src/app/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
posts:Post[]=[];
private postsSub!:Subscription;
totalPosts = 10;
postsperpage=2;
currentpage = 1;
pagesizeoptions=[1,2,5,10];
  constructor(public postsService:PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts(this.postsperpage,this.currentpage);
    this.postsSub = this.postsService.getPostsUpdateListener()
    .subscribe((data:Post[])=>{
      this.posts = data;
    })
  }

  onChangePage(pageData:PageEvent){
this.currentpage = pageData.pageIndex + 1;
this.postsperpage = pageData.pageSize;
this.postsService.getPosts(this.postsperpage,this.currentpage);
  }

  onDelete(postId:string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }
}
