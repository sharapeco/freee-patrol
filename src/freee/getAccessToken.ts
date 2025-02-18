import { createLocalStorage } from "localstorage-ponyfill";
import { gray, red, bold, underline } from "kolorist";
import { question } from "../cli/question.js";

export async function getAccessToken(): Promise<string> {
	const localStorage = createLocalStorage();

	while (true) {
		try {
			const token = localStorage.getItem("token");
			if (token == null) {
				throw new Error("invalid_access_token");
			}
			return token;
		} catch (e) {
			if (
				e instanceof Error &&
				/\b(?:invalid|expired)_access_token\b/.test(e.message)
			) {
				console.log(
					bold(
						red(
							"アクセストークン取得ページからアクセストークンを取得してください",
						),
					),
				);
				console.log(underline(authorizeURL()));
				console.log("");
				const token = await question(gray("アクセストークン: "));
				localStorage.setItem("token", token);
			} else {
				throw e;
			}
		}
	}
}

function authorizeURL(): string {
	const { FREEE_APP_ID, FREEE_COMPANY_ID } = process.env;
	return `https://app.secure.freee.co.jp/developers/start_guides/applications/${FREEE_APP_ID}/authorize?company_id=${FREEE_COMPANY_ID}`;
}
