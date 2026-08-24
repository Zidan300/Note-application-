const Task = require('../models/Task');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    const task = await Task.create({
      owner: req.user.sub,
      title,
      description,
      isCompleted,
      dueDate,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { completed } = req.query;

    const filter = {};

    if (completed !== undefined) {
      if (completed === 'true') {
        filter.isCompleted = true;
      } else if (completed === 'false') {
        filter.isCompleted = false;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid value for "completed" query parameter. Use "true" or "false".',
        });
      }
    }

    const tasks = await Task.find({ ...filter, owner: req.user.sub }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findOne({ _id: id, owner: req.user.sub });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body cannot be empty',
      });
    }

    const { title, description, isCompleted, dueDate } = body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title must be a non-empty string',
        });
      }
      if (title.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot exceed 100 characters',
        });
      }
    }

    if (dueDate !== undefined && dueDate !== null) {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid dueDate value',
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    if (isCompleted !== undefined && typeof isCompleted !== 'boolean') return res.status(400).json({ success: false, message: 'isCompleted must be a boolean' });
    const task = await Task.findOneAndUpdate({ _id: id, owner: req.user.sub }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, owner: req.user.sub });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
