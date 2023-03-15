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
  body('exerciseName', '-m- Exercise Name is required').not().isEmpty().trim(),
  body('details', '-m- Exercise details is required').trim().escape(),
  createExercise
)
router.get('/', verifyToken, getExercises)
router.put('/:exerciseId', verifyToken, editExercise)
router.patch('/:exerciseId', verifyToken, editExercise)
router.delete('/:exerciseId', verifyToken, deleteExercise)
router.get('/:type', verifyToken, getExercisesByType)

module.exports = router
