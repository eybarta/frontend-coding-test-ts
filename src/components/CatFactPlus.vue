<template>
	<div>
		<div class="p-4 mt-4 flex flex-col items-center justify-center border border-teal-300/20 bg-teal-600/10 rounded">
			<h4 class="font-bold text-xs text-gray-700">CAT FACT</h4>
			<span>🐱🐱🐱🐱</span>
			<Preloader v-if=" catFactLoading " label="Get ready for a cat fact"></Preloader>
			<div v-else class="cat-fact mt-8">
				<transition appear mode="out-in" name="fade">
					<p v-bind:key=" `currentCatFactText-${ currentCatFactIndex }` " class="text-teal-700 font-bold"
						v-text=" currentCatFactText "></p>
				</transition>
				<transition appear mode="out-in" name="fade">
					<Preloader v-if=" catImageLoading " label="Wait for the image as well!"></Preloader>
					<div v-else v-bind:key=" `currentCatFactImage-${ currentCatFactIndex }` "
						class="mt-4 rounded overflow-hidden border-8 border-teal-200/60">
						<img class="rounded w-full" v-bind:src=" isMissingCatImage
								? '/src/assets/missing-cat.png'
								: `data:image/png;base64,${ currentCatFactImage }`
							" v-bind:alt=" currentCatFactText " />
					</div>
				</transition>
			</div>

			<div class="w-full flex items-center justify-between mt-8">
				<button class="app-btn" v-bind:disabled=" currentCatFactIndex === 0 " v-on:click=" fetchPreviousFact ">
					Last Fact
				</button>

				<div class="flex gap-2 items-center">
					<button v-if=" isLastCatFactIndex " v-tooltip=" { content: 'Fetch more fun cat facts!' } " class="app-btn"
						v-on:click=" fetchSomeCatFacts ">
						<i v-if=" catFactLoading " class="fa-solid fa-spinner fa-spin"></i>
						<i v-else class="fa-solid fa-cat"></i>
					</button>
					<button class="app-btn" v-bind:disabled=" isLastCatFactIndex " v-on:click=" fetchNextFact ">
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

const toast = useToast()

const cacheKey = 'cat-facts-cache'
const catFacts = ref<CatFact[]>( [] )

const catImageLoading = ref( false )
const catFactLoading = ref( true )
const loading = computed( () => catFactLoading.value || catImageLoading.value )
const currentCatFactIndex = ref( 0 )
const currentCatFact = computed( () => catFacts.value[ currentCatFactIndex.value ] )
const currentCatFactText = computed( () => currentCatFact.value?.text )
const currentCatFactImage = computed( () => currentCatFact.value?.image )
const isMissingCatImage = computed( () => !catImageLoading.value && currentCatFactImage.value === 'missing' )
const isLastCatFactIndex = computed( () => currentCatFactIndex.value === catFacts.value.length - 1 )
watchEffect( async () => {
	if ( !loading.value && !currentCatFactImage.value ) {
		const catImage = await generateCatImage()
		if ( typeof catImage === 'string' ) {
			updateCatImage( currentCatFactIndex.value, catImage )
		} else {
			updateCatImage( currentCatFactIndex.value, 'missing' )

		}
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
function mapCatFacts ( stringFacts: string[] ) {
	return stringFacts.map( ( fact ) => ( { text: fact, image: '' } ) )
}
function updateCatFactsArray ( facts: CatFact[] ) {
	if ( facts?.length ) {
		catFacts.value.push( ...facts )
	}
}
/* 
	Cat facts image generation
*/
async function generateCatImage () {
	catImageLoading.value = true
	const res = await generateImage( currentCatFactText.value )
	catImageLoading.value = false
	return res || ''
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
		toast.success( "This is only a demo :)", {
			toastClassName: "toast-alert",
			position: POSITION.BOTTOM_LEFT
		} )

	}
	catFactLoading.value = false
}

/* 
	Cat facts UI
*/
const fetchNextFact = async () => {
	if ( catFacts.value.length > currentCatFactIndex.value ) {
		currentCatFactIndex.value += 1
	}
}
const fetchPreviousFact = async () => {
	if ( currentCatFactIndex.value ) {
		currentCatFactIndex.value -= 1
	}
}

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
