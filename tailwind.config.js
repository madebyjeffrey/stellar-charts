import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	darkMode: ['class'],
	plugins: [typography, daisyui],
	daisyui: {
		themes: [
			{
				business: {
					...import('daisyui/src/theming/themes')['business'],
					'base-100': '#252525',
					'base-200': '#212121',
					'base-300': '#151515',
					'--gauge': '#151515'
				},
				emerald: {
					...import('daisyui/src/theming/themes')['emerald'],
					primary: '#4D9A69',
					'base-200': '#C3C3C3', // win31!
					'--gauge': '#555555'
				}
			}
		],
		darkTheme: 'business'
	}
};
