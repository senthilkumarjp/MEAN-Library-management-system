const express = require('express');
const bodyparser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/library')
.then(()=>{
  console.log('connected to database!')
}).catch(()=>{
  console.log('connection error!')
})

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use((req,res,next) =>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
})

app.post('/posts',(req,res,next)=>{
const post = new Post({
  FullName:req.body.FullName,
  RegisterNo:req.body.RegisterNo,
  Department:req.body.Department,
  Year:req.body.Year,
  EnteringTime:req.body.EnteringTime
})
post.save().then(result =>{
  res.json({
    message:'added success!',
    postId:result._id
  })
});
})

app.put('/posts/:id',(req,res,next)=>{
  const post =new Post({
    _id:req.body.id,
    FullName:req.body.FullName,
    RegisterNo:req.body.RegisterNo,
    Department:req.body.Department,
    Year:req.body.Year,
    EnteringTime:req.body.EnteringTime
  })
 Post.updateOne({_id:req.params.id},post).then(result =>{
   res.json({message:'posts updated successfully!'})
 })
})

app.get('/posts',(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if(pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage -1))
    .limit(pageSize);
  }
  Post.find().then(documents =>{
    res.json({
      message:'posts added success!',
      posts:documents
  })
  });
})

app.get('/posts/:id',(req,res,next)=>{
  Post.findById(req.params.id).then(post =>{
    if(post){
      res.json(post);
    }else{
      res.json({message:'post not found'});
    }
  })
})

app.delete('/posts/:id',(req,res,next)=>{
 Post.deleteOne({_id:req.params.id}).then(result =>{
   console.log(result);
  res.json({message:'deleted'})
 })
})

module.exports = app;
