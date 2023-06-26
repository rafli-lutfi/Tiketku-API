module.exports = {
	successOK: (res, message, data = null) => {
		return res.status(200).json({
			status: true,
			message: message,
			data: data
		});
	},

	successCreated: (res, message, data = null) => {
		return res.status(200).json({
			status: true,
			message: message,
			data: data
		});
	},

	errorJoiValidation: (res, error) => {
		const detailError = error.details.map(x => {return x.message;});
    
		return res.status(400).json({
			status: false,
			message: "Validation error",
			error: detailError
		});
	},

	errorBadRequest: (res, error, detail = null) => {
		return res.status(400).json({
			status: false,
			message: error,
			error: detail
		});
	}
};