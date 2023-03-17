const express = require('express')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { check, validationResult } = require('express-validator')

// ? Controller Functions
//@route /api/users
//@method GET To get users
//@access Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  if (users.length === 0) {
    res.status(404).json({ message: 'Users not found' })
  }
  res.status(200).json({ msg: 'All users Only admin is Authorized', users })
})

//@route /api/users/register
//@method POST To create user
//@access public
const register = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body
  // if express validator has not verified throw errors and not process further
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // Find if user already exist
  const userExist = await User.findOne({ email })
  if (userExist) {
    res.status(400)
    throw new Error(' -- User with similar email already exist')
  }
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  // create user
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  })
  if (user) {
    const id = user._id
    const { name, username } = user
    res.status(201).json({
      // user,
      name,
      username,
      token: await generateToken(id),
    })
  } else {
    res.status(400).json({ message: 'Invalid user Data' })
  }
})
//@route /api/users/login
//@method POST
//@access public
const login = async (req, res) => {
  const { email, password } = req.body
  // if express validator has not verified throw errors and not process further
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'Kindly enter Login Credentials' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).send({ message: 'User with this email not found' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = await generateToken(user._id)
      // res.cookie(token)
      const { name, username } = user
      // console.log(name, username)
      res
        .status(200)
        .json({ name, username, message: 'you are authentic user', token })
    } else {
      res.status(400).json({ message: 'Invalid Password' })
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error ${error.message}` })
  }
}
//@route /api/users/profileUpdate
//@method PUT
//@access Private
const profileUpdate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  const { password, newPassword, username, email, name } = req.body
  if (!name || !email || !username || !password || !newPassword) {
    res
      .status(400)
      .json({ message: 'Kindly Add user details to update user data' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  console.log('isMatch', isMatch)
  if (!isMatch) {
    return res.status(400).json({ message: 'Old Password is Incorrect' })
  } else {
    const newHashedPass = await bcrypt.hash(newPassword, 10)
    const updatedUser = await User.updateOne(
      { _id: req.user.id },
      {
        name,
        email,
        password: newHashedPass,
        username,
      }
    )
    console.log('userOld ', user)
    console.log('updatedUser ', updatedUser)
    res.status(200).json(updatedUser)
  }
  // res.json({ message: 'Update user' })
})

// Token Generate Function
const generateToken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
module.exports = { getUsers, register, login, profileUpdate }
