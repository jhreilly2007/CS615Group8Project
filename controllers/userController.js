//This is the Controller in the MVC

var User = require('../models/userModel');
const path = require("path");

//Authenticate User
exports.user_auth = function (request, response) {
    var user = new User(
        {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        }
    );
    user.save(function (err) {
        if (err) {
         return response.send('Signup Error, please try again!! <a href=\"http://localhost:3000\">Back to Home<\/a>'); 

        }else 
            request.session.user= {
                  email: user.email,
                  password: user.password
            };
            request.session.save();
        //For testing
        console.log(request.session.user);
        console.log('Sign up successful!');
        response.redirect('/welcome');
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
            request.session.user= {
                  email: user.email,
                  password: user.password
            };
            request.session.save();
            //responses are temporary for testing
            //response.send(request.session);//testing
            response.redirect('/welcome');//should send to a personalised page

        })
    }
        
    })
};

//Logout & delete stored session data
exports.user_logout = function (request, response) {
    if(request.session.user) {
        console.log(request.session.user)//just for testing
        delete request.session.user;
        response.redirect('/');//change routes as we develop
    } else {
        console.log('No session found')//just for testing
        response.redirect('/');//change routes as we develop
    }        
};
