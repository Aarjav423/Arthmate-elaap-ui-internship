'use strict';
var compose = require('composable-middleware');

const hasRole = (...allowedRole) => {
	return compose()
		.use((req, res, next) => {
			var allowed = false;
			if (req.user) {
				allowedRole.forEach((element, index) => {
					if (req.user.userroles.indexOf(element) > -1) {
						allowed = true;
					}
				});
				if (allowed) {
					next();
				} else {
					return res.status(403).send({ message: 'Not Authorised to perform this operation' });
				}
			} else {
				return res.status(403).json({ message: 'Forbidden' });
			}
		});
};

const hasType = (...allowedType) => {
	return compose()
		.use((req, res, next) => {
			var allowed = false;
			if (req.user) {
				allowedType.forEach((element, index) => {
					if (req.user.type.indexOf(element) > -1) {
						allowed = true;
					}
				});
				if (allowed) {
					next();
				} else {
					return res.status(403).send({ message: 'Not Authorised to perform this operation' });
				}
			} else {
				return res.status(403).json({ message: 'Forbidden' });
			}
		});
};

module.exports = {
	ensureHasRole: hasRole,
	ensureHasType: hasType
};
