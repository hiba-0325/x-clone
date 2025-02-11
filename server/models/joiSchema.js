import joi from "joi";

 const joiUserSchema = joi.object({
    name: joi.string().required(),
    userName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    otp: joi.string().required()
});

const joiTweet = joi.object({
    user:joi.string().required(),
    text:joi.string().required(),
   
    
})
export { joiUserSchema, joiTweet };
