const respone = require("../utils/respone");

const options = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true,
	errors: {
		wrap: {
			label: ""
		}
	},
	convert: false
};


module.exports = (schemas) => {
	const {bodySchema, querySchema, parameterSchema, fileSchema} = schemas;

	return async (req, res, next) => {
		try {
			if(fileSchema){
				if(req.file){
					req.file = await fileSchema.validateAsync(req.file, options);
					return next();
				}
			}

			if(bodySchema){
				req.body = await bodySchema.validateAsync(req.body, options);
			}

			if(querySchema){
				req.query = await querySchema.validateAsync(req.query, options);
			}

			if(parameterSchema){
				req.params = await parameterSchema.validateAsync(req.params, options);
			}

			next();
		} catch (error) {
			respone.errorJoiValidation(res, error);
		}
	};
};