import fs from "fs";
import multer from "multer";
import * as nc from "next-connect";
import path from "path";
import { pinata } from "../../utils/config";
// export const pinata = new PinataSDK({
//   pinataJwt: `${process.env.PINATA_JWT}`,
//   pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
// });
console.log("NEXT_PUBLIC_GATEWAY_URL: ", process.env.NEXT_PUBLIC_GATEWAY_URL);

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

  const dataUrl = await readFileAsync(upload_path + "/" + file.filename);

  const filePath = `/uploads/${file.filename}`;
  console.log("url:dataUrl --- ", dataUrl);

  console.log("filePath: ", {
    code: 0,
    msg: "文件上传成功",
    path: dataUrl,
  });

  res.status(200).json({
    data: {
      path: dataUrl,
      code: 0,
      msg: "文件上传成功",
    },
  });
});

async function readFileAsync(path) {
  try {
    const buffer = await fs.promises.readFile(path);
    const data = new Blob([buffer], { type: "image/png" });
    const { cid } = await pinata.upload.public.file(data);
    const resultUrl = await pinata.gateways.public.convert(cid);
    return resultUrl;
  } catch (err) {
    console.error(err);
  }
}

export default router.handler();

export const config = {
  api: {
    bodyParser: false,
  },
};
