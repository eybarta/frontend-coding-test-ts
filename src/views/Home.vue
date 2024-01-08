<template>
	<div class="justify-center max-w-md mt-10 min-w-[33%]">
		<!-- <h1 class="font-extrabold tracking-tigh text-3xl leading-10">
      Ready for the challenge?
    </h1> -->
		<div class="mt-8 pr-4">
			<section>
				<h2 class="font-bold text-2xl leading-6">Cat Facts</h2>
				<CatFactPlus> </CatFactPlus>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ShowExercises } from '../types/exercise'
import CatFactPlus from '../components/CatFactPlus.vue'

const showExercise = reactive<ShowExercises>( {
	second: false,
	third: false,
} )

const showNextExercise = ( exercise: keyof ShowExercises ) => {
	showExercise[ exercise ] = !showExercise[ exercise ]
}
</script>
