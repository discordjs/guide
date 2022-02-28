<template>
	<div class="card">
		<span class="title"> Info </span>
		<span class="content">{{ content }}</span>
	</div>
</template>

<script setup lang="ts">
const props = defineProps(["title", "content"]);
</script>

<style setup lang="scss">
.card {
	border-radius: 0.375rem;
	border-color: #7289da;
	border-radius: 0.375rem;
	padding: 0.1rem 1.5rem;
	border-left-width: 0.5rem;
	border-left-style: solid;
	margin: 1rem 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: #23272a;
	color: #fff;
	padding: 1rem;

	// someone is gonna scream at me for this i can sense it
	&:hover {
		box-shadow: 0 0 0.5rem 0.5rem rgba(114, 137, 218, 0.5);
		transition: box-shadow 0.2s ease-in-out;
		transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	&:hover ~ .card {
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
		transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
}

.title {
	font-weight: 600;
	line-height: 1.7;
	font-size: 16px;
	margin-bottom: -0.2rem;
	color: #4e5d94;
}

.content {
	// definition of the word
	font-size: 16px;
	color: #fff;
}
</style>
