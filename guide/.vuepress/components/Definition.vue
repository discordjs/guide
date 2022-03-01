<template>
	<div class="card">
		<span class="title"> INFO </span>
		<span class="content">{{ content }}</span>
	</div>
</template>

<script setup lang="ts">
const props = defineProps(['title', 'content']);
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
}

.title {
    font-weight: 600;
    margin-bottom:-.4rem
    line-height: 1.7;
	font-size: 16px;
	color: #4e5d94;
}

.content {
	// definition of the word
	font-size: 16px;
	color: #fff;
}
</style>
