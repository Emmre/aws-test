import {
    getTodosByUser,
    createTodo,
    updateTodo as updateTodoModel,
    deleteTodo as deleteTodoModel,
    findTodoById
} from '../models/Todo.js';
import multer from 'multer';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Multer setup for file uploads (memory storage)
const storage = multer.memoryStorage();
export const upload = multer({storage});

// Helper to upload file to S3
async function uploadFileToS3(file) {
    const key = Date.now() + '-' + file.originalname;
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    await s3.send(new PutObjectCommand(params));
    // Return the public S3 URL
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export const getTodos = async (req, res) => {
    try {
        const todos = await getTodosByUser(req.user.id);
        res.json(todos);
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};

export const addTodo = async (req, res) => {
    try {
        const {text} = req.body;
        let image = null;
        if (req.file) {
            image = await uploadFileToS3(req.file);
        }
        const todo = await createTodo({user_id: req.user.id, text, image});
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};

export const updateTodo = async (req, res) => {
    try {
        const {text} = req.body;
        const todo = await findTodoById({id: req.params.id, user_id: req.user.id});
        if (!todo) return res.status(404).json({msg: 'Todo not found'});
        let image = todo.image;
        if (req.file) {
            image = await uploadFileToS3(req.file);
        }
        const updated = await updateTodoModel({
            id: req.params.id,
            user_id: req.user.id,
            text: text || todo.text,
            image
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const deleted = await deleteTodoModel({id: req.params.id, user_id: req.user.id});
        if (!deleted) return res.status(404).json({msg: 'Todo not found'});
        res.json({msg: 'Todo deleted'});
    } catch (err) {
        res.status(500).json({msg: 'Server error'});
    }
};
