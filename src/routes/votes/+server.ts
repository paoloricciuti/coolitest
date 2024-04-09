import { error } from '@sveltejs/kit';
import { controllers } from './db';

export function GET({ cookies }) {
	const id = cookies.get('coolitest-client-id');
	if (!id) {
		error(500);
	}
	return new Response(
		new ReadableStream({
			start(_controller) {
				controllers.set(id, _controller);
			},
			cancel() {
				controllers.delete(id);
			}
		}),
		{
			headers: {
				'Cache-Control': 'no-cache',
				'Content-Type': 'text/event-stream'
			}
		}
	);
}
