import jwt from 'jsonwebtoken';

const userAuth = async (req,res,next)=>{
    const {token}= req.cookies;
    if(!token){
       return res.send({success:false,message:"Not authorized, please login again, token not found"});
    }
    try {
        const DecodedToken = jwt.verify(token,process.env.JWT_SECRET)
        if(DecodedToken.id){
            req.body.userId = DecodedToken.id;
        }
        else{
            return res.send({success:false,message:"Account not verified, please login again."})
        }
        return next();
    } catch (error) {
        return res.send({success:false,message:error.message})
    }
}
export default userAuth;