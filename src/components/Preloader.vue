<template>
	<div>
		<div class="box">
			<div class="cat">
				<div class="cat__body cat-img"></div>
				<div class="cat__body cat-img"></div>
				<div class="cat__tail cat-img"></div>
				<div class="cat__head cat-img"></div>
			</div>
		</div>
		<span v-if=" label " class="text-teal-600" v-text=" label "></span>
	</div>
</template>

<script setup lang="ts">
defineProps( {
	label: {
		type: String,
		default: '',
	},
} )
</script>

<style scoped>
/* Based on: https://codepen.io/Rplus/pen/PWZYRM */
.fill-full {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* Cat Styles */
.cat {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 20em;
}

.cat::before {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.cat:hover > * {
  animation-play-state: paused;
}

.cat:active > * {
  animation-play-state: running;
}

/* Cat Image Styles */
.cat-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: rotating 2.79s cubic-bezier(.65, .54, .12, .93) infinite;
  will-change: transform;
}

.cat-img::before {
  content: "";
  position: absolute;
  width: 50%;
  height: 50%;
  background-image: url("/src/assets/cat-preloader-img.png");
  background-repeat: no-repeat;
  background-size: 200%;
}

/* Specific Cat Parts */
.cat__head::before {
  top: 0;
  right: 0;
  background-position: 100% 0;
  transform: rotate(90deg);
  transform-origin: 0 100%;
}

.cat__tail {
  animation-delay: .2s;
}

.cat__tail::before {
  bottom: 0;
  left: 0;
  background-position: 0 100%;
  transform: rotate(-30deg);
  transform-origin: 100% 0;
}

.cat__body {
  animation-delay: .1s;
}

.cat__body:nth-of-type(2) {
  animation-delay: .17s;
}

.cat__body::before {
  right: 0;
  bottom: 0;
  background-position: 100% 100%;
  transform-origin: 0 0;
}

/* Animations */
@keyframes rotating {
  from {
    transform: rotate(720deg);
  }

  to {
    transform: none;
  }
}

/* Box Styles */
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
