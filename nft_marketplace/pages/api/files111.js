import multer from "multer";
import { createRouter } from "next-connect";
import path from "path";

const upload_path = path.join(process.cwd(), "public/uploads");
// 配置 multer 中间件
const upload = multer({ dest: upload_path });

// 创建 next-connect 处理器
const router = createRouter();

// 使用 multer 处理 multipart/form-data
router.use(upload.single("file"));

router.post((req, res) => {
  // 获取 FormData 中的文件
  const file = req.file;
  console.log("file:111--- ", file);

  // 获取 FormData 中的其他字段
  const { field1, field2 } = req.body;

  // 处理文件和其他数据
  console.log("File:", file);
  console.log("Fields:", field1, field2);

  // 返回响应
  if (!file) {
    res.status(400).json({
      code: -1,
      msg: "文件上传失败",
    });
  }

  res.status(200).json({
    data: {
      path: "filePath",
      code: 0,
      msg: "文件上传成功",
    },
  });
});

export default router.handler();
