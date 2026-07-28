await Bun.build({
	entrypoints: ["./index.ts"],
	compile: {
		outfile: "./dist/ollama-chat",
	},
});
