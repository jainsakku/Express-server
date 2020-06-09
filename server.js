const express=require('express');
const mongoose=require('mongoose');
const users=require('./routes/api/users');
const posts=require('./routes/api/posts');
const profile=require('./routes/api/profile');
const bodyParser=require('body-parser');

const db=require('./config.js').mongoURI;

mongoose.connect(db)
	.then(()=>console.log('MongoDb connected'))
	.catch((err)=>console.log(err));

const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/',(req,res)=>res.send('hello !!'));

app.use('/api/users',users);
app.use('/api/post',posts);
app.use('/api/profile',profile);

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`server is running on port ${port}`));