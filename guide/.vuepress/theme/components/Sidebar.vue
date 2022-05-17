<template>
	<aside class="sidebar">
		<NavbarItems />
		<slot name="top"></slot>
		<ul class="sidebar-links">
			<UserSettings />
			<SidebarItem
				v-for="item in sidebarItems"
				:key="item.link || item.text"
				:item="item"
			/>
		</ul>
		<slot name="bottom"></slot>
	</aside>
</template>

<script setup lang="ts">
import { useSidebarItems } from '@vuepress/theme-default/lib/client/composables';
import NavbarItems from '@vuepress/theme-default/lib/client/components/NavbarItems.vue';
import SidebarItem from '@vuepress/theme-default/lib/client/components/SidebarItem.vue';
import UserSettings from './UserSettings.vue';

const sidebarItems = useSidebarItems();
</script>
