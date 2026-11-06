// Mock in-memory database to avoid crashing without Firebase credentials
class MockDatabase {
  constructor() {
    this.alerts = [
      {
        id: '1',
        title: 'Crowd Surge at Gate 2',
        description: 'Large crowd gathering rapidly. High risk of stampede.',
        location: [17.4399, 78.4983], // Secunderabad
        severity: 'high',
        status: 'active',
        reporterId: 'user_1',
        reporterRole: 'Police',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Medical Emergency',
        description: 'Individual fainted due to heat near Main Stage.',
        location: [17.4239, 78.4738], // Hyderabad Center
        severity: 'medium',
        status: 'active',
        reporterId: 'user_2',
        reporterRole: 'Medical',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString()
      }
    ];
  }

  getAlerts() {
    return this.alerts;
  }

  addAlert(alertData) {
    const newAlert = {
      id: Date.now().toString(),
      ...alertData,
      status: 'active',
      timestamp: new Date().toISOString()
    };
    this.alerts.push(newAlert);
    return newAlert;
  }

  updateAlert(id, updates) {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alerts[index] = { ...this.alerts[index], ...updates };
      return this.alerts[index];
    }
    return null;
  }
}

module.exports = new MockDatabase();
