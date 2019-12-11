/*
Based on https://github.com/marborkowski/fetch-worker/
Copyright (c) 2017 Marcin Borkowski
*/

let worker;

const request: RequestInit = {
	method: 'GET',
	mode: 'cors',
	cache: 'default',
	redirect: 'follow',
	headers: {
		'Content-Type': 'application/json'
	}
};

const tasks = {};

const onmessage = (event: any) => {
	const { id, query } = event.data;
	fetch(query.url, query.request)
		.then(async (response) => {
			response.json().then(json => 
				postMessage({ 
					id, 
					data: {
						status: response.status,
						statusText: response.statusText,
						headers: Array.prototype.slice.call(response.headers),
						type: response.type,
						redirected: response.redirected,
						url: response.url,
						json,
					}
				})
			);
		}).catch((ex) => {
			postMessage({ id, error: ex });
		});
};

const blob = new Blob(
	[`onmessage = ${String(onmessage)}`],
	{
		type: 'text\/javascript',
	}
);

if (self.Worker) {
	worker = new Worker(
		URL.createObjectURL(blob)
	);
} else {
	worker = {
		listener: null,
		addEventListener: (eventType, callback) => {
			worker.listener = callback;
		},
		postMessage: (input) => {
		const { id, query } = input;
		fetch(query.url, query.request)
			.then((response) => {
				worker.listener({
					data: {
						id,
						data: response
					}
				});
			}).catch((ex) => {
				worker.listener({
					data: {
						id,
						error: ex
					}
				});
			});
		}
	}
}

worker.addEventListener('message', (event) => {
	const { id, data, error } = event.data;

	if (data) {
		tasks[id].promise.then(() => {
			delete tasks[id];
		});

		tasks[id].res(data);
	} else {
		tasks[id].rej(error);
	}
}, false);

const API = {
	fetch: (url: string, req = request) => {
		const id = `${(Math.random() * 1000)}_${Date.now()}`;
		tasks[id] = (() => {
			let res;
			let rej;
			const promise = new Promise((resolve, reject) => {
				res = resolve;
				rej = reject;
			});
			return {
				promise,
				res,
				rej
			};
		})();

		const query = {
			url: url || `http://localhost:3000/api/List?${Math.random()}`,
			request: req
		};

		worker.postMessage({ id, query });

		return tasks[id].promise;
	}
};

export default API;
