module.exports = {
	hasRole: (roles = []) => {
		if(typeof roles == "string") roles = [roles];

		return (req, res, next) => {
			if(!roles.includes(req.user.role)){
				return res.status(403).json({
					status: false,
					message: "you do not have permission to access this site", 
					data: null
				});
			}
			next();
		};
	}
};