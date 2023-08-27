const jwt = require("jsonwebtoken");

const generateTokens = (userInfo) => {
  const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || "15m"; // Default to 15 minutes
  const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || "7d"; // Default to 7 days
  
  // Generate an access token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        user: userInfo.email,
        userId: userInfo._id,
        roles: userInfo.roles
      }
    },
    process.env.SECRET_KEY,
    { expiresIn: accessTokenExpiration }
  );

  // Generate a refresh token
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        user: userInfo.email,
        userId: userInfo._id,
        roles: userInfo.roles
      }
    },
    process.env.SECRET_KEY,
    { expiresIn: refreshTokenExpiration }
  );

  return { accessToken, refreshToken };
};

const generateAccessTokenFromRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    const userInfo = decoded.UserInfo;

    const accessToken = jwt.sign(
      {
        UserInfo: {
          user: userInfo.email,
          userId: userInfo._id,
          roles: userInfo.roles
        }
      },
      process.env.SECRET_KEY,
      { expiresIn: accessTokenExpiration } // Set your desired expiration time
    );

    return accessToken;
  } catch (error) {
    // Handle token verification error
    return null;
  }
};

module.exports = { generateTokens, generateAccessTokenFromRefreshToken };

