const CustomErr = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req,res,next)=>{
    const token = req.signedCookies.token

    if(!token){
        throw new CustomErr.UnauthenticatedError('Authentication Invalid');
    }

    try{
        const {name, userId} = isTokenValid({token});
        req.user = {name, userId}
        next();
    }
    catch(error){
        console.log(error)
        throw new CustomErr.UnauthenticatedError('Authentication Invalid');
    }
}

const authorizePermissions = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new CustomErr.UnauthorizedError(
                'Unauthorized to access this route'
            );
        }
        next();
    } 
}

module.exports = {
    authenticateUser,
    authorizePermissions
}