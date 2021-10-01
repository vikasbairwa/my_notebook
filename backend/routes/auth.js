const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
jwt_sec = process.env.SECRET_KEY

// Rout 1: creat a user using POST "/api/auth/creatuser". Dosent require login
router.post('/creatuser', [
    body('name', "Enter a valid name").isLength({ min: 5 }),
    body('email', "Enter a valid name").isEmail(),
    body('password', "Minimum length of 8 required").isLength({ min: 8 }),
], async (req, res) => {
    let success=false;
    // for validation by harry 
    // console.log(req.body);
    // const user = User(req.body);
    // user.save()
    // res.send(req.body)

    // validation by package
    //if there are errors return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //chech for unique email 
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        //   .then(user => res.json(user))
        //   .catch(err=>{console.log(err)
        //     res.json({error: "This email already exist", message: err.message})})
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, jwt_sec);
        console.log(token);
success=true;
        res.json({success,token});
        // res.json(user);

    } catch (err) {
        console.log(err.message)
        res.status(500).send("some error occured")
    }
})

// Rout 2: Log in using POST "/api/auth/creatuser". Dosent require login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  

        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, jwt_sec);
        console.log(token);
        success=true

        res.json({success, token});

    } catch (err) {
        console.log(err.message)
        res.status(500).send("some error occured")
    }

})

// Rout 3: get login details, post req, log in require
router.post('/getuser', fetchuser, async (req, res) => {
try {
    userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
} catch (err) {
    console.log(err.message)
        res.status(500).send("some error occured")
}
})


module.exports = router