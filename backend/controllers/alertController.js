const admin = require('firebase-admin');

// Helper to auto-classify severity based on description
const classifySeverity = (description) => {
  const text = (description || '').toLowerCase();
  if (text.match(/(stampede|fire|weapon|riot|bomb|dead|fatal)/)) return 'critical';
  if (text.match(/(injury|faint|fight|medical|blood|collapse)/)) return 'high';
  if (text.match(/(crowd|lost|theft|drunk)/)) return 'medium';
  return 'low';
};

const getAlerts = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('alerts').orderBy('timestamp', 'desc').get();
    const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Error fetching alerts' });
  }
};

const createAlert = async (req, res) => {
  try {
    const { title, description, location, reporterId, reporterRole } = req.body;
    
    if (!location || !description) {
      return res.status(400).json({ message: 'Location and description are required.' });
    }

    const severity = req.body.severity || classifySeverity(description);

    const newAlertData = {
      title: title || 'Emergency Alert',
      description,
      location, // array [lat, lng]
      reporterId: reporterId || 'anonymous',
      reporterRole: reporterRole || 'Volunteer',
      severity,
      status: 'active',
      timestamp: new Date().toISOString()
    };

    const docRef = await admin.firestore().collection('alerts').add(newAlertData);
    
    res.status(201).json({ id: docRef.id, ...newAlertData });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Error creating alert' });
  }
};

const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    await admin.firestore().collection('alerts').doc(id).update({ status });
    
    // Fetch updated doc
    const updatedDoc = await admin.firestore().collection('alerts').doc(id).get();
    
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Error updating alert status' });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  updateAlertStatus
};
