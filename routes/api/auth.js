const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const config = require('config')

router.get('/',auth, async (req, res) => {
    console.log(req.user.id)
try{
    const user = await User.findById(req.user.id).select('-password');
    res.send(user)
}catch(err){
    res.status(500).send('server error')
}
});

router.post(
    '/',
    [
        
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { email, password } = req.body;
    
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
            }
    
            // Saving user and generating token
            // ...

            const payload = {
                user : {
                    id : user.id
                }
            }
      
            jwt.sign(payload, config.get('secret') ,
            {expiresIn : 360000}, (err,token) => {
                if(err) throw err;
                res.json(token)
            });
        }  catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
      }
    }
  );

module.exports = router;