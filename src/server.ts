import dbConnect from "./utils/connnect";
import app from "./index";
const PORT = 3000;
(async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
