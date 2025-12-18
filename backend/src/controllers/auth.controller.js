const { User } = require('../models');
const { generateToken } = require('../config/jwt');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    delete user.password;

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to TailorCraft!',
        template: 'welcome',
        context: {
          name: user.name
        }
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    delete user.password;

    res.json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No data to update'
      });
    }

    const user = await User.update(req.user.id, updateData);

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByEmail(req.user.email);
    
    // Verify current password
    const isValidPassword = await User.comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await User.updatePassword(req.user.id, newPassword);

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email'
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user (you'll need to add these fields to your User model)
    await User.update(user.id, {
      reset_password_token: resetTokenHash,
      reset_password_expires: new Date(resetTokenExpiry)
    });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        context: {
          name: user.name,
          resetUrl
        }
      });
    } catch (emailError) {
      await User.update(user.id, {
        reset_password_token: null,
        reset_password_expires: null
      });

      console.error('Failed to send password reset email:', emailError);
      
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send password reset email'
      });
    }

    res.json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const sql = `
      SELECT * FROM users 
      WHERE reset_password_token = $1 
      AND reset_password_expires > CURRENT_TIMESTAMP
      AND deleted_at IS NULL
    `;

    const result = await query(sql, [resetTokenHash]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    await User.updatePassword(user.id, password);

    // Clear reset token
    await User.update(user.id, {
      reset_password_token: null,
      reset_password_expires: null
    });

    res.json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, we just tell the client to remove the token
    // In a real app, you might want to implement token blacklisting
    
    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
