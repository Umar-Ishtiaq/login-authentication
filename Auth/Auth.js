const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.webtoken

exports.register = async (req,res,next)=>{
    const {username, password} = req.body
    if(password.length < 6){
        return res.status(400).json({message:"password less than 6 characters"})
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
          username,
          password: hash,
        })
          .then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
              { id: user._id, username, role: user.role },
              jwtSecret,
              {
                expiresIn: maxAge, // 3hrs
              }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000,
            });
            res.status(201).json({
              message: "User successfully created",
              user: user._id,
              role: user.role,
            });
          })
          .catch((error) =>
            res.status(400).json({
              message: "User not successfully created",
              error: error.message,
            })
          );
      });
    };

exports.login = async (req,res, next)=>{
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({
            message: "Username or Password is empty"
        })
    }
    try{
    const user = await User.findOne({ username })
    if(!user){
         res.status(401).json({
            message: "Login unsuccessful",
            error: "user not found"
        })
    } else{
        bcrypt.compare(password, user.password).then(function(result){
        if(result){
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
              { id: user._id, username, role: user.role },
              jwtSecret,
              {
                expiresIn: maxAge, // 3hrs
              }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000,
            });
            res.status(201).json({
              message: "User successfully logged in",
              user: user._id,
              role: user.role,
            });
        }else{
            res.status(400).json({
                message: "login failed"
            })
        }
    })
    }
    }catch(error){
        res.status(400).json({
            message: "an error occured",
            error: error.message
        })
    }
}

exports.update = async (req,res,next)=>{
    const {role, id} = req.body
    if(role && id){
        if(role === "admin"){
            await User.findById(id)
            .then(user=>{
                if(user.role != "admin"){
                    user.role = "admin"
                    user.save((err)=>{
                        if(err){
                            res.status(400).json({
                                message:"An Error",
                                error: error.message
                            })
                            process.exit(1)
                        }
                        res.status(201).json({
                            message: "Update successful",
                            user
                        })
                    })
                }else{
                    res.status(400).json({
                        message: "user is already admin"
                    })
                }
            })
            .catch(error => {
                res.status(400).json({
                    message: "an error occured",
                    error: error.message
                })
            })
        }else{
            res.status(400).json({
                message: "Role is not admin"
            })
        }
    }else {
        res.status(400).json({
            message: "Role or ID is missing"
        })
    }
}

exports.deleteUser = async (req,res,next)=>{
    const {id} = req.body
    await User.findById(id)
    .then(user=> user.remove())
    .then(result=>{
        res.status(201).json({
            message: "user deleted",
            result
        })
    })
    .catch(error=>{
        res.status(400).json({
            message: "an error occured",
            error: error.message
        })
    })
}

exports.getUsers = async (req,res,next)=>{
    await User.find()
    .then(users=>{
        const userFunction = users.map(user=> {
            const container = {}
            container.username = user.username
            container.role = user.role
            container.id = user._id
            return container
        })
        res.status(200).json({user: userFunction})
    })
    .catch(error=>res.status(401).json({message: "not successful",error: error.meessage}))
}