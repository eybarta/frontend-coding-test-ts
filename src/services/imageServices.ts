import axios from 'axios';

const NETLIFY_BASE_URL = 'https://imagies.netlify.app';

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
		const prompt = `Create a highly detailed, friendly, cute, fun and vivid cartoon-style image, focusing on the unique characteristics of cats, ensuring no text or unrelated elements appear. Depict visual representations of cat facts, maintaining the highest quality possible within the 512x512 size limit - reference: ${inputText}`
		const query = `prompt=${prompt}&size=512x512&model=dall-e-2`
		const response = await fetch(`${NETLIFY_BASE_URL}/image-generate-ai?${query}`)
		const data = await response.json()
		return data?.base64Image
  } catch (error) {
		return error
  }
};