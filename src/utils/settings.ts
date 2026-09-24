export function getSiteSettings() {
	return {
		pages: {
			hero: true,
			approvals: true,
			groups: true,
			downtime: true,
			ceremonies: false,
		},
		features: {
			groupSubmissions: false,
		},
	};
}
