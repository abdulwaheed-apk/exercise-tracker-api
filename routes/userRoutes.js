const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const {
  getUsers,
  register,
  login,
  profileUpdate,
  deleteUser,
} = require('../controllers/userController')
const User = require('../models/userModel')
const verifyToken = require('../middlewares/auth')

// Routes
router.get('/', verifyToken, getUsers)
router.post(
  '/register',
  body('name', `Name is required \n `).not().isEmpty().trim(),
  body('username', `Username is required and must be unique \n `)
    .not()
    .isEmpty()
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value })
      if (user) {
        return Promise.reject(`Username is not available \n `)
      }
    }),

  body('email', `Email is required, and must be unique. \n `)
    .isEmail()
    .normalizeEmail()
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject(`Email Already in use Must be unique \n `)
      }
    }),

  body('password', `Password is required \n `).not().isEmpty(),
  // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  register
)
router.post(
  '/login',
  body('email', `Email is required \n `).not().isEmpty(),
  body('password', `Password is required \n `).not().isEmpty(),
  login
)
router.put('/profileUpdate', verifyToken, profileUpdate)
router.delete('/deleteUser', verifyToken, deleteUser)

module.exports = router
