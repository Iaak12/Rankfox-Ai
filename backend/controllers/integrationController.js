const User = require('../models/User');
const { google } = require('googleapis');

const getOauth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
    process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/integrations/gsc/callback'
  );
};

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

/* ─── GSC OAuth2 Flow ─── */
// GET /api/integrations/gsc/auth-url
const getGscAuthUrl = async (req, res) => {
  try {
    // If no real Google Client ID is configured, bypass the Google UI entirely
    // so the user doesn't hit a 400 Invalid Client error.
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'mock_client_id') {
      const mockCallbackUrl = `${process.env.VITE_API_URL || 'http://localhost:5000'}/api/integrations/gsc/callback?code=mock_code_123&state=${req.user._id}`;
      return res.json({ url: mockCallbackUrl });
    }

    const oauth2Client = getOauth2Client();
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
      prompt: 'consent', // Force consent to get refresh token
      state: req.user._id.toString() // Pass user ID through state
    });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/integrations/gsc/callback
const handleGscCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (error) {
      return res.redirect(`${frontendUrl}/dashboard?gsc=error&msg=${error}`);
    }
    if (!code) {
      return res.status(400).send('No code provided');
    }

    // For mock testing without valid Google Credentials
    if (process.env.GOOGLE_CLIENT_ID === 'mock_client_id' || !process.env.GOOGLE_CLIENT_ID) {
      console.warn('Using mock GSC OAuth flow since valid GOOGLE_CLIENT_ID is not provided.');
      const user = await User.findById(state);
      if (user) {
        if (!user.integrations) user.integrations = {};
        if (!user.integrations.gsc) user.integrations.gsc = {};
        user.integrations.gsc.connected = true;
        user.integrations.gsc.token = JSON.stringify({ access_token: 'mock_token', refresh_token: 'mock_refresh' });
        await user.save();
      }
      return res.redirect(`${frontendUrl}/dashboard?gsc=connected`);
    }

    const oauth2Client = getOauth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    const user = await User.findById(state);
    if (!user) return res.status(404).send('User not found');

    if (!user.integrations) user.integrations = {};
    if (!user.integrations.gsc) user.integrations.gsc = {};

    user.integrations.gsc.connected = true;
    user.integrations.gsc.token = JSON.stringify(tokens);
    await user.save();

    res.redirect(`${frontendUrl}/dashboard?gsc=connected`);
  } catch (error) {
    console.error('GSC OAuth Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?gsc=error`);
  }
};

module.exports = {
  getStatus,
  connectIntegration,
  disconnectIntegration,
  getGscAuthUrl,
  handleGscCallback
};
