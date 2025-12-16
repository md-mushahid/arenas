import OpenAI from "openai";

const client = new OpenAI({
    baseURL: 'https://api.tokenfactory.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});

export const getChatCompletion = async (prompt: string) => {
  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
    //   max_tokens: 300,
    //   temperature: 0.7,
    //   response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a helpful software agent that helps users plan their app ideas.
When a user gives a vague idea (like "I want to build an Amazon clone"),
you respond by asking smart clarifying questions to help them define their idea clearly.
Your response should ONLY be a JSON array of questions.
Do not answer the questions, just return questions needed to plan the app.
          `.trim(),
        },
        { role: "user", content: prompt },
      ],
    });
    console.log("completion", completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI error:", err);
    return "Sorry, something went wrong.";
  }
};

