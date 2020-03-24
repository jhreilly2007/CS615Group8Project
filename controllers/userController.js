//This is the Controller in the MVC

var User = require('../models/userModel');

//Authenticate User
exports.user_auth = function (request, response) {
    var user = new User(
        {
            email: request.body.email,
            password: request.body.password
        }
    );
    user.save(function (err) {
        if (err) {
            //'<a href=\"http://localhost:3000\">Back to Home<\/a>' ONLY TEMP
            //needs to be removed
            response.status(400).send(err);
        }else
        response.send('User Successfully created account <a href=\"http://localhost:3000\">Back to Home<\/a>')
    })
};

//Sign in
exports.user_signin = function (request, response) {
    //predefined function .findOne
    User.findOne({'email' : request.body.email}, (err, user)=>{
        //no email matching user, throw error
        if(!user){
            response.json({message : 'Login failed, user not found!'})
        }else{
        
        //if emailed found, compare passwords
        user.comparePassword(request.body.password, (err, isMatch)=>{
            if(err) throw err;
            if(!isMatch) return response.status(400).json({
                message : 'Wrong Password'
            });
            response.status(200).send('Logged in successfully! <a href=\"http://localhost:3000\">Back to Home<\/a>')

        })
    }
        
    })
};
