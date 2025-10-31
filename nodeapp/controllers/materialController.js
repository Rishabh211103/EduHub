const Material = require('../models/materialModel');
const axios = require('axios')

const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find({}).populate('courseId')
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id)

    if (material) {
      res.status(200).json(material);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaterialByIdV2 = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id).populate('courseId')

    if (material) {
      res.status(200).json(material);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaterialsByCourseId = async (req, res) => {
  try {
    const { id } = req.params;
    const materials = await Material.find({ courseId: id });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMaterial = async (req, res) => {
  try {
    const { courseId, title, description, url, contentType } = req.body;

    let coverImageFilePath = null;
    if (req.file) {
      coverImageFilePath = `/uploads/materials/${req.file.filename}`;
    }
    const text = `${title} - ${description}`
    const embedding = await axios.post(`${process.env.FRESHERMATE_APP_API}/chat/embedding`, text)
    const materialObj = {
      courseId,
      title,
      description,
      url,
      contentType,
      file: coverImageFilePath,
      embedding
    };

    const material = await Material.create(materialObj);
    res.status(200).json({ message: 'Material added successfully', data: material });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByIdAndUpdate(id, req.body, { new: true });

    if (material) {
      res.status(200).json({ material, message: 'Material updated successfully' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMaterialV2 = async (req, res) => {
  try {
    const { courseId, title, description, url, contentType } = req.body;


    let coverImageFilePath = null;
    if (req.file) {
      coverImageFilePath = `/uploads/materials/${req.file.filename}`;
    }

    const materialObj = {
      courseId,
      title,
      description,
      url,
      contentType,
      file: coverImageFilePath
    };

    const material = await Material.create(materialObj);

    
    res.status(200).json({ 
      message: 'Material added successfully', 
      data: material 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMaterialV2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, title, description, url, contentType } = req.body;

    const updateObj = {
      title,
      description,
      url,
      contentType,
      courseId,
      updatedAt: new Date()
    };

    if (req.file) {
      updateObj.file = `/uploads/materials/${req.file.filename}`;
    } else {
      console.log('No new file - keeping existing');
    }

    const material = await Material.findByIdAndUpdate(
      id, 
      updateObj, 
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.status(200).json({ 
      message: 'Material updated successfully', 
      data: material 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByIdAndDelete(id);

    if (material) {
      res.status(200).json({ message: 'Material deleted successfully' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  getMaterialsByCourseId,
  addMaterial,
  addMaterialV2,
  updateMaterial,
  updateMaterialV2,
  deleteMaterial,
  getMaterialByIdV2
};