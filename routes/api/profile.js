const express = require('express')
const router = express.Router();
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const { check, validationResult } = require('express-validator');


//@route GET api/profile/me
//desc  GET current user's profile
//access private
router.get('/me', auth, async(req, res) => {


    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name','avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

    }catch(err){
        consple.log(err.message);
        res.status(500).send("Server error")
    }

    
});

router.post('/', [auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   



    const {
        company,
        location,
        website,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    const profileFields= {}
     profileFields.user = req.user.id;
     if(company) profileFields.company = company;
     if(company) profileFields.location = location;
     if(company) profileFields.website = website;
     if(company) profileFields.bio = bio;
     if(company) profileFields.status = status;
     if(company) profileFields.githubusername = githubusername;
     if(skills) {
     profileFields.skills = skills.split(",").map(skill => skill.trim());
     }
     profileFields.social = {}
     if(youtube) profileFields.social.youtube = youtube;
     if(twitter) profileFields.social.youtube = twitter;
     if(facebook) profileFields.social.youtube = facebook;
     if(linkedin) profileFields.social.youtube = linkedin;
     if(instagram) profileFields.social.youtube = instagram;

     console.log(profileFields.skills)

     try{
         let profile = await Profile.findOne({user : req.user.id});

         if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set : profileFields},
                {
                    new :true
                }
            
            );
            return res.json(profile);
         }
         profile = new Profile (profileFields)
         await profile.save()


         
     }catch(err){
        console.log(err.message);
        res.status(500).send("Server error")
    }




    


});

module.exports = router;