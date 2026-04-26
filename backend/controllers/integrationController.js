const User = require('../models/User');

// GET /api/integrations/status
// Get current connection status for all integrations
const getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const integrations = user.integrations || {};
    
    res.json({
      medium: !!integrations.medium?.connected,
      blogger: !!integrations.blogger?.connected,
      tumblr: !!integrations.tumblr?.connected,
      wordpress: !!integrations.wordpress?.connected,
      gsc: !!integrations.gsc?.connected,
      ga: !!integrations.ga?.connected,
      ahrefs: !!integrations.ahrefs?.connected,
      semrush: !!integrations.semrush?.connected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/integrations/connect/:platform
const connectIntegration = async (req, res) => {
  try {
    const { platform } = req.params;
    const { token, url, username, appPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.integrations) user.integrations = {};

    if (platform === 'wordpress') {
      user.integrations.wordpress = { connected: true, url, username, appPassword };
    } else if (['medium', 'blogger', 'tumblr', 'gsc', 'ga', 'ahrefs', 'semrush'].includes(platform)) {
      user.integrations[platform] = { connected: true, token };
    } else {
      return res.status(400).json({ message: 'Unknown platform: ' + platform });
    }

    await user.save();
    res.json({ success: true, platform });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/integrations/disconnect/:platform
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
