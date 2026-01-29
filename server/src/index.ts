
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDatabase } from './config/database';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all CORS for dev
app.use(express.json());

// Database
connectDatabase();

// Routes
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);

app.get('/', (req, res) => {
    res.send('Blog API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
