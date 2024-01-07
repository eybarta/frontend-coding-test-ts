import axios from 'axios';
import { CatFact } from '@t/catFact'

export default async function generateCatFacts() {
	const response = await axios.get('https://cat-fact.herokuapp.com/facts');
	console.log('response: ', response);
	if (response.data?.length) {
		return response.data.map(({text }: CatFact) => ({text, image: ''}))
	}
	return { error: "No cat data 🙈"}
}