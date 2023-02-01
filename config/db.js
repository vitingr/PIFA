if (process.env.NODE_ENV == "production") {

    module.exports = {mongoURI: "mongodb://mongo:PPcwUIHJo4v4R86howLF@containers-us-west-110.railway.app:5519"}

} else {

    module.exports = {mongoURI: "mongodb://localhost/PIFA"}

}
