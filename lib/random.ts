export function getRandomElementStrict<T>(array: T[]): T {
	if (array.length === 0) {
		throw new Error("Array must not be empty.");
	}
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}
