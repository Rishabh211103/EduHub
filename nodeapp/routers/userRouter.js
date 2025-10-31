const express = require('express');
const { addUser, getUserByEmailAndPassword, addUserV2, checkEmailExits, checkMobileExists } = require('../controllers/userController');

const router = express.Router();

router.post('/login', getUserByEmailAndPassword);
router.post('/register', addUserV2);
router.post('/checkEmail', checkEmailExits)
router.post('/checkMobile', checkMobileExists)


module.exports = router;