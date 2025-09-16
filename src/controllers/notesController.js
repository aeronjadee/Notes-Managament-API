const { Note } = require('../models');
const { Op } = require('sequelize');

// Get all notes with advanced filtering
const getAllNotes = async (req, res) => {
  try {
    // Extract query parameters with default values
    const {
      page = 1,
      limit = 10,
      search,
      category,
      archived = 'false',
      pinned,
      priority,
      sortBy = 'updatedAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build dynamic where clause
    const whereClause = {};

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        {
          title: { [Op.like]: `%${search}%` }
        },
        {
          content: { [Op.like]: `%${search}%` }
        }
      ];
    }

    // Filter by category   
    if (category) {
      whereClause.category = category;
    }

    // Filter by archived status
    whereClause.isArchived = archived === 'true';

    // Filter by pinned status
    if (pinned !== undefined) {
      whereClause.isPinned = pinned === 'true';
    }

    // Filter by priority
    if (priority) {
      whereClause.priority = priority;
    }

    // Validate sort fields for security
    const allowedSortFields = ['title', 'createdAt', 'updatedAt', 'category', 'priority'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'updatedAt';

    // Execute database query
    const { count, rows: notes } = await Note.findAndCountAll({
      where: whereClause,
      order: [
        ['isPinned', 'DESC'], // Pinned notes always appear first
        [sortField, sortOrder.toUpperCase()]
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Send response with pagination info
    res.json({
      success: true,
      data: notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      isPinned,
      priority
    } = req.body;

    const note = await Note.create({
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      isPinned: isPinned || false,
      priority: priority || 'medium'
    });

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update existing note
const updateNote = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      isPinned,
      isArchived,
      priority
    } = req.body;

    const [updatedRowsCount] = await Note.update({
      title,
      content,
      category,
      tags,
      isPinned,
      isArchived,
      priority
    }, {
      where: {
        id: req.params.id
      },
      returning: true
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Fetch the updated note to return fresh data
    const updatedNote = await Note.findByPk(req.params.id);
    res.json({
      success: true,
      data: updatedNote,
      message: 'Note updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const deletedRowsCount = await Note.destroy({
      where: {
        id: req.params.id
      }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get notes by category
const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const notes = await Note.findAll({
      where: {
        category,
        isArchived: false
      },
      order: [
        ['isPinned', 'DESC'],
        ['updatedAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: notes,
      category,
      count: notes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle pin status
const togglePinNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      success: true,
      data: note,
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle archive status
const toggleArchiveNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.json({
      success: true,
      data: note,
      message: `Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all available categories
const getCategories = async (req, res) => {
  try {
    const categories = await Note.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categoryList = categories.map(item => item.category);
    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search notes by content
const searchNotes = async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const notes = await Note.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                title: { [Op.like]: `%${query}%` }
              },
              {
                content: { [Op.like]: `%${query}%` }
              }
            ]
          },
          {
            isArchived: false
          }
        ]
      },
      order: [
        ['isPinned', 'DESC'],
        ['updatedAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: notes,
      query,
      count: notes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
  togglePinNote,
  toggleArchiveNote,
  getCategories,
  searchNotes
};