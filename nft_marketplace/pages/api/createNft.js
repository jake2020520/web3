export default async (req, res) => {
  console.log("req: ", req.body);
  const metadata = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  };
  const metadataString = JSON.stringify(metadata);
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/pinning/pinJSONToIPFS`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: metadata,
    }
  );
  console.log("resultUrl:000 ", response);

  res.status(200).json({
    data: {
      path: "resultUrl",
      code: 0,
      msg: "文件上传成功",
    },
  });
};
