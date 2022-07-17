const jwt = require('jsonwebtoken')
const jwtSecret = 'c7ea746a6da43b3ed0ac53aea95092c5cd1e0507d954e907cb2ed627dee8fd22b3450a'
exports.adminAuth = (req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token,jwtSecret,(err,decodedToken)=>{
            if(err){
                return res.status(401).json({
                    message: "Not authorized"
                })
            }else{
                if(decodedToken.role !== "admin"){
                    return res.status(401).json({
                        meessage: "Not authorized"
                    })
                }else{
                    next()
                }
            }
        })
    }else{
        return res.status(401).json({message: "Not authorized, token not available"})
    }
}

exports.userAuth = (req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token,jwtSecret,(err,decodedToken)=>{
            if(err){
                return res.status(401).json({
                    message: "Not authorized"
                })
            }else{
                if(decodedToken.role !== "Basic"){
                    return res.status(401).json({
                        meessage: "Not authorized"
                    })
                }else{
                    next()
                }
            }
        })
    }else{
        return res.status(401).json({message: "Not authorized, token not available"})
    }
}
