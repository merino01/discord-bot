export function serializeError (_error, stringify) {
	const err = {
		name: _error.name,
		message: _error.message,
		stack: _error.stack
	}

	if (stringify) {
		return JSON.stringify(err)
	}
	return err
}
