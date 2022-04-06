import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/post.model';
import { PostsService } from 'src/app/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode='create';
private postId : any ;
 post!:Post;
  constructor(public postsservice:PostsService, public route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
if(paramMap.has('id')){
this.mode = 'edit';
this.postId = paramMap.get('id');
this.postsservice.getpost(this.postId).subscribe(postData =>{
  this.post = {id:postData._id,FullName:postData.FullName,RegisterNo:postData.RegisterNo,Department:postData.Department,Year:postData.Year,EnteringTime:postData.EnteringTime}
});
}else{
  this.mode = 'create'
  this.postId = null;
}
    })
  }

onAdd(form:NgForm){
  if(form.invalid){
    return;
  }
  if(this.mode === 'create'){
    this.postsservice.addposts(form.value.FullName,form.value.RegisterNo,form.value.Department,form.value.Year,form.value.EnteringTime)
  }else{
    this.postsservice.updatepost(this.postId,form.value.FullName,form.value.RegisterNo,form.value.Department,form.value.Year,form.value.EnteringTime)
  }

  form.resetForm();
}

}
