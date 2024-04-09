import { votes, add_vote } from './votes/db';

export function load({ cookies }) {
	if (!cookies.get('coolitest-client-id')) {
		cookies.set('coolitest-client-id', crypto.randomUUID(), {
			path: '/'
		});
	}
	return {
		votes
	};
}

export const actions = {
	async default({ request, cookies }) {
		const data = await request.formData();
		const id = cookies.get('coolitest-client-id');
		const vote = data.get('vote');
		if (vote && id) {
			add_vote(id, parseInt(String(vote)));
		}
	}
};
