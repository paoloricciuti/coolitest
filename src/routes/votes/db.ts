export const controllers = new Map<string, ReadableStreamDefaultController<string>>();

export const votes = new Map<number, number>();

export function add_vote(id: string, vote: number) {
	if (!votes.has(vote)) {
		votes.set(vote, 0);
	}
	votes.set(vote, votes.get(vote)! + 1);
	controllers.forEach((controller, key) => {
		console.log({ key, id });
		if (key !== id) {
			controller?.enqueue(
				`event: update-votes\ndata: ${JSON.stringify(Object.fromEntries(votes.entries()))}\n\n`
			);
		}
	});
}
