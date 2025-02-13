const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode).json({ message: err?.message || "Something went wrong" });
}

export default errorHandler