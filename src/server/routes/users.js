const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../modules/User')
const auth = require("../middleware/auth");
const Job = require("../modules/JobOffer");
const Student = require("../modules/StudentProfile");
const mongoose = require("mongoose");
const Employer = require("../modules/EmployerProfile");
/**
 *@route    POST api/users
 *@desc     register a new user
 *@access   Public
 */

router.post('/', [
        check('email', 'Please include a valid email').isEmail(),
        check('typeOfUser', 'Please include type of user').notEmpty(),
        check('password', 'please enter a password longer then 6 characters').isLength({min: 6})
    ],
    async (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const {email, password, typeOfUser} = req.body;
        try{
            let user = await User.findOne({email});
            if (user){
                return  res.status(400).json({errors:[{msg: 'User exist'}]})
            }

            user = new User({typeOfUser, email, password})

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)

            await user.save()

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload,
                require('../configs/defualt.json').JWT_SECRET,
                {expiresIn: 360000,},
                (err, token)=>{
                    if (err){
                        throw err;
                    }
                    res.json({token})
                })
        }catch (e) {
            console.error(e.message)
            res.status(500).send('server error')
        }

    });

/**
 *@route    get api/users/
 *@desc     get all users
 *@access   Public
 */
router.get('/', [],
    async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.error(e.message)
            res.status(500).send('server error')
        }
})

/**
 *@route    delete api/users/
 *@desc      delete user
 *@access   Public
 */
router.delete('/:id',
    async (req, res) => {
        try {
            let profile = await Student.find({user: mongoose.Types.ObjectId(req.params.id)})
            if (!profile) {
                profile = await Employer.find({user: req.params.id});
                if (!profile) {
                    return res.status(400).json({msg: 'user dont have profile'})
                }
                await  Employer.findOneAndDelete({user:req.params.id})
            }
            await  Student.findOneAndDelete({user:req.params.id})
            const exists = await User.findById(req.params.id)
            if (!exists) {
                return res.status(404).json({msg: "User Doesn't exists"});
            }

            await User.findOneAndDelete({_id: req.params.id});
            res.json({msg: 'User Deleted Successfully'});
        } catch (e) {
            console.error(e.message)
            res.status(500).send('server error')
        }
    })

module.exports = router;
