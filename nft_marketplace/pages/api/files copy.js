import multer from "multer";
import * as nc from "next-connect";
import path from "path";

const router = nc.createRouter();

const upload_path = path.join(process.cwd(), "public/uploads");
const storage = multer.diskStorage({
  destination: upload_path,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
});
router.use(upload.single("file"));

router.post(async (req, res) => {
  console.log("router.post:  ", req.file);
  const file = req.file;
  if (!file) {
    res.status(400).json({
      code: -1,
      msg: "文件上传失败",
    });
  }
  console.log("url: ", url);

  const filePath = `/uploads/${file.filename}`;
  console.log("filePath: ", {
    code: 0,
    msg: "文件上传成功",
    path: filePath,
  });

  res.status(200).json({
    data: {
      path: filePath,
      code: 0,
      msg: "文件上传成功",
    },
  });
});

export default router.handler();

export const config = {
  api: {
    bodyParser: false,
  },
};
