import customError from "../utils/customError.js";


const manageErrors = (err, req, res, next) => {
    if (err instanceof customError) {
        return res.status(err.statusCode).json({
            message: "something went wrong",
        });
    };
}
export default manageErrors