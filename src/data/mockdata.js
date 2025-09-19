export const tourists = [
  {
    id: 'T-0001',
    name: 'Asha Devi',
    country: 'India',
    itinerary: 'Guwahati → Kaziranga → Majuli',
    safetyScore: 87,
    status: 'Active',
    lastLocation: { lat: 26.5775, lng: 93.1711 },
    // Planned route as an array of [lat, lng] coordinates
    plannedRoute: [
      [26.1433, 91.7898], // Guwahati
      [26.5775, 93.1711], // Kaziranga
      [27.0500, 94.1333]  // Majuli (simplified)
    ]
  },
  {
    id: 'T-0002',
    name: 'John Miller',
    country: 'UK',
    itinerary: 'Guwahati → Shillong',
    safetyScore: 62,
    status: 'Alerted',
    lastLocation: { lat: 25.5788, lng: 91.8933 },
    plannedRoute: [
      [26.1433, 91.7898], // Guwahati
      [25.5788, 91.8933]  // Shillong
    ]
  }
];