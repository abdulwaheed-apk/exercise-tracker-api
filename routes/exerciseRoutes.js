const router = require('express').Router()
const { body } = require('express-validator')
const {
  createExercise,
  getExercises,
  editExercise,
  deleteExercise,
  getExercisesByType,
} = require('../controllers/exerciseController')
const verifyToken = require('../middlewares/auth')

router.post(
  '/',
  verifyToken,
  body('exerciseName', `Exercise Name is required \n`).not().isEmpty().trim(),
  body('exerciseType', `Exercise Type is required \n`).not().isEmpty().trim(),
  body('duration', `Exercise Duration is required \n`).not().isEmpty().trim(),
  body('date', `Exercise Date is required \n`).not().isEmpty().trim(),
  body('details', `Exercise details is required \n`)
    .not()
    .isEmpty()
    .trim()
    .escape(),
  createExercise
)
router.get('/', verifyToken, getExercises)
router.put('/:exerciseId', verifyToken, editExercise)
router.patch('/:exerciseId', verifyToken, editExercise)
router.delete('/:exerciseId', verifyToken, deleteExercise)
router.get('/:type', verifyToken, getExercisesByType)

module.exports = router
