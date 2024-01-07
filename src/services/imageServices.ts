import axios from 'axios';

const GENERATE_API = 'https://api.openai.com/v1/images/generations';
const { VITE_OPENAI_KEY } = import.meta.env;
console.log('VITE_OPENAI_KEY: ', VITE_OPENAI_KEY);


async function saveImageUrlToLocalCache(imageUrl: string) {
  try {
    const existingData = localStorage.getItem('catImages');
    const newData = existingData ? JSON.parse(existingData) : {};
    const newKey = `cat-${Object.keys(newData).length + 1}`;
    newData[newKey] = imageUrl;
    localStorage.setItem('catImages', JSON.stringify(newData));
    const updatedItems = localStorage.getItem('catImages');
    return updatedItems
  } catch (error) {
    console.error('Error saving image URL:', error);
		return error
  }
}
export default async function generateImage(inputText: string) {
	if (!inputText) return
  try {
		const prompt = `hyper realistic vivid scene depicting this description - ${inputText}`
    const response = await axios.post(GENERATE_API,
      {
        prompt,
        n: 1,
        size: "256x256",
        model: "dall-e-2",
				response_format: 'b64_json'
      },
      {
        headers: {
          'Authorization': `Bearer ${VITE_OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const image64 = response.data.data[0].b64_json; // Modify according to the actual response structure
    console.log('##home b64_json: ', image64);
    return image64
  } catch (e) {
    console.error("Error generating image: >> ", e)
		return e
  }
};