exports.getAll = (Model) => async (req, res, next) => {
	try {
		const	data = await Model.find();

		res.status(200).json({
			status: 'success',
			data
		})
	}
	catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
}