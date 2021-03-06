const express=require('express');
const User=require('../../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys.js');
const passport=require('passport');
const router=express.Router();
router.get('/test',(req,res)=>res.json({msg:"user workig"}));

// routes @ localhost/api/users/register

router.post('/register',(req,res)=>{
	User.findOne({email:req.body.email})
		.then(user=>{
			if(user)
			{
				return res.status(400).json({err:"User exits"});
			}
			else
			{
				const avatar=gravatar.url(req.body.email,{
					s:200, //size
					r:'pg', //Rating
					d:'mm'	//default
				});
				const newUser=new User({
					name:req.body.name,
					email:req.body.email,
					avatar:avatar,
					password:req.body.password

				});
				bcrypt.genSalt(10,(err,salt)=>{
					bcrypt.hash(newUser.password,salt,(err,hash)=>{
						if(err) throw err;
						newUser.password=hash;
						newUser.save()
							.then(user=>res.json(user))
							.catch(err=>console.log(err));
					})
				})
			}
		})
		.catch(err=>console.log(err));
});

// routes @ localhost/api/users/login

router.post('/login',(req,res)=>{
	const email=req.body.email;
	const password=req.body.password;
	User.findOne({email})
		.then(user=>{
			if(!user)
				return res.status(404).json({msg:"Email Not Found"});
			
			bcrypt.compare(password,user.password)
				.then(isMatch=>{
					if(isMatch)
					{
						const payload={id:user.id,name:user.name,avatar:user.avatar};
						jwt.sign(payload,keys.secretOrKey,{expiresIn:3600},
							(err,token)=>{
								res.json({
									success:true,
									token:token
								})
							}
							);
					}
					else
					{
						return res.status(404).json({msg:"Passsword Incorrect"});
					}
				});				
		});
});

// routes @ localhost/api/users/current

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
	res.json(req.user);
});

module.exports=router;