
const tryCatch=(func)=>async(req,res,next)=>{
    try {
        await func(req,res,next)
    } catch (error) {
        console.log("from tryCatch",error)
        next(error)
    }
}

export default tryCatch