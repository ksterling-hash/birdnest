import { diskStorage } from "multer"
import path from "path"


const UPLOAD_FOLDER = './uploads/bird-images'

export const imageStorage = {
  storage: diskStorage({
    destination: UPLOAD_FOLDER, 

    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const fileExtension = path.extname(file.originalname)
      cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`)
    },
  }),
}