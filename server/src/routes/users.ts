// import express from 'express';
// import { User } from '../models';
// import { authMiddleware } from '../utils/permissions';

// const app = express();
// app.use(authMiddleware);

// app.get('/', async (req, res) => {
//     const user = await User.findById(req.user.uid);
//     if (!user)
//         return res.json({ message: 'User does not exist' });

//     return res.json({ data: user.toJSON() });
// });

// app.post('/', async (req, res) => {
//     const { name, email } = req.body;
//     const user = await User.create({ _id: req.user.uid, name, email });
//     return res.json({ data: user.toJSON() });
// });

// app.put('/', async (req, res) => {
//     const { name, email } = req.body;
//     const user = await User.findById(req.user.uid);
//     if (!user)
//         return res.json({ message: 'User does not exist' });

//     user.name = name;
//     user.email = email;
//     await user.save();

//     return res.json({ data: user.toJSON() });
// });


// export default app;