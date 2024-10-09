const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // Log the token and secret for debugging (remove in production)
  console.log("Token:", token);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  // Check if no token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid token
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authentication;
