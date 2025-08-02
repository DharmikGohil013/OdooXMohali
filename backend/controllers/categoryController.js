import Category from '../models/Category.js';
import Ticket from '../models/Ticket.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Private
 */
export const getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};
  
  // Filter by active status
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  } else {
    // By default, only show active categories
    query.isActive = true;
  }

  // Search by name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  const categories = await Category.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Category.countDocuments(query);

  res.json({
    success: true,
    data: {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Private
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Get ticket count for this category
  const ticketCount = await Ticket.countDocuments({ category: category._id });

  res.json({
    success: true,
    data: {
      category: {
        ...category.toObject(),
        ticketCount
      }
    }
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, color } = req.body;

  // Check if category name already exists
  const categoryExists = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') } 
  });

  if (categoryExists) {
    return res.status(400).json({
      success: false,
      message: 'Category with this name already exists'
    });
  }

  const category = await Category.create({
    name,
    description,
    color,
    createdBy: req.user.id
  });

  // Populate the createdBy field
  await category.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: {
      category
    }
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, color, isActive } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if name is being changed and if it already exists
  if (name && name.toLowerCase() !== category.name.toLowerCase()) {
    const nameExists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: category._id }
    });

    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
  }

  // Update fields
  category.name = name || category.name;
  category.description = description || category.description;
  category.color = color || category.color;
  
  if (isActive !== undefined) {
    category.isActive = isActive;
  }

  const updatedCategory = await category.save();
  await updatedCategory.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: {
      category: updatedCategory
    }
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has associated tickets
  const ticketCount = await Ticket.countDocuments({ category: category._id });

  if (ticketCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category. It has ${ticketCount} associated ticket(s). Please reassign or delete the tickets first.`
    });
  }

  await Category.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

/**
 * @desc    Get category statistics
 * @route   GET /api/categories/stats
 * @access  Private
 */
export const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await Category.aggregate([
    // Lookup tickets for each category
    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: 'category',
        as: 'tickets'
      }
    },
    // Add computed fields
    {
      $addFields: {
        ticketCount: { $size: '$tickets' },
        openTickets: {
          $size: {
            $filter: {
              input: '$tickets',
              cond: { $eq: ['$$this.status', 'open'] }
            }
          }
        },
        resolvedTickets: {
          $size: {
            $filter: {
              input: '$tickets',
              cond: { $eq: ['$$this.status', 'resolved'] }
            }
          }
        }
      }
    },
    // Project only needed fields
    {
      $project: {
        name: 1,
        description: 1,
        color: 1,
        isActive: 1,
        ticketCount: 1,
        openTickets: 1,
        resolvedTickets: 1,
        createdAt: 1
      }
    },
    // Sort by ticket count descending
    {
      $sort: { ticketCount: -1 }
    }
  ]);

  const totalCategories = await Category.countDocuments();
  const activeCategories = await Category.countDocuments({ isActive: true });

  res.json({
    success: true,
    data: {
      totalCategories,
      activeCategories,
      categoryStats: stats
    }
  });
});

/**
 * @desc    Bulk update categories (Admin only)
 * @route   PUT /api/categories/bulk
 * @access  Private/Admin
 */
export const bulkUpdateCategories = asyncHandler(async (req, res) => {
  const { categoryIds, action, data } = req.body;

  if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid category IDs'
    });
  }

  let updateData = {};

  switch (action) {
    case 'activate':
      updateData.isActive = true;
      break;
    case 'deactivate':
      updateData.isActive = false;
      break;
    case 'update':
      if (data) {
        updateData = { ...data };
      }
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid action specified'
      });
  }

  const result = await Category.updateMany(
    { _id: { $in: categoryIds } },
    { $set: updateData }
  );

  res.json({
    success: true,
    message: `Successfully updated ${result.modifiedCount} category(ies)`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
});
