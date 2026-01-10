export async function runExtraction<T>(prompt: string, schema: ZodSchema<T>) {
  const response = await openai.responses.parse({
    model: "gpt-4.1",
    input: prompt,
    schema,
  });

  return response.output;
}
