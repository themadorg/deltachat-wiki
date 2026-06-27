// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			lang: string;
		}
		interface PageData {
			lang: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "*.yml?raw" {
    const content: string;
    export default content;
}

export { };
