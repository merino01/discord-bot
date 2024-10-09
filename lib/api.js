const BASE_API_URL = "http://localhost:3002/api/v1/"

export default {
	GET,
	POST,
	DELETE
}

async function GET (url) {
	return await doRequest({
		url,
		method: "GET"
	})
}

async function POST (url, body) {
	return await doRequest({
		url,
		method: "POST",
		body
	})
}

async function DELETE (url) {
	return await doRequest({
		url,
		method: "DELETE"
	})
}

async function doRequest ({ url, method, body }) {
	const fullURL = `${BASE_API_URL}${url}`

	const response = await fetch(fullURL, {
		method,
		headers: {
			"Content-Type": "application/json"
		},
		body: body
			? JSON.stringify(body)
			: undefined
	})
	const data = await response.json()
	return data
}
