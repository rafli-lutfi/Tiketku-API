const crypto = require("crypto");
const {URL} = require("url");
const {User} = require("../db/models");
const imagekit = require("../utils/imageKit");
const path = require("path");

module.exports = {
	uploadAvatar: async (req, res, next) => {
		try {
			const user = req.user;
			
			if(!req.get("Content-Type").includes("multipart/form-data")) {
				return next();
			}

			const mimeType = req.file.mimetype;

			if (mimeType != "image/png" && mimeType != "image/jpg" && mimeType != "image/jpeg") {
				return res.status(400).json({
					status: false,
					message: "file type must be png, jpg, or jpeg",
					data: null,
				});
			}

			const userDb = await User.findOne({where: {id: user.id}});
			const oldAvatar = userDb.avatar;

			const paths = new URL(oldAvatar).pathname.split("/");
			let [filename] = paths.slice(-1);

			if (filename == "default-avatar.png") {
				filename = `${user.fullname}_${crypto.randomBytes(8).toString("hex").toLowerCase()}${path.extname(req.file.originalname)}`;
			}

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