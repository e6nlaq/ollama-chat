import { Command } from "@commander-js/extra-typings";
import ollama from "ollama";
import { getRandomElementStrict } from "./lib/random";
import packageJson from "./package.json";

const program = new Command("ollama-chat")
	.description("Chat with ollama models!")
	.version(packageJson.version)
	.option("--model <model>", "AI Model", "gemma3n:e2b")
	.option(
		"-m --message <message>",
		"Init message",
		"[チャットが開始されました]",
	)
	.option("-u --username <username>", "Your username", "@player")
	.option("-d --delay <delay>", "Delay of chats", "15000");

program.parse();

const opts = program.opts();

const name = opts.username;

// const names = ["Ken", "Hana", "Taro", "Momoka", "Ren", "Chiko", "Saki"];
const names = [
	"Hikakin",
	"徳川家康",
	"織田信長",
	"尾田栄一郎",
	"豊臣秀吉",
	"安倍晋三",
	"聖徳太子",
	"Elon Musk",
	"Steve Jobs",
	"Jesus Christ",
	"習近平",
	"金正恩",
	"Donald Trump",
	"神",
];
const chat = [
	`Chat: ${opts.message}`,
	`Chat: (まだ誰も会話をしていないようです...何か話題を作ってみましょう!)`,
];

const input = `${name}: `;

console.log(chat[0]);

console.write(input);

let last = name;
setInterval(async () => {
	const per = getRandomElementStrict(names);
	if (per === last) return;
	last = per;
	const mes = `You are a user in a group chat. Please look at the chat history below and respond as **${per}**. Do not use line breaks or emojis in your reply. Also, please consider gender and personality based on the name and past replies of that person when responding. Make sure to reply strictly as the assigned person. Also, do not add anything like XXX: at the beginning of the sentence, and just reply directly.
Here are the most recent 10 messages:\n${chat.slice(-10).join("\n")}`;

	const res = await ollama.chat({
		model: opts.model,
		messages: [{ role: "user", content: mes }],
	});

	let resm = res.message.content.trim();
	if (resm.includes(`${per}:`)) resm = "[検閲済み]";
	resm = resm.replaceAll("\n\n", "\n");

	const out = `${per}: ${resm}`;
	console.log("\x1b[2K");
	console.log(out);
	chat.push(out);
	console.write(input);
}, Number(opts.delay));

for await (const line of console) {
	if (["!q", ":q", "exit", "quit"].includes(line)) {
		console.log("Chat: [チャットを終了します...]");
		process.exit(0);
	}
	chat.push(`${name}: ${line.trim()}`);
	console.write(input);
	last = name;
}
