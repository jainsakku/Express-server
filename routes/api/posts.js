const express=require('express');
const router=express.Router();
router.get('/test',(req,res)=>res.json({msg:"post workig"}));;

module.exports=router;