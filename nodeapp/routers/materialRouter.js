const express = require('express');
const {
  addMaterial,
  getAllMaterials,
  getMaterialById,
  getMaterialsByCourseId,
  updateMaterial,
  deleteMaterial,
  getMaterialByIdV2,
  addMaterialV2,
  updateMaterialV2
} = require('../controllers/materialController');

const upload = require('../middlewares/multer');
const { validateRole } = require('../authUtils');
const router = express.Router();

router.post('/add-material', validateRole('educator'), upload.single('coverImage'), addMaterialV2);
router.get('/', validateRole('student', 'educator'), getAllMaterials);
router.get('/course/:id', validateRole('educator', 'student'), getMaterialsByCourseId);
router.get('/:id', validateRole('educator', 'student'), getMaterialByIdV2);
router.put('/:id', validateRole('educator'), upload.single('coverImage'), updateMaterialV2);
router.delete('/:id', validateRole('educator'), deleteMaterial);

module.exports = router;