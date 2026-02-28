let appInstance = null;

module.exports = async (req, res) => {
    try {
        if (!appInstance) {
            appInstance = require('../server');
        }
        return appInstance(req, res);
    } catch (error) {
        console.error('Vercel bootstrap error:', error);
        return res.status(500).json({
            error: 'Backend bootstrap failed',
            message: error.message
        });
    }
};
