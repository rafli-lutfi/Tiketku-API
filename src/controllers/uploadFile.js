const crypto = require("crypto");
const imagekit = require("../utils/imageKit");
const path = require("path");

module.exports = {
	uploadAvatar: async (req, res, next) => {
		try {
			const user = req.user;
			
			if(!req.get("Content-Type").includes("multipart/form-data")) {
				return next();
			}

			const filename = `${user.fullname}_${crypto.randomBytes(8).toString("hex").toLowerCase()}${path.extname(req.file.originalname)}`;

			const imageString = req.file.buffer.toString("base64");

			const uploadFile = await imagekit.upload({
				fileName: filename,
				file: imageString,
				folder: "Tiketku-API/avatar",
				useUniqueFileName: false,
				overwriteFile: true,
			});

			req.uploadFile = {
				imageUrl: uploadFile.url,
			};
            
			return next();
		} catch (error) {
			return next(error);
		}
	}
};