import './Config';

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

// import usersApi from './routes/users';
import designsApi from './routes/designs';
import projectsApi from './routes/projects';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':remote-addr - [:date[clf]] ":method :url" :status ":user-agent"'));
app.use(helmet({
    contentSecurityPolicy: false,
}));

function allowCrossDomain(req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

app.get('/api', (req, res) => {
    res.send('Express + TypeScript Server');
});


// app.use('/users', usersApi);
app.use('/api/projects', projectsApi);
app.use('/api/designs', designsApi);

export default app;