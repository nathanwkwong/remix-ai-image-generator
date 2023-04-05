import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: ENV.OPENAPI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const generateImage = async (description: string, size: string) => {
    const imageSize = size === 'large' ? '512x512' : '256x256';

    try {
        const response = await openai.createImage({
            prompt: description,
            n: 1, // number of images to generate
            size: imageSize
        });

        const imageUrl = response.data.data[0].url;

        return { success: true, data: { imageUrl } };
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        return {
            success: false,
            error: 'The image could not be generated'
        };
    }
};
