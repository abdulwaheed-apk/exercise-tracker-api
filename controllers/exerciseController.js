const express = require('express')
const asyncHandler = require('express-async-handler')
const Exercise = require('../models/exerciseModel')
const User = require('../models/userModel')
const { validationResult } = require('express-validator')

//**  Controller Functions */

//@route POST /api/exercises
//@desc Create  New exercise
//@access Private
const createExercise = async (req, res) => {
  const { exerciseName, exerciseType, duration, date, details } = req.body
  // middleware result
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    // create exercise
    // req.user is coming from verifyToken middleware
    // console.log(req.user)
    const exercise = await Exercise.create({
      userId: req.user.id,
      exerciseName,
      exerciseType,
      duration,
      date: date.toLocaleString('en-US'),
      details,
    })
    res.status(201).json(exercise)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

//@route GET /api/exercises
//@desc Get all exercises
//@access Private

// const getExercises = async (req, res) => {
//   try {
//     const exercises = await Exercise.find()
//     if (exercises.length === 0) {
//       res.status(404).json({ message: 'Exercises Not Found, Add New.' })
//     }
//     res.status(200).json({ exercises })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }
const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find()
    if (exercises.length === 0) {
      res.status(404).json({ message: 'Exercises Not Found, Add New.' })
    }
    res.status(200).json(exercises)
  } catch (error) {
    res.status(500)
    console.log(error.message)
  }
}

//@route PUT/PATCH /api/exercises/:exerciseId
//@desc  Update exercise
//@access Private
const editExercise = async (req, res) => {
  // const { exerciseName, exerciseType, duration, date, details } = req.body
  try {
    // select exercise to update
    // console.log(req.params.exerciseId)
    const exercise = await Exercise.findById(req.params.exerciseId)
    // console.log(exercise)
    if (!exercise) {
      res.status(404).json({
        message:
          'exercise Not found with this id make sure to add correct id of exercise you want to edit',
      })
    }
    // Get user from token => req.user.id coming from token payload(req.user)
    const user = await User.findById(req.user.id)

    if (!user) {
      res.status(403).json({ message: 'You are not allowed to Edit' })
    }
    // console.log(user)
    // Now update exercise
    const updatedExercise = await Exercise.findByIdAndUpdate(
      { _id: req.params.exerciseId },
      req.body,
      { new: true, runValidators: true }
    )
    res.status(200).json(updatedExercise)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//@route DELETE /api/exercises/:exerciseId
//@desc delete exercise
//@access Private
const deleteExercise = async (req, res) => {
  const exercise = await Exercise.findById(req.params.exerciseId)

  if (!exercise) {
    res.status(404).json({ message: 'Exercise Not Found' })
  }
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(404).json({ message: 'User Not Found' })
  }

  if (exercise.userId.toString() !== req.user.id) {
    res.status(401).json({
      message:
        "User who created post and user who want to delete post did't match",
    })
  }
  // exercise.remove()
  const removedExercise = await Exercise.findByIdAndRemove(exercise._id)
  // console.log(removedExercise)
  res.status(200).json({ message: 'Exercise Removed' })
}
// todo Create This endpoint
//@route GET /api/exercises/:type
//@desc Get exercise By Type
//@access Private
const getExercisesByType = async (req, res) => {
  const user = await User.findById(req.user.id)
  try {
    if (!user) {
      res.status(401).json({ message: 'You are not Authentic user.' })
    }
    const exercisesOfType = await Exercise.find({
      exerciseType: req.params.type,
    })
    res.json({ 'check type': exercisesOfType })
  } catch (error) {
    res.status(501).json({ message: error.message })
  }
}

module.exports = {
  createExercise,
  getExercises,
  editExercise,
  deleteExercise,
  getExercisesByType,
}
