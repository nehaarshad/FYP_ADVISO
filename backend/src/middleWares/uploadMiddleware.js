import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
import sharp from 'sharp'; 

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let dest = path.join(dirname, '..', 'uploads');
        
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
            fs.chmodSync(dest, 0o755);
        }
        
        cb(null, dest);
    },
    filename: function(req, file, cb) {
        const uniquename = Date.now() + '-' + uuidv4();
        const ext = path.extname(file.originalname).toLowerCase(); 
        const filename = file.fieldname + '-' + uniquename + ext;
        cb(null, filename);
    }
});

const filefilter = (req, file, cb) => {
    const allowedTypes = /xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images Only! Allowed formats: XLSX, XLS'));
    }
};

const xlsxFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error('Excel files only! Allowed: XLSX, XLS'));
};

const uploadXlsx = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024, files: 5 }, // adjust limits as needed
    fileFilter: xlsxFilter
});

// Export the multer instance directly and other utilities as named exports
export { uploadXlsx ,filefilter};


