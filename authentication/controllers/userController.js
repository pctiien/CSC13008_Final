const userService = require('../services/userService')

const getAllUsers = async(req,res,next)=>{
    const users = await userService.getAllUsers(req.query)
    if(users.success)
    {
        return res.status(200).json(users)
    }else{
        return res.status(500).json('Error while getting users')
    }
}
const getUserDetails = async(req,res,next)=>{

    try{

        const user = await userService.getUserDetails(req.params.id)
        if(user.success)
        {
            return res.status(200).json(user)
        }else{
            return res.status(404).json({ success: false, message: 'User not found' });
        }
            
    }catch(err)
    {
        return next(new Error('Internal Server Error: Unable to retrieve user details'))
    }
}

const toggleBanUser = async(req,res,next)=>{
    try{
        const result = await userService.toggleBanUserById(req.params.id)
        if(result.success)
        {
            return res.status(200).json(result)
        }else{
            return res.status(404).json({success: false,message: 'User not found'})
        }
    }catch(err)
    {
        return next(new Error('Internal Server Error: Unable to ban user'))
    }
}

module.exports = {getAllUsers,getUserDetails,toggleBanUser}