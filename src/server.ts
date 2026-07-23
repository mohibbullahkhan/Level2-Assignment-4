import app from "./app";
import config from "./config";

const main = async () => {
  try {
    const port = config.port || 5000;
    app.listen(port, () => {
      console.log(`RentNest server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

main();
