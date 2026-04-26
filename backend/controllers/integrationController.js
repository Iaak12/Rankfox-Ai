const User = require('../models/User');

// GET /api/integrations/status
// Get current connection status for all integrations
const getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const integrations = user.integrations || {};
    
    // Return only the connection status, not the raw tokens
    res.json({
      medium: !!integrations.medium?.connected,
      blogger: !!integrations.blogger?.connected,
      tumblr: !!integrations.tumblr?.connected,
      wordpress: !!integrations.wordpress?.connected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/integrations/connect/:platform
// Save credentials and connect a platform
const connectIntegration = async (req, res) => {
  try {
    const { platform } = req.params;
    const { token, url, username, appPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.integrations) {
      user.integrations = {};
    }

    if (platform === 'wordpress') {
      user.integrations.wordpress = { connected: true, url, username, appPassword };
    } else if (['medium', 'blogger', 'tumblr'].includes(platform)) {
      user.integrations[platform] = { connected: true, token };
    } else {
      return res.status(400).json({ message: 'Unknown platform' });
    }

    await user.save();
    
    // Return updated status
    res.json({ success: true, platform });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/integrations/disconnect/:platform
// Remove credentials and disconnect a platform
const disconnectIntegration = async (req, res) => {
  try {
    const { platform } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.integrations && user.integrations[platform]) {
      user.integrations[platform].connected = false;
      user.integrations[platform].token = '';
      if (platform === 'wordpress') {
        user.integrations.wordpress.url = '';
        user.integrations.wordpress.username = '';
        user.integrations.wordpress.appPassword = '';
      }
      await user.save();
    }
    
    res.json({ success: true, platform });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStatus,
  connectIntegration,
  disconnectIntegration
};
