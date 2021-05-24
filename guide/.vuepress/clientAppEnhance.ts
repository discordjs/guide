import { defineClientAppEnhance } from '@vuepress/client';
import ResultingCode from './components/ResultingCode.vue';

export default defineClientAppEnhance(({ app, router, siteData }) => {
	app.component('ResultingCode', ResultingCode)
})
