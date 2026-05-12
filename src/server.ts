import {dbConnect} from "./utils/connnect";
import app from "./index";
import dns from"dns"
dns.setServers(["8.8.8.8","8.8.4.4"])
const PORT = 8000;
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
