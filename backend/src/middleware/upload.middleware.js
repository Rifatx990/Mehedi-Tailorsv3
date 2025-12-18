const { upload } = require('../config/upload');

// Single image upload
exports.uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};

// Multiple images upload
exports.uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMultiple = upload.array(fieldName, maxCount);
    
    uploadMultiple(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};

// Fields upload (for different types of files)
exports.uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadFields = upload.fields(fields);
    
    uploadFields(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};
