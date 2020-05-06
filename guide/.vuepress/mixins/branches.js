const branches = [
	{
		label: 'v12 (stable)',
		version: '12.x',
		aliases: ['12', 'stable'],
	},
	{
		label: 'v11',
		version: '11.x',
		aliases: ['11'],
	},
];

const [defaultBranch] = branches;

export default {
	data() {
		return {
			branches,
			defaultBranch,
			selectedBranch: defaultBranch.version,
		};
	},
	mounted() {
		this.selectedBranch = localStorage.getItem('branch-version') || defaultBranch.version;
	},
	methods: {
		getBranch(version) {
			return this.branches.find(branch => branch.aliases.includes(version) || branch.version === version);
		},
		updateBranch(branch) {
			this.selectedBranch = branch;
		},
	},
};
