import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import accountRoutes from "./routes/AccountRoutes";
import customerTypeRoutes from "./routes/CustomerTypeRoute";
import teamRoutes from "./routes/TeamRoutes";
import productRoutes from "./routes/ProductRoutes";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

app.use('/api/accounts',accountRoutes);
app.use('/api/customer',customerTypeRoutes);
app.use('/api/team',teamRoutes);
app.use('/api/product',productRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
