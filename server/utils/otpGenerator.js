import otpGenerator from "otp-generator";

const otpGen= ()=>{
    return otpGenerator.generate(6, {
        upperCaseAlphabets:true,
        specialChars:false,
    });
};

export default otpGen