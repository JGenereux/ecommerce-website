const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const router = require("express").Router();

const upload = multer({ storage: multer.memoryStorage() });

async function uploadImage(imageBuffer) {
  const clientId = "0fb7da4e8a0451b";
  const formData = new FormData();
  formData.append("image", imageBuffer, {
    filename: "navbarLogo.png",
    contentType: "image/png",
  });

  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Client-ID ${clientId}`,
        },
      }
    );
    return response.data.data.link;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

router.route("/api/upload").post(upload.single("image"), async (req, res) => {
  console.log(req.file);

  try {
    const imageUrl = await uploadImage(req.file.buffer);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
