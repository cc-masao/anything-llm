
const {format} = require('util')

/* ref.
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});
*/

class OpenAi {

	// API キーの保持はしていない。
	constructor() {
		const {OpenAI } =  require("openai");
		const openai = new OpenAI({
			apiKey: process.env.OPEN_AI_KEY,
		});
		this.openai = openai;

		/*
    	const { Configuration, OpenAIApi } = require("openai");
    	const config = new Configuration({
      		apiKey: process.env.OPEN_AI_KEY,
    	});
    	const openai = new OpenAIApi(config);
    	this.openai = openai;
		*/
	}

	//  "gpt-4", "gpt-3.5-turbo" のみ許可。より長いモデルは？
  	isValidChatModel(modelName = "") {
    	const validModels = ["gpt-4", "gpt-3.5-turbo"];
    	return validModels.includes(modelName);
  	}

  async isSafe(input = "") {
    const { flagged = false, categories = {} } = await this.openai
      .createModeration({ input })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("results"))
          throw new Error("OpenAI moderation: No results!");
        if (res.results.length === 0)
          throw new Error("OpenAI moderation: No results length!");
        return res.results[0];
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::CreateModeration failed with: ${error.message}`
        );
      });

    if (!flagged) return { safe: true, reasons: [] };
    const reasons = Object.keys(categories)
      .map((category) => {
        const value = categories[category];
        if (value === true) {
          return category.replace("/", " or ");
        } else {
          return null;
        }
      })
      .filter((reason) => !!reason);

    return { safe: false, reasons };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}) {
	console.log("debug >>> IN : sendChat")
	const model = process.env.OPEN_MODEL_PREF;
    if (!this.isValidChatModel(model))
      	throw new Error(
        		`OpenAI chat: ${model} is not valid for chat completion!`
    	);

	// max token おいたほうが良いか？
    const textResponse = await this.openai
      	.createChatCompletion({
        	model,
        	temperature: Number(workspace?.openAiTemp ?? 0.7),
        	n: 1,
			max_tokens: 1000,
        	messages: [
          		{ role: "system", content: "" },
          		...chatHistory,
          		{ role: "user", content: prompt },
        	],
      		})
      	.then((json) => {
        	const res = json.data;
        	if (!res.hasOwnProperty("choices"))
        		throw new Error("OpenAI chat: No results!");
        	if (res.choices.length === 0)
          		throw new Error("OpenAI chat: No results length!");
        	return res.choices[0].message.content;
      		})
      	.catch((error) => {
			const msg = format('createChatCompletion error : %s', error)
			console.log(msg);
        	// console.log(error);
        	throw new Error(
          	`OpenAI::createChatCompletion failed with: ${error.message}`
        	);
      	});

    	return textResponse;
  	}

	// これが呼ばれた。
  	async getChatCompletion(messages = [], { temperature = 0.7 }) {
		console.log("# debug >>> IN : getChatCompletion")
		console.log(messages)
    	const model = process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo";
		console.log(model)
		console.log(temperature)
		console.log(process.env.CC_MAX_TOKENS)

		const { data } = await this.openai.createChatCompletion({
			model,
        	messages,
			temperature,
	  	});

		/*
		const { data } = await this.openai.createChatCompletion({
			model,
        	temperature: temperature,
        	n: 1,
			max_tokens:  process.env.CC_MAX_TOKENS,
        	messages: messages,
	  	});
		*/
		/*
    	const { data } = await this.openai.createChatCompletion({
      		model,
      		messages,
      		temperature,
    	});
		*/

    	if (!data.hasOwnProperty("choices")) return null;
    	return data.choices[0].message.content;
  	}

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
    return result?.[0] || [];
  }

  	async embedChunks(textChunks = []) {
		console.log('>> debug > openAi::embedChunks.')
		const {
      		data: { data },
		} = await this.openai.embeddings.create ({
		// } = await this.openai.createEmbedding({
      			model: "text-embedding-ada-002",
      			input: textChunks,
    		});


    	return data.length > 0 &&
      		data.every((embd) => embd.hasOwnProperty("embedding"))
      		? data.map((embd) => embd.embedding)
      		: null;
  	}

}

module.exports = {
  OpenAi,
};
