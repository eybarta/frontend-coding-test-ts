<template>
	<div>
		<div
			class="min-h-[75vh] relative p-4 mt-4 flex flex-col items-center justify-evenly border border-teal-300/20 bg-teal-600/10 rounded">
			<div class="py-2 text-2xl">🐱🐱🐱🐱</div>
			<Preloader v-if=" catFactLoading " label="Get ready for a cat fact"></Preloader>
			<div v-else class="cat-fact mt-8">
				<transition appear mode="out-in" name="fade">
					<p v-bind:key=" `currentCatFactText-${ currentCatFactIndex }` " class="text-teal-700 font-bold text-xl"
						v-text=" currentCatFactText "></p>
				</transition>
				<transition appear mode="out-in" name="fade">
					<Preloader v-if=" catImageLoading " class="mt-8" label="Wait for the image!"></Preloader>
					<div v-else v-bind:key=" `currentCatFactImage-${ currentCatFactIndex }` "
						class="mt-8 rounded overflow-hidden border-8 border-teal-200/60">
						<img class="rounded w-full cursor-pointer" v-bind:src=" isMissingCatImage
								? '/src/assets/missing-cat.png'
								: `data:image/png;base64,${ currentCatFactImage }`
							" v-bind:alt=" currentCatFactText " v-on:click=" touchedACat " />
					</div>
				</transition>
			</div>

			<div class="w-full flex items-center justify-between mt-auto">
				<button class="app-btn" v-bind:disabled=" currentCatFactIndex === 0 " v-on:click=" fetchPreviousFact ">
					Last Fact
				</button>

				<div class="flex gap-2 items-center">
					<button v-if=" loading || isLastCatFactIndex " ref="prevBtn" v-tooltip=" { content: 'Fetch more fun cat facts!' } "
						class="app-btn" v-on:click=" fetchSomeCatFacts ">
						<i v-if=" catFactLoading " class="fa-solid fa-spinner fa-spin"></i>
						<i v-else class="fa-solid fa-cat" v-bind:class=" [ mockFetchCats ? 'fa-spin' : '' ] "></i>
					</button>
					<button ref="nextBtn" class="app-btn" v-bind:disabled=" loading || isLastCatFactIndex "
						v-on:click=" fetchNextFact ">
						Next Fact
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable */
import CatFact from '@t/CatFact.ts'
import generateImage from '@services/imageServices.ts'
import generateCatFacts from '@services/catFactGenerator.ts'
import Preloader from '@components/Preloader.vue'
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import { useToast, POSITION } from 'vue-toastification'
import debounce from 'lodash.debounce';
import sample from 'lodash.sample';

const toast = useToast()

const cacheKey = 'cat-facts'
const catFacts = ref<CatFact[]>( [] )

const mockFetchCats = ref( false )
const catImageLoading = ref( false )
const catFactLoading = ref( true )
const loading = computed( () => catFactLoading.value || catImageLoading.value )

const currentCatFactIndex = ref( 0 )
const currentCatFact = computed( () => catFacts.value[ currentCatFactIndex.value ] )
const currentCatFactText = computed( () => currentCatFact.value?.text )
const currentCatFactImage = computed( () => currentCatFact.value?.image )
const isMissingCatImage = computed( () => !catImageLoading.value && currentCatFactImage.value === 'missing' )
const isLastCatFactIndex = computed( () => currentCatFactIndex.value === catFacts.value.length - 1 )

// for testing
const nextBtn = ref( null )
const prevBtn = ref( null )


watchEffect( () => {
	if ( !loading.value && !currentCatFactImage.value ) {
		catImageLoading.value = true
		generateCatImage()
			.then( catImage => {
				if ( typeof catImage === 'string' ) {
					updateCatImage( currentCatFactIndex.value, catImage );
				}
			} )
			.catch( error => {
				console.error( "Error generating cat image:", error );
				updateCatImage( currentCatFactIndex.value, 'missing' );
			} ).finally( () => {
				catImageLoading.value = false
			} )


	}
} )

watch( catFacts, arr => {
	if ( arr.length ) {
		cacheCatFactsArray()
	}
}, { deep: true } )

function cacheCatFactsArray () {
	const hopefullyLimitedArrayString = JSON.stringify( catFacts.value )
	localStorage.setItem( cacheKey, hopefullyLimitedArrayString )
}
function updateCatFactsArray ( facts: CatFact[] ) {
	if ( facts?.length ) {
		catFacts.value.push( ...facts )
	}
}

const catResponses = [
	'Hey, nice to meet you :)',
	'Oh, hello there, human!',
	'Purrhaps you have treats?',
	'Soft touches are the best, thank you!',
	'Meow-lo! Are we friends now?',
	'That was a pawsome pet!',
	'I\'m feline good about this!',
	'You\'ve got the magic touch!',
	'Paws for a moment, that was lovely!',
	'More pets, please?'
];

type FeelType = 'warning' | 'success' | 'error' | 'info';
const feel: FeelType[] = [ 'warning', 'success', 'error', 'info' ];

function touchedACat () {
	const sampleCatRes = sample( catResponses )
	const sampleFeel = sample( feel ) as FeelType;
	toast[ sampleFeel ]( sampleCatRes, {
		toastClassName: "toast-alert",
		position: POSITION.BOTTOM_LEFT
	} )
}
/* 
	Cat facts image generation
*/
async function generateCatImage () {
	console.log( '2 generateCatImage ' );
	return new Promise( ( resolve, reject ) => {
		generateImage( currentCatFactText.value ).then( ( res: string ) => {
			console.log( '33 res: ', res );
			if ( res ) {
				resolve( res )
			} else {
				reject( new Error( "No image was generated" ) );
			}
			// catImageLoading.value = false
		} )


	} )
}
function updateCatImage ( index: number, image: string ) {
	catFacts.value[ index ].image = image
}
/* 
	Cat facts text generation
*/
const fetchSomeCatFacts = async () => {
	catFactLoading.value = true
	if ( catFacts.value.length < 5 ) {
		const facts: CatFact[] = await generateCatFacts()
		updateCatFactsArray( facts )
	} else {
		mockFetchCats.value = true
		toast.success( "This is only a demo :)", {
			toastClassName: "toast-alert",
			position: POSITION.BOTTOM_LEFT
		} )
		setTimeout( () => {
			mockFetchCats.value = false
		}, 3333 );

	}
	catFactLoading.value = false
}

/* 
	Cat facts UI
*/
const fetchNextFact = debounce( () => currentCatFactIndex.value += 1, 300 )
const fetchPreviousFact = debounce( () => currentCatFactIndex.value -= 1, 300 )

onMounted( () => {
	const catFactsFromCache = localStorage.getItem( cacheKey )
	if ( catFactsFromCache ) {
		updateCatFactsArray( JSON.parse( catFactsFromCache ) )
		nextTick( () => catFactLoading.value = false )
	} else {
		fetchSomeCatFacts()
	}
} )
</script>
<style>
.Vue-Toastification__toast--success {
	@apply !bg-teal-500;
}

.app-btn {
	@apply bg-teal-400 hover:bg-teal-500 duration-200;
	@apply rounded px-4 flex justify-center items-center text-white text-sm font-bold h-8;
}

.app-btn[disabled] {
	@apply opacity-40 pointer-events-none;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity .369s;
}

.fade-enter,
.fade-leave-to {
	@apply opacity-0;
}
</style>
